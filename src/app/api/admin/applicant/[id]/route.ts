import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../auth/[...nextauth]/route'

const prisma = new PrismaClient()

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()
    
    const { action, status, note } = body

    if (action === 'updateStatus' && status) {
      const updated = await prisma.applicant.update({
        where: { id },
        data: { applicationStatus: status }
      })
      return NextResponse.json({ success: true, applicant: updated })
    }

    if (action === 'addNote' && note) {
      const newNote = await prisma.applicationNote.create({
        data: {
          content: note,
          applicantId: id
        }
      })
      return NextResponse.json({ success: true, note: newNote })
    }

    return NextResponse.json({ error: 'Action invalide' }, { status: 400 })

  } catch (error) {
    console.error('Admin API error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
