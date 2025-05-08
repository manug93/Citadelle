import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { NewsItem, CreateNewsInput } from "@/types";
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
import { Loader2 } from "lucide-react";

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
  });

  type NewsFormValues = z.infer<typeof formSchema>;

  // Define default values
  const defaultValues: Partial<NewsFormValues> = {
    title: newsItem?.title || "",
    content: newsItem?.content || "",
    summary: newsItem?.summary || "",
    category: newsItem?.category || "",
    imageUrl: newsItem?.imageUrl || ""
  };

  // Initialize form
  const form = useForm<NewsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: CreateNewsInput) => {
      const response = await apiRequest("POST", "/api/news", data);
      return response.json();
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
      const response = await apiRequest("PATCH", `/api/news/${newsItem!.id}`, data);
      return response.json();
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
  );
};

export default NewsForm;
