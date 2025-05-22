import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

interface PartnerLogo {
  id: number;
  name: string;
  logo: string;
  alt: string;
}

const PartnersSection: React.FC = () => {
  const { t } = useTranslation();
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };
  
  const partners: PartnerLogo[] = [
    {
      id: 1,
      name: "Port Autonome de Douala",
      logo: "/logos/port_douala.png",
      alt: "Logo Port Autonome de Douala"
    },
    {
      id: 2,
      name: "Matgenie",
      logo: "/logos/matgenie.png",
      alt: "Logo Matgenie"
    },
    {
      id: 3,
      name: "Barco Group",
      logo: "/logos/barco.png",
      alt: "Logo Barco Group"
    },
    {
      id: 4,
      name: "WOLF",
      logo: "/logos/wolf.png",
      alt: "Logo WOLF"
    },
    {
      id: 5,
      name: "J2L",
      logo: "/logos/j2l.png",
      alt: "Logo J2L"
    },
    {
      id: 6,
      name: "Synergie & Compétences",
      logo: "/logos/synergie.png",
      alt: "Logo Synergie & Compétences"
    },
    {
      id: 7,
      name: "LINKSYS",
      logo: "/logos/linksys.png",
      alt: "Logo LINKSYS"
    },
    {
      id: 8,
      name: "GMC",
      logo: "/logos/gmc.png",
      alt: "Logo GMC"
    },
    {
      id: 9,
      name: "BELINDO",
      logo: "/logos/belindo.png",
      alt: "Logo BELINDO"
    },
    {
      id: 10,
      name: "EMI",
      logo: "/logos/emi.png",
      alt: "Logo EMI"
    },
    {
      id: 11,
      name: "Total",
      logo: "/logos/total.png",
      alt: "Logo Total"
    },
    {
      id: 12,
      name: "BIA",
      logo: "/logos/bia.png",
      alt: "Logo BIA"
    },
    {
      id: 13,
      name: "Constellation",
      logo: "/logos/constellation.png",
      alt: "Logo Constellation"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="w-full"
        >
          <div className="text-center mb-12">
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl font-bold text-primary mb-4">
                {t("home.partners.title")}
              </h2>
              <div className="w-20 h-1 bg-[#2c9c6a] mx-auto mb-6"></div>
            </motion.div>
            <motion.div variants={itemVariants}>
              <p className="max-w-3xl mx-auto text-lg text-neutral mb-8">
                {t("home.partners.description")}
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
            {partners.map((partner) => (
              <motion.div key={partner.id} variants={itemVariants} className="w-full">
                <div className="h-32 flex items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                  <img
                    src={partner.logo}
                    alt={partner.alt}
                    className="max-w-full max-h-24 object-contain"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PartnersSection;