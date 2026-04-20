import { useTranslation } from "react-i18next";
import Layout from "@/components/layout/Layout";
import { Helmet } from "react-helmet";
import PageHeader from "@/components/layout/PageHeader";
import { MapPin, Calendar } from "lucide-react";

const ProjectsPage = () => {
  const { t } = useTranslation();

  const projectCategories = [
    {
      id: 'infrastructure',
      title: t('projects.infrastructure.title'),
      projects: [
        {
          id: 1,
          title: t('projects.infrastructure.project1.title'),
          description: t('projects.infrastructure.project1.description'),
          date: t('projects.infrastructure.project1.date'),
          location: t('projects.infrastructure.project1.location'),
          image: "https://citadelle.inchtechs.com/uploads/images/1747202957432-image-fx--12-.jpg"
        },
        {
          id: 2,
          title: t('projects.infrastructure.project2.title'),
          description: t('projects.infrastructure.project2.description'),
          date: t('projects.infrastructure.project2.date'),
          location: t('projects.infrastructure.project2.location'),
          image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500"
        },
        {
          id: 3,
          title: "Rénovation du réseau routier de Douala",
          description: "Réhabilitation complète de 45 km de voiries urbaines à Douala, incluant le drainage, l'éclairage public et la signalisation routière.",
          date: "2017-2019",
          location: "Douala, Cameroun",
          image: "https://groupelacitadelle-sa.com/uploads/images/1748355698957-image-fx--1-.jpg"
        }
      ]
    },
    {
      id: 'buildings',
      title: t('projects.buildings.title'),
      projects: [
        {
          id: 4,
          title: t('projects.buildings.project1.title'),
          description: t('projects.buildings.project1.description'),
          date: t('projects.buildings.project1.date'),
          location: t('projects.buildings.project1.location'),
          image: "https://groupelacitadelle-sa.com/uploads/images/1747880737686-image3.png"
        },
        {
          id: 5,
          title: t('projects.buildings.project2.title'),
          description: t('projects.buildings.project2.description'),
          date: t('projects.buildings.project2.date'),
          location: t('projects.buildings.project2.location'),
          image: "https://groupelacitadelle-sa.com/uploads/images/1748355878488-image-fx--5-.jpg"
        },
        {
          id: 6,
          title: "Construction de l'École Polytechnique de Maroua",
          description: "Conception et construction d'un campus universitaire technique comprenant des salles de cours, des laboratoires, et des résidences étudiantes.",
          date: "2018-2021",
          location: "Maroua, Cameroun",
          image: "https://groupelacitadelle-sa.com/uploads/images/1748355705980-image-fx--2-.jpg"
        }
      ]
    },
    {
      id: 'energy',
      title: t('projects.energy.title'),
      projects: [
        {
          id: 7,
          title: t('projects.energy.project1.title'),
          description: t('projects.energy.project1.description'),
          date: t('projects.energy.project1.date'),
          location: t('projects.energy.project1.location'),
          image: "https://citadelle.inchtechs.com/uploads/images/1747880744107-image4.jpg"
        }
      ]
    },
    {
      id: 'international',
      title: "Projets Internationaux",
      projects: [
        {
          id: 7,
          title: "Traitement des berges à Brazzaville",
          description: "Projet de stabilisation des berges et travaux d'assainissement dans des zones à risques d'inondation à Brazzaville.",
          date: "2016-2018",
          location: "Brazzaville, République du Congo",
          image: "https://groupelacitadelle-sa.com/uploads/images/1748355716376-image-fx--3-.jpg"
        },
        {
          id: 8,
          title: "Centre administratif de N'Djamena",
          description: "Construction d'un complexe administratif moderne pour les services gouvernementaux tchadiens.",
          date: "2019-2022",
          location: "N'Djamena, Tchad",
          image: "https://groupelacitadelle-sa.com/uploads/images/1748355724144-image-fx--4-.jpg"
        }
      ]
    }
  ];

  return (
    <Layout>
      <Helmet>
        <title>{t('projects.title')} | Groupe La Citadelle S.A.</title>
        <meta 
          name="description" 
          content={t('projects.description')} 
        />
        <meta property="og:title" content={`${t('projects.title')} | Groupe La Citadelle S.A.`} />
        <meta property="og:description" content={t('projects.description')} />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Page Header */}
      <PageHeader
        title={t('projects.title')}
        subtitle={t('projects.description')}
        backgroundImage="https://images.unsplash.com/photo-1609034545675-5c936fa5e1e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=800"
      />

      {/* Projects List */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="space-y-16">
            {projectCategories.map((category) => (
              <div key={category.id} id={category.id}>
                <h2 className="text-3xl font-bold text-primary mb-8">{category.title}</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {category.projects.map((project) => (
                    <div key={project.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                      <img 
                        src={project.image}
                        alt={project.title}
                        className="w-full h-56 object-cover"
                      />
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-primary mb-3">{project.title}</h3>
                        <p className="text-neutral mb-4">{project.description}</p>
                        <div className="flex flex-wrap items-center text-sm text-neutral gap-4">
                          <span className="flex items-center">
                            <Calendar className="mr-1 text-[#2c9c6a] h-4 w-4" />
                            {project.date}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="mr-1 text-[#2c9c6a] h-4 w-4" />
                            {project.location}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievement Stats */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-primary mb-12 text-center">Nos Chiffres Clés</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-4xl font-bold text-primary mb-2">120+ km</div>
              <p className="text-neutral">de routes construites</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-4xl font-bold text-primary mb-2">25+</div>
              <p className="text-neutral">bâtiments livrés</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-4xl font-bold text-primary mb-2">4</div>
              <p className="text-neutral">pays d'intervention</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-4xl font-bold text-primary mb-2">18</div>
              <p className="text-neutral">ans d'expertise</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-primary mb-12 text-center">Ce que disent nos clients</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <p className="text-neutral italic mb-6">
                "Le Groupe La Citadelle a démontré un professionnalisme et une expertise technique remarquables dans la réalisation de nos projets d'infrastructure. Leur capacité à respecter les délais et les budgets, même dans des contextes complexes, mérite d'être soulignée."
              </p>
              <div className="flex items-center">
                <div className="mr-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                    MT
                  </div>
                </div>
                <div>
                  <h4 className="font-bold">Ministère des Travaux Publics</h4>
                  <p className="text-sm text-neutral">Direction des Infrastructures Routières</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <p className="text-neutral italic mb-6">
                "Nous avons particulièrement apprécié la réactivité des équipes de La Citadelle et leur capacité à proposer des solutions innovantes face aux défis techniques rencontrés lors de la construction de notre centre administratif."
              </p>
              <div className="flex items-center">
                <div className="mr-4">
                  <div className="w-12 h-12 bg-[#2c9c6a] rounded-full flex items-center justify-center text-white font-bold">
                    ML
                  </div>
                </div>
                <div>
                  <h4 className="font-bold">Mairie de Limbé</h4>
                  <p className="text-sm text-neutral">Service des Grands Projets</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProjectsPage;
