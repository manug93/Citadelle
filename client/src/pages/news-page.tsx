import { useTranslation } from "react-i18next";
import Layout from "@/components/layout/Layout";
import { Helmet } from "react-helmet";
import PageHeader from "@/components/layout/PageHeader";
import NewsList from "@/components/news/NewsList";
import { useState, useEffect } from "react";
import { Check, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { NewsItem } from "@/types";

const NewsPage = () => {
  const { t } = useTranslation();
  
  // State for category filters
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
  const [showAllCategories, setShowAllCategories] = useState(true);
  
  // State for year filter
  const [yearFilter, setYearFilter] = useState<number | undefined>(undefined);
  
  // Get all news to extract available years
  const { data: newsItems } = useQuery<NewsItem[]>({
    queryKey: ['/api/news'],
  });
  
  // Extract unique years from news items
  const availableYears = newsItems 
    ? [...new Set(newsItems.map(item => new Date(item.date).getFullYear()))]
        .sort((a, b) => b - a) // Sort in descending order (newest first)
    : [];
    
  // Handle checkbox change for category filters
  const handleCategoryChange = (category: string, checked: boolean) => {
    if (category === 'all') {
      setShowAllCategories(checked);
      if (checked) {
        setCategoryFilters([]);
      }
    } else {
      if (checked) {
        // Add the category to filters and uncheck "All" option
        setCategoryFilters(prev => [...prev, category]);
        setShowAllCategories(false);
      } else {
        // Remove the category from filters
        setCategoryFilters(prev => prev.filter(c => c !== category));
        // If no categories are selected, check "All" option
        if (categoryFilters.length === 1 && categoryFilters[0] === category) {
          setShowAllCategories(true);
        }
      }
    }
  };
  
  // Handle year filter change
  const handleYearClick = (year: number) => {
    if (yearFilter === year) {
      // If clicking on the already selected year, clear the filter
      setYearFilter(undefined);
    } else {
      // Otherwise, set the year filter
      setYearFilter(year);
    }
  };
  
  // Reset all filters
  const resetFilters = () => {
    setCategoryFilters([]);
    setShowAllCategories(true);
    setYearFilter(undefined);
  };
  
  // Get current year if none available
  const currentYear = new Date().getFullYear();
  const yearsToDisplay = availableYears.length > 0 ? availableYears : [currentYear, currentYear-1, currentYear-2, currentYear-3];

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

      {/* Page Header */}
      <PageHeader
        title={t('news.title')}
        subtitle={t('news.description')}
        backgroundImage="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=800"
      />

      {/* News Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filter Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm sticky top-24">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-primary">Filtres</h3>
                  <button 
                    onClick={resetFilters}
                    className="inline-flex items-center text-sm text-gray-600 hover:text-primary transition-colors"
                  >
                    <RefreshCw className="mr-1 h-3.5 w-3.5" /> Réinitialiser
                  </button>
                </div>
                
                <h4 className="font-semibold text-primary mb-3">Catégories</h4>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="cat-all" 
                      className="mr-3 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      checked={showAllCategories}
                      onChange={(e) => handleCategoryChange('all', e.target.checked)}
                    />
                    <label htmlFor="cat-all" className="text-neutral">Toutes les actualités</label>
                  </li>
                  <li className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="cat-partnership" 
                      className="mr-3 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      checked={categoryFilters.includes('partnership')}
                      onChange={(e) => handleCategoryChange('partnership', e.target.checked)}
                    />
                    <label htmlFor="cat-partnership" className="text-neutral">{t('news.category.partnership')}</label>
                  </li>
                  <li className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="cat-achievement" 
                      className="mr-3 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      checked={categoryFilters.includes('achievement')}
                      onChange={(e) => handleCategoryChange('achievement', e.target.checked)}
                    />
                    <label htmlFor="cat-achievement" className="text-neutral">{t('news.category.achievement')}</label>
                  </li>
                  <li className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="cat-expansion" 
                      className="mr-3 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      checked={categoryFilters.includes('expansion')}
                      onChange={(e) => handleCategoryChange('expansion', e.target.checked)}
                    />
                    <label htmlFor="cat-expansion" className="text-neutral">{t('news.category.expansion')}</label>
                  </li>
                </ul>

                <div className="border-t border-gray-200 my-6 pt-6">
                  <h4 className="font-semibold text-primary mb-3">Archives</h4>
                  <ul className="space-y-3">
                    {yearsToDisplay.map(year => (
                      <li key={year} className="flex items-center gap-2">
                        <button 
                          onClick={() => handleYearClick(year)}
                          className={`${
                            yearFilter === year 
                              ? 'bg-primary text-white' 
                              : 'text-primary hover:text-[#2c9c6a]'
                          } py-1 px-2 rounded transition duration-200 flex items-center w-full`}
                        >
                          {yearFilter === year && <Check className="h-3.5 w-3.5 mr-1.5" />}
                          {year}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Active filters display */}
                {(categoryFilters.length > 0 || yearFilter) && (
                  <div className="border-t border-gray-200 mt-6 pt-6">
                    <h4 className="font-semibold text-primary mb-3">Filtres actifs</h4>
                    <div className="flex flex-wrap gap-2">
                      {categoryFilters.map(category => (
                        <span key={category} className="inline-flex items-center bg-primary/10 text-primary text-sm px-2 py-1 rounded">
                          {t(`news.category.${category}`)}
                          <button 
                            onClick={() => handleCategoryChange(category, false)}
                            className="ml-1.5 text-primary/70 hover:text-primary"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                      {yearFilter && (
                        <span className="inline-flex items-center bg-primary/10 text-primary text-sm px-2 py-1 rounded">
                          {yearFilter}
                          <button 
                            onClick={() => setYearFilter(undefined)}
                            className="ml-1.5 text-primary/70 hover:text-primary"
                          >
                            ✕
                          </button>
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* News List */}
            <div className="lg:col-span-3">
              <h2 className="text-3xl font-bold text-primary mb-8">
                {showAllCategories ? 'Dernières Actualités' : 'Actualités Filtrées'}
              </h2>
              <NewsList 
                categoryFilters={categoryFilters} 
                yearFilter={yearFilter} 
              />
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
