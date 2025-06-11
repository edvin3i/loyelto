import { Stack, Box, Typography, TextField, Button } from "@mui/material";
import { useState } from "react";
import { useTheme, Theme } from '@mui/material/styles';

export default function Steps() {
    const theme = useTheme<Theme>();
    const [activeStep, setActiveStep] = useState(0);
    const [businessData, setBusinessData] = useState<{
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


    }>({
        name: null, slug: null, owner_email: null, country: null, city: null,
        address: null, zip_code: null, logo_url: null,
        description: null, rate_loyl: 0
    });


    // const handleNext = (value: string) => {

    //     setActiveStep((prevActiveStep) => prevActiveStep + 1);
    //     console.log(`printing from handleNext: ${value}. Active step is: ${activeStep}`)
    //     setBusinessData((prevData) => ({
    //         ...prevData,
    //         [steps[activeStep].name]: value,
    //     }));
    // };

    const toSnakeCase = (str: string): string => {
        return str
            .trim()
            .replace(/\s+/g, '_')
            .replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
            .replace(/^_+/, '')
            .toLowerCase();
    }

    // const handleSubmit(e)

    const handleNameEmail = (nameEmail: [string, string]): void => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        console.log(`printing from handleNext: ${nameEmail}. Active step is: ${activeStep}`)
        setBusinessData((prevData) => ({
            ...prevData,
            "name": nameEmail[0],
            "owner_email": nameEmail[1],
            "slug": toSnakeCase(nameEmail[0])
            // [steps[activeStep].name]: value,
        }));
    }


    // const steps = [
    //     { name: 'nameEmail', component: <FormText h='Votre nom et prénom' handleSubmit={handleNext} /> },
    //     { name: 'geography', component: <FormEmail handleSubmit={handleNext} /> },
    //     { name: "logoDescr", component: <FormText h="Nom de l'entreprise" handleSubmit={handleNext} /> },
    //     { name: "loylRating", component: <></> }
    // ];
    return (
        <>
            <Stack component="form" justifyContent='space-between'
                onSubmit={(e) => {
                    e.preventDefault();
                    console.log("Form submitted");
                    
                    
                    console.dir(e.target)
                    const form = e.target as HTMLFormElement;
                    const entrepriseInput = form.elements.namedItem("EntrepriseField") as HTMLInputElement;
                    const emailInput = form.elements.namedItem("EmailField") as HTMLInputElement;
                    handleNameEmail([entrepriseInput.value, emailInput.value])
                    // const input = form.elements.entreprise;
                    // console.log("tryna print form.elements:")
                    // console.dir(form.elements)
                    // console.log("input: ")
                    // console.dir(input)
                    // handleSubmit(input.value);
                    // handleSubmit(e.target.value)
                }}
                sx={{
                    backgroundColor: theme.palette.neutral.light,
                    borderRadius: 10,
                    width: '100vw',
                    boxSizing: 'border-box',
                    height: 587,
                    paddingY: 3,
                    paddingX: 2
                }}>
                <Stack id="formFieldsStack">
                    <Box sx={{ mb: 2, textAlign: "left" }}>
                        <Typography variant="h5" gutterBottom
                         sx={{fontWeight: 600, fontSize: 20 }}
                        >
                            Name of your business
                        </Typography>
                        <TextField
                            required
                            fullWidth
                            name="enterprise"
                            id="EntrepriseField"
                            type="text"
                            // value={formData.enterprise}
                            // onChange={handleChange}
                            variant="outlined"
                            sx={{ bgcolor: "white", }}

                        />
                    </Box>
                    <Box sx={{ mb: 2, textAlign: "left" }}>
                        <Typography variant="h5" gutterBottom
                         sx={{fontWeight: 600, fontSize: 20 }}>
                           Email
                        </Typography>
                        <TextField
                            required
                            fullWidth
                            name="email"
                            id="EmailField"
                            type="email"
                            // value={formData.enterprise}
                            // onChange={handleChange}
                            variant="outlined"
                            sx={{ bgcolor: "white", }}

                        />
                    </Box>

                </Stack>
                <Button fullWidth disableElevation size="large" color="success" variant="contained" type="submit">
                    Next
                </Button>

            </Stack>
        </>
    )
}