import { Box, Typography, TextField, Button, Snackbar, Alert } from "@mui/material";
import { useState } from "react";
import emailjs from '@emailjs/browser';
import { useTheme, Theme } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'

export default function WaitlistForm() {
  const theme = useTheme<Theme>();
  const [formData, setFormData] = useState({
    enterprise: "",
    phone: "",
    email: ""
  });
  const { t } = useTranslation();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Make sure to use the correct public key format
    emailjs.init("0MSYJSYKK43wKxqnU");//Sveta Vydrina's credentials

    // Make sure these parameter names EXACTLY match your EmailJS template variables
    const templateParams = {
      enterprise_name: formData.enterprise,
      phone_number: formData.phone,
      email: formData.email, // Try using 'email' instead of 'from_email'
      message: `New waitlist signup from enterprise ${formData.enterprise}. Phone ${formData.phone}. Email: ${formData.email}`, // Add a message field
      // Include any other fields your template might be expecting
    };

    console.log("Sending with params:", templateParams); // Debug log

    emailjs.send(
      'service_vf5seeb',
      'template_mpdnwfa',
      templateParams
    )
      .then((response) => {
        console.log('Email sent successfully:', response);
        setSnackbar({
          open: true,
          message: 'Formulaire envoyé avec succès!',
          severity: 'success'
        });
        // Reset form after successful submission
        setFormData({ enterprise: "", phone: "", email: "" });
      })
      .catch((error) => {
        console.error('Email sending failed:', error);
        setSnackbar({
          open: true,
          message: 'Échec de l\'envoi du formulaire. Veuillez réessayer.',
          severity: 'error'
        });
      });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box
      id="join-waitlist"
      sx={{
        bgcolor: theme.palette.secondary.main, // Light green background similar to your screenshot
        padding: 4,
        borderRadius: 6,
        width: '100%',
        // marginX: {sm:'auto', xs: 0},
        my: 4,
        textAlign: "center"
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        {t('waitListFormHeading')}
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
  
        sx={{
          mt: 3,
          width: { sm: 600 },// Constrain the form fields for better readability
          mx: "auto" // Center the form within the full-width container
        }}
      >
        <Box sx={{ mb: 2, textAlign: "left" }}>
          <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold' }}>
            {t('waitListFormCompany')}:
          </Typography>
          <TextField
            required
            fullWidth
            name="enterprise"
            type="text"
            value={formData.enterprise}
            onChange={handleChange}
            variant="outlined"
            sx={{ bgcolor: "white" }}

          />
        </Box>

        <Box sx={{ mb: 2, textAlign: "left" }}>
          <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold' }}>
            {t('waitListFormPhone')}:
          </Typography>
          <TextField
            required
            fullWidth
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            variant="outlined"
            sx={{ bgcolor: "white" }}

          />
        </Box>

        <Box sx={{ mb: 3, textAlign: "left" }}>
          <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold' }}>
            {t('waitListFormEmail')}:
          </Typography>
          <TextField
            required
            fullWidth
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            variant="outlined"
            sx={{ bgcolor: "white" }}

          />
        </Box>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            mt: 5,
            py: 1.5,
            borderRadius: 3,
            fontWeight: 'bold',
            textTransform: 'none',
            "&:hover": {
              bgcolor: "#7ac0fa"
            }
          }}
        >
          {t('waitListFormButton')}
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}