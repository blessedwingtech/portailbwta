# Blessed Wing Tech Academy (BWTA) - Portail Web

Ce projet est un portail web volontairement simple et performant, créé pour l'association BWTA (branche de Blessed Wing Technology) située à Lajeune, Bohoc, Haïti.

Il est construit avec **Next.js (App Router)**, **Tailwind CSS**, **Prisma**, et **NextAuth**.

## Fonctionnalités

1. **Page Publique d'Information (`/`)** : Présente la mission, la vision, le modèle financier et la feuille de route de BWTA.
2. **Page de Candidature (`/rejoindre`)** : Formulaire interactif et dynamique (validation Zod) permettant de soumettre sa candidature pour rejoindre l'association (seulement 15 places).
3. **Espace Administrateur (`/admin`)** : Interface sécurisée pour gérer les candidatures (liste, filtres, détails, notes internes, changement de statut, export CSV).

## Prérequis

- Node.js (v18+)
- npm ou yarn

## Installation Locale (Développement)

1. Clonez ce dépôt.
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Créez un fichier `.env` basé sur `.env.example` :
   ```bash
   cp .env.example .env
   ```
4. Initialisez la base de données (SQLite par défaut) :
   ```bash
   npx prisma db push
   ```
5. Créez le compte administrateur par défaut :
   ```bash
   npm run prisma seed
   # Identifiants créés : admin@bwta.bittonik.com / adminpassword
   ```
6. Lancez le serveur de développement :
   ```bash
   npm run dev
   ```
7. Accédez au site sur `http://localhost:3000`.

## Déploiement en Production (PostgreSQL & bwta.bittonik.com)

Pour le déploiement sur votre VPS cible (`bwta.bittonik.com`) :

1. Mettez à jour la variable `DATABASE_URL` dans le fichier `.env` pour pointer vers votre instance PostgreSQL :
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/bwta_db"
   ```
2. Générez une clé secrète forte pour NextAuth :
   ```env
   NEXTAUTH_SECRET="votre_cle_tres_secrete"
   ```
3. Spécifiez l'URL en production :
   ```env
   NEXTAUTH_URL="https://bwta.bittonik.com"
   ```
4. Synchronisez la structure de base de données PostgreSQL :
   ```bash
   npx prisma db push
   # N'oubliez pas de relancer le seed s'il s'agit d'une DB vierge
   ```
5. Buildez l'application :
   ```bash
   npm run build
   ```
6. Lancez en production :
   ```bash
   npm start
   ```

### Stockage des Fichiers

Actuellement, les fichiers uploadés (CV, photos) sont stockés dans le dossier `/public/uploads`.
- **En production**, assurez-vous que le dossier `public/uploads` a les droits d'écriture adéquats sur votre VPS.
- *Remarque :* Pour une infrastructure plus distribuée, vous pouvez facilement modifier `src/app/api/apply/route.ts` pour envoyer les buffers vers un bucket S3 ou Cloudinary.
