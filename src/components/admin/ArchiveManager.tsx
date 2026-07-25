'use client'

import React, { useState, useEffect, useRef } from 'react'
import { FileText, Plus, Search, Filter, Printer, Trash2, Edit, Check, X, Folder, Shield, Calendar, User, MapPin, Bold, Italic, List, Heading2, Quote } from 'lucide-react'

interface ArchiveDoc {
  id: string
  referenceCode: string
  title: string
  category: string
  richContent: string
  physicalLocation: string | null
  accessLevel: string
  authorName: string
  authorRole: string
  createdAt: string
}

export default function ArchiveManager({ sessionUser }: { sessionUser: any }) {
  const [archives, setArchives] = useState<ArchiveDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Editor modal state
  const [isEditing, setIsEditing] = useState(false)
  const [currentDocId, setCurrentDocId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('proces_verbal')
  const [physicalLocation, setPhysicalLocation] = useState('')
  const [accessLevel, setAccessLevel] = useState('bureau')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Print view state
  const [printingDoc, setPrintingDoc] = useState<ArchiveDoc | null>(null)

  const editorRef = useRef<HTMLDivElement>(null)

  const fetchArchives = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/archives?category=${selectedCategory}&search=${encodeURIComponent(searchTerm)}`)
      if (res.ok) {
        const data = await res.json()
        setArchives(data.archives || [])
      }
    } catch (e: any) {
      setError(e.message || "Erreur de chargement des archives")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchArchives()
  }, [selectedCategory, searchTerm])

  const openNewDocModal = () => {
    setCurrentDocId(null)
    setTitle('')
    setCategory('proces_verbal')
    setPhysicalLocation('Armoire Bureau, Classeur Principal 2026')
    setAccessLevel('bureau')
    setIsEditing(true)
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.innerHTML = "<p>Saisissez ici les informations, délibérations, décisions ou notes de l'association...</p>"
      }
    }, 50)
  }

  const openEditModal = (doc: ArchiveDoc) => {
    setCurrentDocId(doc.id)
    setTitle(doc.title)
    setCategory(doc.category)
    setPhysicalLocation(doc.physicalLocation || '')
    setAccessLevel(doc.accessLevel)
    setIsEditing(true)
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.innerHTML = doc.richContent
      }
    }, 50)
  }

  const execCommand = (command: string, value: string = '') => {
    document.execCommand(command, false, value)
    if (editorRef.current) editorRef.current.focus()
  }

  const handleSaveDoc = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !editorRef.current) {
      setError("Le titre et le contenu sont obligatoires.")
      return
    }
    setIsSubmitting(true)
    setError('')
    setSuccess('')

    const contentHtml = editorRef.current.innerHTML

    try {
      const method = currentDocId ? 'PATCH' : 'POST'
      const body = {
        id: currentDocId || undefined,
        title,
        category,
        richContent: contentHtml,
        physicalLocation,
        accessLevel,
      }

      const res = await fetch('/api/admin/archives', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de l'archivage")
      }

      setSuccess(data.message || "Document archivé avec succès !")
      setIsEditing(false)
      fetchArchives()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string, refCode: string) => {
    if (!window.confirm(`Voulez-vous vraiment supprimer le document [${refCode}] des archives ?`)) return

    try {
      const res = await fetch(`/api/admin/archives?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setArchives(prev => prev.filter(d => d.id !== id))
        setSuccess(`Document [${refCode}] supprimé.`)
      } else {
        const data = await res.json()
        setError(data.error || "Erreur de suppression")
      }
    } catch (e: any) {
      setError(e.message)
    }
  }

  const triggerPrint = (doc: ArchiveDoc) => {
    setPrintingDoc(doc)
    setTimeout(() => {
      window.print()
    }, 200)
  }

  const categoryLabel = (cat: string) => {
    switch (cat) {
      case 'proces_verbal': return 'Procès-Verbal (PV)'
      case 'note': return 'Note de Service / Mémo'
      case 'evenement': return 'Événement & Réunion'
      case 'rapport_financier': return 'Rapport & Reçu Financier'
      case 'contrat_partenariat': return 'Contrat & Alliance Tech'
      default: return 'Document Associatif'
    }
  }

  return (
    <div className="space-y-6">
      {/* Printable Sheet (Caché en vue normale, visible en @media print) */}
      {printingDoc && (
        <div className="hidden print:block fixed inset-0 bg-white z-50 p-10 text-slate-900 font-serif leading-relaxed">
          <div className="border-b-2 border-slate-900 pb-6 mb-6 flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-extrabold uppercase tracking-wide font-sans text-emerald-950">Blessed Wing Tech Academy</h1>
              <p className="text-sm font-sans font-semibold text-emerald-800">Structure Associative Haïtienne &bull; Lajeune, Pignon, Nord</p>
              <p className="text-xs font-sans text-slate-500 mt-1">Initiative technologique sous l&apos;égide de Blessed Wing Technology (BWT)</p>
            </div>
            <div className="text-right border-2 border-slate-900 p-3 bg-slate-50 font-sans rounded">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Cote de Rangée Physique</span>
              <strong className="text-lg font-mono text-slate-900 block">{printingDoc.referenceCode}</strong>
              {printingDoc.physicalLocation && (
                <span className="text-xs text-slate-700 block mt-1"><MapPin size={12} className="inline mr-1" />{printingDoc.physicalLocation}</span>
              )}
            </div>
          </div>

          <div className="mb-6 bg-slate-50 p-4 rounded border border-slate-300 font-sans text-sm flex flex-wrap justify-between items-center gap-4">
            <div>
              <span className="text-xs text-slate-500 uppercase font-bold block">Catégorie officielle</span>
              <strong className="text-slate-900">{categoryLabel(printingDoc.category)}</strong>
            </div>
            <div>
              <span className="text-xs text-slate-500 uppercase font-bold block">Rédigé par</span>
              <strong className="text-slate-900">{printingDoc.authorName} ({printingDoc.authorRole})</strong>
            </div>
            <div>
              <span className="text-xs text-slate-500 uppercase font-bold block">Date d&apos;archivage</span>
              <strong className="text-slate-900">{new Date(printingDoc.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</strong>
            </div>
            <div>
              <span className="text-xs text-slate-500 uppercase font-bold block">Niveau d&apos;accès</span>
              <strong className="uppercase text-xs font-bold px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded">{printingDoc.accessLevel}</strong>
            </div>
          </div>

          <h2 className="text-2xl font-bold font-sans text-slate-950 mb-6 pb-2 border-b border-slate-200">{printingDoc.title}</h2>

          {/* Corps de l'archive */}
          <div className="prose max-w-none text-slate-900 text-base mb-16" dangerouslySetInnerHTML={{ __html: printingDoc.richContent }} />

          {/* Zones de signature officielle */}
          <div className="mt-16 pt-8 border-t border-slate-400 grid grid-cols-3 gap-8 font-sans text-sm page-break-inside-avoid">
            <div className="text-center border p-4 h-32 flex flex-col justify-between rounded-lg">
              <span className="font-bold text-slate-700 underline">Le / La Secrétaire</span>
              <span className="text-xs text-slate-400 italic">Signature et cachet</span>
            </div>
            <div className="text-center border p-4 h-32 flex flex-col justify-between rounded-lg">
              <span className="font-bold text-slate-700 underline">Le / La Trésorier(e)</span>
              <span className="text-xs text-slate-400 italic">(Si matière financière)</span>
            </div>
            <div className="text-center border p-4 h-32 flex flex-col justify-between rounded-lg">
              <span className="font-bold text-slate-700 underline">Le Président / Admin</span>
              <span className="text-xs text-slate-400 italic">Approbation officielle</span>
            </div>
          </div>

          <div className="mt-12 text-center text-[10px] font-sans text-slate-400 border-t border-slate-200 pt-4">
            Document généré depuis le Portail Associatif BWTA &bull; Conservé en archive physique &amp; numérique sécurisée &bull; bwta.bittonik.com
          </div>
        </div>
      )}

      {/* Barre d'entête avec contrôles */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs print:hidden">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-brand-green flex items-center gap-2.5">
            <Folder className="text-brand-gold" size={26} /> 
            <span>Archives Administratives (Physique &amp; Numérique)</span>
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            Espace de rédaction, d&apos;indexation et de classement des Procès-Verbaux, notes du bureau et rapports financiers.
          </p>
        </div>

        <button 
          onClick={openNewDocModal}
          className="inline-flex items-center justify-center gap-2 bg-brand-green hover:bg-emerald-700 text-white font-bold px-5 py-3 rounded-xl transition-all shadow-md text-sm"
        >
          <Plus size={18} />
          Rédiger / Archiver un document
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 border-l-4 border-rose-500 p-4 text-rose-800 rounded-r-xl text-sm font-medium flex items-center justify-between print:hidden">
          <span>{error}</span>
          <button onClick={() => setError('')}><X size={16} /></button>
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 text-emerald-800 rounded-r-xl text-sm font-medium flex items-center justify-between print:hidden">
          <span>{success}</span>
          <button onClick={() => setSuccess('')}><X size={16} /></button>
        </div>
      )}

      {/* Filtres & Recherche */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between print:hidden">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Rechercher cote, titre, mots-clés..."
            className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-turquoise"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={18} className="text-slate-500 shrink-0 hidden sm:block" />
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 bg-white rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-turquoise"
          >
            <option value="all">Toutes les catégories</option>
            <option value="proces_verbal">Procès-Verbaux (PV)</option>
            <option value="note">Notes de service &amp; Mémos</option>
            <option value="evenement">Événements &amp; Réunions</option>
            <option value="rapport_financier">Rapports &amp; Reçus Financiers</option>
            <option value="contrat_partenariat">Contrats &amp; Partenariats Tech</option>
            <option value="autre">Autres Documents</option>
          </select>
        </div>
      </div>

      {/* Liste des Archives */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden print:hidden">
        {loading ? (
          <div className="p-16 text-center text-slate-500">Chargement du classeur numérique et physique...</div>
        ) : archives.length === 0 ? (
          <div className="p-16 text-center text-slate-500 flex flex-col items-center gap-3">
            <Folder size={40} className="text-slate-300" />
            <span>Aucun document archivé dans cette catégorie pour l&apos;instant. Cliquez sur &laquo; Rédiger &raquo; pour créer votre première archive.</span>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {archives.map(doc => (
              <div key={doc.id} className="p-5 sm:p-6 hover:bg-slate-50/70 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-mono font-extrabold bg-emerald-950 text-emerald-300 px-2.5 py-1 rounded-md shadow-2xs">
                      {doc.referenceCode}
                    </span>
                    <span className="font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full">
                      {categoryLabel(doc.category)}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full font-semibold border text-[11px] ${
                      doc.accessLevel === 'public' ? 'bg-teal-50 text-teal-800 border-teal-200' :
                      doc.accessLevel === 'prive' ? 'bg-rose-50 text-rose-800 border-rose-200' :
                      'bg-indigo-50 text-indigo-800 border-indigo-200'
                    }`}>
                      Visibilité : {doc.accessLevel}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 leading-snug hover:text-brand-green transition-colors cursor-pointer" onClick={() => triggerPrint(doc)}>
                    {doc.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-medium pt-1">
                    <span className="flex items-center gap-1"><User size={13} className="text-brand-green" /> Rédigé par {doc.authorName} ({doc.authorRole})</span>
                    <span className="flex items-center gap-1"><Calendar size={13} className="text-slate-400" /> {new Date(doc.createdAt).toLocaleDateString('fr-FR')}</span>
                    {doc.physicalLocation && (
                      <span className="flex items-center gap-1 text-slate-700 bg-slate-100 px-2 py-0.5 rounded"><MapPin size={13} className="text-rose-500" /> Rangement physique : {doc.physicalLocation}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start md:self-center">
                  <button
                    onClick={() => triggerPrint(doc)}
                    title="Imprimer ou Exporter PDF pour Classeur Physique"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm"
                  >
                    <Printer size={16} className="text-brand-gold-light" />
                    <span>Dossier Papier</span>
                  </button>
                  
                  <button
                    onClick={() => openEditModal(doc)}
                    title="Modifier l'archive"
                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <Edit size={18} />
                  </button>

                  <button
                    onClick={() => handleDelete(doc.id, doc.referenceCode)}
                    title="Supprimer l'archive"
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Éditeur Riche et Simple Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6 print:hidden">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-4xl w-full h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4 shrink-0">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-brand-gold">Éditeur d&apos;Archivage Bureau</span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-brand-green">
                  {currentDocId ? "Modifier l'Archive" : "Nouvelle Archive &amp; Indexation Physique"}
                </h3>
              </div>
              <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-700 p-1">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSaveDoc} className="space-y-4 overflow-y-auto flex-grow pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs sm:text-sm font-semibold text-slate-800 block">Titre officiel du document <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Ex: Procès-Verbal Assemblée Générale de Lancement BWTA"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-turquoise font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs sm:text-sm font-semibold text-slate-800 block">Catégorie <span className="text-rose-500">*</span></label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-turquoise"
                  >
                    <option value="proces_verbal">Procès-Verbal (PV)</option>
                    <option value="note">Note de Service &amp; Mémo</option>
                    <option value="evenement">Événement &amp; Réunion</option>
                    <option value="rapport_financier">Rapport &amp; Reçu Financier</option>
                    <option value="contrat_partenariat">Contrat &amp; Partenariat Tech</option>
                    <option value="autre">Autre Document</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="space-y-1">
                  <label className="text-xs sm:text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                    <MapPin size={15} className="text-rose-500" /> Emplacement de l&apos;Archive Physique (Papier)
                  </label>
                  <input
                    type="text"
                    value={physicalLocation}
                    onChange={e => setPhysicalLocation(e.target.value)}
                    placeholder="Ex: Armoire Secrétaire, Etagère 1, Classeur Vert"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-turquoise"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs sm:text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                    <Shield size={15} className="text-indigo-600" /> Visibilité dans le système
                  </label>
                  <select
                    value={accessLevel}
                    onChange={e => setAccessLevel(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-turquoise"
                  >
                    <option value="bureau">Partagé : Tous les membres du bureau exécutif (Secrétaire, Trésorier...)</option>
                    <option value="prive">Restreint : Visible uniquement par le créateur et l&apos;Admin principal</option>
                    <option value="public">Publie / Document général ouvert à tous</option>
                  </select>
                </div>
              </div>

              {/* Éditeur Riche Toolbar & Zone de saisie */}
              <div className="flex flex-col space-y-2 flex-grow pt-2">
                <label className="text-xs sm:text-sm font-semibold text-slate-800 block">
                  Contenu du Document (Éditeur Riche de Mise en Forme) <span className="text-rose-500">*</span>
                </label>

                <div className="border border-slate-300 rounded-2xl overflow-hidden shadow-2xs flex-grow flex flex-col bg-white">
                  <div className="bg-slate-100 p-2 border-b border-slate-200 flex flex-wrap items-center gap-1 text-slate-700">
                    <button
                      type="button"
                      onClick={() => execCommand('bold')}
                      className="p-2 hover:bg-white rounded font-bold"
                      title="Gras"
                    >
                      <Bold size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => execCommand('italic')}
                      className="p-2 hover:bg-white rounded font-italic"
                      title="Italique"
                    >
                      <Italic size={16} />
                    </button>
                    <span className="text-slate-300 mx-1">|</span>
                    <button
                      type="button"
                      onClick={() => execCommand('formatBlock', '<h3>')}
                      className="p-2 hover:bg-white rounded text-xs font-extrabold flex items-center gap-1"
                      title="Sous-titre"
                    >
                      <Heading2 size={16} /> <span>Titre 2</span>
                    </button>
                    <span className="text-slate-300 mx-1">|</span>
                    <button
                      type="button"
                      onClick={() => execCommand('insertUnorderedList')}
                      className="p-2 hover:bg-white rounded flex items-center gap-1 text-xs font-semibold"
                      title="Liste à puces"
                    >
                      <List size={16} /> <span>Liste à puces</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => execCommand('insertOrderedList')}
                      className="p-2 hover:bg-white rounded text-xs font-semibold px-2"
                      title="Liste numérotée"
                    >
                      1. 2. 3.
                    </button>
                    <span className="text-slate-300 mx-1">|</span>
                    <button
                      type="button"
                      onClick={() => execCommand('formatBlock', '<blockquote>')}
                      className="p-2 hover:bg-white rounded text-xs font-semibold flex items-center gap-1"
                      title="Citation ou Note importante"
                    >
                      <Quote size={16} /> <span>Citation</span>
                    </button>
                  </div>

                  <div
                    ref={editorRef}
                    contentEditable
                    className="p-6 min-h-[300px] flex-grow focus:outline-none focus:ring-inner text-slate-800 leading-relaxed prose prose-sm max-w-none overflow-y-auto"
                    style={{ maxHeight: '420px' }}
                  />
                </div>
                <p className="text-xs text-slate-400 italic">
                  Conseil : Mettez en forme votre texte à l&apos;aide des boutons du ruban. Une fois enregistré, le document pourra être imprimé en format A4 pour vos classeurs physiques.
                </p>
              </div>

              <div className="pt-6 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 bg-brand-green hover:bg-emerald-700 text-white font-extrabold px-8 py-2.5 rounded-xl transition-all shadow-lg text-sm"
                >
                  {isSubmitting ? 'Archivage en cours...' : (currentDocId ? 'Enregistrer les modifications' : 'Valider & Archiver (Numérique + Physique)')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
