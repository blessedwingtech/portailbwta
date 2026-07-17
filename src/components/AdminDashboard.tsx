'use client'

import React, { useState } from 'react'
import { Search, Filter, Download, User, Briefcase, FileText, ChevronDown, ChevronUp, MessageSquare, Check, X } from 'lucide-react'

export default function AdminDashboard({ initialApplicants }: { initialApplicants: any[] }) {
  const [applicants, setApplicants] = useState(initialApplicants)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [newNote, setNewNote] = useState('')

  const filteredApplicants = applicants.filter(app => {
    const matchesSearch = `${app.firstName} ${app.lastName} ${app.email}`.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || app.applicationStatus === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/applicant/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'updateStatus', status: newStatus })
      })
      if (res.ok) {
        setApplicants(prev => prev.map(a => a.id === id ? { ...a, applicationStatus: newStatus } : a))
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleAddNote = async (id: string) => {
    if (!newNote.trim()) return
    try {
      const res = await fetch(`/api/admin/applicant/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'addNote', note: newNote })
      })
      if (res.ok) {
        const data = await res.json()
        setApplicants(prev => prev.map(a => 
          a.id === id 
            ? { ...a, notes: [data.note, ...(a.notes || [])] } 
            : a
        ))
        setNewNote('')
      }
    } catch (e) {
      console.error(e)
    }
  }

  const exportCSV = () => {
    // Basic CSV export
    const headers = ['Nom', 'Prénom', 'Email', 'Téléphone', 'Statut', 'Date']
    const rows = filteredApplicants.map(a => [
      a.lastName, a.firstName, a.email, a.phone, a.applicationStatus, new Date(a.createdAt).toLocaleDateString()
    ])
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n")
      
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "candidatures_bwta.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
      {/* Controls */}
      <div className="p-6 border-b border-gray-200 bg-gray-50 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex w-full md:w-auto gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-brand-green outline-none w-full md:w-64"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <select 
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-brand-green outline-none appearance-none"
            >
              <option value="all">Tous les statuts</option>
              <option value="en_attente">En attente</option>
              <option value="retenu">Retenu</option>
              <option value="refuse">Refusé</option>
            </select>
          </div>
        </div>
        
        <button 
          onClick={exportCSV}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Download size={18} /> Exporter CSV
        </button>
      </div>

      {/* List */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-sm">
              <th className="p-4 font-semibold">Candidat</th>
              <th className="p-4 font-semibold">Contact</th>
              <th className="p-4 font-semibold">Profil</th>
              <th className="p-4 font-semibold">Date</th>
              <th className="p-4 font-semibold">Statut</th>
              <th className="p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplicants.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">Aucune candidature trouvée.</td>
              </tr>
            ) : filteredApplicants.map(app => (
              <React.Fragment key={app.id}>
                <tr className={`border-b hover:bg-gray-50 transition-colors ${expandedId === app.id ? 'bg-gray-50' : ''}`}>
                  <td className="p-4">
                    <div className="font-bold text-gray-900">{app.firstName} {app.lastName}</div>
                    <div className="text-xs text-gray-500 capitalize">{app.status.replace('_', ' ')}</div>
                  </td>
                  <td className="p-4 text-sm">
                    <div>{app.email}</div>
                    <div className="text-gray-500">{app.phone}</div>
                  </td>
                  <td className="p-4 text-sm">
                    {(() => {
                      try {
                        const roles = JSON.parse(app.roles)
                        return <span className="inline-block bg-brand-green/10 text-brand-green px-2 py-1 rounded text-xs">{roles[0]} {roles.length > 1 ? `+${roles.length - 1}` : ''}</span>
                      } catch {
                        return '-'
                      }
                    })()}
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <select 
                      value={app.applicationStatus}
                      onChange={(e) => handleStatusChange(app.id, e.target.value)}
                      className={`text-sm px-2 py-1 rounded-md border font-medium ${
                        app.applicationStatus === 'retenu' ? 'bg-green-50 text-green-700 border-green-200' :
                        app.applicationStatus === 'refuse' ? 'bg-red-50 text-red-700 border-red-200' :
                        'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      <option value="en_attente">En attente</option>
                      <option value="retenu">Retenu</option>
                      <option value="refuse">Refusé</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
                      className="text-brand-turquoise hover:text-brand-turquoise-light p-2"
                    >
                      {expandedId === app.id ? <ChevronUp /> : <ChevronDown />}
                    </button>
                  </td>
                </tr>
                
                {/* Expanded Details */}
                {expandedId === app.id && (
                  <tr className="bg-gray-50 border-b">
                    <td colSpan={6} className="p-6">
                      <div className="grid md:grid-cols-3 gap-8">
                        {/* Infos Perso */}
                        <div className="space-y-4">
                          <h4 className="font-bold flex items-center gap-2 text-brand-green"><User size={18} /> Informations Personnelles</h4>
                          <div className="text-sm space-y-2 text-gray-700 bg-white p-4 rounded-lg shadow-sm border">
                            <p><strong>Né(e) le:</strong> {new Date(app.birthDate).toLocaleDateString()} ({app.gender})</p>
                            <p><strong>Nationalité:</strong> {app.nationality}</p>
                            <p><strong>NIF/CIN:</strong> {app.cinNif}</p>
                            <p><strong>Adresse:</strong> {app.address}, {app.section}, {app.commune}, {app.department}</p>
                            {app.photoUrl && (
                              <a href={app.photoUrl} target="_blank" rel="noreferrer" className="text-brand-turquoise hover:underline inline-block mt-2">Voir la photo</a>
                            )}
                          </div>
                        </div>

                        {/* Profil Pro / Académique */}
                        <div className="space-y-4">
                          <h4 className="font-bold flex items-center gap-2 text-brand-green"><Briefcase size={18} /> Profil & Parcours</h4>
                          <div className="text-sm space-y-3 text-gray-700 bg-white p-4 rounded-lg shadow-sm border">
                            {app.profession && <p><strong>Profession:</strong> {app.profession} {app.employer ? `chez ${app.employer}` : ''}</p>}
                            <p><strong>Expérience:</strong> {app.experience || 0} ans</p>
                            
                            <div>
                              <strong>Domaines:</strong>
                              <ul className="list-disc pl-4 mt-1">
                                {(() => {
                                  try {
                                    return JSON.parse(app.expertise).map((e: string) => <li key={e}>{e}</li>)
                                  } catch { return null }
                                })()}
                              </ul>
                            </div>
                            
                            {app.cvUrl && (
                              <a href={app.cvUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-brand-turquoise hover:underline mt-2">
                                <FileText size={16} /> Télécharger le CV
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Motivation & Notes */}
                        <div className="space-y-4">
                          <h4 className="font-bold flex items-center gap-2 text-brand-green"><MessageSquare size={18} /> Motivation & Notes</h4>
                          <div className="text-sm space-y-3 bg-white p-4 rounded-lg shadow-sm border h-full flex flex-col">
                            <div>
                              <strong>Disponibilité:</strong> {app.availability}
                            </div>
                            <div>
                              <strong>Motivation:</strong>
                              <p className="mt-1 text-gray-600 italic bg-gray-50 p-2 rounded">"{app.motivation}"</p>
                            </div>
                            
                            <hr className="my-2" />
                            
                            <div className="flex-grow flex flex-col gap-2">
                              <strong>Notes internes:</strong>
                              <div className="max-h-32 overflow-y-auto space-y-2">
                                {app.notes?.map((n: any) => (
                                  <div key={n.id} className="bg-amber-50 border border-amber-100 p-2 rounded text-xs">
                                    <span className="text-gray-400 text-[10px] block mb-1">{new Date(n.createdAt).toLocaleString()}</span>
                                    {n.content}
                                  </div>
                                ))}
                              </div>
                              <div className="flex gap-2 mt-auto pt-2">
                                <input 
                                  type="text" 
                                  value={newNote}
                                  onChange={e => setNewNote(e.target.value)}
                                  placeholder="Ajouter une note..."
                                  className="border rounded px-2 py-1 text-xs w-full bg-white text-gray-900 focus:ring-1 focus:ring-brand-green outline-none"
                                />
                                <button 
                                  onClick={() => handleAddNote(app.id)}
                                  className="bg-brand-green text-white px-2 py-1 rounded text-xs hover:bg-brand-green-light"
                                >
                                  OK
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
