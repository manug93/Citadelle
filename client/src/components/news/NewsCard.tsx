import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { NewsItem } from "@/types";
import { ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr, enUS, zhCN } from "date-fns/locale";
import { useLanguage } from "@/contexts/LanguageContext";

interface NewsCardProps {
  newsItem: NewsItem;
}

const NewsCard = ({ newsItem }: NewsCardProps) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  
  // Set locale based on current language
  const locales = {
    fr: fr,
    en: enUS,
    zh: zhCN
  };
  
  const dateLocale = locales[language as keyof typeof locales];

  // Format the date
  const formattedDate = formatDistanceToNow(new Date(newsItem.date), { 
    addSuffix: true,
    locale: dateLocale
  });

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
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <img 
        src={newsItem.imageUrl} 
        alt={newsItem.title} 
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-medium text-white bg-primary rounded-full px-3 py-1">
            {getCategoryTranslation(newsItem.category)}
          </span>
          <span className="text-xs text-neutral">{formattedDate}</span>
        </div>
        <h3 className="text-xl font-bold text-primary mb-3">{newsItem.title}</h3>
        <p className="text-neutral mb-4">{newsItem.summary || newsItem.content.substring(0, 120) + '...'}</p>
        <Link href={`/news/${newsItem.id}`}>
          <a className="text-primary font-medium hover:text-[#2c9c6a] transition duration-200 inline-flex items-center">
            {t('news.readMore')} <ChevronRight className="ml-1 h-4 w-4" />
          </a>
        </Link>
      </div>
    </div>
  );
};

export default NewsCard;
