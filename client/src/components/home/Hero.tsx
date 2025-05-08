import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section className="relative bg-primary text-white">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 z-10"></div>
      
      {/* Background Image */}
      <div 
        className="relative h-[600px] bg-cover bg-center z-0" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')" }}
      >
        <div className="container mx-auto px-4 h-full flex items-center z-20 relative">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">{t('home.hero.title')}</h1>
            <h2 className="text-xl md:text-2xl lg:text-3xl mb-8">{t('home.hero.subtitle')}</h2>
            <p className="text-lg mb-10 max-w-2xl">{t('home.hero.description')}</p>
            <div className="flex flex-wrap gap-4">
              <Link href="/services">
                <Button className="bg-[#2c9c6a] hover:bg-[#2c9c6a]/90 text-white font-medium text-base py-3 px-6 rounded-md transition duration-300">
                  {t('home.hero.services')}
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="bg-white hover:bg-gray-100 text-primary font-medium text-base py-3 px-6 rounded-md transition duration-300">
                  {t('home.hero.contact')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
