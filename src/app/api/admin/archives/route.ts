import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/route'

const prisma = new PrismaClient()

function generateReferenceCode(category: string): string {
  const year = new Date().getFullYear()
  let prefix = 'DOC'
  switch (category) {
    case 'proces_verbal': prefix = 'PV'; break;
    case 'note': prefix = 'NOTE'; break;
    case 'evenement': prefix = 'EVNT'; break;
    case 'rapport_financier': prefix = 'FIN'; break;
    case 'contrat_partenariat': prefix = 'PART'; break;
    default: prefix = 'ARCH'; break;
  }
  const randomNum = Math.floor(1000 + Math.random() * 9000)
  return `BWTA-${year}-${prefix}-${randomNum}`
}

// GET /api/admin/archives - Lister les documents archivés (avec filtrage de visibilité)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const user = session.user as any
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    const where: any = {}

    if (category && category !== 'all') {
      where.category = category
    }

    if (search && search.trim() !== '') {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { referenceCode: { contains: search, mode: 'insensitive' } },
        { richContent: { contains: search, mode: 'insensitive' } },
        { physicalLocation: { contains: search, mode: 'insensitive' } },
      ]
    }

    const archives = await prisma.archiveDocument.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    // Filtrer selon accessLevel et rôle
    const filtered = archives.filter(doc => {
      if (doc.accessLevel === 'public') return true;
      if (user.role === 'ADMIN' || user.role === 'PRESIDENT') return true;
      if (doc.accessLevel === 'bureau') return true;
      // si prive, seul l'auteur ou admin/president
      if (doc.accessLevel === 'prive') return doc.authorId === user.id;
      return true;
    })

    return NextResponse.json({ archives: filtered })
  } catch (error: any) {
    console.error("Erreur GET archives:", error)
    return NextResponse.json({ error: error.message || "Erreur serveur" }, { status: 500 })
  }
}

// POST /api/admin/archives - Créer une nouvelle archive physique et numérique
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Connexion au bureau requise' }, { status: 401 })
    }

    const user = session.user as any
    const body = await req.json()
    const { title, category, richContent, physicalLocation, accessLevel, referenceCode: customRef } = body

    if (!title || !category || !richContent) {
      return NextResponse.json({ error: 'Le titre, la catégorie et le contenu du document sont requis' }, { status: 400 })
    }

    let referenceCode = customRef?.trim() || generateReferenceCode(category)
    
    // S'assurer que le code est unique
    let exists = await prisma.archiveDocument.findUnique({ where: { referenceCode } })
    let attempts = 0
    while (exists && attempts < 5) {
      referenceCode = generateReferenceCode(category) + `-${attempts + 1}`
      exists = await prisma.archiveDocument.findUnique({ where: { referenceCode } })
      attempts++
    }

    const archive = await prisma.archiveDocument.create({
      data: {
        referenceCode,
        title: title.trim(),
        category,
        richContent,
        physicalLocation: physicalLocation?.trim() || null,
        accessLevel: accessLevel || "bureau",
        authorId: user.id || null,
        authorName: user.name || user.email,
        authorRole: user.role || 'EXECUTIVE',
      }
    })

    return NextResponse.json({ archive, message: `Document archivé avec succès sous la cote [${referenceCode}].` }, { status: 201 })
  } catch (error: any) {
    console.error("Erreur POST archive:", error)
    return NextResponse.json({ error: error.message || "Erreur d'archivage" }, { status: 500 })
  }
}

// PATCH /api/admin/archives - Modifier un document
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const user = session.user as any
    const body = await req.json()
    const { id, title, category, richContent, physicalLocation, accessLevel } = body

    if (!id) {
      return NextResponse.json({ error: 'ID du document requis' }, { status: 400 })
    }

    const existing = await prisma.archiveDocument.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Document introuvable' }, { status: 404 })
    }

    // Vérification des droits : auteur ou ADMIN/PRESIDENT
    if (user.role !== 'ADMIN' && user.role !== 'PRESIDENT' && existing.authorId !== user.id) {
      return NextResponse.json({ error: 'Seul l’auteur ou le Président/Admin peut modifier ce document.' }, { status: 403 })
    }

    const updated = await prisma.archiveDocument.update({
      where: { id },
      data: {
        title: title !== undefined ? title : existing.title,
        category: category !== undefined ? category : existing.category,
        richContent: richContent !== undefined ? richContent : existing.richContent,
        physicalLocation: physicalLocation !== undefined ? physicalLocation : existing.physicalLocation,
        accessLevel: accessLevel !== undefined ? accessLevel : existing.accessLevel,
      }
    })

    return NextResponse.json({ archive: updated, message: 'Document mis à jour avec succès.' })
  } catch (error: any) {
    console.error("Erreur PATCH archive:", error)
    return NextResponse.json({ error: error.message || "Erreur lors de la modification" }, { status: 500 })
  }
}

// DELETE /api/admin/archives - Supprimer un document archivé
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const user = session.user as any
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 })
    }

    const existing = await prisma.archiveDocument.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Document déjà introuvable' }, { status: 404 })
    }

    if (user.role !== 'ADMIN' && user.role !== 'PRESIDENT' && existing.authorId !== user.id) {
      return NextResponse.json({ error: 'Droit de suppression refusé' }, { status: 403 })
    }

    await prisma.archiveDocument.delete({ where: { id } })
    return NextResponse.json({ message: 'Document supprimé des archives.' })
  } catch (error: any) {
    console.error("Erreur DELETE archive:", error)
    return NextResponse.json({ error: error.message || "Erreur serveur" }, { status: 500 })
  }
}
