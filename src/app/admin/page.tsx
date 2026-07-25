import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import { PrismaClient } from '@prisma/client'
import AdminDashboard from '@/components/AdminDashboard'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    redirect('/admin/login')
  }

  // Récupérer toutes les candidatures et dossiers membres
  const applicants = await prisma.applicant.findMany({
    include: {
      educations: true,
      achievements: true,
      references: true,
      notes: {
        orderBy: { createdAt: 'desc' }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  // Sérialiser pour éviter les erreurs d'hydratation Date/JSON Next.js
  const serializedApplicants = JSON.parse(JSON.stringify(applicants))
  const sessionUser = JSON.parse(JSON.stringify(session.user))

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans selection:bg-brand-turquoise selection:text-white">
      <header className="bg-slate-950 text-white py-4 px-6 sm:px-10 shadow-xl border-b border-emerald-500/30 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-green flex items-center justify-center font-black text-white shadow-md border border-brand-gold/40">
              BW
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-2">
                <span>BWTA</span> <span className="text-brand-gold font-light">|</span> <span>Portail Associatif</span>
              </h1>
              <p className="text-[11px] font-medium text-slate-400">
                Blessed Wing Tech Academy &bull; Système de Gestion &amp; Archives Exécutives
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 bg-slate-900/90 px-4 py-2 rounded-2xl border border-slate-800 text-xs sm:text-sm">
            <div className="text-right">
              <div className="font-extrabold text-white">{sessionUser.name || sessionUser.email.split('@')[0]}</div>
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-brand-gold">{sessionUser.role || 'EXECUTIVE'}</div>
            </div>
            <a 
              href="/api/auth/signout" 
              className="bg-rose-500/20 hover:bg-rose-600 text-rose-300 hover:text-white font-bold px-3 py-1.5 rounded-xl transition-all text-xs"
            >
              Déconnexion
            </a>
          </div>
        </div>
      </header>

      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <AdminDashboard initialApplicants={serializedApplicants} sessionUser={sessionUser} />
      </main>
    </div>
  )
}
