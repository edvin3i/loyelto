import { Typography, TextField, Box } from "@mui/material"

interface FormFieldProps {
    heading: string,
    type: string,
  
    fieldId: string,
    fieldName: string
}

export default function FormFieldElement({ heading, type, fieldId, fieldName }: FormFieldProps) {
    return (
        <Box sx={{ mb: 2 }}>
            <Typography variant="h5" gutterBottom
            sx={{ fontWeight: 600, fontSize: 20 }}
            >
            {heading}
            </Typography>
                <TextField
                required
                fullWidth
                name={fieldName}
                id={fieldId}
                type={type}
                variant="outlined"
                sx={{
                    bgcolor: "white",
                borderRadius: 3,
                "& .MuiOutlinedInput-notchedOutline": {
                border: "none"
                }
            }}
            />
        </Box>
    )
}