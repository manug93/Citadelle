import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { 
  TrafficCone, 
  Compass, 
  Building, 
  Shield, 
  Handshake,
  Check,
  ChevronRight
} from "lucide-react";

const ServicesSection = () => {
  const { t } = useTranslation();

  const services = [
    {
      id: 'infrastructure',
      icon: <TrafficCone className="text-xl" />,
      title: t('services.infrastructure.title'),
      image: "https://citadelle.inchtechs.com/uploads/images/1747201895146-grue.jpg",
      items: t('services.infrastructure.items', { returnObjects: true }) as string[]
    },
    {
      id: 'engineering',
      icon: <Compass className="text-xl" />,
      title: t('services.engineering.title'),
      image: "https://citadelle.inchtechs.com/uploads/images/1747201914565-image-fx--2-.jpg",
      items: t('services.engineering.items', { returnObjects: true }) as string[]
    },
    {
      id: 'realestate',
      icon: <Building className="text-xl" />,
      title: t('services.realestate.title'),
      image: "https://citadelle.inchtechs.com/uploads/images/1747201924643-image-fx--4-.jpg",
      items: t('services.realestate.items', { returnObjects: true }) as string[]
    },
    {
      id: 'insurance',
      icon: <Shield className="text-xl" />,
      title: t('services.insurance.title'),
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      items: t('services.insurance.items', { returnObjects: true }) as string[]
    },
    {
      id: 'partnerships',
      icon: <Handshake className="text-xl" />,
      title: t('services.partnerships.title'),
      image: "https://citadelle.inchtechs.com/uploads/images/1747202219185-image-fx--9-.jpg",
      items: t('services.partnerships.items', { returnObjects: true }) as string[]
    }
  ];

  return (
    <section id="services" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-primary mb-4">{t('services.title')}</h2>
          <div className="w-20 h-1 bg-[#2c9c6a] mx-auto mb-6"></div>
          <p className="max-w-3xl mx-auto text-lg text-neutral">{t('services.description')}</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div 
              key={service.id}
              id={service.id}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105"
            >
              <img 
                src={service.image} 
                alt={service.title} 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-start mb-4">
                  <div className="bg-primary p-3 rounded-full text-white mr-4">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-primary">{service.title}</h3>
                </div>
                <ul className="space-y-2 text-neutral mb-6">
                  {service.items.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="text-[#2c9c6a] h-5 w-5 mt-1 mr-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href={`/services#${service.id}`}>
                  <a className="text-primary font-medium hover:text-[#2c9c6a] transition duration-200 inline-flex items-center">
                    {t('services.learnMore')} <ChevronRight className="h-4 w-4 ml-1" />
                  </a>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
