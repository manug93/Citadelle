import { useTranslation } from "react-i18next";
import Layout from "@/components/layout/Layout";
import { Helmet } from "react-helmet";
import NewsList from "@/components/news/NewsList";

const NewsPage = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      <Helmet>
        <title>{t('news.title')} | Groupe La Citadelle S.A.</title>
        <meta 
          name="description" 
          content={t('news.description')} 
        />
        <meta property="og:title" content={`${t('news.title')} | Groupe La Citadelle S.A.`} />
        <meta property="og:description" content={t('news.description')} />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-primary text-white">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <div 
          className="relative h-[300px] bg-cover bg-center z-0" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=800')" }}
        >
          <div className="container mx-auto px-4 h-full flex items-center z-20 relative">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('news.title')}</h1>
              <p className="text-lg max-w-2xl">{t('news.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* News Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filter Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm sticky top-24">
                <h3 className="text-xl font-bold text-primary mb-6">Catégories</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="cat-all" 
                      className="mr-3 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      defaultChecked
                    />
                    <label htmlFor="cat-all" className="text-neutral">Toutes les actualités</label>
                  </li>
                  <li className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="cat-partnership" 
                      className="mr-3 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="cat-partnership" className="text-neutral">{t('news.category.partnership')}</label>
                  </li>
                  <li className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="cat-achievement" 
                      className="mr-3 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="cat-achievement" className="text-neutral">{t('news.category.achievement')}</label>
                  </li>
                  <li className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="cat-expansion" 
                      className="mr-3 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="cat-expansion" className="text-neutral">{t('news.category.expansion')}</label>
                  </li>
                </ul>

                <div className="border-t border-gray-200 my-6 pt-6">
                  <h3 className="text-xl font-bold text-primary mb-6">Archives</h3>
                  <ul className="space-y-3">
                    <li>
                      <a href="#" className="text-primary hover:text-[#2c9c6a] transition duration-200">2023</a>
                    </li>
                    <li>
                      <a href="#" className="text-primary hover:text-[#2c9c6a] transition duration-200">2022</a>
                    </li>
                    <li>
                      <a href="#" className="text-primary hover:text-[#2c9c6a] transition duration-200">2021</a>
                    </li>
                    <li>
                      <a href="#" className="text-primary hover:text-[#2c9c6a] transition duration-200">2020</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* News List */}
            <div className="lg:col-span-3">
              <h2 className="text-3xl font-bold text-primary mb-8">Dernières Actualités</h2>
              <NewsList />
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-primary mb-4">Restez informé</h2>
            <p className="text-neutral mb-8">
              Inscrivez-vous à notre newsletter pour recevoir nos dernières actualités et informations sur nos projets.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Votre adresse email" 
                className="flex-grow px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <button type="submit" className="bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-md transition duration-300">
                S'inscrire
              </button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default NewsPage;
