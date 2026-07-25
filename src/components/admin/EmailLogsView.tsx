'use client'

import React, { useState, useEffect } from 'react'
import { Mail, CheckCircle, AlertTriangle, Clock, Search, Users, Eye, X } from 'lucide-react'

interface EmailLogItem {
  id: string
  senderEmail: string
  senderName: string | null
  recipientCount: number
  recipients: string
  subject: string
  body: string
  status: string
  errorMessage: string | null
  createdAt: string
}

export default function EmailLogsView() {
  const [logs, setLogs] = useState<EmailLogItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLog, setSelectedLog] = useState<EmailLogItem | null>(null)

  useEffect(() => {
    fetch('/api/admin/email')
      .then(r => r.json())
      .then(d => {
        setLogs(d.logs || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const parseRecipients = (str: string) => {
    try {
      const parsed = JSON.parse(str)
      if (Array.isArray(parsed)) return parsed
      return [str]
    } catch {
      return [str]
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-xl sm:text-2xl font-extrabold text-brand-green flex items-center gap-2.5">
          <Mail className="text-brand-gold" size={26} /> 
          <span>Historique &amp; Journal de Communication</span>
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm mt-1">
          Trace officielle de l&apos;ensemble des e-mails envoyés aux candidats, étudiants et membres du réseau BWTA via contact@bittonik.com.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-slate-500 font-medium">Chargement du journal des e-mails...</div>
        ) : logs.length === 0 ? (
          <div className="p-16 text-center text-slate-500 italic">Aucun e-mail dans l&apos;historique pour l&apos;instant.</div>
        ) : (
          <div className="divide-y divide-slate-100 text-sm">
            {logs.map(log => {
              const recs = parseRecipients(log.recipients)
              return (
                <div key={log.id} className="p-5 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold uppercase ${
                        log.status === 'envoyé' || log.status === 'envoye'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}>
                        {log.status === 'envoyé' || log.status === 'envoye' ? <CheckCircle size={12} /> : <AlertTriangle size={12} />}
                        {log.status}
                      </span>
                      <span className="text-slate-400 font-medium flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(log.createdAt).toLocaleString('fr-FR')}
                      </span>
                      <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-medium text-xs">
                        Par : {log.senderName || log.senderEmail}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-base">{log.subject}</h3>
                    
                    <p className="text-xs text-slate-600 font-medium line-clamp-1 max-w-2xl">
                      <strong>Destinataires ({log.recipientCount}) :</strong> {recs.slice(0, 3).join(', ')} {recs.length > 3 ? `+ ${recs.length - 3} autres...` : ''}
                    </p>
                  </div>

                  <button 
                    onClick={() => setSelectedLog(log)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all self-start sm:self-center shrink-0"
                  >
                    <Eye size={16} />
                    <span>Détails &amp; Contenu</span>
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Modal Détails du log */}
      {selectedLog && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-200 space-y-5 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-extrabold text-brand-green flex items-center gap-2">
                <Mail className="text-brand-gold" size={20} />
                <span>Détail du message archivé</span>
              </h3>
              <button onClick={() => setSelectedLog(null)} className="text-slate-400 hover:text-slate-700">
                <X size={22} />
              </button>
            </div>

            <div className="text-xs sm:text-sm space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div><strong>Date :</strong> {new Date(selectedLog.createdAt).toLocaleString('fr-FR')}</div>
              <div><strong>Expéditeur :</strong> {selectedLog.senderName} ({selectedLog.senderEmail})</div>
              <div><strong>Sujet :</strong> {selectedLog.subject}</div>
              <div>
                <strong>Destinataires ({selectedLog.recipientCount}) :</strong>
                <div className="max-h-24 overflow-y-auto bg-white p-2 rounded border border-slate-200 mt-1 font-mono text-xs text-slate-700">
                  {parseRecipients(selectedLog.recipients).join(', ')}
                </div>
              </div>
              {selectedLog.errorMessage && (
                <div className="text-amber-800 bg-amber-50 p-2 rounded border border-amber-200 font-medium text-xs">
                  <strong>Note système :</strong> {selectedLog.errorMessage}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase">Contenu du message envoyé :</span>
              <div className="p-4 rounded-xl border border-slate-300 bg-white text-sm whitespace-pre-wrap font-sans text-slate-800 leading-relaxed min-h-[120px]">
                {selectedLog.body}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-6 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
