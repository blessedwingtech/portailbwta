'use client'

import { useState, useEffect } from 'react'
import { Activity, ShieldAlert, Smartphone, Monitor, Tablet, RefreshCw, Clock, Globe, Eye, Lock } from 'lucide-react'

interface Visit {
  id: string
  path: string
  device: string
  browser: string
  ipAddress: string
  location: string
  createdAt: string
}

interface AuditLog {
  id: string
  adminEmail: string
  adminName?: string
  action: string
  target?: string
  details?: string
  ipAddress?: string
  createdAt: string
}

export default function AnalyticsAndAudit() {
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'traffic' | 'audit'>('traffic')
  const [analytics, setAnalytics] = useState<{
    totalVisits: number
    devices: { device: string; count: number }[]
    recentVisits: Visit[]
  }>({ totalVisits: 0, devices: [], recentVisits: [] })
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/analytics')
      if (res.ok) {
        const data = await res.json()
        if (data.success) {
          setAnalytics(data.analytics)
          setAuditLogs(data.auditLogs)
        }
      }
    } catch (err) {
      console.error("Erreur de chargement des statistiques", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const getDeviceIcon = (dev: string) => {
    if (dev.toLowerCase().includes('mobile') || dev.toLowerCase().includes('phone')) return <Smartphone size={16} className="text-emerald-500" />
    if (dev.toLowerCase().includes('tablet') || dev.toLowerCase().includes('ipad')) return <Tablet size={16} className="text-amber-500" />
    return <Monitor size={16} className="text-blue-500" />
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* En-tête du module */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-2 text-brand-gold bg-brand-gold/10 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest border border-brand-gold/20 mb-2">
            <Activity size={14} className="animate-pulse" /> Gouvernance &amp; Trafic en Direct
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Audience Publique &amp; Journal d&apos;Audit
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-1">
            Supervision non intrusive des visites web et traçabilité inviolable des actions administratives.
          </p>
        </div>
        
        <button
          onClick={fetchData}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 bg-emerald-600/80 hover:bg-emerald-600 text-white text-xs sm:text-sm font-bold py-3 px-6 rounded-2xl transition-all shadow-md active:scale-95 border border-emerald-400/30 w-full sm:w-auto shrink-0"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          <span>{loading ? "Actualisation..." : "Actualiser en direct"}</span>
        </button>
      </div>

      {/* Cartes métriques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Audience Totale (Pages)</span>
            <div className="text-3xl sm:text-4xl font-black text-slate-900">{analytics.totalVisits}</div>
            <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <Eye size={12} /> Sessions actives sans compte ni cookies
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
            <Activity size={28} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">Appareils &amp; Plateformes</span>
          <div className="flex items-center gap-4 text-sm font-extrabold text-slate-800">
            {analytics.devices.length === 0 ? (
              <span className="text-slate-400 font-medium text-xs">En attente des premières connexions...</span>
            ) : (
              analytics.devices.map(d => (
                <div key={d.device} className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                  {getDeviceIcon(d.device)}
                  <span>{d.count}</span>
                  <span className="text-[10px] text-slate-500 font-semibold">({Math.round((d.count / (analytics.totalVisits || 1)) * 100)}%)</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Journal d&apos;Audit Exécutif</span>
            <div className="text-3xl sm:text-4xl font-black text-brand-gold">{auditLogs.length}</div>
            <p className="text-xs text-slate-500 font-semibold flex items-center gap-1 mt-1">
              <Lock size={12} /> Traçabilité permanente activée
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200/60">
            <ShieldAlert size={28} />
          </div>
        </div>
      </div>

      {/* Sélecteur de vue (Trafic vs Audit) */}
      <div className="flex border-b border-slate-200 text-sm font-extrabold">
        <button
          onClick={() => setViewMode('traffic')}
          className={`pb-4 px-6 inline-flex items-center gap-2.5 border-b-2 transition-all ${
            viewMode === 'traffic'
              ? 'border-brand-green text-brand-green'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Activity size={18} />
          <span>Flux Trafic Visiteurs ({analytics.recentVisits.length})</span>
        </button>
        <button
          onClick={() => setViewMode('audit')}
          className={`pb-4 px-6 inline-flex items-center gap-2.5 border-b-2 transition-all ${
            viewMode === 'audit'
              ? 'border-brand-gold text-amber-950'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldAlert size={18} />
          <span>Journal d&apos;Audit Exécutif ({auditLogs.length})</span>
        </button>
      </div>

      {/* Vue 1: Tableau Trafic Visiteurs */}
      {viewMode === 'traffic' && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 bg-slate-50 border-b border-slate-100">
            <h3 className="text-base font-extrabold text-slate-900">Dernières visites sur le portail public</h3>
            <p className="text-xs text-slate-500">Données respectueuses de la vie privée (aucune IP stockée en clair plus de 15 mn, zéro cookies publicitaires).</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  <th className="p-4 pl-6">Horodatage</th>
                  <th className="p-4">Page Visitée</th>
                  <th className="p-4">Appareil</th>
                  <th className="p-4">Navigateur</th>
                  <th className="p-4 pr-6">Localisation (Réseau)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {analytics.recentVisits.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400 font-medium italic">
                      Aucune visite capturée pour le moment. Visitez le site public et actualisez cette vue !
                    </td>
                  </tr>
                ) : (
                  analytics.recentVisits.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 pl-6 text-slate-500 font-semibold inline-flex items-center gap-2 whitespace-nowrap">
                        <Clock size={14} className="text-slate-400" />
                        {new Date(v.createdAt).toLocaleString('fr-HT', { dateStyle: 'short', timeStyle: 'medium' })}
                      </td>
                      <td className="p-4 font-extrabold text-brand-green">
                        <span className="bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60">
                          {v.path}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-slate-800">
                        <span className="inline-flex items-center gap-2">
                          {getDeviceIcon(v.device)}
                          {v.device}
                        </span>
                      </td>
                      <td className="p-4 text-slate-700 font-semibold">{v.browser || 'Inconnu'}</td>
                      <td className="p-4 pr-6 text-slate-600 font-medium inline-flex items-center gap-1.5">
                        <Globe size={14} className="text-slate-400" />
                        {v.location || 'Haïti / Non spécifié'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Vue 2: Journal d'Audit Administrateurs */}
      {viewMode === 'audit' && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 bg-amber-50/30 border-b border-amber-100/50 flex justify-between items-center">
            <div>
              <h3 className="text-base font-extrabold text-amber-950">Journal des opérations &amp; de traçabilité exécutive</h3>
              <p className="text-xs text-slate-500">Toutes les actions de modification et de gestion réalisées au sein de cet espace sont consignées ici de manière permanente.</p>
            </div>
            <span className="bg-amber-100 text-amber-900 text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
              Inviolable &amp; Horodaté
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  <th className="p-4 pl-6">Horodatage</th>
                  <th className="p-4">Administrateur</th>
                  <th className="p-4">Action</th>
                  <th className="p-4">Cible &amp; Détails</th>
                  <th className="p-4 pr-6">Origine (IP)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400 font-medium italic">
                      Aucune modification d&apos;audit enregistrée à date (tous les prochains changements de statuts de dossiers et notes apparaîtront ici).
                    </td>
                  </tr>
                ) : (
                  auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-amber-50/10 transition-colors">
                      <td className="p-4 pl-6 text-slate-500 font-semibold whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString('fr-HT', { dateStyle: 'short', timeStyle: 'medium' })}
                      </td>
                      <td className="p-4 font-extrabold text-slate-900">
                        <div>{log.adminName || log.adminEmail}</div>
                        <span className="text-[11px] text-slate-400 font-normal">{log.adminEmail}</span>
                      </td>
                      <td className="p-4 font-black">
                        <span className="bg-slate-900 text-brand-gold px-2.5 py-1 rounded-lg text-xs font-sans tracking-wide uppercase">
                          {log.action}
                        </span>
                      </td>
                      <td className="p-4 text-slate-800">
                        <div className="font-bold text-brand-green">{log.target || 'N/A'}</div>
                        <div className="text-xs text-slate-500 italic mt-0.5">{log.details || 'Aucun détail additionnel'}</div>
                      </td>
                      <td className="p-4 pr-6 text-slate-400 font-mono text-xs">{log.ipAddress || 'Interne'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
