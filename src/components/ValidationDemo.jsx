// Comprehensive validation demo showcasing all validation features
import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Chip,
  Alert,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Check as CheckIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Language as LanguageIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Accessibility as AccessibilityIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

// Import validation framework components
import {
  ErrorBoundary,
  ErrorProvider,
  useGlobalErrorHandler,
} from '../utils/validation/errorHandling';
import {
  ValidatedForm,
  ValidatedTextField,
  ValidatedSelectField,
  ValidatedAutocompleteField,
  ValidatedCheckboxGroup,
  ValidatedRadioGroup,
  ValidatedSwitch,
  ValidatedArrayField,
  FormSection,
  FormActions,
} from '../utils/validation/formComponents';
import {
  COMMON_SCHEMAS,
  VALIDATION_RULES,
  ASYNC_VALIDATIONS,
} from '../utils/validation/validationRules';
import {
  useEnhancedForm,
  useFormField,
  useConditionalValidation,
} from '../utils/validation/formHooks';
import EnhancedBarangForm from './EnhancedBarangForm';

// Import i18n
import { useTranslation, Trans } from 'react-i18next';
import {
  changeLanguage,
  getCurrentLanguage,
  formatCurrency,
  formatValidationMessage,
} from '../locales/i18n';

// Demo data
const demoOptions = {
  categories: [
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'food', label: 'Food & Beverage' },
    { value: 'books', label: 'Books' },
    { value: 'sports', label: 'Sports' },
  ],
  priorities: [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' },
    { value: 'urgent', label: 'Urgent' },
  ],
  skills: [
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue.js' },
    { value: 'angular', label: 'Angular' },
    { value: 'node', label: 'Node.js' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
  ],
};

