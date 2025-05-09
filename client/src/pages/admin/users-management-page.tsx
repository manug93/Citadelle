import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { useAuth } from "@/contexts/AuthContext";
import { User } from "@/types";
import { userService, CreateUserInput } from "@/services/user-service";
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
  Loader2,
  Check,
  X
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

import AdminLayout from "@/components/admin/AdminLayout";

// User Form component
interface UserFormProps {
  user?: User;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const UserForm = ({ user, onSuccess, onCancel }: UserFormProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formState, setFormState] = useState<CreateUserInput>({
    username: user?.username || '',
    email: user?.email || '',
    password: '',
    role: user?.role || 'user',
    canCreateNews: user?.canCreateNews || false,
    canViewContacts: user?.canViewContacts || false,
  });
  
  const createMutation = useMutation({
    mutationFn: async (data: CreateUserInput) => {
      return userService.createUser(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['/api/users']});
      toast({
        title: t('admin.users.createSuccess'),
        description: t('admin.users.createSuccessDesc'),
      });
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast({
        title: t('admin.users.error'),
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  const updateMutation = useMutation({
    mutationFn: async (data: CreateUserInput) => {
      if (!user?.id) throw new Error("User ID is required for update");
      return userService.updateUser(user.id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['/api/users']});
      toast({
        title: t('admin.users.updateSuccess'),
        description: t('admin.users.updateSuccessDesc'),
      });
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast({
        title: t('admin.users.error'),
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // If it's an edit and the password is empty, remove it from the request
    const userData = user && !formState.password ? { ...formState, password: undefined } : formState;
    
    if (user) {
      updateMutation.mutate(userData);
    } else {
      createMutation.mutate(userData);
    }
  };
  
  const handleChange = (field: keyof CreateUserInput, value: string | boolean) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };
  
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="username">{t('admin.users.username')}</Label>
          <Input 
            id="username" 
            value={formState.username}
            onChange={(e) => handleChange('username', e.target.value)}
            className="mt-1"
            required
            disabled={isSubmitting}
          />
        </div>
        
        <div>
          <Label htmlFor="email">{t('admin.users.email')}</Label>
          <Input 
            id="email" 
            type="email"
            value={formState.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="mt-1"
            required
            disabled={isSubmitting}
          />
        </div>
        
        <div>
          <Label htmlFor="password">
            {user ? t('admin.users.passwordOptional') : t('admin.users.password')}
          </Label>
          <Input 
            id="password" 
            type="password"
            value={formState.password}
            onChange={(e) => handleChange('password', e.target.value)}
            className="mt-1"
            required={!user}
            disabled={isSubmitting}
          />
          {user && (
            <p className="text-xs text-gray-500 mt-1">
              {t('admin.users.leaveBlank')}
            </p>
          )}
        </div>
        
        <div>
          <Label htmlFor="role">{t('admin.users.role')}</Label>
          <Select 
            value={formState.role} 
            onValueChange={(value) => handleChange('role', value)}
            disabled={isSubmitting}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder={t('admin.users.selectRole')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">{t('admin.users.roleAdmin')}</SelectItem>
              <SelectItem value="editor">{t('admin.users.roleEditor')}</SelectItem>
              <SelectItem value="user">{t('admin.users.roleUser')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>{t('admin.users.permissions')}</Label>
          
          <div className="flex items-center space-x-2 mt-2">
            <Checkbox 
              id="canCreateNews" 
              checked={formState.canCreateNews}
              onCheckedChange={(checked) => 
                handleChange('canCreateNews', checked === true)}
              disabled={isSubmitting}
            />
            <Label htmlFor="canCreateNews">
              {t('admin.users.canCreateNews')}
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="canViewContacts" 
              checked={formState.canViewContacts}
              onCheckedChange={(checked) => 
                handleChange('canViewContacts', checked === true)}
              disabled={isSubmitting}
            />
            <Label htmlFor="canViewContacts">
              {t('admin.users.canViewContacts')}
            </Label>
          </div>
        </div>
      </div>
      
      <div className="flex space-x-4 pt-4">
        <Button 
          type="submit" 
          className="bg-primary hover:bg-primary/90"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('admin.users.saving')}
            </>
          ) : (
            t('admin.users.save')
          )}
        </Button>
        <Button 
          type="button" 
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          {t('admin.users.cancel')}
        </Button>
      </div>
    </form>
  );
};

// Main Page Component
const UsersManagementPage = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Fetch users
  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ['/api/users'],
    queryFn: () => userService.getAllUsers(),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return userService.deleteUser(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['/api/users']});
      toast({
        title: t('admin.users.deleteSuccess'),
        description: t('admin.users.deleteSuccessDesc'),
      });
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
    },
    onError: (error) => {
      toast({
        title: t('admin.users.error'),
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Handle edit button click
  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  // Handle delete button click
  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  // Handle delete confirmation
  const confirmDelete = () => {
    if (selectedUser) {
      deleteMutation.mutate(selectedUser.id);
    }
  };
  
  // Format role for display
  const formatRole = (role: string) => {
    return t(`admin.users.role_${role.toLowerCase()}`) || role;
  };

  return (
    <AdminLayout 
      title={t('admin.users.management')}
      currentPage="users"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('admin.users.management')}</h1>
          <p className="mt-2 text-gray-600">{t('admin.users.description')}</p>
        </div>
        <Button 
          className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          {t('admin.users.create')}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : users && users.length > 0 ? (
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px] sm:w-[200px]">{t('admin.users.username')}</TableHead>
                <TableHead className="hidden sm:table-cell">{t('admin.users.email')}</TableHead>
                <TableHead>{t('admin.users.role')}</TableHead>
                <TableHead className="hidden md:table-cell">{t('admin.users.permissions')}</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{user.username}</span>
                      <span className="text-xs text-gray-500 sm:hidden">{user.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'admin' ? 'default' : user.role === 'editor' ? 'secondary' : 'outline'}>
                      {formatRole(user.role)}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-wrap gap-2">
                      {user.canCreateNews && (
                        <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                          <Newspaper className="h-3 w-3 mr-1" />
                          <span className="hidden lg:inline">{t('admin.users.news')}</span>
                        </Badge>
                      )}
                      {user.canViewContacts && (
                        <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
                          <Mail className="h-3 w-3 mr-1" />
                          <span className="hidden lg:inline">{t('admin.users.contacts')}</span>
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right space-x-1 whitespace-nowrap">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                      onClick={() => handleEdit(user)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-red-600 hover:text-red-800 hover:bg-red-100"
                      onClick={() => handleDelete(user)}
                      disabled={user.role === 'admin'} // Protect admin accounts
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
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('admin.users.noUsers')}</h3>
          <p className="text-gray-500 mb-6">{t('admin.users.getStarted')}</p>
          <Button 
            className="bg-primary hover:bg-primary/90"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            {t('admin.users.create')}
          </Button>
        </div>
      )}

      {/* Create User Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t('admin.users.createTitle')}</DialogTitle>
          </DialogHeader>
          <UserForm 
            onSuccess={() => setIsCreateDialogOpen(false)} 
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t('admin.users.editTitle')}</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <UserForm 
              user={selectedUser} 
              onSuccess={() => {
                setIsEditDialogOpen(false);
                setSelectedUser(null);
              }} 
              onCancel={() => {
                setIsEditDialogOpen(false);
                setSelectedUser(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('admin.users.confirmDelete')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('admin.users.confirmDeleteDesc')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t('admin.users.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('admin.users.deleting')}
                </>
              ) : (
                t('admin.users.delete')
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default UsersManagementPage;