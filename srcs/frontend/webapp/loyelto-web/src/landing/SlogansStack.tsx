import { Stack } from "@mui/material";
import SloganBox from "./SloganBox";

interface SloganStackProps{
  
    bgcolor: string;
    slogans: { slogan: string; comment: string }[];   
}

export default function SlogansStack({bgcolor, slogans}: SloganStackProps){
    return (
        <Stack direction="row" spacing={2}>
                {slogans.map((sl) => {
                    return <SloganBox slogan={sl.slogan} comment={sl.comment} bgcolor={bgcolor} />
                })}
            </Stack>
            
            
    )
}