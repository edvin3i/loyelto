import { Box, Typography, InputLabel, Select, SelectChangeEvent, MenuItem } from '@mui/material'
import { useState } from 'react';

export default function BusinessTypeForm() {
    const [businessType, setBusinessType] = useState('');
    const handleChange = (event: SelectChangeEvent) => {
        setBusinessType(event.target.value);
    }

    return (
        <Box
            component="form"
            autoComplete="off"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
            }}
            onSubmit={(e) => {
                e.preventDefault();
                console.log("Form submitted");
            }}
        >
            <Typography variant="h3" color="initial">Votre secteur d'activité</Typography>
            <InputLabel id="BusinessTypeLabel">Industrie</InputLabel>
        <Select
          labelId="BusinessTypeLabel"
          id="BusinessType"
          value={businessType}
          onChange={handleChange}
          label="Industrie"
          required
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value="restaurant">Restauration</MenuItem>
          <MenuItem value="boulangerie">Boulangerie</MenuItem>
          <MenuItem value="bookstore">Librairie</MenuItem>
          <MenuItem value="bookstore">Epicerie</MenuItem>
        </Select>
        </Box>
    )
}