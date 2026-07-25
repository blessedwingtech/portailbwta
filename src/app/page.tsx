import Link from 'next/link'
import { ArrowRight, CheckCircle2, Target, Users, BookOpen, GraduationCap, Building, ExternalLink, Handshake, Rocket, Laptop, Award } from 'lucide-react'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-brand-gold selection:text-white">
      {/* Hero Section */}
      <header className="bg-brand-green text-white py-16 sm:py-24 px-4 sm:px-8 lg:px-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-turquoise/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-gold/15 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none"></div>

        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 sm:gap-16 relative z-10">
          <div className="w-full lg:w-3/5 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-white/10 border border-emerald-400/30 text-emerald-300 text-xs sm:text-sm font-medium tracking-wide">
              <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse"></span>
              Initiative Associative &amp; Technologique
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight sm:leading-tight">
              Blessed Wing Tech <span className="text-brand-gold-light">Academy</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-emerald-50 font-light italic leading-relaxed">
              &laquo;&nbsp;Promouvoir le développement numérique dans la communauté haïtienne par des formations d&apos;excellence, la collaboration d&apos;experts et des partenariats stratégiques, sans que l&apos;argent ne soit une barrière.&nbsp;&raquo;
            </p>
            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              BWTA se structure comme un écosystème associatif innovant. Notre conviction est simple : en rassemblant professionnels de la tech, formateurs passionnés et entrepreneurs visionnaires, nous construisons des projets informatiques à long terme tout en démocratisant l&apos;accès au savoir pour tous les talents.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link 
                href="/rejoindre" 
                className="w-full sm:w-auto text-center inline-flex items-center justify-center gap-2 bg-brand-gold hover:bg-brand-gold-light text-slate-950 font-bold py-3.5 px-8 rounded-full transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Rejoindre le mouvement
                <ArrowRight size={20} />
              </Link>
              <a 
                href="#vision" 
                className="w-full sm:w-auto text-center inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white border border-white/20 font-semibold py-3.5 px-7 rounded-full transition-all backdrop-blur-sm"
              >
                Découvrir l&apos;idéologie
              </a>
            </div>
          </div>

          <div className="w-full sm:w-4/5 lg:w-2/5 flex justify-center">
            <div className="w-full max-w-md aspect-square bg-emerald-900/80 rounded-3xl border-2 border-brand-turquoise/40 shadow-2xl p-8 flex flex-col items-center justify-center relative overflow-hidden text-center group hover:border-brand-gold/50 transition-all duration-500">
              <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>
              <div className="w-24 h-24 rounded-2xl bg-brand-green border border-emerald-700/60 flex items-center justify-center shadow-inner mb-6 text-brand-gold-light group-hover:scale-110 transition-transform duration-300">
                <GraduationCap size={56} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Excellence &amp; Inclusion</h3>
              <p className="text-sm text-emerald-200 leading-relaxed px-4">
                Une communauté d&apos;experts, de passionnés et d&apos;apprenants réunis pour transformer l&apos;avenir technologique haïtien.
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Piliers de l'idéologie */}
        <section id="vision" className="py-20 px-4 sm:px-8 lg:px-16 bg-white border-b border-slate-100">
          <div className="max-w-6xl mx-auto space-y-16">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-gold px-3 py-1 bg-amber-50 rounded-full border border-amber-200">
                Notre Raison d&apos;Être
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-brand-green tracking-tight">
                Une vision associative et durable
              </h2>
              <p className="text-slate-600 sm:text-lg leading-relaxed">
                BWTA va au-delà d&apos;une simple académie : c&apos;est une structure communautaire inclusive conçue pour porter le progrès numérique en Haïti en valorisant le savoir-faire, les coopérations stratégiques et l&apos;impact à long terme.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {/* Pilier 1 */}
              <div className="bg-slate-50 p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-brand-turquoise/50 transition-all flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-teal-100 text-brand-turquoise rounded-xl flex items-center justify-center mb-5 shadow-sm">
                    <Laptop size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Atouts &amp; Formations</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Délivrer des formations pointues dans diverses branches de l&apos;informatique et du numérique. Rendre nos jeunes compétents, innovants et opérationnels tant au niveau local qu&apos;international.
                  </p>
                </div>
              </div>
              
              {/* Pilier 2 */}
              <div className="bg-slate-50 p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-brand-gold/50 transition-all flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-amber-100 text-brand-gold rounded-xl flex items-center justify-center mb-5 shadow-sm">
                    <Award size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Zéro Barrière Financière</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    L&apos;absence de moyens financiers ne doit jamais stopper un candidat brillant ou déterminé. Notre modèle solidaire ouvre les portes du savoir informatique aux esprits talentueux sans discrimination d&apos;argent.
                  </p>
                </div>
              </div>

              {/* Pilier 3 */}
              <div className="bg-slate-50 p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-brand-green/50 transition-all flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-emerald-100 text-brand-green rounded-xl flex items-center justify-center mb-5 shadow-sm">
                    <Rocket size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Collaborations &amp; Projets</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Rassembler formateurs expérimentés, ingénieurs et passionnés de tech autour de collaborations durables. Réaliser des projets informatiques d&apos;envergure à long terme au service d&apos;Haïti et d&apos;ailleurs.
                  </p>
                </div>
              </div>

              {/* Pilier 4 */}
              <div className="bg-slate-50 p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-indigo-400/50 transition-all flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-xl flex items-center justify-center mb-5 shadow-sm">
                    <Handshake size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Partenariats Stratégiques</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    S&apos;unir à d&apos;autres entités technologiques, organisations et entreprises pour mutualiser les atouts numériques, partager les ressources et bâtir un pont solide d&apos;innovations techniques.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Le Fondateur et l'Écosystème BWT */}
        <section className="py-20 px-4 sm:px-8 lg:px-16 bg-slate-50">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center sm:items-start gap-12 lg:gap-16">
            
            <div className="w-full sm:w-3/4 lg:w-1/3 flex flex-col items-center sm:mx-auto">
              <div className="w-full max-w-[280px] sm:max-w-[320px] aspect-square rounded-2xl bg-white border-4 border-slate-200/80 shadow-xl overflow-hidden flex flex-col items-center justify-center relative mb-6 group hover:border-brand-turquoise transition-colors">
                 <Building size={80} className="text-brand-green/20 absolute" />
                 <div className="relative h-44 w-44 overflow-hidden rounded-full border-4 border-brand-green/10 bg-slate-100 shadow-md"> 
                   <Image src={'/ba.png'} alt='Bentzky Louis' fill className="object-cover" />
                 </div>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 text-center">Bentzky Louis</h3>
              <p className="text-brand-green font-semibold text-sm mt-1 text-center">Software Engineer &amp; Fondateur de BWT</p>
            </div>

            <div className="w-full lg:w-2/3 space-y-6 text-left">
              <div className="inline-block">
                <span className="text-xs font-bold uppercase tracking-widest text-brand-turquoise bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                  Leadership &amp; Expertise
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-green mt-2">
                  L&apos;élan d&apos;une ingénierie engagée
                </h2>
              </div>

              <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
                Le projet BWTA puise sa force d&apos;exécution dans l&apos;expérience de <strong className="text-slate-900"><a href="https://bentz.bittonik.com" target="_blank" rel="noopener noreferrer" className="underline decoration-brand-gold underline-offset-4 hover:text-brand-green transition-colors">Bentzky Louis</a></strong>, ingénieur en informatique (Licencié), développeur Full-Stack, administrateur système et formateur.
                <br /><br />
                Avec plus de <strong className="text-slate-900">5 années d&apos;expérience opérationnelle</strong> dans l&apos;industrie tech, il dirige l&apos;écosystème <a href="https://bwt.bittonik.com" target="_blank" rel="noopener noreferrer" className="text-brand-green font-bold hover:underline">Blessed Wing Technology (BWT)</a>, créateur d&apos;infrastructures numériques et plateformes logicielles reconnues&nbsp;:
              </p>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 py-2">
                <a className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs sm:text-sm font-bold text-slate-800 hover:border-brand-turquoise hover:text-brand-green transition-all shadow-2xs" href="https://www.bittonik.com" target="_blank" rel="noopener noreferrer">BitTonik <ExternalLink size={14} className="text-slate-400" /></a>
                <a className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs sm:text-sm font-bold text-slate-800 hover:border-brand-turquoise hover:text-brand-green transition-all shadow-2xs" href="https://shop.bittonik.com" target="_blank" rel="noopener noreferrer">ShopTonik <ExternalLink size={14} className="text-slate-400" /></a>
                <a className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs sm:text-sm font-bold text-slate-800 hover:border-brand-turquoise hover:text-brand-green transition-all shadow-2xs" href="https://press.bittonik.com" target="_blank" rel="noopener noreferrer">PressTonik <ExternalLink size={14} className="text-slate-400" /></a>
                <a className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs sm:text-sm font-bold text-slate-800 hover:border-brand-turquoise hover:text-brand-green transition-all shadow-2xs" href="https://memo.bittonik.com" target="_blank" rel="noopener noreferrer">MemoTonik <ExternalLink size={14} className="text-slate-400" /></a>
                <span className="px-3 py-1 text-xs font-semibold text-slate-500 bg-slate-200/70 rounded-md">+ Solutions Cloud &amp; Cyber</span>
              </div>
              
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-slate-200 space-y-4">
                <h4 className="font-bold text-slate-900 text-base sm:text-lg">Un gage de rigueur technique pour l&apos;Académie :</h4>
                <ul className="space-y-3 sm:space-y-4 text-slate-600 text-sm sm:text-base">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-brand-green shrink-0 mt-0.5" size={20} />
                    <span><strong className="text-slate-900">Production d&apos;impact :</strong> Plus de 50 projets informatiques majeurs déployés (ingénierie logicielle, services réseau, cybersécurité, design) par l&apos;entité BWT.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-brand-green shrink-0 mt-0.5" size={20} />
                    <span><strong className="text-slate-900">Pédagogie éprouvée :</strong> Encadrement et formation pratique de nombreux apprenants aux métiers d&apos;avenir de la technologie et de l&apos;informatique.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-brand-green shrink-0 mt-0.5" size={20} />
                    <span><strong className="text-slate-900">Infrastructures modernes :</strong> Mobilisation des outils professionnels de BWT pour offrir un environnement d&apos;apprentissage et de collaboration de haut niveau.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-2">
                <a 
                  href="https://bentz.bittonik.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-brand-gold hover:text-brand-green font-bold text-base sm:text-lg transition-colors group"
                >
                  Découvrir son portfolio et ses réalisations officielles 
                  <ExternalLink size={18} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

          </div>
        </section>

        {/* Feuille de route */}
        <section className="py-20 px-4 sm:px-8 lg:px-16 bg-white border-t border-slate-200/80">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-brand-green">Notre Feuille de Route</h2>
              <p className="text-slate-600 text-sm sm:text-base">
                Les étapes stratégiques du déploiement de Blessed Wing Tech Academy, d&apos;une initiative fondatrice à un laboratoire technologique de pointe.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {/* Phase 1 */}
              <div className="relative p-6 rounded-xl border border-slate-200 border-l-4 border-l-brand-turquoise bg-slate-50 shadow-2xs hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-brand-turquoise uppercase tracking-wider">Phase 01</span>
                </div>
                <h4 className="text-base sm:text-lg font-bold text-slate-900 mb-2">Recrutement &amp; Alliances</h4>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Rassembler les professionnels, formateurs, passionnés de tech et entrepreneurs désireux de rejoindre l&apos;équipe fondatrice et de structurer l&apos;association.
                </p>
              </div>

              {/* Phase 2 */}
              <div className="relative p-6 rounded-xl border border-slate-200 border-l-4 border-l-brand-gold bg-slate-50 shadow-2xs hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-brand-gold uppercase tracking-wider">Phase 02</span>
                </div>
                <h4 className="text-base sm:text-lg font-bold text-slate-900 mb-2">Consolidation &amp; Entités</h4>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Officialisation légale de la structure associative et scellage des partenariats techniques avec d&apos;autres entités afin de démultiplier les ressources numériques.
                </p>
              </div>

              {/* Phase 3 */}
              <div className="relative p-6 rounded-xl border border-slate-200 border-l-4 border-l-amber-500 bg-slate-50 shadow-2xs hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">Phase 03</span>
                </div>
                <h4 className="text-base sm:text-lg font-bold text-slate-900 mb-2">Lactivation Pédagogique</h4>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Lancement officiel des premières cohortes et parcours de formation (technique informatique, bureautique, anglais), en appliquant notre principe de parité financière.
                </p>
              </div>

              {/* Phase 4 */}
              <div className="relative p-6 rounded-xl border border-slate-200 border-l-4 border-l-brand-green bg-slate-50 shadow-2xs hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-brand-green uppercase tracking-wider">Phase 04</span>
                </div>
                <h4 className="text-base sm:text-lg font-bold text-slate-900 mb-2">Pôle &amp; Innovation IA</h4>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Déploiement d&apos;un véritable centre de recherche technologique : intelligence artificielle, développement de solutions d&apos;impact et opportunités d&apos;outsourcing.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA et Avertissement */}
        <section className="py-20 sm:py-28 px-4 sm:px-8 lg:px-16 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-brand-green/25 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-brand-turquoise/15 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="max-w-4xl mx-auto text-center space-y-12 relative z-10">
            <div className="space-y-4">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-brand-gold">Appel Aux Forces Vives</span>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Rejoignez l&apos;Idéologie BWTA</h2>
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Nous invitons tous ceux qui se reconnaissent dans notre mission à s&apos;engager : <strong className="text-white">professionnels du numérique</strong>, <strong className="text-white">formateurs experts</strong>, 
                <strong className="text-white"> passionnés d&apos;informatique</strong> et <strong className="text-white">entrepreneurs</strong>. En joignant nos forces et en nouant des partenariats stratégiques, nous bâtirons bien plus qu&apos;une école : un véritable moteur de développement technologique.
              </p>
            </div>
            
            <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-3xl p-6 sm:p-10 max-w-2xl mx-auto shadow-2xl text-left">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-700/80 pb-6 mb-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-brand-gold-light flex items-center gap-2.5">
                    <Target className="text-brand-gold shrink-0" size={26} /> 
                    <span>Candidature Fondatrice</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Pour intégrer le noyau fondateur et concevoir les futurs programmes de l&apos;association.
                  </p>
                </div>
                <span className="px-3 py-1.5 rounded-full bg-brand-green/30 border border-emerald-500/40 text-emerald-300 font-extrabold text-xs shrink-0">
                  Sélection : 15 Retenus
                </span>
              </div>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                Pour garantir l&apos;excellence opérationnelle de notre lancement, ce premier appel sélectionnera <strong className="text-white bg-brand-gold/30 px-1.5 py-0.5 rounded">15 membres fondateurs</strong>. Les autres postulants resteront enregistrés en priorité pour les étapes suivantes d&apos;adhésion générale et la participation à nos projets.
              </p>
              
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-slate-300 text-xs sm:text-sm">
                <li className="flex items-center gap-2.5 bg-slate-900/50 p-3 rounded-xl border border-slate-800/80">
                  <CheckCircle2 className="text-brand-turquoise shrink-0" size={18} /> 
                  <span>Partage de l&apos;idéologie solidaire</span>
                </li>
                <li className="flex items-center gap-2.5 bg-slate-900/50 p-3 rounded-xl border border-slate-800/80">
                  <CheckCircle2 className="text-brand-turquoise shrink-0" size={18} /> 
                  <span>Volonté de transmission ou d&apos;impact</span>
                </li>
                <li className="flex items-center gap-2.5 bg-slate-900/50 p-3 rounded-xl border border-slate-800/80">
                  <CheckCircle2 className="text-brand-turquoise shrink-0" size={18} /> 
                  <span>Ouverture aux synergies &amp; partenariats</span>
                </li>
                <li className="flex items-center gap-2.5 bg-slate-900/50 p-3 rounded-xl border border-slate-800/80">
                  <CheckCircle2 className="text-brand-turquoise shrink-0" size={18} /> 
                  <span>Vision technologique à long terme</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 flex justify-center">
              <Link 
                href="/rejoindre" 
                className="w-full sm:w-auto text-center inline-flex items-center justify-center gap-3 bg-brand-gold hover:bg-brand-gold-light text-slate-950 font-extrabold text-lg sm:text-xl py-4 px-10 rounded-full transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
              >
                Postuler dès maintenant
                <ArrowRight size={24} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 px-4 sm:px-8 text-center border-t border-slate-900">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="space-y-1">
            <h4 className="text-xl font-bold text-white tracking-tight">Blessed Wing Tech Academy <small className="text-xs text-brand-turquoise uppercase ml-2 font-semibold">BWTA</small></h4>
            <p className="text-sm text-slate-400 font-medium">(local Campus AEM) Lajeune, Département du Nord, Haïti &bull; Initiative associative sous l&apos;égide de BWT</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs sm:text-sm font-medium pt-2">
            <a href="mailto:contact@bittonik.com" className="hover:text-brand-turquoise transition-colors">contact@bittonik.com</a>
            <span className="text-slate-700 hidden sm:inline">&bull;</span>
            <span className="text-slate-400">+509 4057 6045 &nbsp;|&nbsp; +509 4836 5101</span>
            <span className="text-slate-700 hidden sm:inline">&bull;</span>
            <a href="https://bwt.bittonik.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-colors">bwt.bittonik.com</a>
            <span className="text-slate-700 hidden sm:inline">&bull;</span>
            <Link href="/admin/login" className="inline-flex items-center gap-1 text-emerald-400 hover:text-brand-gold transition-colors font-bold">
              <span>🔐 Espace Bureau &amp; Connexion</span>
            </Link>
          </div>
          <div className="pt-8 text-xs text-slate-600 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>&copy; {new Date().getFullYear()} BWT - Blessed Wing Technology &amp; BWTA. Tous droits réservés.</span>
            <Link href="/admin/login" className="text-[11px] text-slate-500 hover:text-emerald-400 transition-colors">
              Accès Membres du Conseil &amp; Secrétariat &rarr;
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
