import { Box, Typography, Link } from "@mui/material";

export default function SocialLinks() {
  return (
    <Box sx={{ textAlign: "center", my: 3, pb: 4 }}>
      <Typography variant="body1">
        Follow us on{" "}
        <Link 
          href="https://linkedin.com/company/loyelto" 
          target="_blank" 
          rel="noopener noreferrer"
          sx={{ fontWeight: "bold", textDecoration: "none" }}
        >
          LinkedIn
        </Link>
        ,{" "}
        <Link 
          href="https://t.me/loyelto" 
          target="_blank" 
          rel="noopener noreferrer"
          sx={{ fontWeight: "bold", textDecoration: "none" }}
        >
          Telegram
        </Link>
      </Typography>
    </Box>
  );
}