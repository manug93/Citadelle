import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { contactService, Contact } from "@/services/contact-service";
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
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { 
  Newspaper, 
  BarChart4, 
  Users, 
  Mail, 
  LogOut, 
  Home,
  Eye,
  Trash2,
  Loader2,
  MessageSquare,
  Calendar,
  User,
  CheckCircle,
  AlertCircle,
  MailOpen
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import AdminLayout from "@/components/admin/AdminLayout";

// ContactDetail component
interface ContactDetailProps {
  contact: Contact;
  onMarkAsRead: () => void;
  onClose: () => void;
}

const ContactDetail = ({ contact, onMarkAsRead, onClose }: ContactDetailProps) => {
  const { t } = useTranslation();
  
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return format(new Date(dateStr), 'dd/MM/yyyy HH:mm');
  };
  
  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
          <div>
            <h3 className="text-xl font-semibold">
              {contact.subject}
            </h3>
            <div className="flex flex-col sm:flex-row sm:items-center mt-1 text-sm text-gray-500">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                <span className="font-medium mr-3">{contact.name}</span>
              </div>
              <div className="flex items-center mt-1 sm:mt-0">
                <Mail className="h-4 w-4 mr-1" />
                <a href={`mailto:${contact.email}`} className="text-primary hover:underline break-all">
                  {contact.email}
                </a>
              </div>
            </div>
          </div>
          <Badge variant={contact.isRead ? "outline" : "default"} className="self-start mt-2 sm:mt-0">
            {contact.isRead ? (
              <span className="flex items-center">
                <MailOpen className="h-3 w-3 mr-1" />
                {t('admin.contacts.statusRead')}
              </span>
            ) : (
              <span className="flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {t('admin.contacts.statusUnread')}
              </span>
            )}
          </Badge>
        </div>
        <div className="flex items-center mt-3 text-xs text-gray-500">
          <Calendar className="h-3 w-3 mr-1" />
          {formatDate(contact.createdAt)}
        </div>
      </div>
      
      <div className="prose prose-sm max-w-none">
        <p className="whitespace-pre-line break-words">{contact.message}</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2 sm:space-x-4 pt-4">
        {!contact.isRead && (
          <Button 
            className="bg-primary hover:bg-primary/90"
            onClick={onMarkAsRead}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            {t('admin.contacts.markAsRead')}
          </Button>
        )}
        <Button 
          variant="outline"
          onClick={onClose}
        >
          {t('admin.contacts.close')}
        </Button>
      </div>
    </div>
  );
};

