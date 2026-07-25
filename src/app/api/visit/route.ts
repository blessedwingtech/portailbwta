import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Cache mémoire simple pour éviter d'inonder la base sur les rechargements (F5) intempestifs
const visitCache = new Set<string>()

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const path = body.path || '/'

    const headers = req.headers
    const userAgent = headers.get('user-agent') || ''
    const ip = headers.get('cf-connecting-ip') || headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1'
    const location = headers.get('cf-ipcountry') || 'Haïti / Non spécifié'

    // Détection de l'appareil
    let device = 'Bureau (Desktop)'
    if (/mobile/i.test(userAgent)) {
      device = 'Mobile (Smartphone)'
    } else if (/ipad|tablet/i.test(userAgent)) {
      device = 'Tablette'
    }

    // Détection du navigateur
    let browser = 'Inconnu'
    if (/chrome|crios/i.test(userAgent) && !/edge|edg/i.test(userAgent)) browser = 'Chrome'
    else if (/safari/i.test(userAgent) && !/chrome|crios/i.test(userAgent)) browser = 'Safari'
    else if (/firefox|fxios/i.test(userAgent)) browser = 'Firefox'
    else if (/edg/i.test(userAgent)) browser = 'Edge'

    // Clef anti-doublon (15 min en mémoire par IP et Page)
    const cacheKey = `${ip}_${path}`
    if (visitCache.has(cacheKey)) {
      return NextResponse.json({ success: true, ignored: 'duplicate' })
    }

    visitCache.add(cacheKey)
    setTimeout(() => visitCache.delete(cacheKey), 15 * 60 * 1000) // Nettoyage après 15 min

    await prisma.siteVisit.create({
      data: {
        path,
        device,
        browser,
        ipAddress: ip.slice(0, 45), // Protection longueur
        location: location.toUpperCase() === 'HT' ? 'Haïti (HT)' : location
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    // Si la table ou la base rencontre un souci de connexion, on ignore silencieusement pour ne pas perturber le visiteur
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
