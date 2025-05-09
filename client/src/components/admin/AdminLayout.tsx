import React, { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { 
  BarChart4, 
  Users, 
  Mail, 
  LogOut, 
  Home,
  Newspaper,
} from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  currentPage: 'dashboard' | 'news' | 'users' | 'contacts' | 'images';
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title, currentPage }) => {
  const { t } = useTranslation();
  const { user, logoutMutation } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Helmet>
        <title>{title} | Admin | Groupe La Citadelle S.A.</title>
      </Helmet>

      {/* Admin Navbar */}
      <nav className="bg-primary text-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Mobile menu button */}
              <button 
                className="md:hidden flex items-center justify-center p-2 mr-2 rounded-md text-white hover:bg-white/10"
                onClick={toggleSidebar}
                aria-label="Menu principal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              <Link href="/admin/dashboard">
                <a className="flex-shrink-0 font-bold text-xl truncate">
                  <span className="hidden sm:inline">LA CITADELLE - </span>ADMIN
                </a>
              </Link>
            </div>
            <div className="flex items-center">
              <div className="hidden sm:flex">
                <div className="ml-4 flex items-center">
                  <Link href="/">
                    <a className="text-white px-3 py-2 rounded-md text-sm font-medium flex items-center">
                      <Home className="h-4 w-4 mr-1" />
                      <span className="hidden md:inline">Retour au site</span>
                      <span className="md:hidden">Site</span>
                    </a>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="ml-2 text-white px-3 py-2 rounded-md text-sm font-medium flex items-center hover:bg-white/10"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    <span className="hidden md:inline">{t('admin.logout')}</span>
                    <span className="md:hidden">Sortir</span>
                  </button>
                </div>
              </div>
              
              {/* Mobile only */}
              <div className="sm:hidden flex">
                <Link href="/">
                  <a className="text-white p-2 rounded-md flex items-center justify-center">
                    <Home className="h-5 w-5" />
                  </a>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-white p-2 rounded-md flex items-center justify-center"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex flex-col md:flex-row">
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-20 bg-gray-600 bg-opacity-75 md:hidden"
            onClick={toggleSidebar}
          />
        )}

        {/* Sidebar for mobile */}
        <aside 
          className={`
            fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-md transition duration-300 ease-in-out transform 
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
            md:translate-x-0 md:static md:inset-0 md:z-0
          `}
        >
          <div className="h-16 flex items-center justify-between px-4 bg-gray-50 md:hidden">
            <div className="font-bold text-lg text-primary">Menu admin</div>
            <button 
              onClick={toggleSidebar} 
              className="text-gray-500 hover:text-gray-800"
              aria-label="Fermer le menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="pt-5 pb-4 h-full overflow-y-auto">
            <div className="px-4 text-center">
              <div className="h-10 w-10 rounded-full bg-primary/10 mx-auto mb-3 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="font-semibold truncate">{user?.email}</div>
              <div className="text-xs text-gray-500">{user?.role || 'Administrator'}</div>
            </div>
            <nav className="mt-8 px-2 space-y-1">
              <Link href="/admin/dashboard">
                <a 
                  className={`group flex items-center px-4 py-3 rounded-md ${
                    currentPage === 'dashboard' 
                      ? 'text-white bg-primary' 
                      : 'text-gray-700 hover:bg-primary/5'
                  }`} 
                  onClick={() => setSidebarOpen(false)}
                >
                  <BarChart4 className={`mr-3 h-5 w-5 ${
                    currentPage === 'dashboard' 
                      ? 'text-white' 
                      : 'text-gray-500 group-hover:text-primary'
                  }`} />
                  Tableau de bord
                </a>
              </Link>
              <Link href="/admin/news">
                <a 
                  className={`group flex items-center px-4 py-3 rounded-md ${
                    currentPage === 'news' 
                      ? 'text-white bg-primary' 
                      : 'text-gray-700 hover:bg-primary/5'
                  }`} 
                  onClick={() => setSidebarOpen(false)}
                >
                  <Newspaper className={`mr-3 h-5 w-5 ${
                    currentPage === 'news' 
                      ? 'text-white' 
                      : 'text-gray-500 group-hover:text-primary'
                  }`} />
                  Gestion des actualités
                </a>
              </Link>
              <Link href="/admin/users">
                <a 
                  className={`group flex items-center px-4 py-3 rounded-md ${
                    currentPage === 'users' 
                      ? 'text-white bg-primary' 
                      : 'text-gray-700 hover:bg-primary/5'
                  }`} 
                  onClick={() => setSidebarOpen(false)}
                >
                  <Users className={`mr-3 h-5 w-5 ${
                    currentPage === 'users' 
                      ? 'text-white' 
                      : 'text-gray-500 group-hover:text-primary'
                  }`} />
                  Gestion des utilisateurs
                </a>
              </Link>
              <Link href="/admin/contacts">
                <a 
                  className={`group flex items-center px-4 py-3 rounded-md ${
                    currentPage === 'contacts' 
                      ? 'text-white bg-primary' 
                      : 'text-gray-700 hover:bg-primary/5'
                  }`} 
                  onClick={() => setSidebarOpen(false)}
                >
                  <Mail className={`mr-3 h-5 w-5 ${
                    currentPage === 'contacts' 
                      ? 'text-white' 
                      : 'text-gray-500 group-hover:text-primary'
                  }`} />
                  Messages de contact
                </a>
              </Link>
              <Link href="/admin/images">
                <a 
                  className={`group flex items-center px-4 py-3 rounded-md ${
                    currentPage === 'images' 
                      ? 'text-white bg-primary' 
                      : 'text-gray-700 hover:bg-primary/5'
                  }`} 
                  onClick={() => setSidebarOpen(false)}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`mr-3 h-5 w-5 ${
                      currentPage === 'images' 
                        ? 'text-white' 
                        : 'text-gray-500 group-hover:text-primary'
                    }`} 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                    <circle cx="9" cy="9" r="2"/>
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                  </svg>
                  Gestion des images
                </a>
              </Link>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 w-full p-4 sm:p-6 md:p-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;