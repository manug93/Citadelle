import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { Helmet } from "react-helmet";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  Newspaper, 
  BarChart4, 
  Users, 
  Mail, 
  LogOut, 
  Home,
  PlusCircle
} from "lucide-react";

// Admin page layout component
const AdminLayout = ({ children, title }: { children: React.ReactNode, title: string }) => {
  const { t } = useTranslation();
  const { user, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Helmet>
        <title>{title} | Admin | Groupe La Citadelle S.A.</title>
      </Helmet>

      {/* Admin Navbar */}
      <nav className="bg-primary text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/admin/dashboard">
                <a className="flex-shrink-0 font-bold text-xl">
                  LA CITADELLE - ADMIN
                </a>
              </Link>
            </div>
            <div className="flex items-center">
              <div className="hidden md:block">
                <div className="ml-4 flex items-center md:ml-6">
                  <Link href="/">
                    <a className="text-white px-3 py-2 rounded-md text-sm font-medium flex items-center">
                      <Home className="h-4 w-4 mr-1" />
                      Retour au site
                    </a>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="ml-4 text-white px-3 py-2 rounded-md text-sm font-medium flex items-center hover:bg-white/10"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    {t('admin.logout')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-md min-h-screen">
          <div className="pt-5 pb-4">
            <div className="px-4 text-center">
              <div className="h-10 w-10 rounded-full bg-primary/10 mx-auto mb-3 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="font-semibold">{user?.email}</div>
              <div className="text-xs text-gray-500">{user?.role || 'Administrator'}</div>
            </div>
            <nav className="mt-8 px-2">
              <Link href="/admin/dashboard">
                <a className="group flex items-center px-4 py-3 text-gray-700 hover:bg-primary/5 rounded-md">
                  <BarChart4 className="mr-3 h-5 w-5 text-gray-500 group-hover:text-primary" />
                  Tableau de bord
                </a>
              </Link>
              <Link href="/admin/news">
                <a className="group flex items-center px-4 py-3 text-gray-700 hover:bg-primary/5 rounded-md">
                  <Newspaper className="mr-3 h-5 w-5 text-gray-500 group-hover:text-primary" />
                  Gestion des actualités
                </a>
              </Link>
              <a href="#" className="group flex items-center px-4 py-3 text-gray-700 hover:bg-primary/5 rounded-md">
                <Users className="mr-3 h-5 w-5 text-gray-500 group-hover:text-primary" />
                Gestion des utilisateurs
              </a>
              <a href="#" className="group flex items-center px-4 py-3 text-gray-700 hover:bg-primary/5 rounded-md">
                <Mail className="mr-3 h-5 w-5 text-gray-500 group-hover:text-primary" />
                Messages de contact
              </a>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// Dashboard page content
const DashboardPage = () => {
  const { t } = useTranslation();

  return (
    <AdminLayout title={t('admin.dashboard.title')}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('admin.dashboard.title')}</h1>
        <p className="mt-2 text-gray-600">{t('admin.dashboard.welcome')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary/10 mr-4">
              <Newspaper className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Actualités</p>
              <p className="text-2xl font-semibold text-gray-900">12</p>
            </div>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-[#2c9c6a]/10 mr-4">
              <Mail className="h-8 w-8 text-[#2c9c6a]" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Messages</p>
              <p className="text-2xl font-semibold text-gray-900">24</p>
            </div>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Utilisateurs</p>
              <p className="text-2xl font-semibold text-gray-900">5</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Dernières actualités</h2>
            <Link href="/admin/news">
              <Button variant="ghost" className="text-primary">
                Voir tout
              </Button>
            </Link>
          </div>
          <div className="space-y-4">
            <div className="border-b pb-4">
              <p className="text-sm text-gray-500">12 Mars 2023</p>
              <h3 className="font-medium text-gray-900">Nouveau partenariat stratégique avec la SIC</h3>
            </div>
            <div className="border-b pb-4">
              <p className="text-sm text-gray-500">28 Février 2023</p>
              <h3 className="font-medium text-gray-900">Achèvement du tronçon routier Ebolowa-Nkoemvon</h3>
            </div>
            <div>
              <p className="text-sm text-gray-500">15 Janvier 2023</p>
              <h3 className="font-medium text-gray-900">Ouverture d'un bureau de représentation au Rwanda</h3>
            </div>
          </div>
          <div className="mt-6">
            <Link href="/admin/news">
              <Button className="w-full bg-primary hover:bg-primary/90">
                <PlusCircle className="mr-2 h-4 w-4" />
                Ajouter une actualité
              </Button>
            </Link>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Messages récents</h2>
            <Button variant="ghost" className="text-primary">
              Voir tout
            </Button>
          </div>
          <div className="space-y-4">
            <div className="border-b pb-4">
              <div className="flex justify-between">
                <p className="font-medium text-gray-900">Jean Dupont</p>
                <p className="text-sm text-gray-500">Aujourd'hui</p>
              </div>
              <p className="text-sm text-gray-600 truncate">Demande d'information sur vos services d'ingénierie...</p>
            </div>
            <div className="border-b pb-4">
              <div className="flex justify-between">
                <p className="font-medium text-gray-900">Marie Martin</p>
                <p className="text-sm text-gray-500">Hier</p>
              </div>
              <p className="text-sm text-gray-600 truncate">Question concernant un projet de construction...</p>
            </div>
            <div>
              <div className="flex justify-between">
                <p className="font-medium text-gray-900">Paul Bernard</p>
                <p className="text-sm text-gray-500">Il y a 3 jours</p>
              </div>
              <p className="text-sm text-gray-600 truncate">Demande de devis pour la réhabilitation...</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;
