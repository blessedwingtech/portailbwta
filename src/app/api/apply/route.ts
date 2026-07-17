import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { applicationSchema } from '@/lib/schemas'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

const prisma = new PrismaClient()

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

    // File Uploads (Local for Dev, easy to swap out)
    let cvUrl = null
    let photoUrl = null

    const cvFile = formData.get('cv') as File | null
    const photoFile = formData.get('photo') as File | null

    const uploadDir = path.join(process.cwd(), 'public/uploads')
    
    // Ensure dir exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    if (cvFile && cvFile.size > 0) {
      const buffer = Buffer.from(await cvFile.arrayBuffer())
      const ext = path.extname(cvFile.name)
      const fileName = `cv-${crypto.randomUUID()}${ext}`
      fs.writeFileSync(path.join(uploadDir, fileName), buffer)
      cvUrl = `/uploads/${fileName}`
    }

    if (photoFile && photoFile.size > 0) {
      const buffer = Buffer.from(await photoFile.arrayBuffer())
      const ext = path.extname(photoFile.name)
      const fileName = `photo-${crypto.randomUUID()}${ext}`
      fs.writeFileSync(path.join(uploadDir, fileName), buffer)
      photoUrl = `/uploads/${fileName}`
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
