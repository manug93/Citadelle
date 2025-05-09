import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { statsService, DashboardStats } from "@/services/stats-service";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Newspaper, 
  Users, 
  Mail, 
  Loader2,
  MessageSquare,
  AlertCircle
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";

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
    <AdminLayout 
      title={t('admin.dashboard.title')}
      currentPage="dashboard"
    >
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {t('admin.dashboard.title')}
        </h1>
        <p className="mt-2 text-gray-600 capitalize">
          {currentDate}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
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

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {t('admin.dashboard.quickActions')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Create News Card */}
          <Card className="h-full flex flex-col">
            <CardHeader className="flex-1">
              <CardTitle className="text-lg truncate">{t('admin.dashboard.createNews')}</CardTitle>
              <CardDescription className="line-clamp-3">
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
          
          {/* Manage Users Card */}
          <Card className="h-full flex flex-col">
            <CardHeader className="flex-1">
              <CardTitle className="text-lg truncate">{t('admin.dashboard.manageUsers')}</CardTitle>
              <CardDescription className="line-clamp-3">
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
          
          {/* Check Messages Card */}
          <Card className="h-full flex flex-col">
            <CardHeader className="flex-1">
              <CardTitle className="text-lg truncate">{t('admin.dashboard.checkMessages')}</CardTitle>
              <CardDescription className="line-clamp-3">
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
          
          {/* Manage Images Card */}
          <Card className="h-full flex flex-col">
            <CardHeader className="flex-1">
              <CardTitle className="text-lg truncate">Gérer les images</CardTitle>
              <CardDescription className="line-clamp-3">
                Téléchargez et organisez les images utilisées dans vos articles et sur votre site.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button 
                className="w-full bg-primary hover:bg-primary/90"
                asChild
              >
                <Link href="/admin/images">
                  <a className="flex items-center justify-center">
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                      <circle cx="9" cy="9" r="2"/>
                      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                    </svg>
                    Gérer
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