import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { NewsItem } from "@/types";
import { Button } from "@/components/ui/button";
import NewsCard from "@/components/news/NewsCard";
import { ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const NewsSection = () => {
  const { t } = useTranslation();
  
  const { data: newsItems, isLoading } = useQuery<NewsItem[]>({
    queryKey: ['/api/news?limit=3'],
  });

  return (
    <section id="news" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-primary mb-4">{t('news.title')}</h2>
          <div className="w-20 h-1 bg-[#2c9c6a] mx-auto mb-6"></div>
          <p className="max-w-3xl mx-auto text-lg text-neutral">{t('news.description')}</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            // Loading state
            [...Array(3)].map((_, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <Skeleton className="w-full h-48" />
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-7 w-full mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-4" />
                  <Skeleton className="h-6 w-32" />
                </div>
              </div>
            ))
          ) : newsItems && newsItems.length > 0 ? (
            // Loaded news items
            newsItems.map((newsItem) => (
              <NewsCard key={newsItem.id} newsItem={newsItem} />
            ))
          ) : (
            // Fallback for no news items
            <div className="col-span-3 text-center py-8 text-neutral">
              No news items available at the moment.
            </div>
          )}
        </div>
        
        <div className="text-center mt-12">
          <Link href="/news">
            <Button className="bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-md transition duration-300 inline-flex items-center">
              {t('news.viewAll')} <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
