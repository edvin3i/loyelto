import { Box, Toolbar } from "@mui/material"
import { useState } from "react"
import Steps from "./Steps"
import LoyelToBar from "../landing/LoyelToBar";



export default function FormAndSteps() {
    
    return (
        <>
        <LoyelToBar/>
        <Toolbar/>
            <Box component="section"
            id="StepsOuterBox"
            sx={{
                marginTop: 20,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center', 
                alignItems: 'center'
            }}>
                <Steps />
            </Box>
        </>
    )
}