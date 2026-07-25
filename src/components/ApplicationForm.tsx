'use client'

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { applicationSchema, ApplicationFormData } from '@/lib/schemas'
import { Loader2, Plus, Trash2, Check, ShieldCheck } from 'lucide-react'

export default function ApplicationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [fileError, setFileError] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, label: string) => {
    setFileError('')
    const file = e.target.files?.[0]
    if (file && file.size > 5 * 1024 * 1024) {
      const sizeMo = (file.size / (1024 * 1024)).toFixed(2)
      setFileError(`⚠️ Le fichier sélectionné pour [${label}] est trop lourd (${sizeMo} Mo). La limite maximale autorisée est de 5 Mo (5 MB).`)
      e.target.value = '' // Réinitialiser l'input
    }
  }

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
      <div className="bg-emerald-50 border border-emerald-300 p-8 sm:p-12 rounded-2xl text-center shadow-lg max-w-2xl mx-auto space-y-4">
        <div className="w-16 h-16 bg-emerald-100 text-brand-green rounded-full flex items-center justify-center mx-auto mb-2 shadow-inner">
          <ShieldCheck size={36} />
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-brand-green">Candidature Reçue avec Succès !</h3>
        <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
          Merci pour votre engagement envers <strong className="text-slate-900">Blessed Wing Tech Academy (BWTA)</strong>. Votre dossier de candidature fondateur a été transmis avec succès et sera étudié rigoureusement par notre commission de sélection.
        </p>
        <p className="text-xs font-semibold text-emerald-800 bg-emerald-100/60 py-2 px-4 rounded-lg inline-block mt-4">
          Un retour vous sera adressé prochainement par courriel ou téléphone.
        </p>
      </div>
    )
  }

  const InputField = ({ label, name, type = 'text', required = false, error, placeholder = '', ...props }: any) => (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-xs sm:text-sm font-semibold text-slate-800 flex items-center justify-between">
        <span>{label} {required && <span className="text-rose-500">*</span>}</span>
      </label>
      <input 
        type={type} 
        {...register(name)} 
        placeholder={placeholder}
        className={`w-full border rounded-lg px-3.5 py-2.5 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-turquoise transition-all ${error ? 'border-rose-500 focus:ring-rose-400' : 'border-slate-300 shadow-2xs hover:border-slate-400'}`} 
        {...props} 
      />
      {error && <span className="text-xs font-medium text-rose-500">{error.message}</span>}
    </div>
  )

  const expertiseList = [
    'Développement Web & Mobile',
    'Réseaux & Infrastructure IT',
    'Cybersécurité & Cloud',
    'Intelligence Artificielle & Data',
    'Design / Infographie / UI-UX',
    'Bureautique Avancée',
    'Anglais Technique & Pro',
    'Gestion de projet & Leadership',
    'Entrepreneuriat & Innovation',
    'Pédagogie & Formation',
    'Support IT & Maintenance',
    'Autre domaine technique'
  ]

  const roleList = [
    'Membre fondateur / Allié actif',
    'Formateur & expert technique (bénévole)',
    'Formateur / ingénieur (rémunéré)',
    'Partenaire stratégique / Entreprise tech',
    'Parrain / Donateur (soutien boursier)',
    'Collaborateur projet / Développeur',
    'Autre contribution'
  ]

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12 bg-white p-5 sm:p-8 md:p-12 rounded-3xl shadow-xl border border-slate-200/80">
      {submitError && (
        <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-xl text-rose-800 text-sm font-medium">
          <p>{submitError}</p>
        </div>
      )}

      {/* 1. Statut */}
      <section className="space-y-4">
        <div className="border-b border-slate-200 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-gold">Étape 01</span>
          <h3 className="text-lg sm:text-2xl font-bold text-brand-green">Votre Statut Actuel</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {['etudiant', 'salarie', 'independant', 'sans_emploi', 'autre'].map(s => (
            <label 
              key={s} 
              className={`cursor-pointer border text-xs sm:text-sm font-semibold p-3 sm:py-3.5 rounded-xl text-center transition-all shadow-2xs flex items-center justify-center gap-1.5 ${
                currentStatus === s 
                  ? 'bg-brand-green text-white border-brand-green shadow-md scale-[1.02]' 
                  : 'bg-slate-50/80 text-slate-700 border-slate-200 hover:bg-slate-100/80 hover:border-slate-300'
              }`}
            >
              <input type="radio" value={s} {...register('status')} className="hidden" />
              <span className="capitalize">{s.replace('_', ' ')}</span>
              {currentStatus === s && <Check size={16} className="text-brand-gold-light shrink-0" />}
            </label>
          ))}
        </div>
        {errors.status && <p className="text-xs font-medium text-rose-500">{errors.status.message}</p>}
      </section>

      {/* 2. Infos personnelles */}
      <section className="space-y-6">
        <div className="border-b border-slate-200 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-gold">Étape 02</span>
          <h3 className="text-lg sm:text-2xl font-bold text-brand-green">Informations Personnelles</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <InputField label="Nom de famille" name="lastName" required error={errors.lastName} placeholder="Ex: Louis" />
          <InputField label="Prénom" name="firstName" required error={errors.firstName} placeholder="Ex: Bentzky" />
          <InputField label="Date de naissance" name="birthDate" type="date" required error={errors.birthDate} />
          
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-xs sm:text-sm font-semibold text-slate-800">Sexe <span className="text-rose-500">*</span></label>
            <select {...register('gender')} className={`w-full border rounded-lg px-3.5 py-2.5 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-turquoise transition-all shadow-2xs ${errors.gender ? 'border-rose-500' : 'border-slate-300 hover:border-slate-400'}`}>
              <option value="">Sélectionner votre genre...</option>
              <option value="M">Masculin</option>
              <option value="F">Féminin</option>
            </select>
            {errors.gender && <span className="text-xs font-medium text-rose-500">{errors.gender.message}</span>}
          </div>

          <InputField label="Nationalité" name="nationality" required error={errors.nationality} placeholder="Ex: Haïtienne" />
          <InputField label="Numéro NIF / CIN / Passeport" name="cinNif" required error={errors.cinNif} placeholder="Ex: 000-000-000-0" />
          <InputField label="Téléphone principal (WhatsApp)" name="phone" required error={errors.phone} placeholder="+509 XXXX XXXX" />
          <InputField label="Adresse email professionnelle" name="email" type="email" required error={errors.email} placeholder="nom@exemple.com" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
          <InputField label="Département / Région" name="department" required error={errors.department} placeholder="Ex: Nord, Ouest, Diaspora..." />
          <InputField label="Commune / Ville" name="commune" required error={errors.commune} placeholder="Ex: Pignon, Cap-Haïtien..." />
          <InputField label="Section communale / Zone" name="section" required error={errors.section} placeholder="Ex: Lajeune / Centre" />
          <InputField label="Adresse complète" name="address" required error={errors.address} placeholder="Numéro, rue, quartier..." />
        </div>

        <div className="pt-2">
          <div className="flex flex-col gap-2 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
             <label className="text-xs sm:text-sm font-semibold text-slate-800">Photo de profil / Identité <span className="text-slate-400 text-xs font-normal">(Optionnel, JPG/PNG, Max 5MB)</span></label>
              <input 
                type="file" 
                id="photo-upload" 
                accept="image/*" 
                onChange={(e) => handleFileChange(e, 'Photo de profil')}
                className="text-xs sm:text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-bold file:bg-emerald-100 file:text-brand-green hover:file:bg-emerald-200 cursor-pointer transition-colors" 
              />
          </div>
        </div>
      </section>

      {/* 3. Infos pro */}
      <section className="space-y-6">
        <div className="border-b border-slate-200 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-gold">Étape 03</span>
          <h3 className="text-lg sm:text-2xl font-bold text-brand-green">Profil &amp; Atouts Numériques</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {(currentStatus === 'salarie' || currentStatus === 'independant') && (
            <>
              <InputField label="Profession / Spécialité actuelle" name="profession" error={errors.profession} placeholder="Ex: Développeur, Ingénieur système..." />
              <InputField label="Employeur / Structure" name="employer" error={errors.employer} placeholder="Ex: Blessed Wing Technology / Freelance" />
            </>
          )}
          <InputField label="Années d'expérience professionnelle" name="experience" type="number" min="0" error={errors.experience} placeholder="Ex: 3" />
          <InputField label="Liens professionnels (Portfolio, LinkedIn, GitHub...)" name="portfolio" error={errors.portfolio} placeholder="https://github.com/... https://linkedin.com/... (séparation par espace ou virgule)" />
        </div>
        
        <div className="pt-2">
          <label className="text-xs sm:text-sm font-semibold text-slate-800 block mb-3">
            Sélectionnez votre ou vos domaine(s) d&apos;expertise <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
            {expertiseList.map(exp => (
              <label 
                key={exp} 
                className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs sm:text-sm font-medium text-slate-800 cursor-pointer hover:bg-emerald-50/50 hover:border-brand-turquoise/50 transition-all shadow-2xs"
              >
                <input type="checkbox" value={exp} {...register('expertise')} className="w-4 h-4 rounded text-brand-green focus:ring-brand-green shrink-0" />
                <span className="select-none leading-snug">{exp}</span>
              </label>
            ))}
          </div>
          {errors.expertise && <span className="text-xs font-medium text-rose-500 block mt-2">{errors.expertise.message}</span>}
        </div>

        <div className="pt-2">
          <div className="flex flex-col gap-2 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
            <label className="text-xs sm:text-sm font-semibold text-slate-800">Curriculum Vitae / CV <span className="text-slate-400 text-xs font-normal">(PDF, DOCX recommandé, Max 5MB)</span></label>
            <input 
              type="file" 
              id="cv-upload" 
              accept=".pdf,.doc,.docx" 
              onChange={(e) => handleFileChange(e, 'CV')}
              className="text-xs sm:text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-bold file:bg-amber-100 file:text-amber-900 hover:file:bg-amber-200 cursor-pointer transition-colors" 
            />
          </div>
        </div>
      </section>

      {/* 4. Formation */}
      <section className="space-y-6">
        <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-gold">Étape 04</span>
            <h3 className="text-lg sm:text-2xl font-bold text-brand-green">Formation Académique</h3>
          </div>
          <button 
            type="button" 
            onClick={() => appendEdu({ degree: '', institution: '', year: '', field: '' })} 
            className="text-xs sm:text-sm inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-brand-green border border-emerald-200/80 px-3.5 py-2 rounded-xl font-bold transition-all self-start sm:self-auto shadow-2xs"
          >
            <Plus size={16} /> Ajouter une formation
          </button>
        </div>

        {eduFields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-5 sm:p-6 bg-slate-50/80 border border-slate-200/80 rounded-2xl relative shadow-2xs">
            <InputField label="Diplôme / Niveau" name={`educations.${index}.degree`} required error={errors?.educations?.[index]?.degree} placeholder="Ex: Licence / Bac+4" />
            <InputField label="Institution / École" name={`educations.${index}.institution`} required error={errors?.educations?.[index]?.institution} placeholder="Ex: Université / Faculté" />
            <InputField label="Année d'obtention" name={`educations.${index}.year`} required error={errors?.educations?.[index]?.year} placeholder="Ex: 2024" />
            <InputField label="Domaine / Filière" name={`educations.${index}.field`} required error={errors?.educations?.[index]?.field} placeholder="Ex: Sciences Informatiques" />
            {index > 0 && (
              <button 
                type="button" 
                onClick={() => removeEdu(index)} 
                title="Supprimer cette formation"
                className="absolute -right-2 sm:-right-3 -top-2 sm:-top-3 w-8 h-8 bg-rose-100 text-rose-700 rounded-full flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all shadow-md border border-rose-200"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}
        {errors.educations && <p className="text-xs font-medium text-rose-500">{errors.educations.message}</p>}
      </section>

      {/* 5. Réalisations */}
      <section className="space-y-6">
        <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-gold">Étape 05</span>
            <h3 className="text-lg sm:text-2xl font-bold text-brand-green">Projets &amp; Réalisations <span className="text-slate-400 text-sm font-normal">(Optionnel)</span></h3>
          </div>
          <button 
            type="button" 
            onClick={() => appendAch({ title: '', description: '', link: '', year: '' })} 
            className="text-xs sm:text-sm inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-brand-green border border-emerald-200/80 px-3.5 py-2 rounded-xl font-bold transition-all self-start sm:self-auto shadow-2xs"
          >
            <Plus size={16} /> Ajouter un projet
          </button>
        </div>

        {achFields.length === 0 && (
          <p className="text-xs sm:text-sm text-slate-500 italic bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
            Vous avez développé une application, dirigé un projet technique ou apporté une solution numérique notable ? Cliquez sur &laquo; Ajouter un projet &raquo; pour le valoriser.
          </p>
        )}

        {achFields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-5 sm:p-6 bg-slate-50/80 border border-slate-200/80 rounded-2xl relative shadow-2xs">
            <InputField label="Titre du projet" name={`achievements.${index}.title`} error={errors?.achievements?.[index]?.title} placeholder="Ex: Système de gestion scolaire" />
            <InputField label="Description courte" name={`achievements.${index}.description`} error={errors?.achievements?.[index]?.description} placeholder="Ex: Déployé sous Next.js/PostgreSQL..." />
            <InputField label="Lien du projet / Démo" name={`achievements.${index}.link`} error={errors?.achievements?.[index]?.link} placeholder="https://..." />
            <InputField label="Année / Statut" name={`achievements.${index}.year`} error={errors?.achievements?.[index]?.year} placeholder="Ex: 2025" />
            <button 
              type="button" 
              onClick={() => removeAch(index)} 
              title="Supprimer ce projet"
              className="absolute -right-2 sm:-right-3 -top-2 sm:-top-3 w-8 h-8 bg-rose-100 text-rose-700 rounded-full flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all shadow-md border border-rose-200"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </section>

      {/* 6. Motivation */}
      <section className="space-y-6">
        <div className="border-b border-slate-200 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-gold">Étape 06</span>
          <h3 className="text-lg sm:text-2xl font-bold text-brand-green">Engagement &amp; Vision Associative</h3>
        </div>
        
        <div>
          <label className="text-xs sm:text-sm font-semibold text-slate-800 block mb-3">
            Rôle(s) envisagé(s) au sein de Blessed Wing Tech Academy <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
            {roleList.map(role => (
              <label 
                key={role} 
                className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs sm:text-sm font-medium text-slate-800 cursor-pointer hover:bg-emerald-50/50 hover:border-brand-turquoise/50 transition-all shadow-2xs"
              >
                <input type="checkbox" value={role} {...register('roles')} className="w-4 h-4 rounded text-brand-green focus:ring-brand-green shrink-0 mt-0.5" />
                <span className="select-none leading-snug">{role}</span>
              </label>
            ))}
          </div>
          {errors.roles && <span className="text-xs font-medium text-rose-500 block mt-2">{errors.roles.message}</span>}
        </div>

        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-xs sm:text-sm font-semibold text-slate-800">
            Votre motivation &amp; vision pour la communauté <span className="text-rose-500">*</span>
          </label>
          <textarea 
            {...register('motivation')} 
            rows={5} 
            className={`w-full border rounded-xl px-4 py-3 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-turquoise transition-all shadow-2xs ${errors.motivation ? 'border-rose-500' : 'border-slate-300 hover:border-slate-400'}`} 
            placeholder="Partagez pourquoi vous souhaitez rejoindre cette initiative, comment vous concevez l'accessibilité informatique sans barrière d'argent et l'impact que nous pouvons générer ensemble en Haïti et au-delà..."
          ></textarea>
          {errors.motivation && <span className="text-xs font-medium text-rose-500">{errors.motivation.message}</span>}
        </div>

        <InputField label="Disponibilité &amp; Mode d'engagement" name="availability" required error={errors.availability} placeholder="Ex: 10h/semaine (Hybride ou En ligne) / Support ponctuel..." />

        <div className="pt-6 border-t border-slate-100 space-y-4">
           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
             <div>
               <label className="text-xs sm:text-sm font-semibold text-slate-800 block">Personne(s) de référence <span className="text-rose-500">*</span></label>
               <span className="text-xs text-slate-500">Mentors, anciens employeurs, collaborateurs ou partenaires pouvant appuyer votre candidature.</span>
             </div>
             <button 
               type="button" 
               onClick={() => appendRef({ name: '', contact: '', relation: '' })} 
               className="text-xs sm:text-sm inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-brand-green border border-emerald-200/80 px-3.5 py-2 rounded-xl font-bold transition-all self-start sm:self-auto shadow-2xs shrink-0"
             >
               <Plus size={16} /> Ajouter une référence
             </button>
           </div>
           
           {refFields.map((field, index) => (
             <div key={field.id} className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 bg-slate-50/80 border border-slate-200/80 rounded-2xl relative shadow-2xs">
               <InputField label="Nom complet de la référence" name={`references.${index}.name`} required error={errors?.references?.[index]?.name} placeholder="Ex: Jean Michel" />
               <InputField label="Contact (Tél ou Email)" name={`references.${index}.contact`} required error={errors?.references?.[index]?.contact} placeholder="+509 XXXX XXXX / email" />
               <InputField label="Relation professionnelle" name={`references.${index}.relation`} required error={errors?.references?.[index]?.relation} placeholder="Ex: Ancien directeur, collègue BWT..." />
               {index > 0 && (
                 <button 
                   type="button" 
                   onClick={() => removeRef(index)} 
                   title="Supprimer cette référence"
                   className="absolute -right-2 sm:-right-3 -top-2 sm:-top-3 w-8 h-8 bg-rose-100 text-rose-700 rounded-full flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all shadow-md border border-rose-200"
                 >
                   <Trash2 size={16} />
                 </button>
               )}
             </div>
           ))}
           {errors.references && <p className="text-xs font-medium text-rose-500">{errors.references.message}</p>}
        </div>
      </section>

      {/* 7. Consentement */}
      <section className="space-y-4 pt-6 border-t border-slate-200">
        <label className="flex items-start gap-3.5 cursor-pointer group">
          <input type="checkbox" {...register('consentData')} className="mt-1 w-4 h-4 rounded text-brand-green focus:ring-brand-green shrink-0" />
          <span className="text-xs sm:text-sm text-slate-700 leading-relaxed group-hover:text-slate-950 transition-colors">
            Je consens au traitement sécurisé de mes données personnelles par l&apos;association <strong className="text-slate-900">BWTA</strong> dans le cadre exclusif de ma candidature. Je comprends que ces informations seront préservées avec une stricte confidentialité. <span className="text-rose-500">*</span>
          </span>
        </label>
        {errors.consentData && <p className="text-xs font-medium text-rose-500 ml-7">{errors.consentData.message}</p>}

        <label className="flex items-start gap-3.5 cursor-pointer group">
          <input type="checkbox" {...register('certifyExact')} className="mt-1 w-4 h-4 rounded text-brand-green focus:ring-brand-green shrink-0" />
          <span className="text-xs sm:text-sm text-slate-700 leading-relaxed group-hover:text-slate-950 transition-colors">
            Je certifie sur l&apos;honneur l&apos;exactitude et la sincérité des informations fournies dans ce dossier. Je suis motivé à collaborer au succès de l&apos;idéologie technologique d&apos;Haïti. <span className="text-rose-500">*</span>
          </span>
        </label>
        {errors.certifyExact && <p className="text-xs font-medium text-rose-500 ml-7">{errors.certifyExact.message}</p>}
      </section>

      <div className="pt-6 flex flex-col sm:flex-row sm:justify-end border-t border-slate-100 items-center gap-4">
        {fileError && (
          <div className="flex-1 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs sm:text-sm font-semibold shadow-2xs">
            {fileError}
          </div>
        )}
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-brand-green hover:bg-emerald-700 text-white text-base sm:text-lg font-extrabold py-4 px-12 rounded-2xl transition-all shadow-xl hover:shadow-2xl hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:pointer-events-none"
        >
          {isSubmitting ? (
            <><Loader2 size={22} className="animate-spin" /> Transmission de votre candidature...</>
          ) : (
            'Soumettre mon dossier fondateur'
          )}
        </button>
      </div>
    </form>
  )
}
