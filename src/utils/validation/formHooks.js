// Custom hooks for comprehensive form handling with validation
import { useState, useCallback, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { validateField, validateForm, ASYNC_VALIDATIONS } from './validationRules';

// Debounced validation hook
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Enhanced form hook with real-time validation
export const useEnhancedForm = ({
  schema,
  defaultValues = {},
  mode = 'onChange',
  onSubmit,
  onError,
  enableAsyncValidation = false,
  asyncValidationEndpoints = {},
  debounceDelay = 300,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, isDirty, touchedFields },
    watch,
    setValue,
    getValues,
    reset,
    clearErrors,
    setError,
    trigger,
  } = useForm({
    resolver: schema ? yupResolver(schema) : undefined,
    defaultValues,
    mode,
  });

  const [asyncErrors, setAsyncErrors] = useState({});
  const [fieldStates, setFieldStates] = useState({});
  const [isAsyncValidating, setIsAsyncValidating] = useState({});
  const asyncValidationCache = useRef(new Map());

  // Watch all form values for real-time validation
  const watchedValues = watch();
  const debouncedValues = useDebounce(watchedValues, debounceDelay);

  // Async validation function
  const performAsyncValidation = useCallback(
    async (fieldName, value) => {
      if (!enableAsyncValidation || !asyncValidationEndpoints[fieldName]) {
        return;
      }

      const cacheKey = `${fieldName}-${value}`;
      if (asyncValidationCache.current.has(cacheKey)) {
        return asyncValidationCache.current.get(cacheKey);
      }

      setIsAsyncValidating(prev => ({ ...prev, [fieldName]: true }));

      try {
        const endpoint = asyncValidationEndpoints[fieldName];
        let isValid = true;

        switch (endpoint.type) {
          case 'uniqueCode':
            isValid = await ASYNC_VALIDATIONS.checkUniqueCode(
              value,
              endpoint.url,
              endpoint.excludeId
            );
            break;
          case 'uniqueEmail':
            isValid = await ASYNC_VALIDATIONS.checkUniqueEmail(
              value,
              endpoint.url,
              endpoint.excludeId
            );
            break;
          case 'usernameAvailability':
            isValid = await ASYNC_VALIDATIONS.checkUsernameAvailability(
              value,
              endpoint.url,
              endpoint.excludeId
            );
            break;
          default:
            if (endpoint.customValidator) {
              isValid = await endpoint.customValidator(value);
            }
        }

        asyncValidationCache.current.set(cacheKey, isValid);

        if (!isValid) {
          setAsyncErrors(prev => ({
            ...prev,
            [fieldName]: endpoint.message || 'Validation failed',
          }));
        } else {
          setAsyncErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[fieldName];
            return newErrors;
          });
        }
      } catch (error) {
        console.error('Async validation error:', error);
      } finally {
        setIsAsyncValidating(prev => ({ ...prev, [fieldName]: false }));
      }
    },
    [enableAsyncValidation, asyncValidationEndpoints]
  );

  // Effect for debounced async validation
  useEffect(() => {
    if (enableAsyncValidation) {
      Object.keys(asyncValidationEndpoints).forEach(fieldName => {
        const value = debouncedValues[fieldName];
        if (value && touchedFields[fieldName]) {
          performAsyncValidation(fieldName, value);
        }
      });
    }
  }, [debouncedValues, enableAsyncValidation, performAsyncValidation, touchedFields]);

  // Enhanced field registration with real-time validation
  const registerField = useCallback(
    (fieldName, validationRules = {}) => {
      const baseRegistration = register(fieldName, validationRules);

      return {
        ...baseRegistration,
        onChange: e => {
          baseRegistration.onChange(e);

          // Clear async errors when user types
          if (asyncErrors[fieldName]) {
            setAsyncErrors(prev => {
              const newErrors = { ...prev };
              delete newErrors[fieldName];
              return newErrors;
            });
          }

          // Update field state
          setFieldStates(prev => ({
            ...prev,
            [fieldName]: {
              ...prev[fieldName],
              touched: true,
              modified: true,
            },
          }));
        },
        onBlur: e => {
          baseRegistration.onBlur(e);

          // Trigger async validation on blur
          if (enableAsyncValidation && asyncValidationEndpoints[fieldName]) {
            performAsyncValidation(fieldName, e.target.value);
          }
        },
      };
    },
    [register, asyncErrors, enableAsyncValidation, asyncValidationEndpoints, performAsyncValidation]
  );

  // Get field validation state
  const getFieldState = useCallback(
    fieldName => {
      const hasError = !!(errors[fieldName] || asyncErrors[fieldName]);
      const isValidating = isAsyncValidating[fieldName];
      const isAsyncValid = !asyncErrors[fieldName];
      const isTouched = touchedFields[fieldName];
      const isModified = fieldStates[fieldName]?.modified;

      return {
        hasError,
        isValidating,
        isValid: !hasError && isAsyncValid,
        isAsyncValid,
        isTouched,
        isModified,
        error: errors[fieldName]?.message || asyncErrors[fieldName],
        helperText: errors[fieldName]?.message || asyncErrors[fieldName],
      };
    },
    [errors, asyncErrors, isAsyncValidating, touchedFields, fieldStates]
  );

  // Enhanced submit handler
  const handleEnhancedSubmit = useCallback(
    async data => {
      try {
        // Check for async validation errors
        if (Object.keys(asyncErrors).length > 0) {
          toast.error('Mohon perbaiki kesalahan validasi terlebih dahulu');
          return;
        }

        // Check if async validation is still in progress
        if (Object.values(isAsyncValidating).some(validating => validating)) {
          toast.warning('Tunggu validasi selesai...');
          return;
        }

        await onSubmit(data);
      } catch (error) {
        if (onError) {
          onError(error);
        } else {
          toast.error('Terjadi kesalahan saat menyimpan data');
        }
      }
    },
    [onSubmit, onError, asyncErrors, isAsyncValidating]
  );

  // Form state summary
  const formState = {
    isValid: isValid && Object.keys(asyncErrors).length === 0,
    isDirty,
    isSubmitting,
    hasAsyncErrors: Object.keys(asyncErrors).length > 0,
    isAsyncValidating: Object.values(isAsyncValidating).some(validating => validating),
    touchedFields,
    errors: { ...errors, ...asyncErrors },
  };

  return {
    // React Hook Form methods
    register: registerField,
    handleSubmit: handleSubmit(handleEnhancedSubmit),
    watch,
    setValue,
    getValues,
    reset,
    clearErrors,
    setError,
    trigger,

    // Enhanced methods
    getFieldState,
    formState,

    // Async validation
    asyncErrors,
    isAsyncValidating,
    performAsyncValidation,
  };
};

