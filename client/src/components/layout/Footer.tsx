import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Paper,
  useTheme,
  alpha,
} from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

const socialIconVariants = {
  hover: {
    y: -5,
    scale: 1.1,
    transition: { type: "spring", stiffness: 400, damping: 10 }
  }
};

const listItemVariants = {
  hover: {
    x: 5,
    transition: { type: "spring", stiffness: 400, damping: 10 }
  }
};

const Footer = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  const servicesLinks = [
    { href: "/services#infrastructure", label: t('services.infrastructure.title') },
    { href: "/services#engineering", label: t('services.engineering.title') },
    { href: "/services#realestate", label: t('services.realestate.title') },
    { href: "/services#insurance", label: t('services.insurance.title') },
    { href: "/services#partnerships", label: t('services.partnerships.title') },
  ];

  const navLinks = [
    { href: "/", label: t('nav.home') },
    { href: "/about", label: t('nav.about') },
    { href: "/services", label: t('nav.services') },
    { href: "/projects", label: t('nav.projects') },
    { href: "/team", label: t('nav.team') },
    { href: "/news", label: t('nav.news') },
    { href: "/contact", label: t('nav.contact') },
  ];

  const contactInfo = [
    { 
      icon: <LocationOnIcon />, 
      text: t('contact.info.addressLine1'),
      link: "https://maps.google.com"
    },
    { 
      icon: <PhoneIcon />, 
      text: `${t('contact.info.phone1')} / ${t('contact.info.phone2')}`,
      link: `tel:${t('contact.info.phone1').replace(/\s/g, '')}`
    },
    { 
      icon: <EmailIcon />, 
      text: t('contact.info.emailAddress'),
      link: `mailto:${t('contact.info.emailAddress')}`
    },
  ];

  const socialLinks = [
    { icon: <FacebookIcon />, label: "Facebook", href: "#" },
    { icon: <TwitterIcon />, label: "Twitter", href: "#" },
    { icon: <LinkedInIcon />, label: "LinkedIn", href: "#" },
    { icon: <InstagramIcon />, label: "Instagram", href: "#" },
  ];

  return (
    <Box component="footer" sx={{ 
      bgcolor: 'primary.main', 
      color: 'white',
      pt: 6,
      pb: 4,
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 50%)',
        pointerEvents: 'none',
        zIndex: 1,
      }
    }}>
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <Grid container spacing={4}>
            {/* Column 1 - About */}
            <Grid item xs={12} md={6} lg={3}>
              <motion.div variants={itemVariants}>
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <BusinessIcon sx={{ mr: 1, fontSize: 28 }} />
                  <Typography variant="h6" fontWeight="bold" sx={{ letterSpacing: 1 }}>
                    GROUPE LA CITADELLE
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
                  {t('footer.aboutText')}
                </Typography>

                <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                  {socialLinks.map((social, index) => (
                    <motion.div
                      key={social.label}
                      variants={socialIconVariants}
                      whileHover="hover"
                      custom={index}
                    >
                      <IconButton
                        href={social.href}
                        aria-label={social.label}
                        sx={{
                          color: 'white',
                          transition: 'all 0.3s',
                          background: alpha('#fff', 0.1),
                          '&:hover': {
                            background: alpha('#fff', 0.2),
                          }
                        }}
                      >
                        {social.icon}
                      </IconButton>
                    </motion.div>
                  ))}
                </Stack>
              </motion.div>
            </Grid>

            {/* Column 2 - Services */}
            <Grid item xs={12} sm={6} lg={3}>
              <motion.div variants={itemVariants}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                  {t('footer.services')}
                </Typography>
                <List disablePadding>
                  {servicesLinks.map((link) => (
                    <motion.div 
                      key={link.href}
                      variants={listItemVariants}
                      whileHover="hover"
                    >
                      <ListItem 
                        component={Link} 
                        href={link.href}
                        sx={{ 
                          py: 0.5, 
                          px: 0, 
                          color: 'white',
                          textDecoration: 'none',
                          '&:hover': {
                            color: alpha('#fff', 0.8),
                          }
                        }}
                        disableGutters
                      >
                        <ListItemIcon sx={{ color: 'inherit', minWidth: 30 }}>
                          <KeyboardArrowRightIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={link.label} 
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    </motion.div>
                  ))}
                </List>
              </motion.div>
            </Grid>

            {/* Column 3 - Navigation */}
            <Grid item xs={12} sm={6} lg={3}>
              <motion.div variants={itemVariants}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                  {t('footer.navigation')}
                </Typography>
                <List disablePadding>
                  {navLinks.map((link) => (
                    <motion.div 
                      key={link.href}
                      variants={listItemVariants}
                      whileHover="hover"
                    >
                      <ListItem 
                        component={Link} 
                        href={link.href}
                        sx={{ 
                          py: 0.5, 
                          px: 0, 
                          color: 'white',
                          textDecoration: 'none',
                          '&:hover': {
                            color: alpha('#fff', 0.8),
                          }
                        }}
                        disableGutters
                      >
                        <ListItemIcon sx={{ color: 'inherit', minWidth: 30 }}>
                          <KeyboardArrowRightIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={link.label}
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    </motion.div>
                  ))}
                </List>
              </motion.div>
            </Grid>

            {/* Column 4 - Contact */}
            <Grid item xs={12} md={6} lg={3}>
              <motion.div variants={itemVariants}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                  {t('footer.contact')}
                </Typography>
                <List disablePadding>
                  {contactInfo.map((info, index) => (
                    <ListItem 
                      key={index}
                      component="a"
                      href={info.link}
                      disableGutters
                      sx={{ 
                        py: 1.5, 
                        px: 0, 
                        color: 'white',
                        textDecoration: 'none',
                        '&:hover': {
                          color: alpha('#fff', 0.8),
                        }
                      }}
                    >
                      <ListItemIcon sx={{ color: 'white', minWidth: 36 }}>
                        {info.icon}
                      </ListItemIcon>
                      <ListItemText 
                        primary={info.text}
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </motion.div>
            </Grid>
          </Grid>

          <motion.div variants={itemVariants}>
            <Divider sx={{ my: 4, opacity: 0.2, borderColor: 'white' }} />
          
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'center', md: 'flex-start' }
            }}>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                {t('footer.copyright').replace('2023', currentYear.toString())}
              </Typography>
              
              <Box sx={{ mt: { xs: 2, md: 0 } }}>
                <Button 
                  component="a" 
                  href="#"
                  color="inherit"
                  size="small"
                  sx={{ opacity: 0.7, textTransform: 'none', mr: 2 }}
                >
                  {t('footer.privacy')}
                </Button>
                <Button 
                  component="a" 
                  href="#"
                  color="inherit"
                  size="small"
                  sx={{ opacity: 0.7, textTransform: 'none' }}
                >
                  {t('footer.legal')}
                </Button>
              </Box>
            </Box>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Footer;

