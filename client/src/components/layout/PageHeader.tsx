import { motion } from "framer-motion";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}

const PageHeader = ({ 
  title, 
  subtitle, 
  backgroundImage = "https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=600&q=80" 
}: PageHeaderProps) => {
  return (
    <section className="relative bg-primary text-white">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      />
      
      {/* Dark overlay - behind the text now (z-10) */}
      <div className="absolute inset-0 bg-black/60 z-10"></div>
      
      {/* Content - highest z-index (z-20) */}
      <div className="relative h-[300px] z-20">
        <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center">
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white drop-shadow-md text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {title}
          </motion.h1>
          
          {subtitle && (
            <motion.p 
              className="text-xl max-w-2xl text-white/90 text-center drop-shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      </div>
    </section>
  );
};

export default PageHeader;