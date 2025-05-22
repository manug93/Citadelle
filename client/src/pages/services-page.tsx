import { useTranslation } from "react-i18next";
import Layout from "@/components/layout/Layout";
import { Helmet } from "react-helmet";
import PageHeader from "@/components/layout/PageHeader";
import { 
  TrafficCone, 
  Compass, 
  Building, 
  Shield, 
  Handshake,
  Check,
  ArrowRight
} from "lucide-react";

const ServicesPage = () => {
  const { t } = useTranslation();

  const services = [
    {
      id: 'infrastructure',
      icon: <TrafficCone className="h-12 w-12" />,
      title: t('services.infrastructure.title'),
      image: "https://citadelle.inchtechs.com/uploads/images/1747201895146-grue.jpg",
      items: t('services.infrastructure.items', { returnObjects: true }) as string[],
      description: "Notre pôle BTP rassemble une expertise de pointe dans la réalisation d'infrastructures de transport et de bâtiments techniques. Des études préalables à la maintenance, nous assurons une qualité d'exécution optimale pour chaque projet, en tenant compte des contraintes techniques, environnementales et budgétaires spécifiques."
    },
    {
      id: 'engineering',
      icon: <Compass className="h-12 w-12" />,
      title: t('services.engineering.title'),
      image: "https://citadelle.inchtechs.com/uploads/images/1747201914565-image-fx--2-.jpg",
      items: t('services.engineering.items', { returnObjects: true }) as string[],
      description: "Notre bureau d'études intégré apporte son expertise pluridisciplinaire à chaque phase de vos projets. De la conception initiale à la réalisation finale, nos ingénieurs et techniciens élaborent des solutions adaptées, innovantes et durables, en conformité avec les standards internationaux les plus exigeants."
    },
    {
      id: 'realestate',
      icon: <Building className="h-12 w-12" />,
      title: t('services.realestate.title'),
      image: "https://citadelle.inchtechs.com/uploads/images/1747884657480-imgg.png",
      items: t('services.realestate.items', { returnObjects: true }) as string[],
      description: "Notre division immobilière se spécialise dans le développement résidentiel à grande échelle, avec une attention particulière aux projets de logements sociaux et intermédiaires. À travers des partenariats stratégiques avec les acteurs institutionnels, nous concevons et réalisons des projets immobiliers qui répondent aux besoins des populations et des territoires."
    },
    {
      id: 'insurance',
      icon: <Shield className="h-12 w-12" />,
      title: t('services.insurance.title'),
      image: "https://citadelle.inchtechs.com/uploads/images/1747880724637-image1.png",
      items: t('services.insurance.items', { returnObjects: true }) as string[],
      description: "Nous proposons des solutions d'assurance sur mesure pour les grands comptes institutionnels et les organismes publics. Notre expertise dans ce domaine nous permet d'accompagner efficacement nos clients dans l'évaluation et la couverture de leurs risques spécifiques, tout en leur fournissant des équipements techniques de pointe."
    },
    {
      id: 'partnerships',
      icon: <Handshake className="h-12 w-12" />,
      title: t('services.partnerships.title'),
      image: "https://citadelle.inchtechs.com/uploads/images/1747880762891-image7.jpg",
      items: t('services.partnerships.items', { returnObjects: true }) as string[],
      description: "Le Groupe La Citadelle développe activement des partenariats stratégiques avec des acteurs nationaux et internationaux. Ces collaborations nous permettent d'élargir notre portefeuille d'activités et d'apporter à nos clients des solutions complètes dans des domaines techniques spécialisés et des secteurs stratégiques."
    }
  ];

  return (
    <Layout>
      <Helmet>
        <title>{t('services.title')} | Groupe La Citadelle S.A.</title>
        <meta 
          name="description" 
          content={t('services.description')} 
        />
        <meta property="og:title" content={`${t('services.title')} | Groupe La Citadelle S.A.`} />
        <meta property="og:description" content={t('services.description')} />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Page Header */}
      <PageHeader
        title={t('services.title')}
        subtitle={t('services.description')}
        backgroundImage="https://images.unsplash.com/photo-1607166452946-7a841c97d1f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=800"
      />

      {/* Services List */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="space-y-20">
            {services.map((service, index) => (
              <div 
                key={service.id} 
                id={service.id}
                className={`grid md:grid-cols-2 gap-10 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
              >
                <div className={`order-2 ${index % 2 === 1 ? 'md:order-1' : 'md:order-2'}`}>
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-auto rounded-lg shadow-md"
                  />
                </div>
                <div className={`order-1 ${index % 2 === 1 ? 'md:order-2' : 'md:order-1'}`}>
                  <div className="mb-6 flex items-center">
                    <div className="bg-primary p-4 rounded-full text-white mr-4">
                      {service.icon}
                    </div>
                    <h2 className="text-3xl font-bold text-primary">{service.title}</h2>
                  </div>
                  <p className="text-neutral mb-8">{service.description}</p>
                  <div className="bg-gray-50 p-6 rounded-lg mb-8">
                    <h3 className="text-xl font-bold text-primary mb-4">Nos prestations</h3>
                    <ul className="space-y-3">
                      {service.items.map((item, idx) => (
                        <li key={idx} className="flex items-start">
                          <Check className="text-[#2c9c6a] h-5 w-5 mt-1 mr-3 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <a href="#contact" className="text-primary font-medium hover:text-[#2c9c6a] transition duration-200 inline-flex items-center">
                    Contacter notre équipe <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary mb-6">Besoin d'une solution sur mesure?</h2>
          <p className="text-lg text-neutral max-w-3xl mx-auto mb-8">
            Nos équipes sont à votre disposition pour étudier vos besoins spécifiques et vous proposer des solutions adaptées à vos projets.
          </p>
          <a href="/contact" className="inline-block bg-primary hover:bg-primary/90 text-white font-medium py-3 px-8 rounded-md transition duration-300">
            Demander un devis
          </a>
        </div>
      </section>
    </Layout>
  );
};

export default ServicesPage;
