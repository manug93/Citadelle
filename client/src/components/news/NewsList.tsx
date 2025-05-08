import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { NewsItem } from "@/types";
import NewsCard from "./NewsCard";
import { Skeleton } from "@/components/ui/skeleton";

const NewsList = () => {
  const { t } = useTranslation();
  
  const { data: newsItems, isLoading, error } = useQuery<NewsItem[]>({
    queryKey: ['/api/news'],
  });

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, index) => (
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
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-8 bg-red-50 text-red-500 rounded-lg">
        <p>{error.message || 'Error loading news items'}</p>
      </div>
    );
  }

  if (!newsItems || newsItems.length === 0) {
    return (
      <div className="flex justify-center items-center p-8 bg-gray-50 text-neutral rounded-lg">
        <p>No news items available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {newsItems.map((newsItem) => (
        <NewsCard key={newsItem.id} newsItem={newsItem} />
      ))}
    </div>
  );
};

export default NewsList;
