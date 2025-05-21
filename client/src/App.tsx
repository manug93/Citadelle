import { Switch, Route } from "wouter";
import { Helmet } from "react-helmet";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme/theme";
import HomePage from "@/pages/home-page";
import AboutPage from "@/pages/about-page";
import ServicesPage from "@/pages/services-page";
import ProjectsPage from "@/pages/projects-page";
import TeamPage from "@/pages/team-page";
import NewsPage from "@/pages/news-page";
import NewsDetailPage from "@/pages/news-detail-page";
import ContactPage from "@/pages/contact-page";
import LoginPage from "@/pages/admin/login-page";

// Admin pages
import DashboardPage from "@/pages/admin/dashboard-page";
import NewsManagementPage from "@/pages/admin/news-management-page";
import UsersManagementPage from "@/pages/admin/users-management-page";
import ContactsManagementPage from "@/pages/admin/contacts-management-page";
import ImagesManagementPage from "@/pages/admin/images-management-page";
import VideosManagementPage from "@/pages/admin/videos-management-page";

// Wrappers pour les composants admin (correction de type pour ProtectedRoute)
const DashboardComponent = () => <DashboardPage />;
const NewsManagementComponent = () => <NewsManagementPage />;
const UsersManagementComponent = () => <UsersManagementPage />;
const ContactsManagementComponent = () => <ContactsManagementPage />;
const ImagesManagementComponent = () => <ImagesManagementPage />;
const VideosManagementComponent = () => <VideosManagementPage />;

import NotFound from "@/pages/not-found";
import { ProtectedRoute } from "@/lib/protected-route";
import "./lib/i18n"; // Initialize i18n

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/services" component={ServicesPage} />
      <Route path="/projects" component={ProjectsPage} />
      <Route path="/team" component={TeamPage} />
      <Route path="/news" component={NewsPage} />
      <Route path="/news/:id" component={NewsDetailPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/admin/login" component={LoginPage} />
      <ProtectedRoute path="/admin/dashboard" component={DashboardComponent} />
      <ProtectedRoute path="/admin/news" component={NewsManagementComponent} />
      <ProtectedRoute path="/admin/users" component={UsersManagementComponent} />
      <ProtectedRoute path="/admin/contacts" component={ContactsManagementComponent} />
      <ProtectedRoute path="/admin/images" component={ImagesManagementComponent} />
      <ProtectedRoute path="/admin/videos" component={VideosManagementComponent} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <>
      <Helmet>
        <title>Groupe La Citadelle S.A. | Ingénierie, BTP & Services</title>
        <meta 
          name="description" 
          content="Groupe La Citadelle S.A. est un acteur majeur du conseil, de l'ingénierie et de la réalisation de projets au Cameroun et en Afrique centrale depuis 2005."
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <LanguageProvider>
            <AuthProvider>
              <TooltipProvider>
                <Toaster />
                <Router />
              </TooltipProvider>
            </AuthProvider>
          </LanguageProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
