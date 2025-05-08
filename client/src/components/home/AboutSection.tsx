import { useTranslation } from "react-i18next";
import { Building, Globe } from "lucide-react";

const AboutSection = () => {
  const { t } = useTranslation();

  return (
    <section id="about" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-primary mb-4">{t('about.title')}</h2>
          <div className="w-20 h-1 bg-[#2c9c6a] mx-auto mb-6"></div>
          <p className="max-w-3xl mx-auto text-lg text-neutral">{t('about.description')}</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-neutral">
              <p className="mb-4">{t('about.history.paragraph1')}</p>
              <p className="mb-4">{t('about.history.paragraph2')}</p>
              <p>{t('about.history.paragraph3')}</p>
            </div>
            
            <div className="mt-8 grid grid-cols-2 gap-6">
              <div className="bg-gray-50 p-5 rounded-lg">
                <h3 className="text-primary font-bold text-xl mb-3">{t('about.vision.title')}</h3>
                <p>{t('about.vision.description')}</p>
              </div>
              <div className="bg-gray-50 p-5 rounded-lg">
                <h3 className="text-primary font-bold text-xl mb-3">{t('about.mission.title')}</h3>
                <p>{t('about.mission.description')}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <img 
              src="https://images.unsplash.com/photo-1580983218765-f663bec07b37?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="L'équipe de La Citadelle en action" 
              className="w-full h-auto rounded-lg shadow-md mb-6"
            />
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary text-white p-4 rounded-lg flex items-center">
                <Building className="h-8 w-8 mr-4" />
                <div>
                  <h4 className="font-bold text-lg">Depuis 2005</h4>
                  <p className="text-sm">Expertise confirmée</p>
                </div>
              </div>
              <div className="bg-[#2c9c6a] text-white p-4 rounded-lg flex items-center">
                <Globe className="h-8 w-8 mr-4" />
                <div>
                  <h4 className="font-bold text-lg">Panafricain</h4>
                  <p className="text-sm">Présence régionale</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-primary mb-6">{t('about.info.title')}</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-50 p-5 rounded-lg shadow-sm">
              <h4 className="font-bold text-neutral mb-3">{t('about.info.name')}</h4>
              <p>{t('about.info.nameFull')}</p>
              <p className="mt-1 text-sm">{t('about.info.nameType')}</p>
            </div>
            <div className="bg-gray-50 p-5 rounded-lg shadow-sm">
              <h4 className="font-bold text-neutral mb-3">{t('about.info.foundation')}</h4>
              <p>{t('about.info.foundationDate')}</p>
              <p className="mt-1 text-sm">{t('about.info.transformation')}</p>
            </div>
            <div className="bg-gray-50 p-5 rounded-lg shadow-sm">
              <h4 className="font-bold text-neutral mb-3">{t('about.info.registration')}</h4>
              <p>{t('about.info.registrationNumber')}</p>
              <p className="mt-1 text-sm">{t('about.info.taxNumber')}</p>
            </div>
            <div className="bg-gray-50 p-5 rounded-lg shadow-sm">
              <h4 className="font-bold text-neutral mb-3">{t('about.info.area')}</h4>
              <p>{t('about.info.areaMain')}</p>
              <p className="mt-1 text-sm">{t('about.info.areaSecondary')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
