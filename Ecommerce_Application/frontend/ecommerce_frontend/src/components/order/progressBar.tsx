import { Stepper, Step, StepLabel } from '@mui/material';

type ProgressBarProps = {
  activeStep: number;
};

const steps = ['Cart', 'Address', 'Summary'];

const ProgressBar = ({ activeStep }: ProgressBarProps) => {
  return (
    <Stepper activeStep={activeStep} alternativeLabel
    
    >
      {steps.map((label, index) => (
        <Step key={index} sx={{paddingLeft: 8, paddingRight: 8}}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default ProgressBar;
