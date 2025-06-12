import { Stack, Typography, TextField, Box, Button } from "@mui/material"
import { useTheme, Theme } from '@mui/material/styles';
import FormFieldElement from "./FormFieldElement";
interface NameEmailFormProps {
    handleSubmit: (values: [string, string]) => void;
}

export default function NameEmailForm({handleSubmit}: NameEmailFormProps){
    const theme = useTheme<Theme>();
    return (
        <Stack component="form" justifyContent='space-between'
                onSubmit={(e) => {
                    e.preventDefault();
                    console.log("Form submitted");
                    const form = e.target as HTMLFormElement;
                    const entrepriseInput = form.elements.namedItem("EntrepriseField") as HTMLInputElement;
                    const emailInput = form.elements.namedItem("EmailField") as HTMLInputElement;
                    handleSubmit([entrepriseInput.value, emailInput.value])
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
                    <FormFieldElement heading="Name of your business" type="text" fieldId="EntrepriseField" fieldName="entreprise" />
                    <FormFieldElement heading="Email" type="email" fieldId="EmailField" fieldName="email" />
                </Stack>
                <Button fullWidth disableElevation size="large" color="success" variant="contained" type="submit">
                    Next
                </Button>

            </Stack>
    )
}