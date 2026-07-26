import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

/**
 * Bouclier Zéro-Redémarrage pour le stockage local :
 * Cette route API sert instantanément les fichiers déposés dans /public/uploads
 * depuis le disque SSD du serveur, sans attendre d'indexation ni aucun redémarrage du conteneur Next.js !
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: filePathArray } = await context.params
    if (!filePathArray || filePathArray.length === 0) {
      return new NextResponse('Fichier non spécifié', { status: 400 })
    }

    // Protection anti-traversée de répertoire
    const relativePath = path.normalize(filePathArray.join('/')).replace(/^(\.\.(\/|\\|$))+/, '')
    const fullPath = path.join(process.cwd(), 'public', 'uploads', relativePath)

    if (!fs.existsSync(fullPath)) {
      return new NextResponse('Fichier introuvable', { status: 404 })
    }

    const fileBuffer = fs.readFileSync(fullPath)
    const ext = path.extname(fullPath).toLowerCase()

    const contentTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    }

    const contentType = contentTypes[ext] || 'application/octet-stream'

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Erreur lors de la lecture du fichier dynamique :', error)
    return new NextResponse('Erreur serveur lors de la lecture', { status: 500 })
  }
}
