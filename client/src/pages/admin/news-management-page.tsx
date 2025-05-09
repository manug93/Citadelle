import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Helmet } from "react-helmet";
import { useAuth } from "@/contexts/AuthContext";
import { NewsItem } from "@/types";
import { newsService } from "@/services/news-service";
import NewsForm from "@/components/admin/NewsForm";
import BackendSelector from "@/components/admin/BackendSelector";
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

import AdminLayout from "@/components/admin/AdminLayout";
import { Badge } from "@/components/ui/badge";

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
    queryFn: () => newsService.getAllNews(),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return newsService.deleteNews(id);
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
    <AdminLayout 
      title={t('admin.news.management')}
      currentPage="news"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('admin.news.management')}</h1>
          <p className="mt-2 text-gray-600">Gérez les actualités du site</p>
        </div>
        <Button 
          className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          {t('admin.news.create')}
        </Button>
      </div>
      
      {/* Backend Selector */}
      <div className="mb-4">
        <BackendSelector />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : newsItems && newsItems.length > 0 ? (
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px] sm:w-[250px]">{t('admin.news.title')}</TableHead>
                <TableHead className="hidden sm:table-cell">{t('admin.news.category')}</TableHead>
                <TableHead className="hidden md:table-cell">{t('admin.news.date')}</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {newsItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{item.title}</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <Badge variant="outline" className="sm:hidden bg-primary/10 text-primary">
                          {formatCategory(item.category)}
                        </Badge>
                        <span className="text-xs text-gray-500 md:hidden">
                          {format(new Date(item.date), 'dd/MM/yyyy')}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant="outline" className="bg-primary/10 text-primary">
                      {formatCategory(item.category)}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {format(new Date(item.date), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell className="text-right space-x-1 whitespace-nowrap">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
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
        <DialogContent className="max-w-[95vw] lg:max-w-3xl max-h-[90vh] overflow-y-auto">
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
        <DialogContent className="max-w-[95vw] lg:max-w-3xl max-h-[90vh] overflow-y-auto">
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
        <AlertDialogContent className="max-w-[95vw] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>{t('admin.news.confirmDelete')}</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Cette actualité sera définitivement supprimée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <AlertDialogCancel className="mt-0 sm:mt-0">
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
