import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Button,
  IconButton,
  Typography,
  Switch,
  Slider,
  FormControlLabel,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Alert,
  Tooltip,
} from '@mui/material';
import {
  Accessibility,
  ZoomIn,
  ZoomOut,
  Contrast,
  TextFields,
  VolumeUp,
  VolumeOff,
  Visibility,
  VisibilityOff,
  KeyboardArrowUp,
  KeyboardArrowDown,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  SkipNext,
} from '@mui/icons-material';

// Accessibility toolbar
export const AccessibilityToolbar = ({ 
  position = 'bottom-right',
  onSettingsChange 
}) => {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState({
    fontSize: 16,
    highContrast: false,
    reduceMotion: false,
    screenReader: false,
    soundEnabled: true,
    keyboardNavigation: true,
    focusIndicator: true,
  });

  const handleSettingChange = useCallback((key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsChange?.(newSettings);

    // Apply settings to document
    if (key === 'fontSize') {
      document.documentElement.style.fontSize = `${value}px`;
    }
    if (key === 'highContrast') {
      document.documentElement.classList.toggle('high-contrast', value);
    }
    if (key === 'reduceMotion') {
      document.documentElement.classList.toggle('reduce-motion', value);
    }
  }, [settings, onSettingsChange]);

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          ...(position.includes('bottom') ? { bottom: 16 } : { top: 16 }),
          ...(position.includes('right') ? { right: 16 } : { left: 16 }),
          zIndex: 9999,
        }}
      >
        <Tooltip title="Accessibility Settings">
          <IconButton
            onClick={() => setOpen(true)}
            sx={{
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            }}
            aria-label="Open accessibility settings"
          >
            <Accessibility />
          </IconButton>
        </Tooltip>
      </Box>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
        aria-labelledby="accessibility-dialog-title"
      >
        <DialogTitle id="accessibility-dialog-title">
          Accessibility Settings
        </DialogTitle>
        <DialogContent>
          <List>
            <ListItem>
              <ListItemIcon>
                <TextFields />
              </ListItemIcon>
              <ListItemText
                primary="Font Size"
                secondary={`Current: ${settings.fontSize}px`}
              />
              <Box sx={{ width: 120, ml: 2 }}>
                <Slider
                  value={settings.fontSize}
                  onChange={(_, value) => handleSettingChange('fontSize', value)}
                  min={12}
                  max={24}
                  step={1}
                  marks={[
                    { value: 12, label: 'S' },
                    { value: 16, label: 'M' },
                    { value: 20, label: 'L' },
                    { value: 24, label: 'XL' },
                  ]}
                  aria-label="Font size"
                />
              </Box>
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <Contrast />
              </ListItemIcon>
              <ListItemText
                primary="High Contrast"
                secondary="Increase contrast for better visibility"
              />
              <Switch
                checked={settings.highContrast}
                onChange={(e) => handleSettingChange('highContrast', e.target.checked)}
                inputProps={{ 'aria-label': 'High contrast mode' }}
              />
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <Visibility />
              </ListItemIcon>
              <ListItemText
                primary="Reduce Motion"
                secondary="Minimize animations for comfort"
              />
              <Switch
                checked={settings.reduceMotion}
                onChange={(e) => handleSettingChange('reduceMotion', e.target.checked)}
                inputProps={{ 'aria-label': 'Reduce motion' }}
              />
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <VolumeUp />
              </ListItemIcon>
              <ListItemText
                primary="Sound Feedback"
                secondary="Audio cues for interactions"
              />
              <Switch
                checked={settings.soundEnabled}
                onChange={(e) => handleSettingChange('soundEnabled', e.target.checked)}
                inputProps={{ 'aria-label': 'Sound feedback' }}
              />
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <SkipNext />
              </ListItemIcon>
              <ListItemText
                primary="Keyboard Navigation"
                secondary="Enhanced keyboard support"
              />
              <Switch
                checked={settings.keyboardNavigation}
                onChange={(e) => handleSettingChange('keyboardNavigation', e.target.checked)}
                inputProps={{ 'aria-label': 'Keyboard navigation' }}
              />
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <Accessibility />
              </ListItemIcon>
              <ListItemText
                primary="Focus Indicator"
                secondary="Enhanced focus visibility"
              />
              <Switch
                checked={settings.focusIndicator}
                onChange={(e) => handleSettingChange('focusIndicator', e.target.checked)}
                inputProps={{ 'aria-label': 'Focus indicator' }}
              />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// Skip navigation links
