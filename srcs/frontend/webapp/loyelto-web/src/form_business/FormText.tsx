import { Typography, TextField, Box } from "@mui/material";

// import {useState} from 'react' maybe we don't actually need it

export default function FormText(){
    // const [data, setData] = useState('');
    
    return(
    <Box  component="form"
    noValidate
    autoComplete="off"
    sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    }}>
        <Typography variant="h3" color="initial">Dites-nous le nom de votre boîte</Typography>
        <TextField
          required
          id="BusinessName"
          label="Requis"
          defaultValue=""
          variant="standard"
        />
    </Box>
    );
}