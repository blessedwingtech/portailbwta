import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/route'

const prisma = new PrismaClient()

// GET /api/admin/users - Lister tous les comptes membres du Bureau / Admin
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const users = await prisma.adminUser.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        active: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    })

    return NextResponse.json({ users })
  } catch (error: any) {
    console.error("Erreur GET users:", error)
    return NextResponse.json({ error: error.message || "Erreur serveur" }, { status: 500 })
  }
}

// POST /api/admin/users - Créer un compte pour Secrétaire, Trésorier, Président...
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || ((session.user as any).role !== 'ADMIN' && (session.user as any).role !== 'PRESIDENT')) {
      return NextResponse.json({ error: 'Privilèges administrateur requis pour créer des comptes' }, { status: 403 })
    }

    const body = await req.json()
    const { email, password, name, role } = body

    if (!email || !password || !role) {
      return NextResponse.json({ error: 'Email, mot de passe et rôle sont requis' }, { status: 400 })
    }

    const existingUser = await prisma.adminUser.findUnique({
      where: { email: email.toLowerCase().trim() }
    })

    if (existingUser) {
      return NextResponse.json({ error: "Un compte avec cette adresse email existe déjà" }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const newUser = await prisma.adminUser.create({
      data: {
        email: email.toLowerCase().trim(),
        name: name?.trim() || null,
        role: role.toUpperCase(),
        passwordHash,
        active: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        active: true,
        createdAt: true,
      }
    })

    return NextResponse.json({ user: newUser, message: `Compte ${role} créé avec succès.` }, { status: 201 })
  } catch (error: any) {
    console.error("Erreur POST user:", error)
    return NextResponse.json({ error: error.message || "Erreur serveur lors de la création du compte" }, { status: 500 })
  }
}

// PATCH /api/admin/users - Modifier le statut actif/inactif ou rôle
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || ((session.user as any).role !== 'ADMIN' && (session.user as any).role !== 'PRESIDENT')) {
      return NextResponse.json({ error: 'Privilèges requis' }, { status: 403 })
    }

    const body = await req.json()
    const { id, role, active, name, password } = body

    if (!id) {
      return NextResponse.json({ error: 'ID utilisateur requis' }, { status: 400 })
    }

    const updateData: any = {}
    if (role !== undefined) updateData.role = role
    if (active !== undefined) updateData.active = active
    if (name !== undefined) updateData.name = name
    if (password && password.trim() !== '') {
      updateData.passwordHash = await bcrypt.hash(password, 10)
    }

    const updated = await prisma.adminUser.update({
      where: { id },
      data: updateData,
      select: { id: true, email: true, name: true, role: true, active: true, createdAt: true }
    })

    return NextResponse.json({ user: updated, message: 'Compte mis à jour.' })
  } catch (error: any) {
    console.error("Erreur PATCH user:", error)
    return NextResponse.json({ error: error.message || "Erreur lors de la modification" }, { status: 500 })
  }
}

// DELETE /api/admin/users - Supprimer un compte
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Seul l’administrateur principal peut supprimer un compte' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 })
    }

    if (id === (session.user as any).id) {
      return NextResponse.json({ error: 'Vous ne pouvez pas supprimer votre propre compte en cours d’utilisation' }, { status: 400 })
    }

    await prisma.adminUser.delete({ where: { id } })

    return NextResponse.json({ message: 'Compte supprimé.' })
  } catch (error: any) {
    console.error("Erreur DELETE user:", error)
    return NextResponse.json({ error: error.message || "Erreur serveur" }, { status: 500 })
  }
}
