import { useTranslation } from "react-i18next";
import Layout from "@/components/layout/Layout";
import { Helmet } from "react-helmet";
import { Building, Globe, Check } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";

const AboutPage = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      <Helmet>
        <title>{t('about.title')} | Groupe La Citadelle S.A.</title>
        <meta 
          name="description" 
          content={t('about.description')} 
        />
        <meta property="og:title" content={`${t('about.title')} | Groupe La Citadelle S.A.`} />
        <meta property="og:description" content={t('about.description')} />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Page Header */}
      <PageHeader
        title={t('about.title')}
        subtitle={t('about.description')}
        backgroundImage="https://images.unsplash.com/photo-1543286386-713bdd548da4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=800"
      />

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-start mb-16">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-6">Notre Histoire</h2>
              <div className="prose max-w-none text-neutral">
                <p className="mb-4">{t('about.history.paragraph1')}</p>
                <p className="mb-4">{t('about.history.paragraph2')}</p>
                <p>{t('about.history.paragraph3')}</p>
              </div>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1444145925002-a0970422cee3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500" 
                alt="Corporate headquarters" 
                className="w-full h-auto rounded-lg shadow-md"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-2xl font-bold text-primary mb-4">{t('about.vision.title')}</h3>
              <p className="text-lg mb-6">{t('about.vision.description')}</p>
              <div className="flex items-center bg-primary text-white p-4 rounded-lg">
                <Building className="h-8 w-8 mr-4" />
                <div>
                  <h4 className="font-bold text-lg">Depuis 2003</h4>
                  <p className="text-sm">Expertise confirmée</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-2xl font-bold text-primary mb-4">{t('about.mission.title')}</h3>
              <p className="text-lg mb-6">{t('about.mission.description')}</p>
              <div className="flex items-center bg-[#2c9c6a] text-white p-4 rounded-lg">
                <Globe className="h-8 w-8 mr-4" />
                <div>
                  <h4 className="font-bold text-lg">Panafricain</h4>
                  <p className="text-sm">Présence régionale</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-primary mb-8">{t('about.info.title')}</h2>
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

          <div className="mt-16">
            <h2 className="text-3xl font-bold text-primary mb-8">Valeurs et Engagement</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold text-primary mb-4">Excellence</h3>
                <p className="mb-4">Nous nous engageons à fournir des services de la plus haute qualité, en respectant les normes internationales et en visant constamment l'amélioration continue.</p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="text-[#2c9c6a] h-5 w-5 mt-1 mr-2" />
                    <span>Standards de qualité rigoureux</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-[#2c9c6a] h-5 w-5 mt-1 mr-2" />
                    <span>Innovation technique constante</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold text-primary mb-4">Intégrité</h3>
                <p className="mb-4">Notre réputation repose sur l'honnêteté, la transparence et le respect des engagements pris envers nos clients, partenaires et collaborateurs.</p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="text-[#2c9c6a] h-5 w-5 mt-1 mr-2" />
                    <span>Éthique professionnelle</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-[#2c9c6a] h-5 w-5 mt-1 mr-2" />
                    <span>Transparence dans nos activités</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold text-primary mb-4">Responsabilité</h3>
                <p className="mb-4">Nous assumons pleinement la responsabilité de nos actions et de leur impact sur les communautés, l'environnement et le développement durable.</p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="text-[#2c9c6a] h-5 w-5 mt-1 mr-2" />
                    <span>Engagement environnemental</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-[#2c9c6a] h-5 w-5 mt-1 mr-2" />
                    <span>Développement communautaire</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutPage;