const ValidationDemo = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  const [language, setLanguage] = useState(getCurrentLanguage());
  const [realTimeValidation, setRealTimeValidation] = useState(true);
  const [showAdvancedFeatures, setShowAdvancedFeatures] = useState(false);
  const { handleError } = useGlobalErrorHandler();

  // Demo form states
  const [basicFormData, setBasicFormData] = useState({});
  const [advancedFormData, setAdvancedFormData] = useState({});
  const [barangFormVisible, setBarangFormVisible] = useState(false);

  const handleLanguageChange = newLanguage => {
    changeLanguage(newLanguage);
    setLanguage(newLanguage);
    toast.success(`Language changed to ${newLanguage.toUpperCase()}`);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Basic validation demo
  const BasicValidationDemo = () => {
    const { formMethods, isValid, errors } = useEnhancedForm({
      schema: COMMON_SCHEMAS.user,
      defaultValues: {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        age: '',
        website: '',
        bio: '',
      },
      mode: realTimeValidation ? 'onChange' : 'onSubmit',
    });

    const handleSubmit = data => {
      setBasicFormData(data);
      toast.success('Form submitted successfully!');
      console.log('Basic form data:', data);
    };

    return (
      <ValidatedForm onSubmit={handleSubmit} formMethods={formMethods}>
        <FormSection
          title="User Information"
          subtitle="Basic form validation with real-time feedback"
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <ValidatedTextField
                name="username"
                label="Username"
                rules={{
                  ...VALIDATION_RULES.required,
                  ...VALIDATION_RULES.alphanumeric,
                  minLength: { value: 3, message: 'Username must be at least 3 characters' },
                  maxLength: { value: 20, message: 'Username must not exceed 20 characters' },
                }}
                placeholder="Enter username"
                tooltip="Username should be 3-20 characters, alphanumeric only"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <ValidatedTextField
                name="email"
                label="Email"
                type="email"
                rules={{
                  ...VALIDATION_RULES.required,
                  ...VALIDATION_RULES.email,
                }}
                placeholder="Enter email address"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <ValidatedTextField
                name="password"
                label="Password"
                type="password"
                rules={{
                  ...VALIDATION_RULES.required,
                  minLength: { value: 8, message: 'Password must be at least 8 characters' },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                    message:
                      'Password must contain uppercase, lowercase, number, and special character',
                  },
                }}
                placeholder="Enter password"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <ValidatedTextField
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                rules={{
                  ...VALIDATION_RULES.required,
                  validate: (value, { password }) => value === password || 'Passwords do not match',
                }}
                placeholder="Confirm password"
              />
            </Grid>

            <Grid item xs={12}>
              <ValidatedTextField
                name="fullName"
                label="Full Name"
                rules={{
                  ...VALIDATION_RULES.required,
                  maxLength: { value: 50, message: 'Full name must not exceed 50 characters' },
                }}
                placeholder="Enter full name"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <ValidatedTextField
                name="age"
                label="Age"
                type="number"
                rules={{
                  min: { value: 13, message: 'Must be at least 13 years old' },
                  max: { value: 120, message: 'Must be less than 120 years old' },
                }}
                placeholder="Enter age"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <ValidatedTextField
                name="website"
                label="Website"
                rules={VALIDATION_RULES.url}
                placeholder="https://example.com"
              />
            </Grid>

            <Grid item xs={12}>
              <ValidatedTextField
                name="bio"
                label="Bio"
                multiline
                rows={3}
                rules={{
                  maxLength: { value: 500, message: 'Bio must not exceed 500 characters' },
                }}
                placeholder="Tell us about yourself..."
              />
            </Grid>
          </Grid>
        </FormSection>

        <FormActions
          submitText="Submit User Form"
          onReset={() => formMethods.reset()}
          disabled={!isValid}
        />
      </ValidatedForm>
    );
  };

  // Advanced validation demo
  const AdvancedValidationDemo = () => {
    const { formMethods, isValid, watch } = useEnhancedForm({
      schema: COMMON_SCHEMAS.transaction,
      defaultValues: {
        category: '',
        priority: 'medium',
        skills: [],
        notifications: {
          email: true,
          sms: false,
          push: true,
        },
        preferences: {
          theme: 'light',
          language: 'en',
        },
        items: [{ name: '', quantity: 1, price: 0 }],
      },
    });

    // Conditional validation
    const category = watch('category');
    const { conditionalRules } = useConditionalValidation({
      condition: category === 'electronics',
      rules: {
        warranty: VALIDATION_RULES.required,
      },
    });

    const handleSubmit = data => {
      setAdvancedFormData(data);
      toast.success('Advanced form submitted successfully!');
      console.log('Advanced form data:', data);
    };

    const renderItemField = (field, index, name) => (
      <Grid container spacing={2} key={field.id}>
        <Grid item xs={12} md={4}>
          <ValidatedTextField
            name={`${name}.name`}
            label="Item Name"
            rules={VALIDATION_RULES.required}
            placeholder="Enter item name"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <ValidatedTextField
            name={`${name}.quantity`}
            label="Quantity"
            type="number"
            rules={{
              ...VALIDATION_RULES.required,
              ...VALIDATION_RULES.positiveNumber,
            }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <ValidatedTextField
            name={`${name}.price`}
            label="Price"
            type="number"
            rules={{
              ...VALIDATION_RULES.required,
              ...VALIDATION_RULES.positiveNumber,
            }}
            prefix="$"
          />
        </Grid>
      </Grid>
    );

    return (
      <ValidatedForm onSubmit={handleSubmit} formMethods={formMethods}>
        <FormSection
          title="Advanced Validation Features"
          subtitle="Complex form with conditional validation, dynamic fields, and cross-field dependencies"
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <ValidatedSelectField
                name="category"
                label="Category"
                options={demoOptions.categories}
                rules={VALIDATION_RULES.required}
                helperText="Category affects other field requirements"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <ValidatedRadioGroup
                name="priority"
                label="Priority"
                options={demoOptions.priorities}
                rules={VALIDATION_RULES.required}
                row
              />
            </Grid>

            <Grid item xs={12}>
              <ValidatedAutocompleteField
                name="skills"
                label="Skills"
                options={demoOptions.skills}
                multiple
                freeSolo
                placeholder="Select or type skills"
                helperText="You can select multiple skills or add custom ones"
              />
            </Grid>

            {category === 'electronics' && (
              <Grid item xs={12}>
                <ValidatedTextField
                  name="warranty"
                  label="Warranty Period"
                  rules={conditionalRules.warranty}
                  placeholder="e.g., 2 years"
                  helperText="Required for electronics category"
                />
              </Grid>
            )}
          </Grid>
        </FormSection>

        <FormSection title="Preferences" subtitle="Checkbox groups and switches">
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <ValidatedCheckboxGroup
                name="notifications"
                label="Notification Preferences"
                options={[
                  { value: 'email', label: 'Email Notifications' },
                  { value: 'sms', label: 'SMS Notifications' },
                  { value: 'push', label: 'Push Notifications' },
                ]}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <ValidatedSwitch
                name="preferences.theme"
                label="Dark Mode"
                helperText="Enable dark theme"
              />

              <ValidatedSwitch
                name="marketing"
                label="Marketing Emails"
                helperText="Receive promotional emails"
              />
            </Grid>
          </Grid>
        </FormSection>

        <FormSection title="Dynamic Items" subtitle="Array fields with add/remove functionality">
          <ValidatedArrayField
            name="items"
            label="Order Items"
            renderField={renderItemField}
            addButtonText="Add Item"
            removeButtonText="Remove Item"
            minItems={1}
            maxItems={5}
            defaultValue={{ name: '', quantity: 1, price: 0 }}
          />
        </FormSection>

        <FormActions
          submitText="Submit Advanced Form"
          onReset={() => formMethods.reset()}
          disabled={!isValid}
        />
      </ValidatedForm>
    );
  };

  // Validation features showcase
  const ValidationFeatures = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader
            avatar={<SpeedIcon color="primary" />}
            title="Real-time Validation"
            subheader="Instant feedback without performance impact"
          />
          <CardContent>
            <Typography variant="body2" paragraph>
              • Debounced input validation (300ms delay)
            </Typography>
            <Typography variant="body2" paragraph>
              • Field-level and form-level validation
            </Typography>
            <Typography variant="body2" paragraph>
              • Cross-field dependencies
            </Typography>
            <Typography variant="body2" paragraph>
              • Async validation for uniqueness checks
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  checked={realTimeValidation}
                  onChange={e => setRealTimeValidation(e.target.checked)}
                />
              }
              label="Enable Real-time Validation"
            />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader
            avatar={<LanguageIcon color="primary" />}
            title="Internationalization"
            subheader="Multi-language support"
          />
          <CardContent>
            <Typography variant="body2" paragraph>
              • Dynamic language switching
            </Typography>
            <Typography variant="body2" paragraph>
              • Contextual error messages
            </Typography>
            <Typography variant="body2" paragraph>
              • Field name translations
            </Typography>
            <Typography variant="body2" paragraph>
              • Currency and date formatting
            </Typography>

            <Box sx={{ mt: 2 }}>
              <Button
                variant={language === 'id' ? 'contained' : 'outlined'}
                onClick={() => handleLanguageChange('id')}
                sx={{ mr: 1 }}
              >
                ID
              </Button>
              <Button
                variant={language === 'en' ? 'contained' : 'outlined'}
                onClick={() => handleLanguageChange('en')}
              >
                EN
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader
            avatar={<SecurityIcon color="primary" />}
            title="Security Features"
            subheader="Comprehensive validation rules"
          />
          <CardContent>
            <Typography variant="body2" paragraph>
              • Email format validation
            </Typography>
            <Typography variant="body2" paragraph>
              • Strong password requirements
            </Typography>
            <Typography variant="body2" paragraph>
              • XSS protection (input sanitization)
            </Typography>
            <Typography variant="body2" paragraph>
              • Server-side validation integration
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader
            avatar={<AccessibilityIcon color="primary" />}
            title="Accessibility"
            subheader="WCAG 2.1 AA compliant"
          />
          <CardContent>
            <Typography variant="body2" paragraph>
              • Screen reader support
            </Typography>
            <Typography variant="body2" paragraph>
              • Keyboard navigation
            </Typography>
            <Typography variant="body2" paragraph>
              • High contrast error indicators
            </Typography>
            <Typography variant="body2" paragraph>
              • ARIA labels and descriptions
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  return (
    <ErrorProvider>
      <ErrorBoundary>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom>
              Comprehensive Form Validation System
            </Typography>
            <Typography variant="h6" color="text.secondary" paragraph>
              Enterprise-grade validation framework with real-time feedback, internationalization,
              and accessibility support
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
              <Chip icon={<CheckIcon />} label="React Hook Form" color="success" />
              <Chip icon={<CheckIcon />} label="Yup/Zod Schemas" color="success" />
              <Chip icon={<CheckIcon />} label="Real-time Validation" color="success" />
              <Chip icon={<CheckIcon />} label="i18n Support" color="success" />
              <Chip icon={<CheckIcon />} label="Error Boundaries" color="success" />
              <Chip icon={<CheckIcon />} label="Accessibility" color="success" />
            </Box>
          </Box>

          <Paper sx={{ width: '100%', mb: 3 }}>
            <Tabs value={activeTab} onChange={handleTabChange}>
              <Tab label="Basic Validation" />
              <Tab label="Advanced Features" />
              <Tab label="Enhanced Barang Form" />
              <Tab label="Features Overview" />
            </Tabs>
          </Paper>

          <Box sx={{ mt: 3 }}>
            {activeTab === 0 && (
              <Paper sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                  Basic Validation Demo
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Demonstrates basic field validation with real-time feedback, error handling, and
                  form state management.
                </Typography>
                <BasicValidationDemo />
              </Paper>
            )}

            {activeTab === 1 && (
              <Paper sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                  Advanced Validation Features
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Shows conditional validation, dynamic arrays, cross-field dependencies, and
                  complex form structures.
                </Typography>
                <AdvancedValidationDemo />
              </Paper>
            )}

            {activeTab === 2 && (
              <Paper sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                  Enhanced Barang Form
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Real-world implementation of the validation framework in a complete form with
                  business logic.
                </Typography>

                {!barangFormVisible ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => setBarangFormVisible(true)}
                    >
                      Open Enhanced Barang Form
                    </Button>
                  </Box>
                ) : (
                  <EnhancedBarangForm
                    onSave={() => {
                      setBarangFormVisible(false);
                      toast.success('Barang form demonstration completed!');
                    }}
                    onCancel={() => setBarangFormVisible(false)}
                  />
                )}
              </Paper>
            )}

            {activeTab === 3 && (
              <Paper sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                  Validation Framework Features
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Comprehensive overview of all validation capabilities and features.
                </Typography>
                <ValidationFeatures />
              </Paper>
            )}
          </Box>

          {/* Display submitted data */}
          {Object.keys(basicFormData).length > 0 && (
            <Paper sx={{ p: 3, mt: 3, bgcolor: 'grey.50' }}>
              <Typography variant="h6" gutterBottom>
                Basic Form Submitted Data:
              </Typography>
              <pre style={{ fontSize: '0.875rem', overflow: 'auto' }}>
                {JSON.stringify(basicFormData, null, 2)}
              </pre>
            </Paper>
          )}

          {Object.keys(advancedFormData).length > 0 && (
            <Paper sx={{ p: 3, mt: 3, bgcolor: 'grey.50' }}>
              <Typography variant="h6" gutterBottom>
                Advanced Form Submitted Data:
              </Typography>
              <pre style={{ fontSize: '0.875rem', overflow: 'auto' }}>
                {JSON.stringify(advancedFormData, null, 2)}
              </pre>
            </Paper>
          )}
        </Container>
      </ErrorBoundary>
    </ErrorProvider>
  );
};

export default ValidationDemo;
