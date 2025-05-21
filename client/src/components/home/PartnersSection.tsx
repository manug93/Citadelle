import React from "react";
import { Container, Typography, Box } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

// Logos import - SVG files from public folder
const portDoualaLogo = "/logos/port_douala.svg";
const matgenieLogo = "/logos/matgenie.svg";
const barcoLogo = "/logos/barco.svg";

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
      logo: portDoualaLogo,
      alt: "Logo Port Autonome de Douala"
    },
    {
      id: 2,
      name: "Matgenie",
      logo: matgenieLogo,
      alt: "Logo Matgenie"
    },
    {
      id: 3,
      name: "Barco Group",
      logo: barcoLogo,
      alt: "Logo Barco Group"
    }
  ];

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

          <Grid container spacing={4} justifyContent="center" alignItems="center">
            {partners.map((partner) => (
              <Grid key={partner.id} xs={12} sm={6} md={4}>
                <motion.div variants={itemVariants}>
                  <Box
                    sx={{
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
                      src={partner.logo}
                      alt={partner.alt}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "120px",
                        objectFit: "contain",
                      }}
                    />
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default PartnersSection;