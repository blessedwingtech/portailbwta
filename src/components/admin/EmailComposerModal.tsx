'use client'

import React, { useState } from 'react'
import { Mail, Send, X, Users, AlertCircle, CheckCircle, Loader2, Info } from 'lucide-react'

export default function EmailComposerModal({
  recipients = [],
  onClose,
  onSent
}: {
  recipients: { id: string; firstName?: string; lastName?: string; email: string }[]
  onClose: () => void
  onSent?: (log: any) => void
}) {
  const [recipientList, setRecipientList] = useState(recipients)
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState(`Bonjour,\n\n\n\nCordialement,\nLe Bureau de Direction BWTA\nBlessed Wing Tech Academy\nhttps://bwta.bittonik.com`)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [logDetails, setLogDetails] = useState<any>(null)

  const removeRecipient = (email: string) => {
    setRecipientList(prev => prev.filter(r => r.email !== email))
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (recipientList.length === 0) {
      setError("Veuillez sélectionner au moins un destinataire.")
      return
    }
    if (!subject.trim() || !body.trim()) {
      setError("Le sujet et le corps du message sont requis.")
      return
    }

    setIsSending(true)
    setError('')
    setSuccess('')

    try {
      const emails = recipientList.map(r => r.email)
      const res = await fetch('/api/admin/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipients: emails,
          subject,
          body
        })
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de l'envoi du message")
      }

      setSuccess(data.message || "Message envoyé avec succès !")
      setLogDetails(data.log)
      if (onSent && data.log) onSent(data.log)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl sm:max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] flex flex-col overflow-y-auto">
        
        {/* Entête */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-brand-green/10 text-brand-green flex items-center justify-center font-extrabold shadow-xs">
              <Mail size={22} />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-brand-green">
                Communication &amp; Messagerie BWTA
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Envoi depuis : <strong className="text-slate-800">contact@bittonik.com</strong> (mail.bittonik.com)
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg">
            <X size={22} />
          </button>
        </div>

        {error && (
          <div className="bg-rose-50 border-l-4 border-rose-500 p-4 text-rose-800 rounded-r-xl text-xs sm:text-sm font-semibold flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError('')}><X size={16} /></button>
          </div>
        )}

        {success ? (
          <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center space-y-4 my-4">
            <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
              <CheckCircle size={28} />
            </div>
            <h4 className="text-lg font-extrabold text-emerald-950">Opération traitée avec succès</h4>
            <p className="text-sm text-emerald-800 font-medium max-w-md mx-auto">{success}</p>
            {logDetails?.errorMessage && (
              <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200 text-left">
                ℹ️ {logDetails.errorMessage}
              </p>
            )}
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-brand-green hover:bg-emerald-700 text-white text-sm font-extrabold rounded-xl shadow-md transition-all"
            >
              Fermer et retourner au tableau de bord
            </button>
          </div>
        ) : (
          <form onSubmit={handleSend} className="space-y-4 flex-grow flex flex-col">
            
            {/* Destinataires */}
            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-semibold text-slate-800 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Users size={16} className="text-brand-gold" />
                  <span>Destinataires ({recipientList.length})</span>
                </span>
                {recipientList.length > 1 && (
                  <span className="text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full">
                    Envoi sécurisé en copie cachée (CCI)
                  </span>
                )}
              </label>
              
              <div className="p-3 bg-slate-50 border border-slate-300 rounded-xl max-h-28 overflow-y-auto flex flex-wrap gap-2">
                {recipientList.length === 0 ? (
                  <span className="text-xs text-rose-500 font-semibold">Aucun destinataire sélectionné</span>
                ) : (
                  recipientList.map(r => (
                    <span key={r.email} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 text-slate-800 text-xs font-bold rounded-lg shadow-2xs">
                      <span>{r.firstName ? `${r.firstName} ${r.lastName}` : r.email}</span>
                      <button 
                        type="button" 
                        onClick={() => removeRecipient(r.email)} 
                        className="text-slate-400 hover:text-rose-600 font-black ml-1"
                        title="Retirer ce destinataire"
                      >
                        ×
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Sujet */}
            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-semibold text-slate-800 block">
                Sujet de l&apos;email <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="Ex: Convocation Entretien BWTA / Confirmation d'admission"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-turquoise"
              />
            </div>

            {/* Corps */}
            <div className="space-y-1.5 flex-grow flex flex-col">
              <label className="text-xs sm:text-sm font-semibold text-slate-800 block">
                Corps du message <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={8}
                value={body}
                onChange={e => setBody(e.target.value)}
                className="w-full p-4 rounded-xl border border-slate-300 text-sm leading-relaxed font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-turquoise flex-grow font-sans"
                placeholder="Rédigez votre message officiel ici..."
              />
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-start gap-2.5 text-xs text-slate-600">
              <Info size={16} className="text-brand-turquoise shrink-0 mt-0.5" />
              <span>
                <strong>Note :</strong> Toutes les communications transmises via ce module sont automatiquement enregistrées dans les journaux et archives de l&apos;académie à des fins d&apos;audit et de traçabilité.
              </span>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSending || recipientList.length === 0}
                className="inline-flex items-center gap-2 bg-brand-green hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold px-7 py-2.5 rounded-xl transition-all shadow-lg text-sm"
              >
                {isSending ? (
                  <><Loader2 size={18} className="animate-spin" /> Transmission...</>
                ) : (
                  <><Send size={18} /> Envoyer le message ({recipientList.length})</>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
