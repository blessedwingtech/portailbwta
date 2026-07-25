'use client'

import React from 'react'
import { X, Printer, Mail, ExternalLink, User, Briefcase, MapPin, Phone, Calendar, Award, FileText, CheckCircle2, AlertCircle, Clock } from 'lucide-react'

export default function MemberDossierModal({ 
  applicant, 
  onClose, 
  onContact,
  onStatusChange 
}: { 
  applicant: any
  onClose: () => void
  onContact: (applicant: any) => void
  onStatusChange: (id: string, status: string) => void 
}) {
  if (!applicant) return null

  // Découpage automatique des liens professionnels multiples (séparés par virgule, espace ou saut de ligne)
  const links: string[] = (applicant.portfolio || '')
    .split(/[\s,]+/)
    .map((l: string) => l.trim())
    .filter((l: string) => l !== '' && (l.startsWith('http://') || l.startsWith('https://') || l.includes('.')))

  const getLinkIcon = (url: string) => {
    const lower = url.toLowerCase()
    if (lower.includes('github.com')) return 'GitHub'
    if (lower.includes('linkedin.com')) return 'LinkedIn'
    if (lower.includes('behance') || lower.includes('dribbble')) return 'Portfolio Design'
    return 'Lien Web'
  }

  const parseJson = (val: any) => {
    try {
      if (typeof val === 'string') return JSON.parse(val)
      return val || []
    } catch {
      return []
    }
  }

  const expertiseList = parseJson(applicant.expertise)
  const rolesList = parseJson(applicant.roles)

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-6 overflow-y-auto">
      {/* Container Principal (Modale en vue écran, page entière en vue impression) */}
      <div className="bg-white rounded-3xl sm:max-w-4xl w-full max-h-[92vh] overflow-y-auto flex flex-col shadow-2xl border border-slate-200 print:max-w-none print:shadow-none print:border-none print:h-auto print:max-h-none">
        
        {/* En-tête de la fiche */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-t-3xl print:rounded-none flex flex-col sm:flex-row justify-between sm:items-center gap-6 border-b border-emerald-500/30">
          <div className="flex items-center gap-5">
            {applicant.photoUrl ? (
              <img 
                src={applicant.photoUrl} 
                alt={`${applicant.firstName} ${applicant.lastName}`} 
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-brand-gold shadow-md shrink-0"
              />
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-brand-green to-emerald-600 text-white flex items-center justify-center text-2xl sm:text-3xl font-black border-2 border-brand-gold/40 shadow-md shrink-0">
                {applicant.firstName.charAt(0)}{applicant.lastName.charAt(0)}
              </div>
            )}
            
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-extrabold uppercase tracking-widest text-brand-gold bg-brand-gold/10 px-2.5 py-1 rounded-md border border-brand-gold/20">
                  Dossier Officiel BWTA
                </span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase ${
                  applicant.applicationStatus === 'retenu' ? 'bg-emerald-500 text-white' :
                  applicant.applicationStatus === 'refuse' ? 'bg-rose-500 text-white' :
                  'bg-amber-500 text-white'
                }`}>
                  {applicant.applicationStatus}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-white">
                {applicant.firstName} <span className="uppercase text-brand-gold-light">{applicant.lastName}</span>
              </h2>
              <p className="text-slate-300 text-sm mt-0.5 flex items-center gap-2">
                <span className="capitalize">{applicant.status?.replace('_', ' ')}</span> &bull; 
                <span>Inscrit le {new Date(applicant.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center print:hidden">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-900 px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md"
              title="Imprimer pour les archives physiques (Classeur papier)"
            >
              <Printer size={16} className="text-brand-green" />
              <span>Imprimer Fiche</span>
            </button>
            <button
              onClick={() => { onClose(); onContact(applicant); }}
              className="inline-flex items-center gap-2 bg-brand-green hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md"
            >
              <Mail size={16} />
              <span>Contacter</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Corps du dossier */}
        <div className="p-6 sm:p-8 space-y-8 flex-grow">
          
          {/* Section 1: Coordonnées & Identité */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200/80">
            <div className="space-y-4">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-brand-green flex items-center gap-2 border-b border-slate-200 pb-2">
                <User size={18} className="text-brand-gold" />
                <span>Identité &amp; État Civil</span>
              </h3>
              <div className="space-y-2 text-sm text-slate-700 font-medium">
                <div className="flex justify-between border-b border-slate-200/50 pb-1.5">
                  <span className="text-slate-500">Date de naissance :</span>
                  <strong className="text-slate-900">{new Date(applicant.birthDate).toLocaleDateString('fr-FR')}</strong>
                </div>
                <div className="flex justify-between border-b border-slate-200/50 pb-1.5">
                  <span className="text-slate-500">Genre :</span>
                  <strong className="text-slate-900">{applicant.gender === 'M' ? 'Masculin' : 'Féminin'}</strong>
                </div>
                <div className="flex justify-between border-b border-slate-200/50 pb-1.5">
                  <span className="text-slate-500">Nationalité :</span>
                  <strong className="text-slate-900">{applicant.nationality}</strong>
                </div>
                <div className="flex justify-between pt-0.5">
                  <span className="text-slate-500">NIF / CIN / Passeport :</span>
                  <strong className="text-slate-900 font-mono bg-white px-2 py-0.5 rounded border border-slate-200">{applicant.cinNif}</strong>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-brand-green flex items-center gap-2 border-b border-slate-200 pb-2">
                <MapPin size={18} className="text-rose-500" />
                <span>Contact &amp; Localisation</span>
              </h3>
              <div className="space-y-2 text-sm text-slate-700 font-medium">
                <div className="flex justify-between border-b border-slate-200/50 pb-1.5">
                  <span className="text-slate-500">Email :</span>
                  <a href={`mailto:${applicant.email}`} className="text-brand-turquoise font-bold hover:underline">{applicant.email}</a>
                </div>
                <div className="flex justify-between border-b border-slate-200/50 pb-1.5">
                  <span className="text-slate-500">Téléphone (WhatsApp) :</span>
                  <a href={`tel:${applicant.phone}`} className="text-slate-900 font-bold hover:underline">{applicant.phone}</a>
                </div>
                <div className="flex flex-col pt-0.5">
                  <span className="text-slate-500 text-xs">Adresse complète :</span>
                  <span className="text-slate-900 font-bold mt-1 bg-white p-2 rounded-lg border border-slate-200 text-xs">
                    {applicant.address}, {applicant.section} &bull; {applicant.commune} ({applicant.department})
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Profil Professionnel & Liens Multiples */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <h3 className="text-base font-extrabold text-brand-green flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="flex items-center gap-2">
                <Briefcase size={20} className="text-brand-gold" />
                <span>Parcours Technique &amp; Compétences</span>
              </span>
              {applicant.experience !== undefined && (
                <span className="text-xs font-extrabold bg-emerald-50 text-brand-green px-3 py-1 rounded-full border border-emerald-200">
                  {applicant.experience} {applicant.experience > 1 ? "ans d'expérience" : "an d'expérience"}
                </span>
              )}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Profession actuelle / Employeur</span>
                <p className="text-slate-900 font-bold text-base">
                  {applicant.profession || 'Non spécifié'} 
                  {applicant.employer ? <span className="text-slate-500 text-sm font-normal"> chez <strong>{applicant.employer}</strong></span> : ''}
                </p>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-400 uppercase block mb-2">Liens &amp; Réseaux Professionnels</span>
                {links.length === 0 ? (
                  <span className="text-slate-400 text-xs italic">Aucun lien professionnel renseigné.</span>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {links.map((url: string, index: number) => (
                      <a
                        key={index}
                        href={url.startsWith('http') ? url : `https://${url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-brand-green text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-sm print:bg-white print:text-slate-900 print:border print:border-slate-300"
                      >
                        <ExternalLink size={14} className="text-brand-gold" />
                        <span>{getLinkIcon(url)} {links.length > 1 && getLinkIcon(url) === 'Lien Web' ? `(${index+1})` : ''}</span>
                      </a>
                    ))}
                  </div>
                )}
                {/* En mode impression, afficher les URLs textuellement pour le papier ! */}
                <div className="hidden print:block mt-2 text-xs font-mono text-slate-600 space-y-1">
                  {links.map((u: string, idx: number) => <div key={idx}>&bull; {u}</div>)}
                </div>
              </div>
            </div>

            {/* Domaines d'expertise */}
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase block mb-2.5">Domaines d&apos;expertise / Spécialisations</span>
              <div className="flex flex-wrap gap-2">
                {expertiseList.map((exp: string) => (
                  <span key={exp} className="px-3 py-1.5 bg-emerald-50 text-emerald-900 font-extrabold text-xs rounded-xl border border-emerald-200 shadow-2xs">
                    &bull; {exp}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Engagement au sein de BWTA & Motivation */}
          <div className="bg-gradient-to-br from-slate-900 to-emerald-950 text-white p-6 sm:p-8 rounded-2xl shadow-md space-y-6 print:bg-none print:bg-white print:text-slate-900 print:border print:border-slate-300 print:shadow-none">
            <h3 className="text-base sm:text-lg font-extrabold text-brand-gold-light flex items-center gap-2 border-b border-slate-700 pb-3 print:text-slate-900 print:border-slate-200">
              <Award size={22} className="text-brand-gold" />
              <span>Implication, Rôle(s) souhaité(s) &amp; Motivation</span>
            </h3>

            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase block mb-2 print:text-slate-600">Rôle(s) ou commission(s) visé(e)(s) dans l&apos;association :</span>
                <div className="flex flex-wrap gap-2">
                  {rolesList.map((r: string) => (
                    <span key={r} className="px-3.5 py-1.5 bg-brand-gold/20 text-brand-gold-light font-black text-xs sm:text-sm rounded-xl border border-brand-gold/30 print:bg-slate-100 print:text-slate-900 print:border-slate-300">
                      ★ {r}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-400 uppercase block mb-1 print:text-slate-600">Disponibilité estimée :</span>
                <span className="text-sm font-bold text-white print:text-slate-900">{applicant.availability || 'Standard'}</span>
              </div>

              <div className="pt-2">
                <span className="text-xs font-bold text-slate-400 uppercase block mb-2 print:text-slate-600">Lettre ou déclaration de motivation du candidat :</span>
                <div className="bg-slate-950/60 p-5 rounded-2xl text-slate-200 italic leading-relaxed text-sm border border-slate-800 print:bg-slate-50 print:text-slate-800 print:border-slate-200">
                  &laquo; {applicant.motivation} &raquo;
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Notes Administratives (Uniquement visibles en mode admin, cachées au print si besoin) */}
          <div className="bg-amber-50/70 p-6 rounded-2xl border border-amber-200/80 space-y-3 print:hidden">
            <h4 className="text-sm font-extrabold text-amber-900 flex items-center gap-2">
              <FileText size={18} className="text-amber-700" />
              <span>Notes Administratives &amp; Observations Internes</span>
            </h4>
            {(!applicant.notes || applicant.notes.length === 0) ? (
              <p className="text-xs text-amber-800/70 italic">Aucune note interne sur ce dossier pour le moment.</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {applicant.notes.map((n: any) => (
                  <div key={n.id || n.createdAt} className="bg-white p-3 rounded-xl border border-amber-200 text-xs text-slate-800 shadow-2xs">
                    <span className="text-[10px] text-slate-400 font-bold block mb-1">
                      {new Date(n.createdAt).toLocaleString('fr-FR')} &bull; Note du bureau
                    </span>
                    {n.content}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bloc signatures officielles pour archives physiques (Visible uniquement en impression) */}
          <div className="hidden print:block pt-10 mt-10 border-t border-slate-300">
            <div className="flex justify-between items-center text-xs text-slate-600 mb-8 font-serif">
              <span>Cote Dossier Membre : BWTA-MBR-{applicant.id.slice(-6).toUpperCase()}</span>
              <span>Validé par le Conseil de Direction BWTA</span>
              <span>Fait à Pignon, le {new Date().toLocaleDateString('fr-FR')}</span>
            </div>
            <div className="grid grid-cols-2 gap-12 font-serif text-sm">
              <div className="border p-6 h-36 rounded-lg text-center flex flex-col justify-between">
                <strong className="underline">Le Président ou Vice-Président</strong>
                <span className="text-xs text-slate-400 italic">Signature &amp; Cachet de l&apos;académie</span>
              </div>
              <div className="border p-6 h-36 rounded-lg text-center flex flex-col justify-between">
                <strong className="underline">Le Cadre / Membre</strong>
                <span className="text-xs text-slate-400 italic">Signature précédée de la mention "Lu et approuvé"</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer avec actions de validation et fermeture */}
        <div className="p-6 bg-slate-100 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0 print:hidden">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-700">Changer le statut de candidature :</span>
            <select
              value={applicant.applicationStatus}
              onChange={(e) => onStatusChange(applicant.id, e.target.value)}
              className="px-4 py-2 rounded-xl bg-white border border-slate-300 font-extrabold text-xs text-slate-900 focus:ring-2 focus:ring-brand-turquoise shadow-2xs"
            >
              <option value="en_attente">⏳ En attente d&apos;examen</option>
              <option value="retenu">✅ Retenu (Membre Officiel)</option>
              <option value="refuse">❌ Refusé ou Non éligible</option>
            </select>
          </div>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md w-full sm:w-auto"
          >
            Fermer le dossier
          </button>
        </div>
      </div>
    </div>
  )
}
