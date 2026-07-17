import { z } from 'zod'

export const applicationSchema = z.object({
  // Section 1: Statut
  status: z.enum(['etudiant', 'salarie', 'independant', 'sans_emploi', 'autre'], {
    message: "Veuillez sélectionner un statut."
  }),

  // Section 2: Infos personnelles
  lastName: z.string().min(2, "Le nom est requis"),
  firstName: z.string().min(2, "Le prénom est requis"),
  birthDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Date de naissance invalide" }),
  gender: z.string().min(1, "Le sexe est requis"),
  nationality: z.string().min(2, "La nationalité est requise"),
  cinNif: z.string().min(4, "Le numéro CIN/NIF est requis"),
  phone: z.string().min(8, "Le numéro de téléphone est requis"),
  email: z.string().email("Adresse email invalide"),
  
  department: z.string().min(2, "Le département est requis"),
  commune: z.string().min(2, "La commune est requise"),
  section: z.string().min(2, "La section communale est requise"),
  address: z.string().min(5, "L'adresse précise est requise"),

  // Section 3: Infos pro (conditionnelles, certaines optionnelles)
  profession: z.string().optional(),
  employer: z.string().optional(),
  expertise: z.array(z.string()).min(1, "Sélectionnez au moins un domaine d'expertise"),
  experience: z.preprocess((val) => (val === "" ? undefined : Number(val)), z.number().min(0).optional()),
  portfolio: z.string().optional(),

  // Section 4: Formation académique
  educations: z.array(
    z.object({
      degree: z.string().min(2, "Requis"),
      institution: z.string().min(2, "Requis"),
      year: z.string().min(4, "Requis"),
      field: z.string().min(2, "Requis"),
    })
  ).min(1, "Veuillez ajouter au moins une formation"),

  // Section 5: Réalisations
  achievements: z.array(
    z.object({
      title: z.string().min(2, "Requis"),
      description: z.string().min(5, "Requis"),
      link: z.string().optional(),
      year: z.string().optional(),
    })
  ).optional(),

  // Section 6: Motivation
  roles: z.array(z.string()).min(1, "Sélectionnez au moins un rôle"),
  motivation: z.string().min(50, "Veuillez détailler votre motivation (min 50 caractères)"),
  availability: z.string().min(2, "Veuillez préciser votre disponibilité"),
  
  references: z.array(
    z.object({
      name: z.string().min(2, "Requis"),
      contact: z.string().min(5, "Requis"),
      relation: z.string().min(2, "Requis"),
    })
  ).min(1, "Veuillez ajouter au moins une référence"),

  // Section 7: Consentement
  consentData: z.literal(true, {
    errorMap: () => ({ message: "Vous devez consentir au traitement de vos données" }),
  }),
  certifyExact: z.literal(true, {
    errorMap: () => ({ message: "Vous devez certifier l'exactitude de ces informations" }),
  }),
})

export type ApplicationFormData = z.infer<typeof applicationSchema>
