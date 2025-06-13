
import { useEffect, useCallback, useMemo } from 'react';
import { Typography, TextField, Box } from "@mui/material"

interface BusinessData {
       name: string | null;
        slug: string | null;
        owner_email: string | null;
        country: string | null;
        city: string | null;
        address: string | null;
        zip_code: string | null;
        logo_url: string | null;
        description: string | null;
        rate_loyl: number;
}

export default function SignupCompleted({ businessData }: { businessData: BusinessData }) {
    // You can now use name, email, and company here
    const stableBusinessData = useMemo(() => businessData, [businessData]);
    
    // const sendEmail = useCallback((stableBusinessData: BusinessData) => {
    //     emailjs.init('0MSYJSYKK43wKxqnU');

    //     const templateParams = {
    //         enterprise_name: stableBusinessData.name,
    //         email: stableBusinessData.email,
    //         company: stableBusinessData.company, // Try using 'email' instead of 'from_email'
    //         message: `New waitlist signup from enterprise: ${stableBusinessData.name}; Email: ${stableBusinessData.email}; Company: ${stableBusinessData.company}`, // Add a message field
    //         // Include any other fields your template might be expecting
    //     };
    //     console.log("Sending with params:", templateParams); // Debug log
    //     emailjs.send(
    //         'service_vf5seeb',
    //         'template_mpdnwfa',
    //         templateParams
    //     )
    //         .then((response) => {
    //             console.log('Email sent successfully:', response);
    //         })
    //         .catch((error) => {
    //             console.error('Email sending failed:', error);
    //         });
    // }, []);

    useEffect(() => {
        console.log("trying to send business data!")
        console.dir(stableBusinessData)
        const sendPostRequest = async (data: BusinessData) => {
            try {
            const response = await fetch('api.stage.loyel.to/v1/businesses/', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            // Optionally handle response data here
            } catch (error) {
            console.error('Failed to send business data:', error);
            }
        };

        sendPostRequest(stableBusinessData);
    }, [stableBusinessData]);

    return (
        <Box>
            <Typography sx={{ mt: 2, mb: 1 }}>
                All steps completed - you&apos;re finished
            </Typography>
        </Box>
    )
}