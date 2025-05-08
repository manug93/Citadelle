import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Helmet } from "react-helmet";
import { useAuth } from "@/contexts/AuthContext";
import { NewsItem } from "@/types";
import { apiRequest } from "@/lib/queryClient";
import NewsForm from "@/components/admin/NewsForm";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { 
  Newspaper, 
  BarChart4, 
  Users, 
  Mail, 
  LogOut, 
  Home,
  PlusCircle,
  Pencil,
  Trash2,
  Loader2
} from "lucide-react";
import { Link } from "wouter";

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
                <a className="group flex items-center px-4 py-3 text-white bg-primary rounded-md">
                  <Newspaper className="mr-3 h-5 w-5 text-white" />
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

// News Management Page
const NewsManagementPage = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  // Fetch news
  const { data: newsItems, isLoading } = useQuery<NewsItem[]>({
    queryKey: ['/api/news'],
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/news/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['/api/news']});
      toast({
        title: t('admin.news.success'),
        description: "News deleted successfully",
      });
      setIsDeleteDialogOpen(false);
      setSelectedNews(null);
    },
    onError: (error) => {
      toast({
        title: t('admin.news.error'),
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Handle edit button click
  const handleEdit = (newsItem: NewsItem) => {
    setSelectedNews(newsItem);
    setIsEditDialogOpen(true);
  };

  // Handle delete button click
  const handleDelete = (newsItem: NewsItem) => {
    setSelectedNews(newsItem);
    setIsDeleteDialogOpen(true);
  };

  // Handle delete confirmation
  const confirmDelete = () => {
    if (selectedNews) {
      deleteMutation.mutate(selectedNews.id);
    }
  };

  // Format category for display
  const formatCategory = (category: string) => {
    return t(`news.category.${category.toLowerCase()}`) || category;
  };

  return (
    <AdminLayout title={t('admin.news.management')}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('admin.news.management')}</h1>
          <p className="mt-2 text-gray-600">Gérez les actualités du site</p>
        </div>
        <Button 
          className="bg-primary hover:bg-primary/90"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          {t('admin.news.create')}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : newsItems && newsItems.length > 0 ? (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">{t('admin.news.title')}</TableHead>
                <TableHead>{t('admin.news.category')}</TableHead>
                <TableHead>{t('admin.news.date')}</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {newsItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {formatCategory(item.category)}
                    </span>
                  </TableCell>
                  <TableCell>{format(new Date(item.date), 'dd/MM/yyyy')}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 mr-2"
                      onClick={() => handleEdit(item)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-red-600 hover:text-red-800 hover:bg-red-100"
                      onClick={() => handleDelete(item)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="bg-white p-8 shadow-md rounded-lg text-center">
          <Newspaper className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No news items found</h3>
          <p className="text-gray-500 mb-6">Get started by creating your first news item</p>
          <Button 
            className="bg-primary hover:bg-primary/90"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            {t('admin.news.create')}
          </Button>
        </div>
      )}

      {/* Create News Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('admin.news.create')}</DialogTitle>
          </DialogHeader>
          <div className="pr-1"> {/* Add padding for scrollbar */}
            <NewsForm onSuccess={() => setIsCreateDialogOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit News Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('admin.news.edit')}</DialogTitle>
          </DialogHeader>
          {selectedNews && (
            <div className="pr-1"> {/* Add padding for scrollbar */}
              <NewsForm 
                newsItem={selectedNews} 
                onSuccess={() => {
                  setIsEditDialogOpen(false);
                  setSelectedNews(null);
                }} 
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('admin.news.confirmDelete')}</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Cette actualité sera définitivement supprimée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t('admin.news.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Suppression...
                </>
              ) : (
                t('admin.news.delete')
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default NewsManagementPage;
