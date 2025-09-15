import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Chip,
  Alert,
  Paper,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  LinearProgress,
  Badge,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {
  Security,
  Warning,
  CheckCircle,
  Error,
  Shield,
  Lock,
  VpnKey,
  Visibility,
  VisibilityOff,
  BugReport,
  NetworkCheck,
  Storage,
  Speed,
  Person,
  Group,
  Settings,
  Refresh,
  ExpandMore,
  Assessment,
  MonitorHeart,
  Notifications,
  TrendingUp,
  TrendingDown,
  Timeline,
} from '@mui/icons-material';

// Security Context for global security state
const SecurityContext = createContext();

export const useSecurityContext = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurityContext must be used within SecurityProvider');
  }
  return context;
};

// Security Provider Component
export const SecurityProvider = ({ children }) => {
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30, // minutes
    passwordComplexity: 'medium',
    loginAttempts: 3,
    ipWhitelist: false,
    encryptionLevel: 'aes256',
    auditLogging: true,
    securityHeaders: true,
    csrfProtection: true,
    xssProtection: true,
  });

  const [threats, setThreats] = useState([]);
  const [securityScore, setSecurityScore] = useState(85);
  const [lastScan, setLastScan] = useState(new Date());

  // Calculate security score based on settings
  const calculateSecurityScore = useCallback(() => {
    let score = 0;
    const weights = {
      twoFactorAuth: 20,
      passwordComplexity: 15,
      encryptionLevel: 15,
      auditLogging: 10,
      securityHeaders: 10,
      csrfProtection: 10,
      xssProtection: 10,
      ipWhitelist: 5,
      sessionTimeout: 5,
    };

    Object.entries(securitySettings).forEach(([key, value]) => {
      if (weights[key]) {
        if (typeof value === 'boolean' && value) {
          score += weights[key];
        } else if (key === 'passwordComplexity') {
          score += value === 'high' ? weights[key] : value === 'medium' ? weights[key] * 0.7 : weights[key] * 0.3;
        } else if (key === 'sessionTimeout') {
          score += value <= 15 ? weights[key] : weights[key] * 0.5;
        } else if (key === 'loginAttempts') {
          score += value <= 3 ? weights[key] : weights[key] * 0.5;
        }
      }
    });

    setSecurityScore(Math.min(100, Math.round(score)));
  }, [securitySettings]);

  useEffect(() => {
    calculateSecurityScore();
  }, [securitySettings, calculateSecurityScore]);

  // Security threat detection
  const detectThreats = useCallback(async () => {
    // Simulate threat detection
    const potentialThreats = [
      {
        id: 'auth-1',
        type: 'authentication',
        severity: 'medium',
        message: 'Multiple failed login attempts detected',
        timestamp: new Date(),
        resolved: false,
      },
      {
        id: 'net-1',
        type: 'network',
        severity: 'low',
        message: 'Unusual network activity from IP 192.168.1.100',
        timestamp: new Date(),
        resolved: false,
      },
      {
        id: 'sql-1',
        type: 'injection',
        severity: 'high',
        message: 'Potential SQL injection attempt blocked',
        timestamp: new Date(),
        resolved: true,
      },
    ];

    setThreats(potentialThreats);
    setLastScan(new Date());
  }, []);

  const updateSecuritySetting = useCallback((key, value) => {
    setSecuritySettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const value = {
    securitySettings,
    updateSecuritySetting,
    threats,
    securityScore,
    lastScan,
    detectThreats,
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
};

// Security Dashboard Component
export const SecurityDashboard = () => {
  const {
    securitySettings,
    updateSecuritySetting,
    threats,
    securityScore,
    lastScan,
    detectThreats,
  } = useSecurityContext();

  const [autoScan, setAutoScan] = useState(true);
  const [scanInterval, setScanInterval] = useState(300000); // 5 minutes

  // Auto scan threats
  useEffect(() => {
    if (autoScan) {
      const interval = setInterval(detectThreats, scanInterval);
      return () => clearInterval(interval);
    }
  }, [autoScan, scanInterval, detectThreats]);

  // Get security score color
  const getScoreColor = (score) => {
    if (score >= 90) return 'success';
    if (score >= 70) return 'warning';
    return 'error';
  };

  // Get threat severity color
  const getThreatColor = (severity) => {
    switch (severity) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  // Get threat icon
  const getThreatIcon = (type) => {
    switch (type) {
      case 'authentication': return <Person />;
      case 'network': return <NetworkCheck />;
      case 'injection': return <BugReport />;
      case 'xss': return <Warning />;
      default: return <Security />;
    }
  };

  const unresolvedThreats = threats.filter(threat => !threat.resolved);
  const highSeverityThreats = threats.filter(threat => threat.severity === 'high');

  return (
    <Box>
      {/* Security Overview */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Security Dashboard</Typography>
        <Box display="flex" gap={2}>
          <FormControlLabel
            control={
              <Switch
                checked={autoScan}
                onChange={(e) => setAutoScan(e.target.checked)}
              />
            }
            label="Auto Scan"
          />
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={detectThreats}
          >
            Scan Now
          </Button>
        </Box>
      </Box>

      {/* Security Score & Quick Stats */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Box position="relative" display="inline-flex" mb={2}>
                <LinearProgress
                  variant="determinate"
                  value={securityScore}
                  color={getScoreColor(securityScore)}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    width: 100,
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                    },
                  }}
                />
                <Box
                  position="absolute"
                  top="50%"
                  left="50%"
                  sx={{
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    {securityScore}%
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h4" color={`${getScoreColor(securityScore)}.main`}>
                {securityScore}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Security Score
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Badge badgeContent={unresolvedThreats.length} color="error">
                <Security color="primary" sx={{ fontSize: 40 }} />
              </Badge>
              <Typography variant="h5" mt={1}>
                {unresolvedThreats.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Threats
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Warning color="error" sx={{ fontSize: 40 }} />
              <Typography variant="h5" mt={1}>
                {highSeverityThreats.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                High Priority
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <MonitorHeart color="success" sx={{ fontSize: 40 }} />
              <Typography variant="h5" mt={1}>
                {Math.round((Date.now() - lastScan.getTime()) / 60000)}m
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Last Scan
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Active Threats */}
      {unresolvedThreats.length > 0 && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="h6">Security Alert</Typography>
          <Typography>
            {unresolvedThreats.length} active threat{unresolvedThreats.length > 1 ? 's' : ''} detected. 
            Immediate attention required for high-priority threats.
          </Typography>
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Security Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Security Configuration
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <VpnKey />
                  </ListItemIcon>
                  <ListItemText primary="Two-Factor Authentication" />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={securitySettings.twoFactorAuth}
                      onChange={(e) => updateSecuritySetting('twoFactorAuth', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <Shield />
                  </ListItemIcon>
                  <ListItemText primary="CSRF Protection" />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={securitySettings.csrfProtection}
                      onChange={(e) => updateSecuritySetting('csrfProtection', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <Security />
                  </ListItemIcon>
                  <ListItemText primary="XSS Protection" />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={securitySettings.xssProtection}
                      onChange={(e) => updateSecuritySetting('xssProtection', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <Assessment />
                  </ListItemIcon>
                  <ListItemText primary="Audit Logging" />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={securitySettings.auditLogging}
                      onChange={(e) => updateSecuritySetting('auditLogging', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <NetworkCheck />
                  </ListItemIcon>
                  <ListItemText primary="IP Whitelist" />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={securitySettings.ipWhitelist}
                      onChange={(e) => updateSecuritySetting('ipWhitelist', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>

              <Box mt={2}>
                <Typography variant="subtitle2" gutterBottom>
                  Password Complexity
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={securitySettings.passwordComplexity}
                    onChange={(e) => updateSecuritySetting('passwordComplexity', e.target.value)}
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Box mt={2}>
                <Typography variant="subtitle2" gutterBottom>
                  Session Timeout (minutes)
                </Typography>
                <TextField
                  type="number"
                  size="small"
                  fullWidth
                  value={securitySettings.sessionTimeout}
                  onChange={(e) => updateSecuritySetting('sessionTimeout', parseInt(e.target.value))}
                  inputProps={{ min: 5, max: 60 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Threat Detection */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Threat Detection
              </Typography>
              
              {threats.length === 0 ? (
                <Box textAlign="center" py={4}>
                  <CheckCircle color="success" sx={{ fontSize: 60, mb: 2 }} />
                  <Typography variant="h6" color="success.main">
                    All Clear
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    No security threats detected
                  </Typography>
                </Box>
              ) : (
                <List>
                  {threats.map((threat) => (
                    <ListItem key={threat.id}>
                      <ListItemIcon>
                        <Box color={`${getThreatColor(threat.severity)}.main`}>
                          {getThreatIcon(threat.type)}
                        </Box>
                      </ListItemIcon>
                      <ListItemText
                        primary={threat.message}
                        secondary={
                          <Box>
                            <Typography variant="caption" display="block">
                              {threat.timestamp.toLocaleString()}
                            </Typography>
                            <Chip
                              label={threat.severity.toUpperCase()}
                              color={getThreatColor(threat.severity)}
                              size="small"
                              sx={{ mt: 0.5 }}
                            />
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        {threat.resolved ? (
                          <CheckCircle color="success" />
                        ) : (
                          <Tooltip title="Mark as resolved">
                            <IconButton
                              onClick={() => {
                                // Mark threat as resolved
                                setThreats(prev => 
                                  prev.map(t => 
                                    t.id === threat.id ? { ...t, resolved: true } : t
                                  )
                                );
                              }}
                            >
                              <CheckCircle />
                            </IconButton>
                          </Tooltip>
                        )}
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

// Security Settings Panel
export const SecuritySettingsPanel = () => {
  const { securitySettings, updateSecuritySetting } = useSecurityContext();
  const [expanded, setExpanded] = useState('authentication');

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Advanced Security Settings
      </Typography>

      {/* Authentication Settings */}
      <Accordion
        expanded={expanded === 'authentication'}
        onChange={handleAccordionChange('authentication')}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box display="flex" alignItems="center" gap={2}>
            <Person />
            <Typography variant="h6">Authentication & Access</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={securitySettings.twoFactorAuth}
                    onChange={(e) => updateSecuritySetting('twoFactorAuth', e.target.checked)}
                  />
                }
                label="Two-Factor Authentication"
              />
              <Typography variant="body2" color="text.secondary">
                Require additional verification for login
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom>
                Max Login Attempts
              </Typography>
              <TextField
                type="number"
                size="small"
                fullWidth
                value={securitySettings.loginAttempts}
                onChange={(e) => updateSecuritySetting('loginAttempts', parseInt(e.target.value))}
                inputProps={{ min: 1, max: 10 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom>
                Password Complexity
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={securitySettings.passwordComplexity}
                  onChange={(e) => updateSecuritySetting('passwordComplexity', e.target.value)}
                >
                  <MenuItem value="low">Low - 6 characters minimum</MenuItem>
                  <MenuItem value="medium">Medium - 8 chars, mixed case</MenuItem>
                  <MenuItem value="high">High - 12 chars, special symbols</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom>
                Session Timeout (minutes)
              </Typography>
              <TextField
                type="number"
                size="small"
                fullWidth
                value={securitySettings.sessionTimeout}
                onChange={(e) => updateSecuritySetting('sessionTimeout', parseInt(e.target.value))}
                inputProps={{ min: 5, max: 120 }}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Data Protection */}
      <Accordion
        expanded={expanded === 'data'}
        onChange={handleAccordionChange('data')}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box display="flex" alignItems="center" gap={2}>
            <Lock />
            <Typography variant="h6">Data Protection</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom>
                Encryption Level
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={securitySettings.encryptionLevel}
                  onChange={(e) => updateSecuritySetting('encryptionLevel', e.target.value)}
                >
                  <MenuItem value="aes128">AES-128</MenuItem>
                  <MenuItem value="aes256">AES-256</MenuItem>
                  <MenuItem value="rsa2048">RSA-2048</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={securitySettings.auditLogging}
                    onChange={(e) => updateSecuritySetting('auditLogging', e.target.checked)}
                  />
                }
                label="Audit Logging"
              />
              <Typography variant="body2" color="text.secondary">
                Log all data access and modifications
              </Typography>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Network Security */}
      <Accordion
        expanded={expanded === 'network'}
        onChange={handleAccordionChange('network')}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box display="flex" alignItems="center" gap={2}>
            <NetworkCheck />
            <Typography variant="h6">Network Security</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={securitySettings.securityHeaders}
                    onChange={(e) => updateSecuritySetting('securityHeaders', e.target.checked)}
                  />
                }
                label="Security Headers"
              />
              <Typography variant="body2" color="text.secondary">
                Enable HSTS, CSP, and other security headers
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={securitySettings.ipWhitelist}
                    onChange={(e) => updateSecuritySetting('ipWhitelist', e.target.checked)}
                  />
                }
                label="IP Whitelist"
              />
              <Typography variant="body2" color="text.secondary">
                Restrict access to approved IP addresses
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={securitySettings.csrfProtection}
                    onChange={(e) => updateSecuritySetting('csrfProtection', e.target.checked)}
                  />
                }
                label="CSRF Protection"
              />
              <Typography variant="body2" color="text.secondary">
                Prevent cross-site request forgery attacks
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={securitySettings.xssProtection}
                    onChange={(e) => updateSecuritySetting('xssProtection', e.target.checked)}
                  />
                }
                label="XSS Protection"
              />
              <Typography variant="body2" color="text.secondary">
                Filter and block cross-site scripting attempts
              </Typography>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default {
  SecurityProvider,
  SecurityDashboard,
  SecuritySettingsPanel,
  useSecurityContext,
};
