import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { statsService, DashboardStats } from "@/services/stats-service";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { 
  Newspaper, 
  BarChart4, 
  Users, 
  Mail, 
  LogOut, 
  Home,
  Loader2,
  Calendar,
  MessageSquare,
  AlertCircle
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
                <a className="group flex items-center px-4 py-3 text-white bg-primary rounded-md">
                  <BarChart4 className="mr-3 h-5 w-5 text-white" />
                  Tableau de bord
                </a>
              </Link>
              <Link href="/admin/news">
                <a className="group flex items-center px-4 py-3 text-gray-700 hover:bg-primary/5 rounded-md">
                  <Newspaper className="mr-3 h-5 w-5 text-gray-500 group-hover:text-primary" />
                  Gestion des actualités
                </a>
              </Link>
              <Link href="/admin/users">
                <a className="group flex items-center px-4 py-3 text-gray-700 hover:bg-primary/5 rounded-md">
                  <Users className="mr-3 h-5 w-5 text-gray-500 group-hover:text-primary" />
                  Gestion des utilisateurs
                </a>
              </Link>
              <Link href="/admin/contacts">
                <a className="group flex items-center px-4 py-3 text-gray-700 hover:bg-primary/5 rounded-md">
                  <Mail className="mr-3 h-5 w-5 text-gray-500 group-hover:text-primary" />
                  Messages de contact
                </a>
              </Link>
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

// Dashboard Stat Card Component
interface StatCardProps {
  title: string;
  value: number | string;
  description?: string;
  icon: React.ReactNode;
  linkText?: string;
  linkHref?: string;
  loading?: boolean;
}

const StatCard = ({ 
  title, 
  value, 
  description, 
  icon, 
  linkText, 
  linkHref,
  loading = false 
}: StatCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">
          {title}
        </CardTitle>
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        ) : (
          <div className="text-3xl font-bold">{value}</div>
        )}
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </CardContent>
      {linkText && linkHref && (
        <CardFooter className="pt-0 pb-3">
          <Link href={linkHref}>
            <a className="text-xs text-primary font-medium hover:underline">
              {linkText}
            </a>
          </Link>
        </CardFooter>
      )}
    </Card>
  );
};

// Dashboard Page
const DashboardPage = () => {
  const { t } = useTranslation();
  const currentDate = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Fetch dashboard stats
  const { data: dashboardStats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['/api/stats/dashboard'],
    queryFn: () => statsService.getDashboardStats(),
  });

  return (
    <AdminLayout title={t('admin.dashboard.title')}>
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {t('admin.dashboard.title')}
        </h1>
        <p className="mt-2 text-gray-600 capitalize">
          {currentDate}
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title={t('admin.dashboard.users')}
          value={dashboardStats?.usersCount || 0}
          icon={<Users className="h-5 w-5 text-primary" />}
          linkText={t('admin.dashboard.manageUsers')}
          linkHref="/admin/users"
          loading={isLoading}
        />
        <StatCard 
          title={t('admin.dashboard.news')}
          value={dashboardStats?.newsCount || 0}
          icon={<Newspaper className="h-5 w-5 text-primary" />}
          linkText={t('admin.dashboard.manageNews')}
          linkHref="/admin/news"
          loading={isLoading}
        />
        <StatCard 
          title={t('admin.dashboard.contacts')}
          value={dashboardStats?.contactsCount || 0}
          icon={<Mail className="h-5 w-5 text-primary" />}
          linkText={t('admin.dashboard.manageContacts')}
          linkHref="/admin/contacts"
          loading={isLoading}
        />
        <StatCard 
          title={t('admin.dashboard.unreadMessages')}
          value={dashboardStats?.unreadContactsCount || 0}
          icon={<AlertCircle className="h-5 w-5 text-primary" />}
          linkText={t('admin.dashboard.viewUnread')}
          linkHref="/admin/contacts"
          loading={isLoading}
        />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {t('admin.dashboard.quickActions')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('admin.dashboard.createNews')}</CardTitle>
              <CardDescription>
                {t('admin.dashboard.createNewsDescription')}
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button 
                className="w-full bg-primary hover:bg-primary/90"
                asChild
              >
                <Link href="/admin/news">
                  <a className="flex items-center justify-center">
                    <Newspaper className="mr-2 h-4 w-4" />
                    {t('admin.dashboard.create')}
                  </a>
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('admin.dashboard.manageUsers')}</CardTitle>
              <CardDescription>
                {t('admin.dashboard.manageUsersDescription')}
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button 
                className="w-full bg-primary hover:bg-primary/90"
                asChild
              >
                <Link href="/admin/users">
                  <a className="flex items-center justify-center">
                    <Users className="mr-2 h-4 w-4" />
                    {t('admin.dashboard.manage')}
                  </a>
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('admin.dashboard.checkMessages')}</CardTitle>
              <CardDescription>
                {t('admin.dashboard.checkMessagesDescription')}
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button 
                className="w-full bg-primary hover:bg-primary/90"
                asChild
              >
                <Link href="/admin/contacts">
                  <a className="flex items-center justify-center">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    {t('admin.dashboard.check')}
                  </a>
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;