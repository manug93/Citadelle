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
              <Link href="/admin/users">
                <a className="group flex items-center px-4 py-3 text-gray-700 hover:bg-primary/5 rounded-md">
                  <Users className="mr-3 h-5 w-5 text-gray-500 group-hover:text-primary" />
                  Gestion des utilisateurs
                </a>
              </Link>
              <Link href="/admin/contacts">
                <a className="group flex items-center px-4 py-3 text-white bg-primary rounded-md">
                  <Mail className="mr-3 h-5 w-5 text-white" />
                  Messages de contact
                </a>
              </Link>
              <Link href="/admin/images">
                <a className="group flex items-center px-4 py-3 text-gray-700 hover:bg-primary/5 rounded-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-5 w-5 text-gray-500 group-hover:text-primary" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                  Gestion des images
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
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold">
              {contact.subject}
            </h3>
            <div className="flex items-center mt-1 text-sm text-gray-500">
              <User className="h-4 w-4 mr-1" />
              <span className="font-medium mr-3">{contact.name}</span>
              <Mail className="h-4 w-4 mr-1" />
              <a href={`mailto:${contact.email}`} className="text-primary hover:underline">
                {contact.email}
              </a>
            </div>
          </div>
          <Badge variant={contact.isRead ? "outline" : "default"}>
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
        <p className="whitespace-pre-line">{contact.message}</p>
      </div>
      
      <div className="flex space-x-4 pt-4">
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
    <AdminLayout title={t('admin.contacts.management')}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('admin.contacts.management')}</h1>
          <p className="mt-2 text-gray-600">{t('admin.contacts.description')}</p>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant={filterRead === null ? "default" : "outline"} 
            onClick={() => setFilterRead(null)}
            className={filterRead === null ? "bg-primary hover:bg-primary/90" : ""}
          >
            {t('admin.contacts.filterAll')}
          </Button>
          <Button 
            variant={filterRead === false ? "default" : "outline"} 
            onClick={() => setFilterRead(false)}
            className={filterRead === false ? "bg-primary hover:bg-primary/90" : ""}
          >
            <AlertCircle className="mr-1 h-4 w-4" />
            {t('admin.contacts.filterUnread')}
          </Button>
          <Button 
            variant={filterRead === true ? "default" : "outline"} 
            onClick={() => setFilterRead(true)}
            className={filterRead === true ? "bg-primary hover:bg-primary/90" : ""}
          >
            <CheckCircle className="mr-1 h-4 w-4" />
            {t('admin.contacts.filterRead')}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredContacts && filteredContacts.length > 0 ? (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">{t('admin.contacts.sender')}</TableHead>
                <TableHead className="w-[250px]">{t('admin.contacts.subject')}</TableHead>
                <TableHead>{t('admin.contacts.date')}</TableHead>
                <TableHead>{t('admin.contacts.status')}</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContacts.map((contact) => (
                <TableRow key={contact.id} className={!contact.isRead ? "bg-blue-50" : ""}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{contact.name}</div>
                      <div className="text-xs text-gray-500">{contact.email}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {contact.subject}
                  </TableCell>
                  <TableCell>
                    {formatDate(contact.createdAt)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={contact.isRead ? "outline" : "default"}>
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
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 mr-2"
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
        <DialogContent className="sm:max-w-lg">
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('admin.contacts.confirmDelete')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('admin.contacts.confirmDeleteDesc')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
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