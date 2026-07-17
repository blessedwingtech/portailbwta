'use client'

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { applicationSchema, ApplicationFormData } from '@/lib/schemas'
import { Loader2, Plus, Trash2 } from 'lucide-react'

export default function ApplicationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema) as any,
    defaultValues: {
      status: 'etudiant',
      educations: [{ degree: '', institution: '', year: '', field: '' }],
      achievements: [],
      references: [{ name: '', contact: '', relation: '' }],
      roles: [],
      expertise: []
    }
  })

  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({ control, name: 'educations' })
  const { fields: achFields, append: appendAch, remove: removeAch } = useFieldArray({ control, name: 'achievements' })
  const { fields: refFields, append: appendRef, remove: removeRef } = useFieldArray({ control, name: 'references' })

  const currentStatus = watch('status')

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true)
    setSubmitError('')
    try {
      // In a real app with file upload, we'd use FormData here.
      // But for the form data itself, we send JSON.
      const formData = new FormData()
      formData.append('data', JSON.stringify(data))
      
      const fileInput = document.getElementById('cv-upload') as HTMLInputElement
      if (fileInput?.files?.[0]) {
        formData.append('cv', fileInput.files[0])
      }
      
      const photoInput = document.getElementById('photo-upload') as HTMLInputElement
      if (photoInput?.files?.[0]) {
        formData.append('photo', photoInput.files[0])
      }

      const res = await fetch('/api/apply', {
        method: 'POST',
        body: formData
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Erreur lors de la soumission')
      }

      setSubmitSuccess(true)
    } catch (err: any) {
      setSubmitError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitSuccess) {
    return (
      <div className="bg-emerald-50 border border-brand-green p-8 rounded-xl text-center">
        <h3 className="text-2xl font-bold text-brand-green mb-4">Candidature Reçue !</h3>
        <p className="text-gray-700">
          Merci pour votre intérêt envers Blessed Wing Tech Academy. Votre dossier a bien été soumis et sera étudié par notre équipe. 
          Nous vous contacterons prochainement.
        </p>
      </div>
    )
  }

  const InputField = ({ label, name, type = 'text', required = false, error, ...props }: any) => (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-sm font-medium text-gray-700">{label} {required && <span className="text-red-500">*</span>}</label>
      <input type={type} {...register(name)} className={`border rounded-md px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-turquoise ${error ? 'border-red-500' : 'border-gray-300'}`} {...props} />
      {error && <span className="text-xs text-red-500">{error.message}</span>}
    </div>
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 bg-white p-6 md:p-10 rounded-2xl shadow-xl">
      {submitError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
          <p>{submitError}</p>
        </div>
      )}

      {/* 1. Statut */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold text-brand-green border-b pb-2">1. Votre Statut Actuel</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {['etudiant', 'salarie', 'independant', 'sans_emploi', 'autre'].map(s => (
            <label key={s} className={`cursor-pointer border p-3 rounded-lg text-center transition-colors ${currentStatus === s ? 'bg-brand-green text-white border-brand-green' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}>
              <input type="radio" value={s} {...register('status')} className="hidden" />
              <span className="capitalize">{s.replace('_', ' ')}</span>
            </label>
          ))}
        </div>
        {errors.status && <p className="text-xs text-red-500">{errors.status.message}</p>}
      </section>

      {/* 2. Infos personnelles */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold text-brand-green border-b pb-2">2. Informations Personnelles</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <InputField label="Nom" name="lastName" required error={errors.lastName} />
          <InputField label="Prénom" name="firstName" required error={errors.firstName} />
          <InputField label="Date de naissance" name="birthDate" type="date" required error={errors.birthDate} />
          
          <div className="flex flex-col gap-1 w-full">
            <label className="text-sm font-medium text-gray-700">Sexe <span className="text-red-500">*</span></label>
            <select {...register('gender')} className={`border rounded-md px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-turquoise ${errors.gender ? 'border-red-500' : 'border-gray-300'}`}>
              <option value="">Sélectionner...</option>
              <option value="M">Masculin</option>
              <option value="F">Féminin</option>
            </select>
            {errors.gender && <span className="text-xs text-red-500">{errors.gender.message}</span>}
          </div>

          <InputField label="Nationalité" name="nationality" required error={errors.nationality} />
          <InputField label="NIF / CIN" name="cinNif" required error={errors.cinNif} />
          <InputField label="Téléphone" name="phone" required error={errors.phone} />
          <InputField label="Email" name="email" type="email" required error={errors.email} />
        </div>
        <div className="grid md:grid-cols-2 gap-4 pt-2">
          <InputField label="Département" name="department" required error={errors.department} />
          <InputField label="Commune" name="commune" required error={errors.commune} />
          <InputField label="Section communale" name="section" required error={errors.section} />
          <InputField label="Adresse complète" name="address" required error={errors.address} />
        </div>
        <div className="grid md:grid-cols-2 gap-4 pt-2">
          <div className="flex flex-col gap-1">
             <label className="text-sm font-medium text-gray-700">Photo de profil (Optionnel, Max 5MB)</label>
             <input type="file" id="photo-upload" accept="image/*" className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brand-green/10 file:text-brand-green hover:file:bg-brand-green/20" />
          </div>
        </div>
      </section>

      {/* 3. Infos pro */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold text-brand-green border-b pb-2">3. Informations Professionnelles</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {(currentStatus === 'salarie' || currentStatus === 'independant') && (
            <>
              <InputField label="Profession / Poste actuel" name="profession" error={errors.profession} />
              <InputField label="Employeur / Structure" name="employer" error={errors.employer} />
            </>
          )}
          <InputField label="Années d'expérience" name="experience" type="number" min="0" error={errors.experience} />
          <InputField label="Lien Portfolio / LinkedIn / GitHub" name="portfolio" error={errors.portfolio} />
        </div>
        
        <div className="pt-2">
          <label className="text-sm font-medium text-gray-700 block mb-2">Domaine(s) d'expertise <span className="text-red-500">*</span></label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {['Développement Web', 'Réseaux & Infrastructure', 'Design/Infographie', 'Bureautique', 'Anglais', 'Gestion de projet', 'Entrepreneuriat', 'Pédagogie/Formation', 'Autre'].map(exp => (
              <label key={exp} className="flex items-center gap-2 text-sm text-gray-900">
                <input type="checkbox" value={exp} {...register('expertise')} className="rounded text-brand-green focus:ring-brand-green" />
                {exp}
              </label>
            ))}
          </div>
          {errors.expertise && <span className="text-xs text-red-500 block mt-1">{errors.expertise.message}</span>}
        </div>

        <div className="pt-2 flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">CV (PDF recommandé, Max 5MB)</label>
          <input type="file" id="cv-upload" accept=".pdf,.doc,.docx" className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brand-gold/10 file:text-brand-gold-light hover:file:bg-brand-gold/20" />
        </div>
      </section>

      {/* 4. Formation */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold text-brand-green border-b pb-2">4. Formation Académique</h3>
        {eduFields.map((field, index) => (
          <div key={field.id} className="grid md:grid-cols-4 gap-3 p-4 bg-gray-50 rounded-lg relative">
            <InputField label="Diplôme / Niveau" name={`educations.${index}.degree`} required error={errors?.educations?.[index]?.degree} />
            <InputField label="Institution" name={`educations.${index}.institution`} required error={errors?.educations?.[index]?.institution} />
            <InputField label="Année" name={`educations.${index}.year`} required error={errors?.educations?.[index]?.year} />
            <InputField label="Domaine" name={`educations.${index}.field`} required error={errors?.educations?.[index]?.field} />
            {index > 0 && (
              <button type="button" onClick={() => removeEdu(index)} className="absolute -right-2 -top-2 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200">
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}
        {errors.educations && <p className="text-xs text-red-500">{errors.educations.message}</p>}
        <button type="button" onClick={() => appendEdu({ degree: '', institution: '', year: '', field: '' })} className="text-sm flex items-center gap-1 text-brand-turquoise-light hover:text-brand-turquoise font-medium">
          <Plus size={16} /> Ajouter une formation
        </button>
      </section>

      {/* 5. Réalisations */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold text-brand-green border-b pb-2">5. Réalisations et Projets (Optionnel)</h3>
        {achFields.map((field, index) => (
          <div key={field.id} className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 p-4 bg-gray-50 rounded-lg relative">
            <InputField label="Titre du projet" name={`achievements.${index}.title`} error={errors?.achievements?.[index]?.title} />
            <InputField label="Description courte" name={`achievements.${index}.description`} error={errors?.achievements?.[index]?.description} />
            <InputField label="Lien" name={`achievements.${index}.link`} error={errors?.achievements?.[index]?.link} />
            <InputField label="Année" name={`achievements.${index}.year`} error={errors?.achievements?.[index]?.year} />
            <button type="button" onClick={() => removeAch(index)} className="absolute -right-2 -top-2 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        <button type="button" onClick={() => appendAch({ title: '', description: '', link: '', year: '' })} className="text-sm flex items-center gap-1 text-brand-turquoise-light hover:text-brand-turquoise font-medium">
          <Plus size={16} /> Ajouter une réalisation
        </button>
      </section>

      {/* 6. Motivation */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold text-brand-green border-b pb-2">6. Motivation et Engagement</h3>
        
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">Rôle(s) souhaité(s) au sein de BWTA <span className="text-red-500">*</span></label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {['Membre actif', 'Formateur bénévole', 'Formateur rémunéré', 'Membre d\'honneur / donateur', 'Parrain d\'étudiant', 'Autre'].map(role => (
              <label key={role} className="flex items-center gap-2 text-sm text-gray-900">
                <input type="checkbox" value={role} {...register('roles')} className="rounded text-brand-green focus:ring-brand-green" />
                {role}
              </label>
            ))}
          </div>
          {errors.roles && <span className="text-xs text-red-500 block mt-1">{errors.roles.message}</span>}
        </div>

        <div className="flex flex-col gap-1 w-full">
          <label className="text-sm font-medium text-gray-700">Votre motivation à rejoindre BWTA <span className="text-red-500">*</span></label>
          <textarea {...register('motivation')} rows={4} className={`border rounded-md px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-turquoise ${errors.motivation ? 'border-red-500' : 'border-gray-300'}`} placeholder="Expliquez pourquoi vous souhaitez nous rejoindre..."></textarea>
          {errors.motivation && <span className="text-xs text-red-500">{errors.motivation.message}</span>}
        </div>

        <InputField label="Disponibilité (ex: 10h/semaine, Hybride)" name="availability" required error={errors.availability} />

        <div className="pt-4">
           <label className="text-sm font-medium text-gray-700 block mb-2">Personne de référence (au moins une requise)</label>
           {refFields.map((field, index) => (
            <div key={field.id} className="grid md:grid-cols-3 gap-3 p-4 bg-gray-50 rounded-lg relative mb-3">
              <InputField label="Nom complet" name={`references.${index}.name`} required error={errors?.references?.[index]?.name} />
              <InputField label="Contact (Tél ou Email)" name={`references.${index}.contact`} required error={errors?.references?.[index]?.contact} />
              <InputField label="Relation" name={`references.${index}.relation`} required error={errors?.references?.[index]?.relation} />
              {index > 0 && (
                <button type="button" onClick={() => removeRef(index)} className="absolute -right-2 -top-2 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200">
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={() => appendRef({ name: '', contact: '', relation: '' })} className="text-sm flex items-center gap-1 text-brand-turquoise-light hover:text-brand-turquoise font-medium">
            <Plus size={16} /> Ajouter une référence
          </button>
        </div>
      </section>

      {/* 7. Consentement */}
      <section className="space-y-4 pt-4 border-t">
        <label className="flex items-start gap-3">
          <input type="checkbox" {...register('consentData')} className="mt-1 rounded text-brand-green focus:ring-brand-green" />
          <span className="text-sm text-gray-900">
            Je consens au traitement de mes données personnelles dans le cadre de ma candidature à BWTA. 
            Je comprends que ces informations resteront confidentielles. <span className="text-red-500">*</span>
          </span>
        </label>
        {errors.consentData && <p className="text-xs text-red-500 ml-7">{errors.consentData.message}</p>}

        <label className="flex items-start gap-3">
          <input type="checkbox" {...register('certifyExact')} className="mt-1 rounded text-brand-green focus:ring-brand-green" />
          <span className="text-sm text-gray-900">
            Je certifie sur l'honneur que les informations fournies dans ce formulaire sont exactes. <span className="text-red-500">*</span>
          </span>
        </label>
        {errors.certifyExact && <p className="text-xs text-red-500 ml-7">{errors.certifyExact.message}</p>}
      </section>

      <div className="pt-6">
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-brand-green hover:bg-brand-green-light text-white font-bold py-4 px-12 rounded-xl transition-all shadow-lg disabled:opacity-70"
        >
          {isSubmitting ? (
            <><Loader2 size={20} className="animate-spin" /> Envoi en cours...</>
          ) : (
            'Soumettre ma candidature'
          )}
        </button>
      </div>
    </form>
  )
}
