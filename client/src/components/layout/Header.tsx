import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  MenuItem,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider,
  Avatar,
  useScrollTrigger,
  Slide,
  Fade,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LanguageIcon from "@mui/icons-material/Language";
import PersonIcon from "@mui/icons-material/Person";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import BusinessIcon from "@mui/icons-material/Business";

// Animation variants
const menuItemVariants = {
  hidden: { y: -10, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  },
  hover: { 
    scale: 1.05, 
    color: "#1a3a63",
    transition: { type: "spring", stiffness: 400, damping: 10 }
  }
};

// Hide on scroll
function HideOnScroll(props: { children: React.ReactElement }) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Header = () => {
  const [location] = useLocation();
  const { t } = useTranslation();
  const { language, changeLanguage } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [languageMenu, setLanguageMenu] = useState<null | HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);

  // Navigation items
  const navItems = [
    { href: "/", label: t('nav.home') },
    { href: "/about", label: t('nav.about') },
    { href: "/services", label: t('nav.services') },
    { href: "/projects", label: t('nav.projects') },
    { href: "/team", label: t('nav.team') },
    { href: "/news", label: t('nav.news') },
    { href: "/contact", label: t('nav.contact') },
  ];

  // Language options
  const languageOptions = [
    { code: 'fr', label: 'Français' },
    { code: 'en', label: 'English' },
    { code: 'zh', label: '中文' },
  ];

  // Check if scrolled
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Language menu handlers
  const handleOpenLanguageMenu = (event: React.MouseEvent<HTMLElement>) => {
    setLanguageMenu(event.currentTarget);
  };
  
  const handleCloseLanguageMenu = () => {
    setLanguageMenu(null);
  };

  const handleLanguageChange = (code: 'fr' | 'en' | 'zh') => {
    changeLanguage(code);
    handleCloseLanguageMenu();
  };

  // Mobile drawer handlers
  const toggleDrawer = () => {
    setMobileOpen(!mobileOpen);
  };

  const currentLanguageLabel = languageOptions.find(opt => opt.code === language)?.label || 'FR';

  return (
    <>
      <HideOnScroll>
        <AppBar 
          position="fixed" 
          color="default" 
          elevation={scrolled ? 4 : 0}
          sx={{ 
            backgroundColor: 'white',
            transition: 'all 0.3s',
            boxShadow: scrolled ? '0px 2px 10px rgba(0, 0, 0, 0.1)' : 'none',
            borderBottom: scrolled ? 'none' : '1px solid rgba(0, 0, 0, 0.05)'
          }}
        >
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              {/* Logo for desktop */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                  <BusinessIcon color="primary" sx={{ mr: 1, fontSize: 30 }} />
                  <Typography
                    variant="h6"
                    noWrap
                    component={Link}
                    href="/"
                    sx={{
                      display: { xs: 'none', md: 'flex' },
                      fontWeight: 700,
                      letterSpacing: '.1rem',
                      color: 'primary.main',
                      textDecoration: 'none',
                    }}
                  >
                    GROUPE LA CITADELLE
                  </Typography>
                </Box>
              </motion.div>

              {/* Mobile menu icon */}
              <Box sx={{ flexGrow: 0, display: { xs: 'flex', md: 'none' } }}>
                <IconButton
                  size="large"
                  aria-label="menu"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={toggleDrawer}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
              </Box>

              {/* Logo for mobile */}
              <Typography
                variant="h6"
                noWrap
                component={Link}
                href="/"
                sx={{
                  mr: 2,
                  display: { xs: 'flex', md: 'none' },
                  flexGrow: 1,
                  fontWeight: 700,
                  letterSpacing: '.1rem',
                  color: 'primary.main',
                  textDecoration: 'none',
                }}
              >
                LA CITADELLE
              </Typography>

              {/* Navigation for desktop */}
              <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 4 }}>
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    variants={menuItemVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    custom={index}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Button
                      component={Link}
                      href={item.href}
                      sx={{
                        my: 2,
                        mx: 1,
                        color: location === item.href ? 'primary.main' : 'text.secondary',
                        display: 'block',
                        fontWeight: location === item.href ? 600 : 500,
                        fontSize: '1rem',
                        '&:hover': {
                          backgroundColor: 'transparent',
                        },
                        position: 'relative',
                        '&::after': location === item.href ? {
                          content: '""',
                          position: 'absolute',
                          bottom: 0,
                          left: '50%',
                          width: '60%',
                          height: '3px',
                          backgroundColor: 'primary.main',
                          transform: 'translateX(-50%)',
                          borderRadius: '2px'
                        } : {}
                      }}
                    >
                      {item.label}
                    </Button>
                  </motion.div>
                ))}
              </Box>

              {/* Language selector */}
              <Box sx={{ flexGrow: 0, mr: 2 }}>
                <Button
                  onClick={handleOpenLanguageMenu}
                  endIcon={<KeyboardArrowDownIcon />}
                  startIcon={<LanguageIcon />}
                  sx={{ color: 'text.secondary' }}
                >
                  {language.toUpperCase()}
                </Button>
                <Menu
                  id="language-menu"
                  anchorEl={languageMenu}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(languageMenu)}
                  onClose={handleCloseLanguageMenu}
                >
                  {languageOptions.map((option) => (
                    <MenuItem 
                      key={option.code}
                      onClick={() => handleLanguageChange(option.code as 'fr' | 'en' | 'zh')}
                      selected={language === option.code}
                    >
                      <Typography textAlign="center">{option.label}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>

              {/* Admin Login Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  component={Link}
                  href="/admin/login"
                  variant="contained"
                  color="primary"
                  startIcon={<PersonIcon />}
                  sx={{ 
                    px: 2, 
                    display: { xs: 'none', sm: 'flex' },
                    borderRadius: '8px'
                  }}
                >
                  {t('nav.admin')}
                </Button>
              </motion.div>
            </Toolbar>
          </Container>
        </AppBar>
      </HideOnScroll>

      {/* Mobile drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={toggleDrawer}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': { width: 280, boxSizing: 'border-box' },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
          <BusinessIcon color="primary" sx={{ mr: 1, fontSize: 24 }} />
          <Typography variant="h6" color="primary.main" fontWeight={700}>
            GROUPE LA CITADELLE
          </Typography>
        </Box>
        <Divider />
        <List>
          {navItems.map((item) => (
            <ListItem key={item.href} disablePadding>
              <ListItemButton
                component={Link}
                href={item.href}
                onClick={toggleDrawer}
                selected={location === item.href}
                sx={{
                  pl: 3,
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(13, 127, 108, 0.08)',
                    borderLeft: '4px solid',
                    borderColor: 'secondary.main',
                    pl: 2,
                  },
                }}
              >
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: location === item.href ? 600 : 400,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            {t('header.language')}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {languageOptions.map((option) => (
              <Button
                key={option.code}
                variant={language === option.code ? "contained" : "outlined"}
                size="small"
                color={language === option.code ? "secondary" : "primary"}
                onClick={() => changeLanguage(option.code as 'fr' | 'en' | 'zh')}
                sx={{ minWidth: '80px' }}
              >
                {option.label}
              </Button>
            ))}
          </Box>
        </Box>
        <Box sx={{ p: 2, mt: 'auto' }}>
          <Button
            component={Link}
            href="/admin/login"
            variant="contained"
            color="primary"
            fullWidth
            startIcon={<PersonIcon />}
            onClick={toggleDrawer}
          >
            {t('nav.admin')}
          </Button>
        </Box>
      </Drawer>

      {/* Toolbar offset for fixed position */}
      <Toolbar />
    </>
  );
};

export default Header;

