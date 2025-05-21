import React from "react";
import { Container, Typography, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

// Logos paths (files in public/logos)
const LOGOS = [
  {
    id: 1,
    name: "Port Autonome de Douala",
    path: "/logos/port_douala.svg",
    alt: "Logo Port Autonome de Douala"
  },
  {
    id: 2,
    name: "Matgenie",
    path: "/logos/matgenie.svg",
    alt: "Logo Matgenie"
  },
  {
    id: 3,
    name: "Barco Group",
    path: "/logos/barco.svg",
    alt: "Logo Barco Group"
  }
];

const PartnersLogos: React.FC = () => {
  const { t } = useTranslation();
  
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

  return (
    <Box
      component="section"
      sx={{
        py: 8,
        background: "linear-gradient(to bottom, #f5f5f5, #ffffff)",
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          <Box textAlign="center" mb={6}>
            <motion.div variants={itemVariants}>
              <Typography
                variant="h3"
                component="h2"
                gutterBottom
                color="primary"
                fontWeight="bold"
              >
                {t("home.partners.title")}
              </Typography>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: "auto", mb: 4 }}>
                {t("home.partners.description")}
              </Typography>
            </motion.div>
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 4 }}>
            {LOGOS.map((logo) => (
              <motion.div key={logo.id} variants={itemVariants}>
                <Box
                  sx={{
                    width: 280,
                    height: 150,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 2,
                    bgcolor: "white",
                    borderRadius: 2,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <img
                    src={logo.path}
                    alt={logo.alt}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "120px",
                      objectFit: "contain",
                    }}
                  />
                </Box>
              </motion.div>
            ))}
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default PartnersLogos;