import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import Layout from "@/components/layout/Layout";
import { Helmet } from "react-helmet";
import { format } from "date-fns";
import { fr, enUS, zhCN } from "date-fns/locale";
import { useLanguage } from "@/contexts/LanguageContext";
import { NewsItem } from "@/types";
import { ChevronLeft, Calendar, User, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const NewsDetailPage = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { id } = useParams();
  
  // Set locale based on current language
  const locales = {
    fr: fr,
    en: enUS,
    zh: zhCN
  };
  
  const dateLocale = locales[language as keyof typeof locales];

  const { data: newsItem, isLoading, error } = useQuery<NewsItem>({
    queryKey: [`/api/news/${id}`],
  });

  // Fetch all news for related articles section
  const { data: allNews, isLoading: isLoadingAllNews } = useQuery<NewsItem[]>({
    queryKey: ['/api/news'],
    enabled: !!newsItem, // Only fetch related articles when current article is loaded
  });

  // Filter related news by same category, excluding current article
  const relatedNews = allNews
    ? allNews
        .filter(item => item.category === newsItem?.category && item.id !== newsItem?.id)
        .slice(0, 3) // Limit to 3 articles
    : [];

  // Format the date if newsItem exists
  const formattedDate = newsItem?.date 
    ? format(new Date(newsItem.date), 'PPP', { locale: dateLocale })
    : '';
    
  // Format date for article card
  const formatArticleDate = (date: string) => {
    return format(new Date(date), 'PP', { locale: dateLocale });
  };

  // Map category to translation key
  const getCategoryTranslation = (category: string) => {
    const categoryMap: Record<string, string> = {
      'partnership': 'news.category.partnership',
      'achievement': 'news.category.achievement',
      'expansion': 'news.category.expansion'
    };
    
    return categoryMap[category.toLowerCase()] 
      ? t(categoryMap[category.toLowerCase()]) 
      : category;
  };

  return (
    <Layout>
      <Helmet>
        <title>{newsItem?.title || t('news.title')} | Groupe La Citadelle S.A.</title>
        <meta 
          name="description" 
          content={newsItem?.summary || t('news.description')} 
        />
        <meta property="og:title" content={`${newsItem?.title || t('news.title')} | Groupe La Citadelle S.A.`} />
        <meta property="og:description" content={newsItem?.summary || t('news.description')} />
        <meta property="og:type" content="article" />
        {newsItem?.imageUrl && <meta property="og:image" content={newsItem.imageUrl} />}
      </Helmet>

      {isLoading ? (
        <div className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Skeleton className="h-8 w-64 mb-4" />
              <Skeleton className="h-6 w-full mb-6" />
              <Skeleton className="h-80 w-full mb-8 rounded-lg" />
              <div className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-2/3" />
              </div>
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="py-16 bg-white">
          <div className="container mx-auto px-4 text-center">
            <div className="p-8 bg-red-50 text-red-500 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Error Loading News</h2>
              <p>{error.message}</p>
              <Link href="/news">
                <a className="inline-block mt-6 text-primary hover:text-primary/90">
                  <ChevronLeft className="inline-block mr-2 h-5 w-5" />
                  Back to News
                </a>
              </Link>
            </div>
          </div>
        </div>
      ) : newsItem ? (
        <>
          {/* Hero Section with Image */}
          <section className="relative bg-primary text-white">
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center" 
              style={{ backgroundImage: `url('${newsItem.imageUrl}')` }}
            ></div>
            
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/50"></div>
            
            {/* Content - Outside of the background elements with higher z-index */}
            <div className="relative z-20 h-[400px]">
              <div className="container mx-auto px-4 h-full flex items-center">
                <div className="max-w-3xl">
                  <span className="inline-block px-3 py-1 bg-[#2c9c6a] text-white rounded-full text-sm font-medium mb-4">
                    {getCategoryTranslation(newsItem.category)}
                  </span>
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">{newsItem.title}</h1>
                  <div className="flex items-center text-white/90 text-sm">
                    <div className="flex items-center mr-6">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formattedDate}
                    </div>
                    {newsItem.author && (
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        {newsItem.author}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* News Content */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                  <Link href="/news">
                    <a className="inline-flex items-center text-primary hover:text-[#2c9c6a] transition duration-200">
                      <ChevronLeft className="h-5 w-5 mr-2" />
                      {t('news.viewAll')}
                    </a>
                  </Link>
                </div>

                {newsItem.summary && (
                  <div className="text-xl text-neutral font-medium mb-8 p-6 bg-gray-50 rounded-lg border-l-4 border-primary">
                    {newsItem.summary}
                  </div>
                )}

                <div className="prose max-w-none text-neutral">
                  {newsItem.content.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>

                {/* Social sharing */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-bold text-primary mb-4">Partager cet article</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                      </svg>
                    </a>
                    <a href="#" className="p-2 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                      </svg>
                    </a>
                    <a href="#" className="p-2 bg-blue-800 text-white rounded-full hover:bg-blue-900 transition">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Related News */}
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-primary mb-10 text-center">Articles Associés</h2>
              
              {isLoadingAllNews ? (
                <div className="grid md:grid-cols-3 gap-8">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <div className="p-6">
                        <Skeleton className="h-5 w-20 mb-3" />
                        <Skeleton className="h-6 w-48 mb-3" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-4/5 mb-4" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : relatedNews.length > 0 ? (
                <div className="grid md:grid-cols-3 gap-8">
                  {relatedNews.map((article) => (
                    <div key={article.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                      {article.imageUrl && (
                        <div 
                          className="h-40 bg-cover bg-center" 
                          style={{ backgroundImage: `url('${article.imageUrl}')` }}
                        ></div>
                      )}
                      <div className="p-6">
                        <span className="inline-block text-xs font-medium text-white bg-primary rounded-full px-3 py-1 mb-3">
                          {getCategoryTranslation(article.category)}
                        </span>
                        <h3 className="text-xl font-bold text-primary mb-2 line-clamp-2">{article.title}</h3>
                        <div className="flex items-center text-gray-500 text-sm mb-3">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatArticleDate(article.date)}
                        </div>
                        <p className="text-neutral mb-4 line-clamp-2">{article.summary}</p>
                        <Link href={`/news/${article.id}`}>
                          <a className="inline-flex items-center text-primary font-medium hover:text-[#2c9c6a] transition duration-200">
                            {t('news.readMore')}
                            <ArrowRight className="h-4 w-4 ml-1" />
                          </a>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 px-4">
                  <p className="text-gray-600 mb-4">Aucun article associé trouvé dans la catégorie <strong>{getCategoryTranslation(newsItem.category)}</strong>.</p>
                  <Link href="/news">
                    <a className="inline-flex items-center text-primary hover:text-[#2c9c6a] transition duration-200">
                      <ChevronLeft className="h-5 w-5 mr-2" />
                      {t('news.viewAll')}
                    </a>
                  </Link>
                </div>
              )}
            </div>
          </section>
        </>
      ) : (
        <div className="py-16 bg-white">
          <div className="container mx-auto px-4 text-center">
            <div className="p-8 bg-gray-50 text-neutral rounded-lg">
              <h2 className="text-2xl font-bold mb-4">News Not Found</h2>
              <p>The requested news article could not be found.</p>
              <Link href="/news">
                <a className="inline-block mt-6 text-primary hover:text-primary/90">
                  <ChevronLeft className="inline-block mr-2 h-5 w-5" />
                  Back to News
                </a>
              </Link>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default NewsDetailPage;
