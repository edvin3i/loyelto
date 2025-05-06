import { Box } from "@mui/material"
import { useState } from "react"
import Steps from "./Steps"



export default function FormAndSteps(){
    const [formData, setFormData] = useState<{
        name: string | null;
        email: string | null;
        company: string | null;
        logo: string | null;
    }>({ name: null, email: null, company: null, logo: null });
    return(
        <Box component="section">
            <Steps/>
        </Box>
    )
}