import { Stack, Typography, TextField, Box, Button } from "@mui/material"
import { useTheme, Theme } from '@mui/material/styles';
import FormFieldElement from "./FormFieldElement";


type FormInstanceProps = {
    handleSubmit: (values: string[]) => void;
    fieldsAndParams: string[][] | null;
};

export default function FormInstance({ handleSubmit, fieldsAndParams }: FormInstanceProps) {
    const theme = useTheme<Theme>();
    return (
        <Stack component="form" justifyContent='space-between'
            onSubmit={(e) => {
                e.preventDefault();
                console.log("Form submitted");
                let values: string[] = []
                const form = e.target as HTMLFormElement;
                fieldsAndParams && fieldsAndParams.forEach((f) => {
                    const input = form.elements.namedItem(f[2]) as HTMLInputElement;
                    values.push(input.value)
                })
                
                handleSubmit(values)
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
            <Stack sx={{paddingY: 1}}>
                {fieldsAndParams && fieldsAndParams.map((f, i) => {
                    console.dir(f)
                    return <FormFieldElement key={i} heading={f[0]} type={f[1]} fieldId={f[2]} fieldName={f[3]} />
                })}
               
            </Stack>
            <Button fullWidth disableElevation size="large" color="success" variant="contained" type="submit">
                Next
            </Button>

        </Stack>
    )
}