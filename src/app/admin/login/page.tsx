'use client'

import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Loader2, Lock, ShieldCheck, ArrowLeft, Building, HelpCircle } from 'lucide-react'
import Link from 'next/link'

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })

      if (res?.error) {
        setError("Identifiants incorrects ou compte désactivé. Veuillez contacter le Président ou l'Admin.")
      } else {
        router.push('/admin')
      }
    } catch (err) {
      setError("Une erreur est survenue lors de l'authentification.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 flex flex-col justify-between p-4 sm:p-8 font-sans selection:bg-brand-turquoise selection:text-white">
      {/* Haut de page */}
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center text-white text-sm">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-slate-300 hover:text-brand-gold transition-colors font-bold text-xs sm:text-sm"
        >
          <ArrowLeft size={16} />
          <span>Retour au site principal BWTA</span>
        </Link>
        <span className="text-xs font-extrabold uppercase tracking-widest text-brand-gold bg-brand-gold/10 px-3 py-1 rounded-full border border-brand-gold/20 hidden sm:inline-block">
          Portail Exécutif &bull; Pignon, Haïti
        </span>
      </div>

      {/* Carte centrale de connexion */}
      <div className="w-full max-w-md mx-auto my-auto py-8">
        <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-10 border border-emerald-500/20 space-y-8 relative overflow-hidden">
          
          {/* Accent lumineux top */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-brand-green via-brand-turquoise to-brand-gold" />

          <div className="flex flex-col items-center text-center space-y-2 pt-2">
            <div className="w-16 h-16 bg-gradient-to-tr from-brand-green to-emerald-600 text-brand-gold-light rounded-2xl flex items-center justify-center shadow-lg border-2 border-brand-gold/40 mb-2">
              <Lock size={32} />
            </div>
            <span className="text-[11px] font-black uppercase tracking-wider bg-emerald-50 text-brand-green px-3 py-1 rounded-full border border-emerald-200">
              Accès Sécurisé - Conseil &amp; Bureau
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Connexion BWTA
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
              Espace réservé aux membres du bureau exécutif (Président, Vice-Président, Secrétaire, Trésorier &amp; Admins).
            </p>
          </div>

          {error && (
            <div className="bg-rose-50 border-l-4 border-rose-500 text-rose-800 p-4 rounded-r-xl text-xs sm:text-sm font-bold text-left shadow-2xs">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5 text-left">
              <label className="block text-xs uppercase font-extrabold tracking-wider text-slate-700">
                Adresse E-mail Officielle
              </label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ex: secretaire@bittonik.com"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-slate-50/50 text-slate-900 font-extrabold text-sm focus:bg-white focus:ring-2 focus:ring-brand-turquoise outline-none transition-all shadow-2xs"
              />
            </div>

            <div className="space-y-1.5 text-left">
              <div className="flex justify-between items-center">
                <label className="block text-xs uppercase font-extrabold tracking-wider text-slate-700">
                  Mot de passe confidentiel
                </label>
              </div>
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-slate-50/50 text-slate-900 font-bold text-sm focus:bg-white focus:ring-2 focus:ring-brand-turquoise outline-none transition-all shadow-2xs"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-slate-900 hover:bg-brand-green disabled:opacity-50 text-white font-black py-3.5 px-6 rounded-xl transition-all duration-300 shadow-xl flex items-center justify-center gap-2.5 text-sm uppercase tracking-wide group"
            >
              {isLoading ? (
                <><Loader2 className="animate-spin text-brand-gold" size={20} /> <span>Vérification...</span></>
              ) : (
                <><ShieldCheck size={20} className="text-brand-gold group-hover:scale-110 transition-transform" /> <span>Ouvrir ma Session Exécutive</span></>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center space-y-2">
            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
              💡 <strong>Nouveau membre du bureau ?</strong> Votre compte et votre rôle (Secrétaire, Trésorier...) sont créés par le Président ou l&apos;Administrateur principal depuis l&apos;onglet <em>« Comptes Bureau &amp; Rôles »</em> du portail.
            </p>
          </div>
        </div>
      </div>

      {/* Bas de page */}
      <div className="text-center text-[11px] font-medium text-slate-400 py-4 max-w-xl mx-auto">
        &copy; {new Date().getFullYear()} Blessed Wing Tech Academy (BWTA) &bull; Initiative sous l&apos;égide de BWT. Tous droits réservés.
      </div>
    </div>
  )
}