// Form field wrapper hook for consistent behavior
export const useFormField = (fieldName, formMethods, validationRules = {}) => {
  const { getFieldState, watch } = formMethods;
  const value = watch(fieldName);
  const fieldState = getFieldState(fieldName);

  // Get input props for Material-UI or other UI libraries
  const getInputProps = useCallback(
    () => ({
      error: fieldState.hasError,
      helperText: fieldState.helperText,
      value: value || '',
      ...formMethods.register(fieldName, validationRules),
    }),
    [fieldState, value, formMethods, fieldName, validationRules]
  );

  // Get validation status icon
  const getValidationIcon = useCallback(() => {
    if (fieldState.isValidating) {
      return 'loading';
    }
    if (fieldState.hasError) {
      return 'error';
    }
    if (fieldState.isValid && fieldState.isTouched) {
      return 'success';
    }
    return null;
  }, [fieldState]);

  return {
    fieldState,
    value,
    getInputProps,
    getValidationIcon,
  };
};

// Hook for handling form arrays (dynamic fields)
export const useFormArray = (formMethods, fieldName, defaultItem = {}) => {
  const [items, setItems] = useState([defaultItem]);
  const { setValue, watch } = formMethods;

  const watchedItems = watch(fieldName) || [];

  useEffect(() => {
    if (watchedItems.length !== items.length) {
      setItems(watchedItems.length > 0 ? watchedItems : [defaultItem]);
    }
  }, [watchedItems, items.length, defaultItem]);

  const addItem = useCallback(() => {
    const newItems = [...items, { ...defaultItem }];
    setItems(newItems);
    setValue(fieldName, newItems);
  }, [items, defaultItem, setValue, fieldName]);

  const removeItem = useCallback(
    index => {
      if (items.length > 1) {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
        setValue(fieldName, newItems);
      }
    },
    [items, setValue, fieldName]
  );

  const updateItem = useCallback(
    (index, updatedItem) => {
      const newItems = items.map((item, i) => (i === index ? { ...item, ...updatedItem } : item));
      setItems(newItems);
      setValue(fieldName, newItems);
    },
    [items, setValue, fieldName]
  );

  const moveItem = useCallback(
    (fromIndex, toIndex) => {
      const newItems = [...items];
      const [movedItem] = newItems.splice(fromIndex, 1);
      newItems.splice(toIndex, 0, movedItem);
      setItems(newItems);
      setValue(fieldName, newItems);
    },
    [items, setValue, fieldName]
  );

  return {
    items,
    addItem,
    removeItem,
    updateItem,
    moveItem,
  };
};

