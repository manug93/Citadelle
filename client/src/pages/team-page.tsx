import { useTranslation } from "react-i18next";
import Layout from "@/components/layout/Layout";
import { Helmet } from "react-helmet";
import PageHeader from "@/components/layout/PageHeader";
import { Linkedin, Mail, User2 } from "lucide-react";

const TeamPage = () => {
  const { t } = useTranslation();

  const executives = [
    {
      id: 1,
      name: t('team.member1.name'),
      position: t('team.member1.position'),
      expertise: t('team.member1.expertise'),
      bio: t('team.member1.bio')
    },
    {
      id: 2,
      name: t('team.member2.name'),
      position: t('team.member2.position'),
      expertise: t('team.member2.expertise'),
      bio: t('team.member2.bio')
    }
  ];

  const directors = [
    {
      id: 3,
      name: t('team.member3.name'),
      position: t('team.member3.position'),
      expertise: t('team.member3.expertise'),
      bio: t('team.member3.bio')
    },
    {
      id: 4,
      name: t('team.member4.name'),
      position: t('team.member4.position'),
      expertise: t('team.member4.expertise'),
      bio: t('team.member4.bio')
    },
    {
      id: 5,
      name: t('team.member5.name'),
      position: t('team.member5.position'),
      expertise: t('team.member5.expertise'),
      bio: t('team.member5.bio')
    },
    {
      id: 6,
      name: t('team.member6.name'),
      position: t('team.member6.position'),
      expertise: t('team.member6.expertise'),
      bio: t('team.member6.bio')
    }
  ];

  const specialists = [
    {
      id: 7,
      name: "Jean-Pierre MBARGA",
      position: "Ingénieur en Chef BTP",
      expertise: "Génie civil et ouvrages d'art",
      bio: "Plus de 15 ans d'expérience dans la conception et la réalisation d'infrastructures complexes au Cameroun et en Afrique centrale."
    },
    {
      id: 8,
      name: "Sandrine ETOA",
      position: "Responsable Marchés Publics",
      expertise: "Procédures de marchés et appels d'offres",
      bio: "Spécialiste des procédures de passation des marchés publics et du montage de dossiers techniques et administratifs."
    },
    {
      id: 9,
      name: "Robert DIKONGUE",
      position: "Chef de Projets Immobiliers",
      expertise: "Promotion immobilière et aménagement",
      bio: "Expert en management de projets immobiliers résidentiels à grande échelle et coordination des intervenants."
    }
  ];

  return (
    <Layout>
      <Helmet>
        <title>{t('team.title')} | Groupe La Citadelle S.A.</title>
        <meta 
          name="description" 
          content={t('team.description')} 
        />
        <meta property="og:title" content={`${t('team.title')} | Groupe La Citadelle S.A.`} />
        <meta property="og:description" content={t('team.description')} />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Page Header */}
      <PageHeader
        title={t('team.title')}
        subtitle={t('team.description')}
        backgroundImage="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=800"
      />

      {/* Organization Info */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-primary mb-4">Notre Organisation</h2>
            <div className="w-20 h-1 bg-[#2c9c6a] mx-auto mb-6"></div>
            <p className="max-w-3xl mx-auto text-lg text-neutral">
              La gouvernance du Groupe La Citadelle repose sur une structure organisationnelle efficace et équilibrée, conçue pour répondre aux défis complexes de nos secteurs d'activité.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm text-center">
              <div className="h-16 w-16 rounded-full bg-primary mx-auto mb-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Conseil d'Administration</h3>
              <p className="text-neutral">
                Organe décisionnel suprême composé de membres expérimentés qui définissent la stratégie à long terme et supervisent la performance globale de l'entreprise.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm text-center">
              <div className="h-16 w-16 rounded-full bg-primary mx-auto mb-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Direction Générale</h3>
              <p className="text-neutral">
                Équipe executive chargée de mettre en œuvre la vision stratégique, de gérer les opérations quotidiennes et d'assurer la coordination entre les différentes directions.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm text-center">
              <div className="h-16 w-16 rounded-full bg-primary mx-auto mb-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Directions Spécialisées</h3>
              <p className="text-neutral">
                Les directions techniques, financières et administratives assurent l'expertise fonctionnelle et opérationnelle nécessaire à la réalisation des projets et à la gestion de l'entreprise.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Executive Team */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-primary mb-12 text-center">Direction Générale</h2>
          <div className="grid md:grid-cols-2 gap-10">
            {executives.map((member) => (
              <div key={member.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
                <div className="md:w-1/3 p-6 flex justify-center items-center bg-primary/5">
                  <div className="h-36 w-36 rounded-full bg-gray-50 flex items-center justify-center">
                    <User2 className="h-24 w-24 text-primary/30" />
                  </div>
                </div>
                <div className="md:w-2/3 p-6">
                  <h3 className="text-xl font-bold text-primary mb-1">{member.name}</h3>
                  <p className="text-[#2c9c6a] font-medium mb-4">{member.position}</p>
                  <p className="text-neutral text-sm mb-4">{member.expertise}</p>
                  <p className="text-neutral text-sm mb-6">{member.bio}</p>
                  <div className="flex space-x-4">
                    <a href="#" className="text-primary hover:text-[#2c9c6a] transition duration-200">
                      <Linkedin className="h-5 w-5" />
                    </a>
                    <a href="#" className="text-primary hover:text-[#2c9c6a] transition duration-200">
                      <Mail className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Directors */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-primary mb-12 text-center">Directions Fonctionnelles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {directors.map((member) => (
              <div key={member.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="h-36 w-36 rounded-full bg-gray-50 mx-auto mb-6 flex items-center justify-center">
                    <User2 className="h-20 w-20 text-primary/30" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-primary mb-1">{member.name}</h3>
                    <p className="text-[#2c9c6a] font-medium mb-4">{member.position}</p>
                    <p className="text-neutral text-sm mb-4">{member.expertise}</p>
                    <p className="text-neutral text-sm mb-6">{member.bio}</p>
                    <div className="flex justify-center space-x-4">
                      <a href="#" className="text-primary hover:text-[#2c9c6a] transition duration-200">
                        <Linkedin className="h-5 w-5" />
                      </a>
                      <a href="#" className="text-primary hover:text-[#2c9c6a] transition duration-200">
                        <Mail className="h-5 w-5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialists */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-primary mb-12 text-center">Nos Experts</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {specialists.map((specialist) => (
              <div key={specialist.id} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 mr-4 flex items-center justify-center">
                    <User2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary">{specialist.name}</h3>
                    <p className="text-sm text-[#2c9c6a]">{specialist.position}</p>
                  </div>
                </div>
                <p className="text-neutral text-sm italic mb-3">{specialist.expertise}</p>
                <p className="text-neutral text-sm">{specialist.bio}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <p className="text-lg text-neutral max-w-3xl mx-auto mb-8">
              Nos équipes sont constituées de professionnels expérimentés et qualifiés, issus des meilleures écoles d'ingénieurs et de management, qui apportent leur expertise et leur engagement à chaque projet.
            </p>
            <a href="/contact" className="inline-block bg-primary hover:bg-primary/90 text-white font-medium py-3 px-8 rounded-md transition duration-300">
              Rejoindre notre équipe
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default TeamPage;
