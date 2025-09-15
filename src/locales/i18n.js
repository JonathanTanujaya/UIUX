// i18n configuration for internationalization support
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import id from './id';
import en from './en';

// Translation resources
const resources = {
  id,
  en,
};

// Language detection options
const detectionOptions = {
  // Order of language detection
  order: ['localStorage', 'sessionStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],

  // Cache user language
  caches: ['localStorage', 'sessionStorage'],

  // Optional: exclude language codes from detection
  excludeCacheFor: ['cimode'],

  // Optional: HTML attribute to look for language
  htmlTag: document.documentElement,

  // Optional: set cookie options
  cookieOptions: { path: '/', sameSite: 'strict' },
};

// Initialize i18n
i18n
  // Load translations using http backend
  .use(Backend)
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    // Resources
    resources,

    // Default language
    fallbackLng: 'id',

    // Default namespace
    defaultNS: 'translation',

    // Language detection
    detection: detectionOptions,

    // Debug mode (set to false in production)
    debug: process.env.NODE_ENV === 'development',

    // Interpolation options
    interpolation: {
      escapeValue: false, // React already escapes values
      formatSeparator: ',',
      format: function (value, format, lng) {
        // Custom formatting for numbers, dates, etc.
        if (format === 'currency') {
          return new Intl.NumberFormat(lng, {
            style: 'currency',
            currency: lng === 'id' ? 'IDR' : 'USD',
            minimumFractionDigits: 0,
          }).format(value);
        }

        if (format === 'number') {
          return new Intl.NumberFormat(lng).format(value);
        }

        if (format === 'date') {
          return new Intl.DateTimeFormat(lng).format(new Date(value));
        }

        if (format === 'datetime') {
          return new Intl.DateTimeFormat(lng, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }).format(new Date(value));
        }

        if (format === 'percentage') {
          return new Intl.NumberFormat(lng, {
            style: 'percent',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          }).format(value / 100);
        }

        return value;
      },
    },

    // React options
    react: {
      useSuspense: false, // Disable suspense for SSR compatibility
      bindI18n: 'languageChanged loaded',
      bindI18nStore: 'added removed',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'em', 'span'],
    },

    // Backend options (if using http backend)
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
      addPath: '/locales/add/{{lng}}/{{ns}}',
      allowMultiLoading: false,
      crossDomain: false,
      withCredentials: false,
      requestOptions: {
        mode: 'cors',
        credentials: 'same-origin',
        cache: 'default',
      },
    },

    // Performance optimizations
    load: 'languageOnly', // Only load language without region
    preload: ['id', 'en'], // Preload these languages

    // Namespace loading
    ns: ['translation'],

    // Key separator
    keySeparator: '.',
    nsSeparator: ':',

    // Pluralization
    pluralSeparator: '_',
    contextSeparator: '_',

    // Missing key handling
    saveMissing: process.env.NODE_ENV === 'development',
    missingKeyHandler: function (lng, ns, key, fallbackValue) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Missing translation key: ${lng}.${ns}.${key}`);
      }
    },

    // Post processor for special formatting
    postProcess: ['interval'],

    // Clean code on language change
    cleanCode: true,

    // Return objects instead of strings when using objects as values
    returnObjects: false,

    // Return empty string for null values
    returnNull: false,
    returnEmptyString: true,

    // Join arrays with separator
    joinArrays: '\n',

    // Override options
    overloadTranslationOptionHandler: function (args) {
      return {
        defaultValue: args[1],
      };
    },
  });

// Export i18n instance
export default i18n;

// Helper functions for common use cases
export const t = i18n.t.bind(i18n);
export const changeLanguage = i18n.changeLanguage.bind(i18n);
export const getCurrentLanguage = () => i18n.language;
export const getSupportedLanguages = () => Object.keys(resources);

// Validation message formatter
export const formatValidationMessage = (key, field, options = {}) => {
  return i18n.t(`validation.${key}`, {
    field: i18n.t(`fields.${field}`),
    ...options,
  });
};

// Field name translator
export const getFieldName = fieldKey => {
  return i18n.t(`fields.${fieldKey}`, { defaultValue: fieldKey });
};

// Error message formatter
export const formatErrorMessage = (errorType, customMessage = null) => {
  const errorConfig = i18n.t(`errors.${errorType}`, { returnObjects: true });

  return {
    title: errorConfig?.title || i18n.t('errors.unknown.title'),
    message: customMessage || errorConfig?.message || i18n.t('errors.unknown.message'),
    action: errorConfig?.action || i18n.t('errors.unknown.action'),
  };
};

// Success message formatter
export const formatSuccessMessage = action => {
  return i18n.t(`success.${action}`, { defaultValue: i18n.t('success.save') });
};

// Currency formatter
export const formatCurrency = (value, currency = null) => {
  const lng = i18n.language;
  const currencyCode = currency || (lng === 'id' ? 'IDR' : 'USD');

  return new Intl.NumberFormat(lng, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
  }).format(value || 0);
};

// Number formatter
export const formatNumber = (value, options = {}) => {
  const lng = i18n.language;
  return new Intl.NumberFormat(lng, options).format(value || 0);
};

// Date formatter
export const formatDate = (value, options = {}) => {
  const lng = i18n.language;
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  return new Intl.DateTimeFormat(lng, { ...defaultOptions, ...options }).format(new Date(value));
};

// DateTime formatter
export const formatDateTime = (value, options = {}) => {
  const lng = i18n.language;
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  return new Intl.DateTimeFormat(lng, { ...defaultOptions, ...options }).format(new Date(value));
};

// Percentage formatter
export const formatPercentage = (value, decimals = 0) => {
  const lng = i18n.language;
  return new Intl.NumberFormat(lng, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format((value || 0) / 100);
};

// Pluralization helper
export const pluralize = (count, singular, plural = null) => {
  if (plural === null) {
    plural = `${singular}s`;
  }

  return count === 1 ? singular : plural;
};

// Truncate text helper
export const truncateText = (text, maxLength = 50, suffix = '...') => {
  if (!text || text.length <= maxLength) {
    return text;
  }

  return text.substring(0, maxLength - suffix.length) + suffix;
};

// Language switcher component props
export const getLanguageSwitcherProps = () => ({
  currentLanguage: getCurrentLanguage(),
  supportedLanguages: getSupportedLanguages().map(lang => ({
    code: lang,
    name: i18n.t(`language.${lang}`, { defaultValue: lang.toUpperCase() }),
  })),
  onLanguageChange: changeLanguage,
});

// Validation message helpers for react-hook-form
export const getValidationRules = (fieldType, fieldName, options = {}) => {
  const rules = {};

  if (options.required) {
    rules.required = formatValidationMessage('required', fieldName);
  }

  if (options.minLength) {
    rules.minLength = {
      value: options.minLength,
      message: formatValidationMessage('minLength', fieldName, { min: options.minLength }),
    };
  }

  if (options.maxLength) {
    rules.maxLength = {
      value: options.maxLength,
      message: formatValidationMessage('maxLength', fieldName, { max: options.maxLength }),
    };
  }

  if (options.min) {
    rules.min = {
      value: options.min,
      message: formatValidationMessage('min', fieldName, { min: options.min }),
    };
  }

  if (options.max) {
    rules.max = {
      value: options.max,
      message: formatValidationMessage('max', fieldName, { max: options.max }),
    };
  }

  if (fieldType === 'email') {
    rules.pattern = {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: formatValidationMessage('email', fieldName),
    };
  }

  if (fieldType === 'phone') {
    rules.pattern = {
      value: /^(\+62|62|0)8[1-9][0-9]{6,9}$/,
      message: formatValidationMessage('phone', fieldName),
    };
  }

  if (fieldType === 'numeric') {
    rules.pattern = {
      value: /^\d+(\.\d+)?$/,
      message: formatValidationMessage('numeric', fieldName),
    };
  }

  return rules;
};
