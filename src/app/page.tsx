import Link from 'next/link'
import { ArrowRight, CheckCircle2, Target, Users, BookOpen, GraduationCap, Building, ExternalLink } from 'lucide-react'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="bg-brand-green text-white py-20 px-6 sm:px-12 lg:px-24">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Blessed Wing Tech <span className="text-brand-gold-light">Academy</span>
            </h1>
            <p className="text-lg md:text-xl text-emerald-50 max-w-2xl font-light italic">
              "Donner à la jeunesse de la communauté haïtienne les outils et compétences technologiques pour bâtir son avenir — 
              sans que le manque de moyens ne ferme jamais la porte."
            </p>
            <p className="text-md text-emerald-100 max-w-2xl">
              Un projet porté par une idéologie forte : l'inclusion numérique. Nous croyons qu'en unissant 
              les forces de plusieurs passionnés, formateurs, supporteurs et professionnels, nous pouvons réaliser 
              de grands exploits numériques en Haïti et au monde entier.
            </p>
            <div className="pt-4">
              <Link 
                href="/rejoindre" 
                className="inline-flex items-center gap-2 bg-brand-gold hover:bg-brand-gold-light text-white font-bold py-3 px-8 rounded-full transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Rejoindre le mouvement
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
          <div className="flex-1 relative hidden md:block">
            <div className="w-full h-80 bg-emerald-800 rounded-2xl border-4 border-brand-turquoise-light/30 shadow-2xl flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
               <GraduationCap size={100} className="text-brand-gold-light drop-shadow-md z-10" />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Mission et Vision */}
        <section className="py-20 px-6 sm:px-12 lg:px-24 bg-white">
          <div className="max-w-5xl mx-auto space-y-16">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-brand-green">Notre Vision et Mission</h2>
              <p className="text-gray-600 max-w-3xl mx-auto text-lg">
                Bâtir un écosystème en Haïti où grandir dans l'univers numérique est un atout indispensable, sans que les moyens financiers n'empêche plus aux talents d'accéder 
                aux compétences qui ouvrent des portes professionnelles. BWTA se conçoit comme un futur 
                écosystème informatique complet au service de la jeunesse haïtienne, sous l'égide de <a href="https://bwt.bittonik.com">BWT</a>.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-emerald-100 text-brand-green rounded-xl flex items-center justify-center mb-6">
                  <Target size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">La Problématique</h3>
                <p className="text-gray-600">
                  L'accès à une formation de qualité dans le domaine de l'informatique est géographiquement et financièrement limité.
                  Un jeune motivé se retrouve souvent écarté d'un secteur qui offre pourtant de réelles perspectives (créativité, développement, entrepreneuriat).
                </p>
              </div>
              
              <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-teal-100 text-brand-turquoise rounded-xl flex items-center justify-center mb-6">
                  <BookOpen size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">La Solution BWTA</h3>
                <p className="text-gray-600">
                  Une offre pédagogique structurée autour de trois volets au lancement : 
                  <strong className="text-brand-green"> Technique informatique - <small>2 ans</small></strong>, 
                  <strong className="text-brand-green"> Bureautique - <small>10 mois</small></strong>, et 
                  <strong className="text-brand-green"> Anglais professionnel - <small>10 mois</small></strong> comme outil indispensable.
                </p>
              </div>

              <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-amber-100 text-brand-gold rounded-xl flex items-center justify-center mb-6">
                  <Users size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Inclusion Financière</h3>
                <p className="text-gray-600">
                  Le manque de moyens ne doit pas être une barrière qui empêche l'accès les talents à acquerrir les accompagnements nécessaires. Nous optons pour un modèle qui repose sur des bourses 
                  totales ou partielles et un système de parrainage individuel créant un lien concret 
                  entre donateurs/supporteurs et étudiants leur pemettant de couvrir les frais nécessaires.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Le Fondateur */}
        <section className="py-20 px-6 sm:px-12 lg:px-24 bg-slate-50">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start gap-12">
            <div className="md:w-1/3 flex flex-col items-center">
              <div className="w-full aspect-square rounded-2xl bg-brand-green-light/20 border-4 border-white shadow-xl overflow-hidden flex flex-col items-center justify-center relative mb-4">
                 <Building size={80} className="text-brand-green opacity-50" />
                 <div className="relative h-40 w-40 overflow-hidden rounded-full border-2 border-primary/20 bg-muted"> 
                  <Image src={'/ba.png'} alt='Bentzky' fill className="object-cover" />
                  </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Bentzky Louis</h3>
              <p className="text-brand-green font-medium">Software Engineer & UI/UX Designer</p>
            </div>
            <div className="md:w-2/3 space-y-6">
              <h2 className="text-3xl font-bold text-brand-green">Le porteur du projet</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Le projet est porté par <strong><a href="https://bentz.bittonik.com">Bentzky Louis</a></strong>, ingénieur en informatique (Licencié), développeur Full-Stack, administrateur système Linux, designer et formateur. Fort de plus de <strong>5 années d'expérience</strong>, il est le fondateur de 
                <a href="https://bwt.bittonik.com" target="_blank" className="text-brand-turquoise hover:underline mx-1 font-semibold">Blessed Wing Technology (BWT)</a>, un écosystème qui met en production des solutions numériques diverses, notamment:
              </p>
                <ul className="gap-3 flex space-y-3 text-gray-600">
                  <li><a className="inline-flex items-center gap-1 text-brand-gold hover:text-brand-green-light transition-colors" href="https://www.bittonik.com">BitTonik<ExternalLink size={20} /></a></li>
                  <li><a className="inline-flex items-center gap-1 text-brand-gold hover:text-brand-green-light transition-colors" href="https://shop.bittonik.com">ShopTonik<ExternalLink size={20} /></a></li>
                  <li><a className="inline-flex items-center gap-1 text-brand-gold hover:text-brand-green-light transition-colors" href="https://press.bittonik.com">PressTonik<ExternalLink size={20} /></a></li>
                  <li><a className="inline-flex items-center gap-1 text-brand-gold hover:text-brand-green-light transition-colors" href="https://memo.bittonik.com">MemoTonik<ExternalLink size={20} /></a></li>
                  <li><a className="inline-flex items-center gap-1 text-brand-gold hover:text-brand-green-light transition-colors" href="#">Etc.</a></li>
                </ul> 
              
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-4">
                <h4 className="font-bold text-gray-900">Un parcours d'excellence et d'impact :</h4>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="text-brand-green shrink-0 mt-1" size={18} />
                    <span><strong>Plus de 50 projets digitaux réalisés</strong> (applications web, solutions cloud, cybersécurité, Services IT, design) via BWT.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="text-brand-green shrink-0 mt-1" size={18} />
                    <span><strong>Formateur expérimenté :</strong> A déjà formé et encadré plus de plusieurs apprenants sur des domaines clés du numérique.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="text-brand-green shrink-0 mt-1" size={18} />
                    <span><strong>Double légitimité :</strong> À la fois expert technique (Programmation, développemnt, déploiement, maintenance) et formateur & accompagnateur engagé dans sa communauté.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-2">
                <a 
                  href="https://bentz.bittonik.com" 
                  target="_blank" 
                  className="inline-flex items-center gap-2 text-brand-gold hover:text-brand-gold-light font-bold text-lg transition-colors"
                >
                  Découvrir son Portfolio et ses réalisations <ExternalLink size={20} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Feuille de route */}
        <section className="py-20 px-6 sm:px-12 lg:px-24 bg-white border-t border-slate-100">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-brand-green text-center mb-12">Notre Feuille de Route</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="relative p-6 border-l-4 border-brand-turquoise bg-slate-50">
                <span className="absolute -left-[14px] top-6 w-6 h-6 rounded-full bg-brand-turquoise border-4 border-white shadow-sm"></span>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Phase 1 : Rerutement</h4>
                <p className="text-gray-600 text-sm"><strong>Recruter des alliés de l'idéologie</strong>. Dans l'objectif de réunir les cadres nécessaires pour mener cette idéologie à sa réalisation et sa tenue à long termes.</p>
              </div>
              <div className="relative p-6 border-l-4 border-brand-gold bg-slate-50">
                <span className="absolute -left-[14px] top-6 w-6 h-6 rounded-full bg-brand-gold border-4 border-white shadow-sm"></span>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Phase 2 : Consolidation</h4>
                <p className="text-gray-600 text-sm">Structurer la base de <strong>Blessed Wing Tech Acdemy</strong>. Recrutement de formateurs, passionnés, entrepreneurs supplémentaires et officialisation légale de l'institution.</p>
              </div>
              <div className="relative p-6 border-l-4 border-brand-gold bg-slate-50">
                <span className="absolute -left-[14px] top-6 w-6 h-6 rounded-full bg-brand-gold border-4 border-white shadow-sm"></span>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Phase 3 : Lancement & Partenariat</h4>
                <p className="text-gray-600 text-sm">Lancer avec la première cohorte d'apprenant <strong>Blessed Wing Tech Acdemy</strong>. Partenariat avec des instances pouvant partager des ressources  pour le progrès de cette initiative.</p>
              </div>
              <div className="relative p-6 border-l-4 border-brand-green bg-slate-50">
                <span className="absolute -left-[14px] top-6 w-6 h-6 rounded-full bg-brand-green border-4 border-white shadow-sm"></span>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Phase 4 : Vision Long Terme</h4>
                <p className="text-gray-600 text-sm">Un centre pleinement équipé aux standards d'un véritable laboratoire informatique. Expansion vers l'intelligence artificielle et l'outsourcing.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA et Avertissement */}
        <section className="py-24 px-6 sm:px-12 lg:px-24 bg-brand-green text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-turquoise opacity-20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-gold opacity-20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="max-w-4xl mx-auto text-center space-y-10 relative z-10">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold">Rejoignez l'Idéologie BWTA</h2>
              <p className="text-lg text-emerald-100 max-w-2xl mx-auto">
                Nous recherchons des <strong className="text-white">professionnels</strong>, des <strong className="text-white">formateurs</strong>, 
                des passionnés du <strong className="text-white">numérique</strong>, des <strong className="text-white">Partenariats</strong> et des <strong className="text-white">entrepreneurs</strong> pour 
                bâtir ensemble cette vision. Car avec l'inclusion de plusieurs, nous pouvons produire bien plus d'impacts positifs.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm border border-brand-gold/50 rounded-2xl p-8 max-w-2xl mx-auto shadow-xl">
              <h3 className="text-2xl font-bold text-brand-gold-light mb-4 flex items-center justify-center gap-3">
                <Target size={28} /> Processus Hautement Sélectif <small>(Pour les membres fondateurs)</small>
              </h3>
              <p className="text-emerald-50 text-lg leading-relaxed">
                Il s'agit d'un appel à candidature compétitif pour constituer l'équipe fondatrice et la future association. 
                Afin de garantir l'excellence de notre idéologie, <strong className="text-white bg-brand-gold/40 px-2 py-1 rounded">15 des postulants seront retenus, et les autres on pour la suite générale.</strong>.
              </p>
              <ul className="text-left mt-6 space-y-3 text-emerald-100 max-w-md mx-auto">
                <li className="flex items-start gap-2"><CheckCircle2 className="text-brand-turquoise-light shrink-0 mt-1" size={18} /> Partagez notre vision d'inclusion.</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="text-brand-turquoise-light shrink-0 mt-1" size={18} /> Démontrez votre expertise et motivation.</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="text-brand-turquoise-light shrink-0 mt-1" size={18} /> Préparez-vous à un engagement sérieux.</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="text-brand-turquoise-light shrink-0 mt-1" size={18} /> Préparez-vous à l'excellence numérique.</li>
              </ul>
            </div>

            <div className="pt-4">
              <Link 
                href="/rejoindre" 
                className="inline-flex items-center gap-3 bg-brand-gold hover:bg-brand-gold-light text-white font-bold text-xl py-4 px-10 rounded-full transition-all shadow-xl hover:shadow-2xl hover:scale-105"
              >
                Postuler maintenant
                <ArrowRight size={24} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6 text-center border-t border-slate-800">
        <div className="max-w-4xl mx-auto space-y-4">
          <h4 className="text-xl font-bold text-white">Blessed Wing Tech Academy</h4>
          <p>Lajeune, Pignon, Nord, Haïti</p>
          <div className="flex justify-center space-x-6 pt-4">
            <a href="mailto:contact@bittonik.com" className="hover:text-brand-turquoise-light transition-colors">contact@bittonik.com</a>
            <span>•</span>
            <span>+509 4057 6045 | +509 4836 5101</span>
          </div>
          <div className="pt-8 text-sm text-slate-500">
            &copy; {new Date().getFullYear()} BWT - Blessed Wing Technology. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  )
}
