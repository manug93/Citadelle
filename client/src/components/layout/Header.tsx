import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, User } from "lucide-react";

const Header = () => {
  const [location] = useLocation();
  const { t } = useTranslation();
  const { language, changeLanguage } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navItems = [
    { href: "/", label: t('nav.home') },
    { href: "/about", label: t('nav.about') },
    { href: "/services", label: t('nav.services') },
    { href: "/projects", label: t('nav.projects') },
    { href: "/team", label: t('nav.team') },
    { href: "/news", label: t('nav.news') },
    { href: "/contact", label: t('nav.contact') },
  ];

  const languageOptions = [
    { code: 'fr', label: 'Français' },
    { code: 'en', label: 'English' },
    { code: 'zh', label: '中文' },
  ];

  const currentLanguageLabel = languageOptions.find(opt => opt.code === language)?.label || 'FR';

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            {/* Logo */}
            <Link href="/">
              <a className="text-primary font-bold text-2xl">
                GROUPE LA CITADELLE
              </a>
            </Link>
            
            {/* Language Selector */}
            <div className="hidden md:block relative ml-6">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center text-neutral hover:text-primary transition duration-200">
                    <span className="mr-1">{language.toUpperCase()}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {languageOptions.map((option) => (
                    <DropdownMenuItem 
                      key={option.code}
                      onClick={() => changeLanguage(option.code as 'fr' | 'en' | 'zh')}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {/* Main Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <a className={`text-neutral hover:text-primary font-medium ${location === item.href ? 'text-primary' : ''}`}>
                  {item.label}
                </a>
              </Link>
            ))}
          </nav>
          
          {/* Admin Login Button */}
          <div className="hidden md:block">
            <Link href="/admin/login">
              <Button className="flex items-center bg-primary text-white hover:bg-primary/90 transition duration-200">
                <User className="h-4 w-4 mr-2" />
                {t('nav.admin')}
              </Button>
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button variant="ghost" onClick={toggleMobileMenu} className="text-neutral hover:text-primary">
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <a 
                    className={`text-neutral hover:text-primary font-medium ${location === item.href ? 'text-primary' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                </Link>
              ))}
              
              <div className="flex space-x-4 items-center pt-2">
                <Link href="/admin/login">
                  <Button 
                    className="bg-primary text-white hover:bg-primary/90 transition duration-200 flex items-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="h-4 w-4 mr-2" />
                    {t('nav.admin')}
                  </Button>
                </Link>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center text-neutral hover:text-primary transition duration-200">
                      <span className="mr-1">{language.toUpperCase()}</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {languageOptions.map((option) => (
                      <DropdownMenuItem 
                        key={option.code}
                        onClick={() => changeLanguage(option.code as 'fr' | 'en' | 'zh')}
                      >
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
