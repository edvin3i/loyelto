import emailjs from '@emailjs/browser'
import { useEffect, useCallback, useMemo } from 'react';
import { Box, Typography } from '@mui/material'

interface BusinessData {
    name: string | null;
    email: string | null;
    company: string | null;
}



export default function SignupCompleted({ businessData }: { businessData: BusinessData }) {
    // You can now use name, email, and company here
    const stableBusinessData = useMemo(() => businessData, [businessData]);
    
    const sendEmail = useCallback((stableBusinessData: BusinessData) => {
        emailjs.init('0MSYJSYKK43wKxqnU');

        const templateParams = {
            enterprise_name: stableBusinessData.name,
            email: stableBusinessData.email,
            company: stableBusinessData.company, // Try using 'email' instead of 'from_email'
            message: `New waitlist signup from enterprise: ${stableBusinessData.name}; Email: ${stableBusinessData.email}; Company: ${stableBusinessData.company}`, // Add a message field
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
            })
            .catch((error) => {
                console.error('Email sending failed:', error);
            });
    }, []);

    useEffect(() => {
        sendEmail(stableBusinessData);
    }, [sendEmail, stableBusinessData]);

    return (
        <Box>
            <Typography sx={{ mt: 2, mb: 1 }}>
                All steps completed - you&apos;re finished
            </Typography>
        </Box>
    )
}