import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import nodemailer from 'nodemailer'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/route'

const prisma = new PrismaClient()

// GET /api/admin/email - Récupérer l'historique et journal des e-mails envoyés
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const logs = await prisma.emailLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100 // Les 100 derniers emails
    })

    return NextResponse.json({ logs })
  } catch (error: any) {
    console.error("Erreur GET email logs:", error)
    return NextResponse.json({ error: error.message || "Erreur serveur" }, { status: 500 })
  }
}

// POST /api/admin/email - Envoyer un e-mail à un ou plusieurs membres / candidats
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const user = session.user as any
    const body = await req.json()
    const { recipients, subject, body: emailBody } = body

    if (!recipients || !subject || !emailBody) {
      return NextResponse.json({ error: 'Destinataire(s), sujet et message requis' }, { status: 400 })
    }

    // Uniformiser les destinataires sous forme de tableau d'emails
    const recipientArray: string[] = Array.isArray(recipients) 
      ? recipients 
      : typeof recipients === 'string' 
        ? recipients.split(/[\s,]+/).map((e: string) => e.trim()).filter(Boolean)
        : []

    if (recipientArray.length === 0) {
      return NextResponse.json({ error: 'Aucune adresse email valide trouvée.' }, { status: 400 })
    }

    const smtpHost = process.env.SMTP_HOST || 'mail.bittonik.com'
    const smtpPort = Number(process.env.SMTP_PORT || 465)
    const smtpUser = process.env.SMTP_USER || 'contact@bittonik.com'
    const smtpPass = process.env.SMTP_PASS || ''
    const smtpFrom = process.env.SMTP_FROM || '"BWTA - Blessed Wing Tech Academy" <contact@bittonik.com>'

    let sendStatus = 'envoyé'
    let errorMessage = null

    // Envoi réel via Nodemailer si le mot de passe SMTP est renseigné
    if (smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465, // true pour 465 (SSL/TLS direct), false pour 587 (STARTTLS)
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        })

        // On envoie le message en CCI (bcc) s'il y a plusieurs destinataires pour protéger la confidentialité !
        const mailOptions: any = {
          from: smtpFrom,
          subject: subject.trim(),
          html: emailBody.replace(/\n/g, '<br/>'),
          text: emailBody,
        }

        if (recipientArray.length === 1) {
          mailOptions.to = recipientArray[0]
        } else {
          mailOptions.to = smtpUser // expéditeur en "To" principal
          mailOptions.bcc = recipientArray // destinataires réels en CCI
        }

        await transporter.sendMail(mailOptions)
      } catch (err: any) {
        console.error("Erreur SMTP Nodemailer:", err)
        sendStatus = 'échec'
        errorMessage = err.message || 'Erreur SMTP'
      }
    } else {
      // Si pas encore de SMTP_PASS, on consigne l'email dans l'historique et en simulation réussie
      console.log(`[SMTP SIMULATION] E-mail destiné à (${recipientArray.join(', ')}) via ${smtpHost} (${smtpUser}) - Sujet: ${subject}`)
      if (!errorMessage) {
        errorMessage = "Mode simulation (Configurez SMTP_PASS dans le fichier .env sur votre serveur pour activer l'envoi réel via mail.bittonik.com)."
      }
    }

    // Exécution et sauvegarde dans le journal de l'association (Base de Données)
    const logEntry = await prisma.emailLog.create({
      data: {
        senderEmail: smtpUser,
        senderName: user.name || user.email,
        recipientCount: recipientArray.length,
        recipients: JSON.stringify(recipientArray),
        subject: subject.trim(),
        body: emailBody,
        status: sendStatus,
        errorMessage: errorMessage || null,
      }
    })

    if (sendStatus === 'échec') {
      return NextResponse.json({ 
        error: `Échec d'envoi SMTP : ${errorMessage}. La tentative a toutefois été journalisée.`, 
        log: logEntry 
      }, { status: 502 })
    }

    return NextResponse.json({ 
      message: smtpPass 
        ? `E-mail envoyé avec succès à ${recipientArray.length} membre(s).`
        : `E-mail journalisé (Mode simulation actif en attente du SMTP_PASS dans .env).`,
      log: logEntry 
    }, { status: 200 })

  } catch (error: any) {
    console.error("Erreur POST email:", error)
    return NextResponse.json({ error: error.message || "Erreur serveur" }, { status: 500 })
  }
}
