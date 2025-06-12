import { Stack, Box, Typography, TextField, Button } from "@mui/material";
import { useState } from "react";
import { useTheme, Theme } from '@mui/material/styles';
import NameEmailForm from "./NameEmailForm";
import FormInstance from "./FormInstance";

const formProps = [
        [
            ["Name of your business", "text", "EntrepriseField", "name"],
            ["Email", "email", "EmailField", "owner_email"]
        ],
        [
            ["Country", "text", "CountryField", "country"],
            ["City", "text", "CityField", "city"],
            ["Address", "text", "AddressField", "address"],
            ["Zip code", "number", "ZipCodeField", "zip_code"]
        ]
]

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

    const toSnakeCase = (str: string): string => {
        return str
            .trim()
            .replace(/\s+/g, '_')
            .replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
            .replace(/^_+/, '')
            .toLowerCase();
    }

    const handleNameEmail = (nameEmail: string[]): void => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        console.log(`printing from handleNameEmail: ${nameEmail}. Active step is: ${activeStep}`)
        setBusinessData((prevData) => ({
            ...prevData,
            "name": nameEmail[0],
            "owner_email": nameEmail[1],
            "slug": toSnakeCase(nameEmail[0])
        }));
    }

    const handleGeography = (geography: string[]) : void =>{
         setActiveStep((prevActiveStep) => prevActiveStep + 1);
        console.log(`printing from handleNameEmail: ${geography}. Active step is: ${activeStep}`)
        setBusinessData((prevData) => ({
            ...prevData,
            "country": geography[0],
            "city": geography[1],
            "address": geography[2],
            "zip_code": geography[3]
        }));
    }

    const steps = [
        {name: 'nameEmail', component: <FormInstance handleSubmit={handleNameEmail} fieldsAndParams={formProps[0]} />},
        // { name: 'nameEmail', component: <NameEmailForm handleSubmit={handleNameEmail} /> },
        { name: 'geography', component: <FormInstance handleSubmit={handleGeography} fieldsAndParams={formProps[1]} /> },
    ];
    return (
        <>
            {/* <FormInstance handleSubmit={handleNameEmail} fieldsAndParams={formProps[0]} /> */}
            <FormInstance handleSubmit={handleGeography} fieldsAndParams={formProps[1]} />
            
        </>
    )
}