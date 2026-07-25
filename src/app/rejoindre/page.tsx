import ApplicationForm from '@/components/ApplicationForm'
import { ArrowLeft, Target, Shield, Users } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Postuler à BWTA | Candidature & Alliance Technologique',
  description: 'Rejoignez la vision associative de Blessed Wing Tech Academy. Postulez en tant que fondateur, formateur, partenaire ou collaborateur projet en Haïti.',
}

export default function RejoindrePage() {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-900 selection:bg-brand-gold selection:text-slate-950">
      <header className="bg-brand-green text-white py-12 sm:py-16 px-4 sm:px-8 lg:px-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-turquoise/15 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-gold/15 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

        <div className="max-w-4xl mx-auto relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-emerald-300 hover:text-white mb-6 text-sm font-bold transition-colors group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Retour à l&apos;accueil
          </Link>

          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-emerald-400/30 text-emerald-200 text-xs sm:text-sm font-semibold tracking-wide">
              <Target size={14} className="text-brand-gold" /> Appel aux Forces Vives &amp; Partenaires
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Dossier d&apos;Adhésion &amp; Candidature</h1>
            <p className="text-emerald-100/90 text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl">
              BWTA se structure comme un écosystème associatif innovant. Vous êtes <strong className="text-white">professionnel</strong>, <strong className="text-white">formateur</strong>, <strong className="text-white">passionné de tech</strong>, <strong className="text-white">entrepreneur</strong> ou <strong className="text-white">représentant d&apos;une organisation</strong> ? Remplissez ce formulaire pour participer à la révolution technologique haïtienne et abattre les barrières financières d&apos;accès au numérique.
            </p>

            <div className="pt-2 flex flex-wrap gap-4 text-xs sm:text-sm text-emerald-200 font-medium">
              <span className="inline-flex items-center gap-1.5 bg-emerald-900/60 border border-emerald-700/60 px-3 py-1.5 rounded-lg">
                <Shield size={16} className="text-brand-gold" /> Données 100% Confidentielles
              </span>
              <span className="inline-flex items-center gap-1.5 bg-emerald-900/60 border border-emerald-700/60 px-3 py-1.5 rounded-lg">
                <Users size={16} className="text-brand-turquoise" /> Sélection compétitive (15 fondateurs retenus) <small></small>
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow py-8 sm:py-14 px-3 sm:px-6 md:px-12 -mt-6 sm:-mt-8 relative z-20">
        <div className="max-w-4xl mx-auto">
          <ApplicationForm />
        </div>
      </main>

      <footer className="bg-slate-950 text-slate-400 py-8 px-4 text-center border-t border-slate-900 mt-auto">
        <div className="max-w-4xl mx-auto space-y-2">
          <p className="text-xs sm:text-sm font-semibold text-slate-300">Blessed Wing Tech Academy &bull; Initiative sous l&apos;égide de BWT</p>
          <p className="text-xs text-slate-600">&copy; {new Date().getFullYear()} BWTA - Blessed Wing Technology. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  )
}
