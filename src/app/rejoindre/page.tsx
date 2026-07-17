import ApplicationForm from '@/components/ApplicationForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Candidature | Blessed Wing Tech Academy',
  description: 'Soumettez votre candidature pour rejoindre Blessed Wing Tech Academy.',
}

export default function RejoindrePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-brand-green text-white py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-brand-turquoise-light hover:text-white mb-6 transition-colors">
            <ArrowLeft size={20} /> Retour à l'accueil
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Dossier de Candidature</h1>
          <p className="text-emerald-50 text-lg">
            Remplissez ce formulaire avec soin. Rappel : la sélection est compétitive (15 places).
          </p>
        </div>
      </header>

      <main className="flex-grow py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <ApplicationForm />
        </div>
      </main>

      <footer className="bg-slate-900 text-slate-400 py-8 px-6 text-center border-t border-slate-800 mt-auto">
        <div className="max-w-4xl mx-auto">
          <p>&copy; {new Date().getFullYear()} BWTA - Blessed Wing Technology.</p>
        </div>
      </footer>
    </div>
  )
}
