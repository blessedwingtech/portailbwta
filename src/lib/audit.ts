import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface AuditLogParams {
  adminEmail: string
  adminName?: string
  action: string
  target?: string
  details?: string
  ipAddress?: string
}

/**
 * Enregistreur officiel d'Audit et Traçabilité pour l'administration BWTA.
 * Garantie d'immutabilité : chaque action critique est scellée avec horodatage en base de données.
 */
export async function logAudit(params: AuditLogParams): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        adminEmail: params.adminEmail || 'Inconnu',
        adminName: params.adminName || null,
        action: params.action,
        target: params.target || null,
        details: params.details || null,
        ipAddress: params.ipAddress || null,
      }
    })
  } catch (error) {
    console.error("❌ Erreur d'enregistrement dans le journal d'audit :", error)
  }
}