// Main Page Component
const ContactsManagementPage = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [filterRead, setFilterRead] = useState<boolean | null>(null);

  // Fetch contacts
  const { data: contacts, isLoading } = useQuery<Contact[]>({
    queryKey: ['/api/contacts'],
    queryFn: () => contactService.getAllContacts(),
  });

  // Filtered contacts
  const filteredContacts = contacts?.filter(contact => {
    if (filterRead === null) return true;
    return contact.isRead === filterRead;
  });

  // Mark as read mutation
  const readMutation = useMutation({
    mutationFn: async (id: number) => {
      return contactService.markContactAsRead(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['/api/contacts']});
      queryClient.invalidateQueries({queryKey: ['/api/stats/dashboard']});
      toast({
        title: t('admin.contacts.readSuccess'),
        description: t('admin.contacts.readSuccessDesc'),
      });
    },
    onError: (error) => {
      toast({
        title: t('admin.contacts.error'),
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return contactService.deleteContact(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['/api/contacts']});
      queryClient.invalidateQueries({queryKey: ['/api/stats/dashboard']});
      toast({
        title: t('admin.contacts.deleteSuccess'),
        description: t('admin.contacts.deleteSuccessDesc'),
      });
      setIsDeleteDialogOpen(false);
      setSelectedContact(null);
    },
    onError: (error) => {
      toast({
        title: t('admin.contacts.error'),
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Handle view button click
  const handleView = (contact: Contact) => {
    setSelectedContact(contact);
    setIsViewDialogOpen(true);
  };

  // Handle delete button click
  const handleDelete = (contact: Contact) => {
    setSelectedContact(contact);
    setIsDeleteDialogOpen(true);
  };

  // Handle delete confirmation
  const confirmDelete = () => {
    if (selectedContact) {
      deleteMutation.mutate(selectedContact.id);
    }
  };
  
  // Handle mark as read
  const handleMarkAsRead = () => {
    if (selectedContact && !selectedContact.isRead) {
      readMutation.mutate(selectedContact.id);
    }
  };
  
  // Format date for display
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return format(new Date(dateStr), 'dd/MM/yyyy HH:mm');
  };

  return (
    <AdminLayout 
      title={t('admin.contacts.management')}
      currentPage="contacts"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('admin.contacts.management')}</h1>
          <p className="mt-2 text-gray-600">{t('admin.contacts.description')}</p>
        </div>
        
        <div className="grid grid-cols-3 gap-2 w-full sm:w-auto">
          <Button 
            variant={filterRead === null ? "default" : "outline"} 
            onClick={() => setFilterRead(null)}
            className={filterRead === null ? "bg-primary hover:bg-primary/90" : ""}
            size="sm"
          >
            {t('admin.contacts.filterAll')}
          </Button>
          <Button 
            variant={filterRead === false ? "default" : "outline"} 
            onClick={() => setFilterRead(false)}
            className={filterRead === false ? "bg-primary hover:bg-primary/90" : ""}
            size="sm"
          >
            <AlertCircle className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">{t('admin.contacts.filterUnread')}</span>
            <span className="sm:hidden">Non lus</span>
          </Button>
          <Button 
            variant={filterRead === true ? "default" : "outline"} 
            onClick={() => setFilterRead(true)}
            className={filterRead === true ? "bg-primary hover:bg-primary/90" : ""}
            size="sm"
          >
            <CheckCircle className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">{t('admin.contacts.filterRead')}</span>
            <span className="sm:hidden">Lus</span>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredContacts && filteredContacts.length > 0 ? (
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px] sm:w-[200px]">{t('admin.contacts.sender')}</TableHead>
                <TableHead className="hidden md:table-cell w-[250px]">{t('admin.contacts.subject')}</TableHead>
                <TableHead className="hidden sm:table-cell">{t('admin.contacts.date')}</TableHead>
                <TableHead>{t('admin.contacts.status')}</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContacts.map((contact) => (
                <TableRow key={contact.id} className={!contact.isRead ? "bg-blue-50" : ""}>
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="font-medium">{contact.name}</div>
                      <div className="text-xs text-gray-500">{contact.email}</div>
                      <div className="md:hidden text-sm font-medium mt-1 text-primary">
                        {contact.subject}
                      </div>
                      <div className="sm:hidden text-xs text-gray-500 mt-1">
                        {formatDate(contact.createdAt)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium hidden md:table-cell">
                    {contact.subject}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {formatDate(contact.createdAt)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={contact.isRead ? "outline" : "default"}>
                      {contact.isRead ? (
                        <span className="flex items-center">
                          <MailOpen className="h-3 w-3 mr-1" />
                          <span className="hidden sm:inline">{t('admin.contacts.statusRead')}</span>
                          <span className="sm:hidden">Lu</span>
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          <span className="hidden sm:inline">{t('admin.contacts.statusUnread')}</span>
                          <span className="sm:hidden">Non lu</span>
                        </span>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-1 whitespace-nowrap">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                      onClick={() => handleView(contact)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-red-600 hover:text-red-800 hover:bg-red-100"
                      onClick={() => handleDelete(contact)}
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
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filterRead !== null 
              ? (filterRead 
                ? t('admin.contacts.noReadMessages') 
                : t('admin.contacts.noUnreadMessages'))
              : t('admin.contacts.noMessages')}
          </h3>
          <p className="text-gray-500 mb-6">
            {filterRead !== null 
              ? t('admin.contacts.changeFilter')
              : t('admin.contacts.waitForMessages')}
          </p>
          {filterRead !== null && (
            <Button 
              variant="outline"
              onClick={() => setFilterRead(null)}
            >
              {t('admin.contacts.showAllMessages')}
            </Button>
          )}
        </div>
      )}

      {/* View Contact Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t('admin.contacts.messageDetails')}</DialogTitle>
          </DialogHeader>
          {selectedContact && (
            <ContactDetail 
              contact={selectedContact}
              onMarkAsRead={() => {
                handleMarkAsRead();
                // Update the local state to show the change immediately
                setSelectedContact(prev => prev ? {...prev, isRead: true} : null);
              }}
              onClose={() => {
                setIsViewDialogOpen(false);
                setSelectedContact(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="max-w-[95vw] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>{t('admin.contacts.confirmDelete')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('admin.contacts.confirmDeleteDesc')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <AlertDialogCancel className="mt-0 sm:mt-0">
              {t('admin.contacts.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('admin.contacts.deleting')}
                </>
              ) : (
                t('admin.contacts.delete')
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default ContactsManagementPage;