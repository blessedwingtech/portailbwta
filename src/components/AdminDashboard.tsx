'use client'

import React, { useState } from 'react'
import { Search, Filter, Download, Users, FolderArchive, ShieldCheck, Mail, CheckSquare, Square, FileText, Send, Eye, MessageSquare, ChevronRight, Activity } from 'lucide-react'
import ArchiveManager from './admin/ArchiveManager'
import UserManager from './admin/UserManager'
import EmailLogsView from './admin/EmailLogsView'
import MemberDossierModal from './admin/MemberDossierModal'
import EmailComposerModal from './admin/EmailComposerModal'
import AnalyticsAndAudit from './admin/AnalyticsAndAudit'

export default function AdminDashboard({ 
  initialApplicants = [], 
  sessionUser = {} 
}: { 
  initialApplicants: any[]
  sessionUser?: any 
}) {
  const [activeTab, setActiveTab] = useState<'members' | 'archives' | 'emails' | 'team' | 'analytics'>('members')
  const [applicants, setApplicants] = useState(initialApplicants)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Sélections pour envoi d'emails en lot
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Modales
  const [viewingApplicant, setViewingApplicant] = useState<any | null>(null)
  const [emailRecipients, setEmailRecipients] = useState<{ id: string; firstName?: string; lastName?: string; email: string }[] | null>(null)

  const filteredApplicants = applicants.filter(app => {
    const matchesSearch = `${app.firstName} ${app.lastName} ${app.email} ${app.profession || ''} ${app.cinNif || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || app.applicationStatus === statusFilter
    return matchesSearch && matchesStatus
  })

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredApplicants.length && filteredApplicants.length > 0) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredApplicants.map(a => a.id))
    }
  }

  const toggleSelectOne = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/applicant/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'updateStatus', status: newStatus })
      })
      if (res.ok) {
        setApplicants(prev => prev.map(a => a.id === id ? { ...a, applicationStatus: newStatus } : a))
        if (viewingApplicant?.id === id) {
          setViewingApplicant((prev: any) => ({ ...prev, applicationStatus: newStatus }))
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleOpenBulkEmail = () => {
    const targets = applicants.filter(a => selectedIds.includes(a.id)).map(a => ({
      id: a.id,
      firstName: a.firstName,
      lastName: a.lastName,
      email: a.email,
    }))
    setEmailRecipients(targets)
  }

  const exportCSV = () => {
    const headers = ['Nom', 'Prénom', 'Email', 'Téléphone', 'Profession', 'Expérience', 'Statut', 'Date']
    const rows = filteredApplicants.map(a => [
      a.lastName, 
      a.firstName, 
      a.email, 
      a.phone, 
      a.profession || '', 
      `${a.experience || 0} ans`,
      a.applicationStatus, 
      new Date(a.createdAt).toLocaleDateString()
    ])
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n")
      
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `membres_bwta_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      {/* Modale Fiche Candidat / Dossier Membre */}
      {viewingApplicant && (
        <MemberDossierModal 
          applicant={viewingApplicant}
          onClose={() => setViewingApplicant(null)}
          onContact={(app) => setEmailRecipients([{ id: app.id, firstName: app.firstName, lastName: app.lastName, email: app.email }])}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Modale Messagerie Email (Individuel ou Lot) */}
      {emailRecipients && (
        <EmailComposerModal 
          recipients={emailRecipients}
          onClose={() => { setEmailRecipients(null); setSelectedIds([]); }}
        />
      )}

      {/* Barre de navigation d'onglets exécutive */}
      <div className="flex flex-wrap items-center gap-2.5 p-2 bg-white rounded-2xl shadow-sm border border-slate-200/80">
        <button 
          onClick={() => setActiveTab('members')}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-extrabold text-sm transition-all ${
            activeTab === 'members' 
              ? 'bg-brand-green text-white shadow-md' 
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Users size={18} className={activeTab === 'members' ? 'text-brand-gold' : 'text-slate-400'} />
          <span>Membres &amp; Candidatures</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
            activeTab === 'members' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-800'
          }`}>
            {applicants.length}
          </span>
        </button>

        <button 
          onClick={() => setActiveTab('archives')}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-extrabold text-sm transition-all ${
            activeTab === 'archives' 
              ? 'bg-brand-green text-white shadow-md' 
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <FolderArchive size={18} className={activeTab === 'archives' ? 'text-brand-gold' : 'text-slate-400'} />
          <span>Archives (Physique &amp; Numérique)</span>
        </button>

        <button 
          onClick={() => setActiveTab('emails')}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-extrabold text-sm transition-all ${
            activeTab === 'emails' 
              ? 'bg-brand-green text-white shadow-md' 
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Mail size={18} className={activeTab === 'emails' ? 'text-brand-gold' : 'text-slate-400'} />
          <span>Messagerie &amp; Journal</span>
        </button>

        {(sessionUser.role === 'ADMIN' || sessionUser.role === 'PRESIDENT' || !sessionUser.role) && (
          <button 
            onClick={() => setActiveTab('team')}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-extrabold text-sm transition-all ${
              activeTab === 'team' 
                ? 'bg-brand-green text-white shadow-md' 
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <ShieldCheck size={18} className={activeTab === 'team' ? 'text-brand-gold' : 'text-slate-400'} />
            <span>Comptes Bureau &amp; Rôles</span>
          </button>
        )}

        <button 
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-extrabold text-sm transition-all ${
            activeTab === 'analytics' 
              ? 'bg-brand-green text-white shadow-md' 
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Activity size={18} className={activeTab === 'analytics' ? 'text-brand-gold' : 'text-slate-400'} />
          <span>Trafic Visiteurs &amp; Audit</span>
        </button>
      </div>

      {/* TAB 1: MEMBRES & CANDIDATURES */}
      {activeTab === 'members' && (
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200/80 space-y-4">
          
          {/* Bandeau d'action rapide si des membres sont sélectionnés */}
          {selectedIds.length > 0 && (
            <div className="bg-emerald-900 text-white px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-3 duration-200 shadow-md">
              <div className="flex items-center gap-3 font-extrabold text-sm sm:text-base">
                <span className="w-8 h-8 rounded-full bg-brand-gold text-slate-950 flex items-center justify-center font-black text-sm">
                  {selectedIds.length}
                </span>
                <span>Membre(s) / Candidat(s) sélectionné(s) pour action groupée</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleOpenBulkEmail}
                  className="inline-flex items-center gap-2 bg-white hover:bg-emerald-50 text-slate-950 font-black px-5 py-2.5 rounded-xl transition-all shadow-lg text-xs sm:text-sm"
                >
                  <Send size={16} className="text-brand-green" />
                  <span>Envoyer un E-mail Groupé (CCI)</span>
                </button>
                <button 
                  onClick={() => setSelectedIds([])} 
                  className="text-slate-300 hover:text-white text-xs underline font-semibold px-2"
                >
                  Désélectionner
                </button>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="p-6 border-b border-slate-200 bg-slate-50/60 flex flex-col lg:flex-row gap-4 justify-between items-center">
            <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Rechercher par nom, email, CIN/NIF..." 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl bg-white text-slate-900 font-medium text-sm focus:ring-2 focus:ring-brand-turquoise outline-none"
                />
              </div>
              <div className="relative w-full sm:w-auto">
                <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <select 
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-2.5 border border-slate-300 rounded-xl bg-white text-slate-900 font-extrabold text-sm focus:ring-2 focus:ring-brand-turquoise outline-none appearance-none w-full shadow-2xs"
                >
                  <option value="all">Tous les statuts ({applicants.length})</option>
                  <option value="en_attente">⏳ En attente ({applicants.filter(a => a.applicationStatus === 'en_attente').length})</option>
                  <option value="retenu">✅ Retenus / Membres ({applicants.filter(a => a.applicationStatus === 'retenu').length})</option>
                  <option value="refuse">❌ Refusés ({applicants.filter(a => a.applicationStatus === 'refuse').length})</option>
                </select>
              </div>
            </div>
            
            <button 
              onClick={exportCSV}
              className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all shadow-md w-full lg:w-auto"
            >
              <Download size={16} className="text-brand-gold" /> <span>Exporter Tableau CSV</span>
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 text-xs uppercase tracking-wider font-extrabold border-b border-slate-200">
                  <th className="p-4 w-12 text-center">
                    <button 
                      onClick={toggleSelectAll}
                      className="p-1 text-slate-500 hover:text-brand-green"
                      title="Tout sélectionner pour envoi groupé"
                    >
                      {selectedIds.length === filteredApplicants.length && filteredApplicants.length > 0 ? (
                        <CheckSquare size={18} className="text-brand-green" />
                      ) : (
                        <Square size={18} />
                      )}
                    </button>
                  </th>
                  <th className="p-4">Candidat &amp; Identité</th>
                  <th className="p-4">Contact (Email &amp; Tél)</th>
                  <th className="p-4">Profil Pro / Rôles visés</th>
                  <th className="p-4 text-center">Statut Actuel</th>
                  <th className="p-4 text-right">Actions &amp; Dossier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredApplicants.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-16 text-center text-slate-500 font-medium">
                      Aucune candidature trouvée avec ces critères.
                    </td>
                  </tr>
                ) : filteredApplicants.map(app => {
                  const isChecked = selectedIds.includes(app.id)
                  let roles = []
                  try { roles = JSON.parse(app.roles) } catch {}

                  return (
                    <tr 
                      key={app.id} 
                      className={`hover:bg-emerald-50/40 transition-colors ${isChecked ? 'bg-emerald-50/70' : ''}`}
                    >
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => toggleSelectOne(app.id)}
                          className="p-1 text-slate-400 hover:text-brand-green"
                        >
                          {isChecked ? <CheckSquare size={18} className="text-brand-green" /> : <Square size={18} />}
                        </button>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {app.photoUrl ? (
                            <img src={app.photoUrl} alt="Photo" className="w-10 h-10 rounded-xl object-cover border border-slate-300 shadow-2xs shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-slate-900 text-brand-gold flex items-center justify-center font-black text-sm shrink-0 shadow-2xs">
                              {app.firstName.charAt(0)}{app.lastName.charAt(0)}
                            </div>
                          )}
                          <div>
                            <div 
                              onClick={() => setViewingApplicant(app)}
                              className="font-extrabold text-slate-950 hover:text-brand-green cursor-pointer transition-colors text-base"
                            >
                              {app.firstName} <span className="uppercase">{app.lastName}</span>
                            </div>
                            <div className="text-xs text-slate-500 font-semibold capitalize flex items-center gap-1.5">
                              <span>{app.status.replace('_', ' ')}</span> &bull; 
                              <span className="text-slate-400">{new Date(app.createdAt).toLocaleDateString('fr-FR')}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 text-xs font-medium">
                        <div className="text-slate-900 font-bold">{app.email}</div>
                        <div className="text-slate-500 mt-0.5">{app.phone}</div>
                      </td>

                      <td className="p-4">
                        <div className="font-bold text-xs text-slate-800 line-clamp-1">
                          {app.profession || 'Sans profession spécialisée'} {app.experience ? `(${app.experience} ans)` : ''}
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                          {Array.isArray(roles) && roles.map((r: string) => (
                            <span key={r} className="inline-block bg-brand-green/10 text-brand-green font-extrabold px-2 py-0.5 rounded text-[11px]">
                              {r}
                            </span>
                          ))}
                          {app.cvUrl && (
                            <a 
                              href={app.cvUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              title="Cliquez pour ouvrir/télécharger le CV du candidat"
                              className="inline-flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white font-black px-2 py-0.5 rounded text-[11px] transition-all shadow-2xs ml-1"
                            >
                              📄 CV
                            </a>
                          )}
                        </div>
                      </td>

                      <td className="p-4 text-center">
                        <select 
                          value={app.applicationStatus}
                          onChange={(e) => handleStatusChange(app.id, e.target.value)}
                          className={`text-xs px-3 py-1.5 rounded-full font-extrabold uppercase tracking-wide cursor-pointer border transition-all ${
                            app.applicationStatus === 'retenu' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            app.applicationStatus === 'refuse' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                            'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          <option value="en_attente">En attente</option>
                          <option value="retenu">Retenu</option>
                          <option value="refuse">Refusé</option>
                        </select>
                      </td>

                      <td className="p-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => setEmailRecipients([{ id: app.id, firstName: app.firstName, lastName: app.lastName, email: app.email }])}
                            className="inline-flex items-center gap-1 p-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all"
                            title="Envoyer un e-mail à ce membre"
                          >
                            <Mail size={16} />
                          </button>

                          <button 
                            onClick={() => setViewingApplicant(app)}
                            className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-brand-green text-white font-extrabold px-4 py-2 rounded-xl text-xs transition-all shadow-2xs"
                          >
                            <FileText size={15} className="text-brand-gold" />
                            <span>Dossier Complet</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ARCHIVES */}
      {activeTab === 'archives' && (
        <ArchiveManager sessionUser={sessionUser} />
      )}

      {/* TAB 3: MESSAGERIE EMAIL */}
      {activeTab === 'emails' && (
        <EmailLogsView />
      )}

      {/* TAB 4: COMPTES BUREAU */}
      {activeTab === 'team' && (
        <UserManager currentUserRole={sessionUser.role} />
      )}

      {/* TAB 5: AUDIENCE & AUDIT */}
      {activeTab === 'analytics' && (
        <AnalyticsAndAudit />
      )}
    </div>
  )
}
