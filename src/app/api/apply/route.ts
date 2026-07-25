import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { applicationSchema } from '@/lib/schemas'
import { uploadFile } from '@/lib/storage'

const prisma = new PrismaClient()

// Limite maximale de fichier (5 Mo en octets)
const MAX_FILE_SIZE = 5 * 1024 * 1024

// Basic Rate Limiting
const rateLimitMap = new Map<string, { count: number, timestamp: number }>()
const RATE_LIMIT = 5 // max 5 per window
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute

export async function POST(req: Request) {
  try {
    // Rate Limiting
    const ip = req.headers.get('x-forwarded-for') || 'unknown'
    const now = Date.now()
    const userLimit = rateLimitMap.get(ip)

    if (userLimit) {
      if (now - userLimit.timestamp < RATE_LIMIT_WINDOW) {
        if (userLimit.count >= RATE_LIMIT) {
          return NextResponse.json({ error: 'Trop de requêtes, veuillez patienter.' }, { status: 429 })
        }
        userLimit.count += 1
      } else {
        rateLimitMap.set(ip, { count: 1, timestamp: now })
      }
    } else {
      rateLimitMap.set(ip, { count: 1, timestamp: now })
    }

    const formData = await req.formData()
    const dataString = formData.get('data') as string
    
    if (!dataString) {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 })
    }

    const parsedData = JSON.parse(dataString)
    const validation = applicationSchema.safeParse(parsedData)
    
    if (!validation.success) {
      return NextResponse.json({ error: 'Données invalides', details: validation.error.format() }, { status: 400 })
    }

    const data = validation.data

    // 1. Validation de la taille maximale des fichiers (5 Mo)
    const cvFile = formData.get('cv') as File | null
    const photoFile = formData.get('photo') as File | null

    if (cvFile && cvFile.size > MAX_FILE_SIZE) {
      const sizeMo = (cvFile.size / (1024 * 1024)).toFixed(2)
      return NextResponse.json({ 
        error: `Le fichier CV dépasse la limite maximale de 5 Mo (taille actuelle : ${sizeMo} Mo). Veuillez compresser votre fichier.` 
      }, { status: 400 })
    }

    if (photoFile && photoFile.size > MAX_FILE_SIZE) {
      const sizeMo = (photoFile.size / (1024 * 1024)).toFixed(2)
      return NextResponse.json({ 
        error: `La photo de profil dépasse la limite maximale de 5 Mo (taille actuelle : ${sizeMo} Mo). Veuillez choisir une photo plus légère.` 
      }, { status: 400 })
    }

    // 2. Upload intelligent vers Cloudflare R2 (bucket bwta-datas) ou repli Volume Docker local
    let cvUrl = null
    let photoUrl = null

    if (cvFile && cvFile.size > 0) {
      cvUrl = await uploadFile(cvFile, 'cvs')
    }

    if (photoFile && photoFile.size > 0) {
      photoUrl = await uploadFile(photoFile, 'photos')
    }

    // Insert into DB
    const applicant = await prisma.applicant.create({
      data: {
        status: data.status,
        lastName: data.lastName,
        firstName: data.firstName,
        birthDate: new Date(data.birthDate),
        gender: data.gender,
        nationality: data.nationality,
        cinNif: data.cinNif,
        phone: data.phone,
        email: data.email,
        department: data.department,
        commune: data.commune,
        section: data.section,
        address: data.address,
        photoUrl,
        profession: data.profession,
        employer: data.employer,
        expertise: JSON.stringify(data.expertise),
        experience: data.experience,
        portfolio: data.portfolio,
        cvUrl,
        roles: JSON.stringify(data.roles),
        motivation: data.motivation,
        availability: data.availability,
        educations: {
          create: data.educations
        },
        achievements: data.achievements && data.achievements.length > 0 
          ? { create: data.achievements } 
          : undefined,
        references: {
          create: data.references
        }
      }
    })

    return NextResponse.json({ success: true, applicantId: applicant.id })
  } catch (error: any) {
    console.error('Submission error:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}
