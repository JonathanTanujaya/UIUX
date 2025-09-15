import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Alert,
  LinearProgress,
  Fade,
  Grow,
} from '@mui/material';
import { Save, NavigateNext, NavigateBefore, Check } from '@mui/icons-material';

const MultiStepForm = ({
  steps = [],
  onSubmit,
  onStepChange,
  autoSave = true,
  autoSaveDelay = 2000,
  submitButtonText = 'Submit',
  title,
  subtitle,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const autoSaveTimer = useRef(null);

  // Auto-save functionality
  const triggerAutoSave = useCallback(async () => {
    if (!autoSave) return;
    
    setIsSaving(true);
    try {
      // Simulate auto-save API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setLastSaved(new Date());
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setIsSaving(false);
    }
  }, [autoSave]);

  // Debounced auto-save
  useEffect(() => {
    if (autoSave && Object.keys(formData).length > 0) {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
      }
      autoSaveTimer.current = setTimeout(triggerAutoSave, autoSaveDelay);
    }
    return () => {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
      }
    };
  }, [formData, triggerAutoSave, autoSaveDelay]);

  const updateFormData = useCallback((stepData) => {
    setFormData(prev => ({ ...prev, ...stepData }));
  }, []);

  const validateStep = useCallback((stepIndex) => {
    const step = steps[stepIndex];
    if (!step?.validation) return true;

    const stepErrors = step.validation(formData);
    setErrors(prev => ({ ...prev, [stepIndex]: stepErrors }));
    return Object.keys(stepErrors).length === 0;
  }, [steps, formData]);

  const handleNext = useCallback(() => {
    if (validateStep(activeStep)) {
      const nextStep = activeStep + 1;
      setActiveStep(nextStep);
      onStepChange?.(nextStep, formData);
    }
  }, [activeStep, validateStep, onStepChange, formData]);

  const handleBack = useCallback(() => {
    const prevStep = activeStep - 1;
    setActiveStep(prevStep);
    onStepChange?.(prevStep, formData);
  }, [activeStep, onStepChange, formData]);

  const handleSubmit = useCallback(async () => {
    // Validate all steps
    let allValid = true;
    for (let i = 0; i < steps.length; i++) {
      if (!validateStep(i)) {
        allValid = false;
      }
    }

    if (!allValid) {
      // Go to first step with errors
      const firstErrorStep = Object.keys(errors).find(key => 
        errors[key] && Object.keys(errors[key]).length > 0
      );
      if (firstErrorStep) {
        setActiveStep(parseInt(firstErrorStep));
      }
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit?.(formData);
    } catch (error) {
      console.error('Form submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [steps, validateStep, errors, formData, onSubmit]);

  const isLastStep = activeStep === steps.length - 1;
  const currentStep = steps[activeStep];
  const progress = ((activeStep + 1) / steps.length) * 100;

  return (
    <Paper elevation={2} sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      {/* Header */}
      {(title || subtitle) && (
        <Box mb={3}>
          {title && (
            <Typography variant="h4" gutterBottom>
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography variant="body1" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
      )}

      {/* Progress Indicator */}
      <Box mb={3}>
        <LinearProgress variant="determinate" value={progress} sx={{ mb: 1 }} />
        <Typography variant="caption" color="text.secondary">
          Step {activeStep + 1} of {steps.length} ({Math.round(progress)}% complete)
        </Typography>
      </Box>

      {/* Auto-save indicator */}
      {autoSave && (
        <Box mb={2}>
          <Fade in={isSaving}>
            <Alert severity="info" sx={{ mb: 1 }}>
              Saving changes...
            </Alert>
          </Fade>
          {lastSaved && (
            <Typography variant="caption" color="text.secondary">
              Last saved: {lastSaved.toLocaleTimeString()}
            </Typography>
          )}
        </Box>
      )}

      {/* Stepper */}
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((step, index) => (
          <Step key={step.label} completed={index < activeStep}>
            <StepLabel 
              error={errors[index] && Object.keys(errors[index]).length > 0}
            >
              {step.label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Step Content */}
      <Box minHeight={300}>
        <Grow in={true} key={activeStep}>
          <Box>
            {currentStep?.component && (
              <currentStep.component
                data={formData}
                onChange={updateFormData}
                errors={errors[activeStep] || {}}
              />
            )}
          </Box>
        </Grow>
      </Box>

      {/* Error Summary */}
      {errors[activeStep] && Object.keys(errors[activeStep]).length > 0 && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Please fix the errors above before continuing.
        </Alert>
      )}

      {/* Navigation */}
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        mt={4}
      >
        <Button
          onClick={handleBack}
          disabled={activeStep === 0 || isSubmitting}
          startIcon={<NavigateBefore />}
        >
          Back
        </Button>

        <Box display="flex" gap={2}>
          {isLastStep ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={isSubmitting}
              startIcon={isSubmitting ? null : <Check />}
              sx={{ minWidth: 120 }}
            >
              {isSubmitting ? 'Submitting...' : submitButtonText}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              endIcon={<NavigateNext />}
            >
              Next
            </Button>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default MultiStepForm;
