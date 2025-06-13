import { Stack, Typography, TextField, Box, Button, IconButton } from "@mui/material"
import { useTheme, Theme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';


type LoylRateProps = {
    handleSubmit: (rate: number) => void;
}

export default function LoylRateForm({ handleSubmit }: LoylRateProps) {
    const theme = useTheme<Theme>();
    return (
        <Stack component="form" justifyContent='space-between'
            onSubmit={(e) => {
                e.preventDefault();
                console.log("Form submitted");
                const form = e.target as HTMLFormElement;
                const averageSpend = form.elements.namedItem("AverageSpend") as HTMLInputElement;
                const avSp = Number(averageSpend.value)

                handleSubmit(avSp)
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
                <Stack direction="row" sx={{ justifyContent: 'space-between', marginY: 3 }}>
                    <Typography variant="h5" color="initial" gutterBottom
                        sx={{ fontWeight: '600', fontSize: '1.3rem' }}>My loyalty program</Typography>
                    <IconButton size="small">
                        <InfoOutlineIcon />
                    </IconButton>
                </Stack>
                <Stack direction="row" spacing={2}>
                    <Button disableElevation size="small" variant="contained" color="info"><RemoveIcon /></Button>
                    <TextField
                        required
                        type="text"
                        id="AverageSpend"
                        inputProps={{
                            inputMode: "numeric",
                            pattern: "[0-9]*",
                            style: { textAlign: 'center', fontSize: 34, fontWeight: 600 }
                        }}
                        sx={{
                            bgcolor: "white",
                            
                            "& .MuiOutlinedInput-notchedOutline": {
                                border: "none"
                            }
                        }}
                    />
                    <Button disableElevation size="small" variant="contained" color="info"><AddIcon /></Button>

                </Stack>

            </Stack>
            <Button fullWidth disableElevation size="large" color="success" variant="contained" type="submit">
                Next
            </Button>

        </Stack>
    )

}