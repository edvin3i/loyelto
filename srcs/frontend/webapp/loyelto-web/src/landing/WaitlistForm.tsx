import { Box, Typography, TextField, Button, Snackbar, Alert } from "@mui/material";
import { useState } from "react";
import emailjs from '@emailjs/browser';
import { useTheme, Theme } from '@mui/material/styles'

// You'll need to install EmailJS: npm install @emailjs/browser

export default function WaitlistForm() {
  const theme = useTheme<Theme>();
  const [formData, setFormData] = useState({
    enterprise: "",
    phone: "",
    email: ""
  });
  
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
    emailjs.init("50jVmxtdntqkpgv22");
    
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
      'service_kq8lk8e',
      'template_0qgzw6y',
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
        width: '100%', // Full width
        my: 4,
        textAlign: "center"
      }}
    >
      <Typography variant="h4" gutterBottom sx={{fontWeight: 'bold'}}>
        Rejoindre la liste d'attente
      </Typography>
      
      <Box 
        component="form" 
        onSubmit={handleSubmit} 
        sx={{ 
          mt: 3,
          maxWidth: "600px", // Constrain the form fields for better readability
          mx: "auto" // Center the form within the full-width container
        }}
      >
        <Box sx={{ mb: 2, textAlign: "left" }}>
          <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold' }}>
            Nom de l'entreprise:
          </Typography>
          <TextField
            fullWidth
            name="enterprise"
            value={formData.enterprise}
            onChange={handleChange}
            variant="outlined"
            sx={{ bgcolor: "white" }}
          />
        </Box>
        
        <Box sx={{ mb: 2, textAlign: "left" }}>
          <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold' }}>
            Numéro de téléphone:
          </Typography>
          <TextField
            fullWidth
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            variant="outlined"
            sx={{ bgcolor: "white" }}
          />
        </Box>
        
        <Box sx={{ mb: 3, textAlign: "left" }}>
          <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold' }}>
            E-mail:
          </Typography>
          <TextField
            fullWidth
            name="email"
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
            mt: 2,
            py: 1.5,
            borderRadius: 3,
           // bgcolor: "#a6d4fa", // Light blue button color
            // color: "black",
            "&:hover": {
              bgcolor: "#7ac0fa"
            }
          }}
        >
          Envoyer le formulaire
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