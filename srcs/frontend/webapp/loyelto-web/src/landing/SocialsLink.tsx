import { Link } from "@mui/material";

interface SocialsLinkProps {
    url: string;
    social: string;
}

export default function SocialsLink({ url, social }: SocialsLinkProps) {
    return (
        <Link
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            color="inherit"
            sx={{ fontWeight: "bold" }}
        >
            {social} 
        </Link>
    );
}