export const SkipLinks = ({ links = [] }) => {
  const defaultLinks = [
    { href: '#main-content', label: 'Skip to main content' },
    { href: '#navigation', label: 'Skip to navigation' },
    { href: '#footer', label: 'Skip to footer' },
  ];

  const allLinks = links.length > 0 ? links : defaultLinks;

  return (
    <Box
      sx={{
        position: 'absolute',
        top: -40,
        left: 6,
        zIndex: 10000,
        '&:focus-within': {
          top: 6,
        },
      }}
    >
      {allLinks.map((link, index) => (
        <Button
          key={index}
          href={link.href}
          variant="contained"
          size="small"
          sx={{
            mr: 1,
            opacity: 0,
            transform: 'translateY(-100%)',
            transition: 'all 0.3s ease',
            '&:focus': {
              opacity: 1,
              transform: 'translateY(0)',
            },
          }}
          onFocus={(e) => {
            e.target.style.opacity = '1';
            e.target.style.transform = 'translateY(0)';
          }}
          onBlur={(e) => {
            e.target.style.opacity = '0';
            e.target.style.transform = 'translateY(-100%)';
          }}
        >
          {link.label}
        </Button>
      ))}
    </Box>
  );
};

// ARIA live region for announcements
export const LiveRegion = ({ 
  children, 
  politeness = 'polite',
  atomic = false 
}) => {
  return (
    <div
      aria-live={politeness}
      aria-atomic={atomic}
      style={{
        position: 'absolute',
        left: '-10000px',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  );
};

// Enhanced focus trap
export const FocusTrap = ({ children, active = true }) => {
  const containerRef = useRef(null);
  const firstFocusableRef = useRef(null);
  const lastFocusableRef = useRef(null);

  useEffect(() => {
    if (!active || !containerRef.current) return;

    const focusableElements = containerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    firstFocusableRef.current = focusableElements[0];
    lastFocusableRef.current = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusableRef.current) {
          e.preventDefault();
          lastFocusableRef.current.focus();
        }
      } else {
        if (document.activeElement === lastFocusableRef.current) {
          e.preventDefault();
          firstFocusableRef.current.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    firstFocusableRef.current.focus();

    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [active]);

  return <div ref={containerRef}>{children}</div>;
};

// Keyboard navigation helper
export const useKeyboardNavigation = (items = [], orientation = 'vertical') => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const handleKeyDown = useCallback((e) => {
    if (!isActive) return;

    const isVertical = orientation === 'vertical';
    const nextKey = isVertical ? 'ArrowDown' : 'ArrowRight';
    const prevKey = isVertical ? 'ArrowUp' : 'ArrowLeft';

    switch (e.key) {
      case nextKey:
        e.preventDefault();
        setCurrentIndex(prev => (prev + 1) % items.length);
        break;
      case prevKey:
        e.preventDefault();
        setCurrentIndex(prev => (prev - 1 + items.length) % items.length);
        break;
      case 'Home':
        e.preventDefault();
        setCurrentIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setCurrentIndex(items.length - 1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        items[currentIndex]?.onClick?.();
        break;
    }
  }, [items, currentIndex, isActive, orientation]);

  useEffect(() => {
    if (isActive) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown, isActive]);

  return {
    currentIndex,
    setCurrentIndex,
    isActive,
    setIsActive,
    handleKeyDown,
  };
};

// Accessible tooltip
export const AccessibleTooltip = ({ 
  children, 
  title, 
  description,
  placement = 'top' 
}) => {
  const [open, setOpen] = useState(false);
  const tooltipId = `tooltip-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <>
      <Tooltip
        title={
          <Box>
            <Typography variant="subtitle2">{title}</Typography>
            {description && (
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {description}
              </Typography>
            )}
          </Box>
        }
        placement={placement}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        arrow
      >
        <Box
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          aria-describedby={open ? tooltipId : undefined}
        >
          {children}
        </Box>
      </Tooltip>
      {open && (
        <div id={tooltipId} style={{ display: 'none' }}>
          {title} {description}
        </div>
      )}
    </>
  );
};

// Screen reader text
export const ScreenReaderText = ({ children }) => {
  return (
    <span
      style={{
        position: 'absolute',
        left: '-10000px',
        top: 'auto',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
      }}
    >
      {children}
    </span>
  );
};

// High contrast mode detector
export const useHighContrast = () => {
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    setIsHighContrast(mediaQuery.matches);

    const handleChange = (e) => setIsHighContrast(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return isHighContrast;
};

// Reduced motion detector
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

// Accessibility status indicator
export const AccessibilityStatus = ({ violations = [] }) => {
  if (violations.length === 0) {
    return (
      <Chip
        icon={<Accessibility />}
        label="Accessible"
        color="success"
        size="small"
      />
    );
  }

  return (
    <Alert severity="warning" sx={{ mt: 1 }}>
      <Typography variant="subtitle2" gutterBottom>
        Accessibility Issues Found:
      </Typography>
      <List dense>
        {violations.map((violation, index) => (
          <ListItem key={index} sx={{ py: 0 }}>
            <ListItemText
              primary={violation.description}
              secondary={`Impact: ${violation.impact}`}
            />
          </ListItem>
        ))}
      </List>
    </Alert>
  );
};

export default {
  AccessibilityToolbar,
  SkipLinks,
  LiveRegion,
  FocusTrap,
  useKeyboardNavigation,
  AccessibleTooltip,
  ScreenReaderText,
  useHighContrast,
  useReducedMotion,
  AccessibilityStatus,
};
