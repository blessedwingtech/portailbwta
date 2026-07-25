import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    // 1. Récupération des dernières visites (Analytics)
    const recentVisits = await prisma.siteVisit.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    const totalVisits = await prisma.siteVisit.count()

    // 2. Calcul des appareils
    const devices = await prisma.siteVisit.groupBy({
      by: ['device'],
      _count: { device: true },
    })

    // 3. Récupération du journal d'Audit et traçabilité
    const auditLogs = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return NextResponse.json({
      success: true,
      analytics: {
        totalVisits,
        devices: devices.map(d => ({ device: d.device, count: d._count.device })),
        recentVisits,
      },
      auditLogs,
    })
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des analytics / audit :", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
