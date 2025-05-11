import { Box, Typography, Link } from "@mui/material";
import SocialsLink from "./SocialsLink";
import { socialLinks } from "./links";

export default function SocialLinks() {
  return (
    <Box sx={{my: 3, pb: 4 }}>
      <Typography variant="body1">
        Follow us on{" "}
        {socialLinks.map((l, index) => (
          <span key={l.social}>
            <SocialsLink url={l.url} social={l.social} />
            {index < socialLinks.length - 1 && ", "}
          </span>
        ))}
        {/* <Link 
          href="https://linkedin.com/company/loyelto" 
          target="_blank" 
          rel="noopener noreferrer"
          color="inherit"
          sx={{ fontWeight: "bold"}}
        >
          LinkedIn
        </Link>
        ,{" "}
        <Link 
          href="https://t.me/loyelto" 
          target="_blank" 
          rel="noopener noreferrer"
          color="inherit"
          sx={{ fontWeight: "bold"}}
        >
          Telegram
        </Link> */}
      </Typography>
    </Box>
  );
}