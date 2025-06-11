import * as React from 'react';
import { Box, Stepper, Step, StepLabel, Button, Typography } from "@mui/material";
import FormText from './FormText';
import FormEmail from './FormEmail';
import emailjs from '@emailjs/browser'
import SignupCompleted from './SignupCompleted';
import BusinessTypeForm from './BusinessTypeForm';
import UploadLogo from './UploadLogo';
import Merci from './Merci';



export default function Steps() {


    const [activeStep, setActiveStep] = React.useState(0);
    const [businessData, setBusinessData] = React.useState<{
        name: string | null;
        email: string | null;
        company: string | null;
        // logo: string | null;
    }>({ name: null, email: null, company: null });
    // const [skipped, setSkipped] = React.useState(new Set<number>());

    // const isStepOptional = (step: number) => {
    //     return step === 3;
    // };

    // const isStepSkipped = (step: number) => {
    //     return skipped.has(step);
    // };

    const sendEmail = () => {
        emailjs.init('0MSYJSYKK43wKxqnU');

        const templateParams = {
            enterprise_name: businessData.name,
            email: businessData.email,
            company: businessData.company, // Try using 'email' instead of 'from_email'
            message: `New waitlist signup from enterprise: ${businessData.name}; Email: ${businessData.email}; Company: ${businessData.company}`, // Add a message field
        };
        console.log("Sending with params:", templateParams); // Debug log
        emailjs.send(
            'service_vf5seeb',
            'template_mpdnwfa',
            templateParams
        )
            .then((response) => {
                console.log('Email sent successfully:', response);
            })
            .catch((error) => {
                console.error('Email sending failed:', error);
            });
    }

    const handleNext = (value: string) => {

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        console.log(`printing from handleNext: ${value}. Active step is: ${activeStep}`)
        setBusinessData((prevData) => ({
            ...prevData,
            [steps[activeStep].name]: value,
        }));
    };

    const steps = [
        { name: 'name', component: <FormText h='Votre nom et prénom' handleSubmit={handleNext} /> },
        { name: 'email', component: <FormEmail handleSubmit={handleNext} /> },
        { name: "company", component: <FormText h="Nom de l'entreprise" handleSubmit={handleNext} /> },
    ];

    return (
        <Box id="stepsOld" sx={{ width: '60%' }}>
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

            {activeStep === steps.length && <SignupCompleted businessData={businessData} />}
            {/* <>
                
                {/* {setActiveStep(0)} */}
            {/* <React.Fragment>
                    <Typography sx={{ mt: 2, mb: 1 }}>
                        All steps completed - you&apos;re finished
                    </Typography> */}
            {/* <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Box sx={{ flex: '1 1 auto' }} />
                    </Box> */}
            {/* </React.Fragment> */}

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