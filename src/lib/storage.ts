import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

/**
 * Service hybride d'enregistrement de fichiers (Cloudflare R2 ou Stockage Disque Local)
 * Si les variables d'environnement R2 sont définies, propulse sur Cloudflare R2 (bucket bwta-datas par défaut).
 * Sinon, sauvegarde directement sur le disque du serveur dans /public/uploads (protégé par volume Docker).
 */
export async function uploadFile(
  file: File,
  folder: 'photos' | 'cvs' | 'archives'
): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer())
  const ext = path.extname(file.name) || (file.type?.includes('pdf') ? '.pdf' : '.jpg')
  const uniqueName = `${folder.slice(0, -1)}-${Date.now()}-${crypto.randomUUID().slice(0, 8)}${ext}`
  const fileKey = `${folder}/${uniqueName}`

  const accountId = process.env.R2_ACCOUNT_ID
  const accessKeyId = process.env.R2_ACCESS_KEY_ID
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY
  const bucketName = process.env.R2_BUCKET_NAME || 'bwta-datas'
  const publicDomain = process.env.R2_PUBLIC_DOMAIN || process.env.R2_PUBLIC_URL

  // 1. Déploiement Cloudflare R2 (si les clés de production sont présentes dans .env)
  if (accountId && accessKeyId && secretAccessKey) {
    try {
      const s3 = new S3Client({
        region: 'auto',
        endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId,
          secretAccessKey
        }
      })

      const contentType = file.type || (ext === '.pdf' ? 'application/pdf' : 'image/jpeg')

      await s3.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: fileKey,
          Body: buffer,
          ContentType: contentType,
        })
      )

      // Retourner l'URL publique ou l'URL r2.dev
      if (publicDomain) {
        const cleanDomain = publicDomain.endsWith('/') ? publicDomain.slice(0, -1) : publicDomain
        return `${cleanDomain}/${fileKey}`
      } else {
        // Fallback d'URL sur le format Cloudflare si le domaine public n'est pas précisé
        return `https://pub-${accountId.slice(0, 16)}.r2.dev/${fileKey}`
      }
    } catch (r2Error) {
      console.error("❌ Erreur lors de l'envoi sur Cloudflare R2, repli automatique vers le disque local :", r2Error)
    }
  }

  // 2. Stockage Disque Local avec persistance Docker (/app/public/uploads)
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder)
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
  }

  const localPath = path.join(uploadDir, uniqueName)
  fs.writeFileSync(localPath, buffer)

  return `/api/files/${folder}/${uniqueName}`
}
