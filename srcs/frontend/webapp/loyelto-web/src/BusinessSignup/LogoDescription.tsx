import { Stack, Button, Typography, TextField } from "@mui/material"
import { useTheme, Theme } from '@mui/material/styles';
import { useState } from "react";
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import { LocalFireDepartment } from "@mui/icons-material";

type LogoDescriptionProps = {
    handleSubmit: (values: string[]) => void;

};

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});


export default function LogoDescription({ handleSubmit }: LogoDescriptionProps) {
    const [logoSrc, setLogoSrc] = useState<string | undefined>(undefined);
    const theme = useTheme<Theme>();

    const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setLogoSrc(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    }
    return (
        <Stack component="form" justifyContent='space-between'
            onSubmit={(e) => {
                e.preventDefault();
                console.log("Form submitted");
                let values: string[] = []
                const form = e.target as HTMLFormElement;

                const descriptionInput = form.elements.namedItem("Description") as HTMLInputElement;
                logoSrc && handleSubmit([logoSrc, descriptionInput.value])

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
            <Stack sx={{ paddingY: 1 }} spacing={3}>
                <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                    <Typography variant="h5" sx={{ fontWeight: 600, fontSize: 20 }}>
                        Logo
                    </Typography>
                    <Button
                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        endIcon={<AddIcon />}
                        disableElevation
                    >
                        Add
                        <VisuallyHiddenInput
                            required
                            type="file"
                            onChange={handleLogoChange}
                            multiple
                        />
                    </Button>
                </Stack>
                <TextField
                    required
                    id="Description"
                    name="description"

                    multiline
                    rows={4}
                    placeholder="Example: cozy Italian restaurant offering fresh pasta, espresso, and homemade desserts in a homely ambiance (max 140 symbols)"
                    sx={{
                        bgcolor: "white",
                        borderRadius: 3,
                        "& .MuiOutlinedInput-notchedOutline": {
                            border: "none"
                        }
                    }}
                />
            </Stack>
            <Button fullWidth disableElevation size="large" color="success" variant="contained" type="submit">
                Next
            </Button>

        </Stack>

    )
}