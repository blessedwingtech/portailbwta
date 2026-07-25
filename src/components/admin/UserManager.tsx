'use client'

import React, { useState, useEffect } from 'react'
import { UserPlus, Shield, Trash2, Edit2, Check, X, Loader2, UserCheck, Lock, Mail, User } from 'lucide-react'

interface AdminAccount {
  id: string
  email: string
  name: string | null
  role: string
  active: boolean
  createdAt: string
}

export default function UserManager({ currentUserRole }: { currentUserRole?: string }) {
  const [users, setUsers] = useState<AdminAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Form states
  const [showModal, setShowModal] = useState(false)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('SECRETAIRE')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/users')
      if (res.ok) {
        const data = await res.json()
        setUsers(data.users || [])
      } else {
        setError('Impossible de charger les comptes utilisateurs')
      }
    } catch (e: any) {
      setError(e.message || 'Erreur réseau')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, password, role })
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la création du compte')
      }

      setSuccess(`Compte pour le rôle ${role} créé avec succès !`)
      setEmail('')
      setName('')
      setPassword('')
      setShowModal(false)
      fetchUsers()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleActive = async (user: AdminAccount) => {
    const actionText = user.active 
      ? `vouloir DÉSACTIVER l'accès de ${user.email} SANS supprimer son compte ? (Ce collaborateur conservera son dossier en base mais ne pourra plus se connecter au portail)` 
      : `vouloir RÉACTIVER le compte de ${user.email} et lui restituer l'accès à son espace ?`
    
    if (!window.confirm(`Êtes-vous sûr de ${actionText}`)) return

    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, active: !user.active })
      })
      if (res.ok) {
        setUsers(prev => prev.map(u => u.id === user.id ? { ...u, active: !user.active } : u))
        setSuccess(`Le compte ${user.email} a été ${user.active ? 'désactivé (accès suspendu sans suppression)' : 'réactivé avec succès'}.`)
      } else {
        const data = await res.json()
        setError(data.error || 'Erreur lors de la modification du statut')
      }
    } catch (e: any) {
      setError(e.message || 'Erreur lors du changement de statut')
      console.error(e)
    }
  }

  const handleDelete = async (id: string, userEmail: string) => {
    if (!window.confirm(`⚠️ ATTENTION : Êtes-vous sûr de vouloir DÉFINITIVEMENT supprimer le compte de ${userEmail} ? (Si vous souhaitez simplement révoquer ses accès en gardant son historique, utilisez le bouton "Désactiver" à la place)`)) return

    try {
      const res = await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setUsers(prev => prev.filter(u => u.id !== id))
        setSuccess('Compte supprimé définitivement.')
      } else {
        const data = await res.json()
        setError(data.error || 'Erreur lors de la suppression')
      }
    } catch (e: any) {
      setError(e.message)
    }
  }

  const roleBadge = (r: string) => {
    switch (r) {
      case 'ADMIN':
        return <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-bold border border-purple-200">Administrateur</span>
      case 'PRESIDENT':
        return <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold border border-amber-200">Président</span>
      case 'SECRETAIRE':
        return <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold border border-emerald-200">Secrétaire</span>
      case 'TRESORIER':
        return <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold border border-blue-200">Trésorier</span>
      default:
        return <span className="px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-xs font-semibold">{r}</span>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-brand-green flex items-center gap-2">
            <Shield className="text-brand-gold" size={24} /> 
            <span>Comptes du Bureau Exécutif &amp; Rôles</span>
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            Gérez les accès administratifs de la direction. Vous pouvez désactiver un collaborateur pour révoquer instantanément son accès tout en préservant intactes l&apos;intégralité de ses archives !
          </p>
        </div>

        <button 
          onClick={() => setShowModal(true)}
          className="inline-flex items-center justify-center gap-2 bg-brand-green hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-md text-sm"
        >
          <UserPlus size={18} />
          Créer un compte Exécutif
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 border-l-4 border-rose-500 p-4 text-rose-800 rounded-r-xl text-sm font-medium flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError('')}><X size={16} /></button>
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 text-emerald-800 rounded-r-xl text-sm font-medium flex items-center justify-between">
          <span>{success}</span>
          <button onClick={() => setSuccess('')}><X size={16} /></button>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
            <Loader2 className="animate-spin text-brand-green" size={28} />
            <span>Chargement des membres du bureau...</span>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-slate-500">Aucun utilisateur inscrit.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold uppercase tracking-wider border-b border-slate-200">
                  <th className="p-4">Membre &amp; Fonction</th>
                  <th className="p-4">Adresse Email</th>
                  <th className="p-4">Rôle Exécutif</th>
                  <th className="p-4">Date de création</th>
                  <th className="p-4 text-center">Statut Actuel</th>
                  <th className="p-4 text-right">Actions (Désactiver / Supprimer)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-xs shrink-0 ${u.active ? 'bg-emerald-100 text-brand-green' : 'bg-slate-200 text-slate-500'}`}>
                          {(u.name || u.email).charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className={u.active ? '' : 'line-through text-slate-500'}>{u.name || 'Non renseigné'}</div>
                          <div className="text-xs text-slate-400">ID: {u.id.slice(-6)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-medium text-slate-700">{u.email}</td>
                    <td className="p-4">{roleBadge(u.role)}</td>
                    <td className="p-4 text-slate-500 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold shadow-2xs ${
                        u.active ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300 animate-pulse'
                      }`}>
                        {u.active ? <><Check size={14} /> Connexion Autorisée</> : <><Lock size={14} /> Désactivé (Accès Bloqué)</>}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center justify-end gap-2">
                        <button 
                          onClick={() => toggleActive(u)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs ${
                            u.active 
                              ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300' 
                              : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300'
                          }`}
                          title={u.active ? "Désactiver l'accès sans supprimer le dossier du collaborateur" : "Réactiver le compte de ce collaborateur"}
                        >
                          {u.active ? (
                            <><Lock size={14} className="text-amber-800" /> <span>Désactiver (Sans Supprimer)</span></>
                          ) : (
                            <><UserCheck size={14} className="text-emerald-800" /> <span>Réactiver le Compte</span></>
                          )}
                        </button>

                        <button 
                          onClick={() => handleDelete(u.id, u.email)}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl transition-colors text-xs font-bold inline-flex items-center gap-1 shadow-2xs hover:text-rose-900"
                          title="Supprimer définitivement ce compte de la base de données"
                        >
                          <Trash2 size={14} />
                          <span className="hidden sm:inline">Supprimer</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal création d'un compte */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg sm:text-xl font-extrabold text-brand-green flex items-center gap-2">
                <UserPlus className="text-brand-gold" size={22} />
                <span>Nouveau Compte Exécutif</span>
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700 p-1">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateAccount} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs sm:text-sm font-semibold text-slate-800 block">Nom et Prénom du cadre</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Ex: Jean Michel (Secrétaire)"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-turquoise"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs sm:text-sm font-semibold text-slate-800 block">Adresse Email <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="secretaire@bittonik.com / bwta"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-turquoise"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs sm:text-sm font-semibold text-slate-800 block">Mot de passe de connexion <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Mot de passe sécurisé (min 6 caractères)"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-turquoise"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs sm:text-sm font-semibold text-slate-800 block">Rôle Exécutif au sein de BWTA <span className="text-rose-500">*</span></label>
                <select 
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-turquoise shadow-2xs"
                >
                  <option value="SECRETAIRE">Secrétaire (Procès-verbaux, Notes, Événements)</option>
                  <option value="TRESORIER">Trésorier (Archivage financier, cotisation, reçus)</option>
                  <option value="PRESIDENT">Président (Validation, supervision générale, messagerie)</option>
                  <option value="ADMIN">Admin IT / Système (Accès technique complet)</option>
                </select>
                <p className="text-xs text-slate-500 pt-1">
                  Tous ces profils ont accès aux outils d&apos;archivage physique &amp; numérique et à la communication officielle.
                </p>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 bg-brand-green hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-lg text-sm disabled:opacity-70"
                >
                  {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> Création...</> : 'Valider la création'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
