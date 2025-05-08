import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section className="relative bg-primary text-white">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')" }}
      />
      
      {/* Dark overlay - behind the text now (z-10) */}
      <div className="absolute inset-0 bg-black/60 z-10"></div>
      
      {/* Content - highest z-index (z-20) */}
      <div className="relative h-[600px] z-20">
        <div className="container mx-auto px-4 h-full flex items-center">
          <motion.div 
            className="max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white drop-shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {t('home.hero.title')}
            </motion.h1>
            
            <motion.h2 
              className="text-xl md:text-2xl lg:text-3xl mb-8 text-white/90 drop-shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {t('home.hero.subtitle')}
            </motion.h2>
            
            <motion.p 
              className="text-lg mb-10 max-w-2xl text-white/80 drop-shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              {t('home.hero.description')}
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <Link href="/services">
                <Button className="bg-[#2c9c6a] hover:bg-[#2c9c6a]/90 text-white font-medium text-base py-3 px-6 rounded-md transition duration-300 shadow-lg hover:shadow-xl">
                  {t('home.hero.services')}
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="bg-white hover:bg-gray-100 text-primary font-medium text-base py-3 px-6 rounded-md transition duration-300 shadow-lg hover:shadow-xl">
                  {t('home.hero.contact')}
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
