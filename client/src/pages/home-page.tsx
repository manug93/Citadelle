import Layout from "@/components/layout/Layout";
import Hero from "@/components/home/Hero";
import AboutSection from "@/components/home/AboutSection";
import ServicesSection from "@/components/home/ServicesSection";
import ProjectsSection from "@/components/home/ProjectsSection";
import TeamSection from "@/components/home/TeamSection";
import NewsSection from "@/components/home/NewsSection";
import ContactSection from "@/components/home/ContactSection";
import PartnersLogos from "@/components/home/PartnersLogos";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";

const HomePage = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      <Helmet>
        <title>{t('home.hero.title')} | {t('home.hero.subtitle')}</title>
        <meta 
          name="description" 
          content={t('about.description')} 
        />
        <meta property="og:title" content={`${t('home.hero.title')} | ${t('home.hero.subtitle')}`} />
        <meta property="og:description" content={t('about.description')} />
        <meta property="og:type" content="website" />
      </Helmet>
      <Hero />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
      <TeamSection />
      <PartnersLogos />
      <NewsSection />
      <ContactSection />
    </Layout>
  );
};

export default HomePage;