// Hook for conditional field validation
export const useConditionalValidation = (formMethods, conditions) => {
  const { watch, clearErrors, setError } = formMethods;
  const watchedValues = watch();

  useEffect(() => {
    conditions.forEach(condition => {
      const { field, dependsOn, shouldValidate, validationRules } = condition;

      const shouldValidateField = shouldValidate(watchedValues);

      if (shouldValidateField) {
        // Apply validation
        const value = watchedValues[field];
        const validation = validateField(value, validationRules);

        if (validation.length > 0) {
          setError(field, {
            type: 'conditional',
            message: validation[0],
          });
        } else {
          clearErrors(field);
        }
      } else {
        // Clear validation
        clearErrors(field);
      }
    });
  }, [watchedValues, conditions, setError, clearErrors]);
};

// Hook for form step management (multi-step forms)
export const useFormStepper = (steps, formMethods) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const { trigger, getValues } = formMethods;

  const nextStep = useCallback(async () => {
    const currentStepFields = steps[currentStep].fields;
    const isValid = await trigger(currentStepFields);

    if (isValid) {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
      return true;
    }
    return false;
  }, [currentStep, steps, trigger]);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  }, []);

  const goToStep = useCallback(
    async stepIndex => {
      if (stepIndex <= currentStep || completedSteps.has(stepIndex - 1)) {
        setCurrentStep(stepIndex);
        return true;
      }

      // Validate all previous steps
      for (let i = currentStep; i < stepIndex; i++) {
        const isValid = await trigger(steps[i].fields);
        if (!isValid) {
          return false;
        }
        setCompletedSteps(prev => new Set([...prev, i]));
      }

      setCurrentStep(stepIndex);
      return true;
    },
    [currentStep, completedSteps, steps, trigger]
  );

  const isStepComplete = useCallback(
    stepIndex => {
      return completedSteps.has(stepIndex);
    },
    [completedSteps]
  );

  const canProceedToStep = useCallback(
    stepIndex => {
      return stepIndex <= currentStep || isStepComplete(stepIndex - 1);
    },
    [currentStep, isStepComplete]
  );

  return {
    currentStep,
    completedSteps,
    nextStep,
    prevStep,
    goToStep,
    isStepComplete,
    canProceedToStep,
    totalSteps: steps.length,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === steps.length - 1,
  };
};

export default {
  useDebounce,
  useEnhancedForm,
  useFormField,
  useFormArray,
  useConditionalValidation,
  useFormStepper,
};
