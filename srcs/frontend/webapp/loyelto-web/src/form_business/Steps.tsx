import * as React from 'react';
import { Box, Stepper, Step, StepLabel, Button, Typography } from "@mui/material";
import FormText from './FormText';
import FormEmail from './FormEmail';
import BusinessTypeForm from './BusinessTypeForm';
import UploadLogo from './UploadLogo';
import Merci from './Merci';



export default function Steps() {

    
    const [activeStep, setActiveStep] = React.useState(0);
    const [businessData, setBusinessData] = React.useState<{
        name: string | null;
        email: string | null;
        company: string | null;
        logo: string | null;
    }>({ name: null, email: null, company: null, logo: null });
    // const [skipped, setSkipped] = React.useState(new Set<number>());

    // const isStepOptional = (step: number) => {
    //     return step === 3;
    // };

    // const isStepSkipped = (step: number) => {
    //     return skipped.has(step);
    // };

    const handleNext = (value: string) => {
        // let newSkipped = skipped;
        // if (isStepSkipped(activeStep)) {
        //     newSkipped = new Set(newSkipped.values());
        //     newSkipped.delete(activeStep);
        // }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        console.log(`printing from handleNext: ${value}`)
        setBusinessData((prevData) => ({
            ...prevData,
            [steps[activeStep].name]: value,
        }));
        // setSkipped(newSkipped);
    };

    const steps = [
        { name: 'Nom et prénom', component: <FormText h='Votre nom et prénom'  handleSubmit={handleNext}/> },
        { name: 'Email', component: <FormEmail  handleSubmit={handleNext}/>},
        { name: "Nom de l'entreprise/", component: <FormText h="Nom de l'entreprise" handleSubmit={handleNext} /> },
        // { name: 'Type de commerce', component: <BusinessTypeForm /> },
        // { name: 'Addresse', component: <FormText h="Adresse de l'établissement"/> },
        // { name: 'Logo', component: <UploadLogo/>}
    ];

    // const handleBack = () => {
    //     setActiveStep((prevActiveStep) => prevActiveStep - 1);
    // };

    // const handleSkip = () => {
    //     if (!isStepOptional(activeStep)) {
    //         throw new Error("Veuillez remplir ce champ.");
    //     }
    // }

    // const handleReset = () => {
    //     setActiveStep(0);
    // };

    return (
        <Box sx={{ width: '60%' }}>
            {steps[activeStep]?.component}
            <Stepper activeStep={activeStep}>
                {steps.map((step, index) => {
                    const stepProps: { completed?: boolean } = {};
                    const labelProps: {
                        optional?: React.ReactNode;
                    } = {};
                    // if (isStepOptional(index)) {
                    //     labelProps.optional = (
                    //         <Typography variant="caption">Optional</Typography>
                    //     );
                    // }
                    // if (isStepSkipped(index)) {
                    //     stepProps.completed = false;
                    // }
                    return (
                        <Step key={step.name} {...stepProps}>
                            <StepLabel {...labelProps}>{step.name}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
            
             {activeStep === steps.length && (
                <React.Fragment>
                    <Typography sx={{ mt: 2, mb: 1 }}>
                        All steps completed - you&apos;re finished
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Box sx={{ flex: '1 1 auto' }} />
                        {/* <Button onClick={handleReset}>Reset</Button> */}
                    </Box>
                </React.Fragment>
            ) } 
                {/*(
                <React.Fragment>
                    {steps[activeStep]?.component}
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Button
                            color="inherit"
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            sx={{ mr: 1 }}
                        >
                            Back
                        </Button>
                        <Box sx={{ flex: '1 1 auto' }} />
                        {isStepOptional(activeStep) && (
                            <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                                Skip
                            </Button>
                        )}
                        <Button onClick={handleNext}>
                            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                        </Button>
                    </Box>
                </React.Fragment>
            )} */}
        </Box>
    )
}