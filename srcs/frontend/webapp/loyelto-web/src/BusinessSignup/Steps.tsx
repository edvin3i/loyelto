import { Stack, Box, Typography, TextField, Button, Stepper, Step } from "@mui/material";
import { useState } from "react";
import { useTheme, Theme } from '@mui/material/styles';
import NameEmailForm from "./NameEmailForm";
import FormInstance from "./FormInstance";
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { styled } from '@mui/material/styles';
import LogoDescription from "./LogoDescription";
import LoylRateForm from "./LoylRateForm";
import SignupCompleted from "./SignupCompleted";
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

const QontoConnector = styled(StepConnector)(({ theme }) => ({
    
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 10,
        left: 'calc(-50% + 2px)',
        right: 'calc(50% + 2px)',
    },
    [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            borderColor: '#90ceff',
        },
    },
    [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            borderColor: '#90ceff',
        },
    },
    [`& .${stepConnectorClasses.line}`]: {
        borderColor: '#eaeaf0',
        borderTopWidth: 5,
        borderRadius: 3,
        ...theme.applyStyles('dark', {
            borderColor: theme.palette.grey[800],
        }),
    },
}));

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

    const handleGeography = (geography: string[]): void => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        console.log(`printing from handleGeography: ${geography}. Active step is: ${activeStep}`)
        setBusinessData((prevData) => ({
            ...prevData,
            "country": geography[0],
            "city": geography[1],
            "address": geography[2],
            "zip_code": geography[3]
        }));
    }

    const handleLogoDescription = (logoDescription: string[]): void => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
         setBusinessData((prevData) => ({
            ...prevData,
            "logo_url": logoDescription[0],
            "description": logoDescription[1]
        }));
    }

    const handleLoylRate = (rate: number): void => {
         setActiveStep((prevActiveStep) => prevActiveStep + 1);
         setBusinessData((prevData) => ({
            ...prevData,
            "rate_loyl": rate
        }));
    }

    const steps = [
        { name: 'nameEmail', component: <FormInstance handleSubmit={handleNameEmail} fieldsAndParams={formProps[0]} /> },
        // { name: 'nameEmail', component: <NameEmailForm handleSubmit={handleNameEmail} /> },
        { name: 'geography', component: <FormInstance handleSubmit={handleGeography} fieldsAndParams={formProps[1]} />},
        {name: 'logoDescription', component: <LogoDescription handleSubmit={handleLogoDescription} />},
        {name: 'rate', component: <LoylRateForm handleSubmit={handleLoylRate} />},
        {name: 'completed', component: <SignupCompleted businessData={businessData}/>}
    ];
    return (
        <>
            {/* <FormInstance handleSubmit={handleNameEmail} fieldsAndParams={formProps[0]} /> */}
            <Stack spacing={3}>
                <Stepper alternativeLabel activeStep={activeStep + 1} connector={<QontoConnector />}>
                    {steps.map((step) => (
                        <Step key={step.name}></Step>
                    ))}
                </Stepper>
              {activeStep < steps.length -1 &&  <Typography variant="caption" color="initial" gutterBottom sx={{textAlign: 'center'}}>
                    Step {activeStep + 1} /4</Typography>}
                {steps[activeStep]?.component}
                {/* <FormInstance handleSubmit={handleGeography} fieldsAndParams={formProps[1]} /> */}
            </Stack>
        </>
    )
}