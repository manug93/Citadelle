import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { NewsItem, CreateNewsInput } from "@/types";
import { newsService } from "@/services/news-service";
import MediaGallery from "@/components/admin/MediaGallery";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Loader2, ImageIcon, Film } from "lucide-react";

interface NewsFormProps {
  newsItem?: NewsItem;
  onSuccess?: () => void;
}

const NewsForm = ({ newsItem, onSuccess }: NewsFormProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Define the form schema
  const formSchema = z.object({
    title: z.string().min(5, {
      message: "Title must be at least 5 characters",
    }),
    content: z.string().min(20, {
      message: "Content must be at least 20 characters",
    }),
    summary: z.string().optional(),
    category: z.string({
      required_error: "Please select a category",
    }),
    imageUrl: z.string().url({
      message: "Please enter a valid URL",
    }),
    author: z.string().optional(),
  });

  type NewsFormValues = z.infer<typeof formSchema>;

  // Define default values
  const defaultValues: Partial<NewsFormValues> = {
    title: newsItem?.title || "",
    content: newsItem?.content || "",
    summary: newsItem?.summary || "",
    category: newsItem?.category || "",
    imageUrl: newsItem?.imageUrl || "",
    author: newsItem?.author || ""
  };

  // Initialize form
  const form = useForm<NewsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: CreateNewsInput) => {
      return newsService.createNews(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['/api/news']});
      toast({
        title: t('admin.news.success'),
        description: "News created successfully",
      });
      if (onSuccess) onSuccess();
      form.reset();
    },
    onError: (error) => {
      toast({
        title: t('admin.news.error'),
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: CreateNewsInput) => {
      if (!newsItem?.id) throw new Error("News ID is required for update");
      return newsService.updateNews(newsItem.id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['/api/news']});
      toast({
        title: t('admin.news.success'),
        description: "News updated successfully",
      });
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast({
        title: t('admin.news.error'),
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Handle form submission
  const onSubmit = (data: NewsFormValues) => {
    if (newsItem) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="general">
          <span className="flex items-center">
            <Loader2 className="mr-2 h-4 w-4" />
            {t('admin.news.generalInfo') || "Informations générales"}
          </span>
        </TabsTrigger>
        <TabsTrigger value="media" disabled={!newsItem}>
          <span className="flex items-center">
            <ImageIcon className="mr-2 h-4 w-4" />
            {t('admin.news.mediaGallery') || "Galerie média"}
          </span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="general">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('admin.news.title')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('admin.news.category')}</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="partnership">{t('news.category.partnership')}</SelectItem>
                      <SelectItem value="achievement">{t('news.category.achievement')}</SelectItem>
                      <SelectItem value="expansion">{t('news.category.expansion')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Summary (optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Brief summary of the news"
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('admin.news.content')}</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      rows={6}
                      className="resize-y"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('admin.news.image')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('admin.news.mainImageInfo') || "Cette image sera utilisée comme couverture principale de l'article. Vous pourrez ajouter des médias supplémentaires après avoir créé l'article."}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('admin.news.author')}</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Nom de l'auteur (optionnel)"
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex space-x-4">
              <Button 
                type="submit" 
                className="bg-primary hover:bg-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('admin.news.save')}
                  </>
                ) : (
                  t('admin.news.save')
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => {
                  form.reset();
                  if (onSuccess) onSuccess();
                }}
                disabled={isSubmitting}
              >
                {t('admin.news.cancel')}
              </Button>
            </div>
          </form>
        </Form>
      </TabsContent>
      
      <TabsContent value="media">
        {newsItem ? (
          <div className="space-y-6">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-2">{t('admin.news.manageMedia') || "Gérer les médias de l'article"}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t('admin.news.mediaDescription') || "Ajoutez des images et des vidéos à cet article. Ces médias seront affichés dans une galerie sur la page de détail de l'article."}
              </p>
            </div>
            
            <MediaGallery articleId={newsItem.id} />
          </div>
        ) : (
          <div className="text-center py-12 bg-muted/50 rounded-lg">
            <p>{t('admin.news.createBeforeMedia') || "Vous devez d'abord créer l'article avant de pouvoir ajouter des médias."}</p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default NewsForm;
