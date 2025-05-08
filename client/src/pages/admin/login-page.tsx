import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Redirect, Link } from "wouter";
import { Helmet } from "react-helmet";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  Grid,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  CircularProgress,
  Alert,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import BusinessIcon from "@mui/icons-material/Business";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const loginSchema = z.object({
  username: z.string().min(1, { message: "Le nom d'utilisateur est requis" }),
  password: z.string().min(1, { message: "Le mot de passe est requis" }),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const { t } = useTranslation();
  const { user, loginMutation } = useAuth();
  const [rememberMe, setRememberMe] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    },
  };

  // Initialize form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
  });

  // Handle form submission
  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate({
      username: data.username,
      password: data.password,
    });
  };

  // If user is already logged in, redirect to admin dashboard
  if (user) {
    return <Redirect to="/admin/dashboard" />;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        bgcolor: "#f5f7fa",
      }}
    >
      <Helmet>
        <title>{t("admin.login.title")} | Groupe La Citadelle S.A.</title>
      </Helmet>

      <Container maxWidth="lg">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <Grid container spacing={3} sx={{ justifyContent: "center", alignItems: "center" }}>
            <Grid xs={12} md={6}>
              <motion.div variants={itemVariants}>
                <Paper
                  elevation={5}
                  sx={{
                    p: 5,
                    borderRadius: 2,
                    backdropFilter: "blur(20px)",
                    bgcolor: "rgba(255, 255, 255, 0.95)",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <Box
                    sx={{
                      mb: 4,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    >
                      <BusinessIcon
                        color="primary"
                        sx={{ fontSize: 60, mb: 2 }}
                      />
                    </motion.div>
                    <Typography
                      component="h1"
                      variant="h4"
                      color="primary"
                      fontWeight="bold"
                      gutterBottom
                    >
                      {t("admin.login.title")}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" align="center">
                      Espace réservé à l'administration de La Citadelle
                    </Typography>
                  </Box>

                  {loginMutation.isError && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Alert severity="error" sx={{ mb: 3 }}>
                        Identifiants incorrects. Veuillez réessayer.
                      </Alert>
                    </motion.div>
                  )}

                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <motion.div variants={itemVariants}>
                      <Controller
                        name="username"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <TextField
                            {...field}
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Nom d'utilisateur"
                            placeholder="admin"
                            autoComplete="username"
                            autoFocus
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <PersonIcon color="primary" />
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <Controller
                        name="password"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <TextField
                            {...field}
                            margin="normal"
                            required
                            fullWidth
                            id="password"
                            label="Mot de passe"
                            type="password"
                            placeholder="••••••••••••••••"
                            autoComplete="current-password"
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <LockIcon color="primary" />
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={rememberMe}
                              onChange={(e) => setRememberMe(e.target.checked)}
                              color="primary"
                            />
                          }
                          label={
                            <Typography variant="body2">
                              {t("admin.login.remember")}
                            </Typography>
                          }
                        />
                      </Box>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        disabled={loginMutation.isPending}
                        size="large"
                        sx={{
                          mt: 3,
                          mb: 2,
                          py: 1.5,
                          borderRadius: 2,
                          position: "relative",
                        }}
                      >
                        {loginMutation.isPending ? (
                          <CircularProgress
                            size={24}
                            sx={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              marginTop: "-12px",
                              marginLeft: "-12px",
                            }}
                          />
                        ) : (
                          t("admin.login.submit")
                        )}
                      </Button>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <Box sx={{ mt: 3, textAlign: "center" }}>
                        <Link href="/">
                          <Button
                            startIcon={<ArrowBackIcon />}
                            color="primary"
                            sx={{ textTransform: "none" }}
                          >
                            Retour au site principal
                          </Button>
                        </Link>
                      </Box>
                    </motion.div>
                  </form>
                </Paper>
              </motion.div>
            </Grid>

            <Grid xs={12} md={6} sx={{ display: { xs: "none", md: "block" } }}>
              <motion.div variants={itemVariants}>
                <Box p={4}>
                  <Typography
                    variant="h4"
                    color="primary"
                    gutterBottom
                    fontWeight="bold"
                  >
                    Groupe La Citadelle
                  </Typography>
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    Ingénierie, BTP & Services
                  </Typography>
                  <Typography variant="body1" paragraph sx={{ mt: 2 }}>
                    Bienvenue dans l'espace d'administration du Groupe La Citadelle. Cet espace est réservé aux administrateurs autorisés.
                  </Typography>
                  <Box
                    sx={{
                      mt: 4,
                      p: 3,
                      bgcolor: "primary.light",
                      color: "white",
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="body2" fontWeight="medium">
                      Note: Pour accéder à cet espace, utilisez les identifiants qui vous ont été communiqués. En cas de problème d'accès, veuillez contacter le service informatique.
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default LoginPage;
