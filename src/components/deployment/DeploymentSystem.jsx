import React, { useState, useEffect, useCallback } from 'react';
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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  LinearProgress,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Badge,
  Divider,
} from '@mui/material';
import {
  CloudUpload,
  CloudDownload,
  Settings,
  PlayArrow,
  Stop,
  Refresh,
  CheckCircle,
  Error,
  Warning,
  Schedule,
  Build,
  Deploy,
  Security,
  MonitorHeart,
  Storage,
  Speed,
  NetworkCheck,
  Computer,
  CloudQueue,
  GitHub,
  Docker,
  Terminal,
  Code,
  Api,
  Database,
  ExpandMore,
  Visibility,
  Edit,
  Delete,
  Add,
  FileCopy,
  Launch,
  Timeline,
} from '@mui/icons-material';

// Deployment environments
const ENVIRONMENTS = {
  development: {
    name: 'Development',
    color: 'info',
    icon: <Code />,
    url: 'https://dev.example.com',
    status: 'active',
  },
  staging: {
    name: 'Staging',
    color: 'warning',
    icon: <Build />,
    url: 'https://staging.example.com',
    status: 'active',
  },
  production: {
    name: 'Production',
    color: 'success',
    icon: <Launch />,
    url: 'https://app.example.com',
    status: 'active',
  },
};

// Mock deployment data
const generateDeploymentHistory = () => {
  const deployments = [];
  const environments = Object.keys(ENVIRONMENTS);
  const statuses = ['success', 'failed', 'in-progress', 'cancelled'];
  
  for (let i = 0; i < 20; i++) {
    const env = environments[Math.floor(Math.random() * environments.length)];
    const status = i === 0 ? 'in-progress' : statuses[Math.floor(Math.random() * statuses.length)];
    const timestamp = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
    
    deployments.push({
      id: `deploy-${i}`,
      environment: env,
      status,
      version: `v1.${Math.floor(Math.random() * 50)}.${Math.floor(Math.random() * 10)}`,
      commit: `${Math.random().toString(36).substring(2, 8)}`,
      author: `developer${Math.floor(Math.random() * 5) + 1}`,
      timestamp,
      duration: Math.floor(Math.random() * 600 + 120), // 2-12 minutes
      changes: Math.floor(Math.random() * 20 + 5),
    });
  }
  
  return deployments.sort((a, b) => b.timestamp - a.timestamp);
};

// Deployment Configuration Component
export const DeploymentDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [deployments, setDeployments] = useState([]);
  const [pipelines, setPipelines] = useState({});
  const [environments, setEnvironments] = useState(ENVIRONMENTS);
  const [loading, setLoading] = useState(false);
  const [selectedDeployment, setSelectedDeployment] = useState(null);
  const [deployDialogOpen, setDeployDialogOpen] = useState(false);
  const [newDeployment, setNewDeployment] = useState({
    environment: 'development',
    branch: 'main',
    version: '',
    description: '',
  });

  // Initialize data
  useEffect(() => {
    const mockDeployments = generateDeploymentHistory();
    setDeployments(mockDeployments);
    
    // Mock pipeline status
    setPipelines({
      development: { running: false, lastRun: new Date(), success: true },
      staging: { running: true, lastRun: new Date(), success: true },
      production: { running: false, lastRun: new Date(Date.now() - 3600000), success: true },
    });
  }, []);

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'success';
      case 'failed': return 'error';
      case 'in-progress': return 'info';
      case 'cancelled': return 'warning';
      default: return 'default';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return <CheckCircle />;
      case 'failed': return <Error />;
      case 'in-progress': return <CircularProgress size={20} />;
      case 'cancelled': return <Warning />;
      default: return <Schedule />;
    }
  };

  // Handle deployment
  const handleDeploy = useCallback(async () => {
    setLoading(true);
    
    try {
      // Simulate deployment process
      const deployment = {
        id: `deploy-${Date.now()}`,
        ...newDeployment,
        status: 'in-progress',
        timestamp: new Date(),
        commit: Math.random().toString(36).substring(2, 8),
        author: 'current-user',
        duration: 0,
        changes: Math.floor(Math.random() * 15 + 3),
      };

      setDeployments(prev => [deployment, ...prev]);
      setPipelines(prev => ({
        ...prev,
        [newDeployment.environment]: {
          ...prev[newDeployment.environment],
          running: true,
          lastRun: new Date(),
        }
      }));

      // Simulate deployment completion
      setTimeout(() => {
        const success = Math.random() > 0.2; // 80% success rate
        
        setDeployments(prev => prev.map(d => 
          d.id === deployment.id 
            ? { ...d, status: success ? 'success' : 'failed', duration: Math.floor(Math.random() * 300 + 120) }
            : d
        ));
        
        setPipelines(prev => ({
          ...prev,
          [newDeployment.environment]: {
            ...prev[newDeployment.environment],
            running: false,
            success,
          }
        }));
      }, 5000);

      setDeployDialogOpen(false);
      setNewDeployment({
        environment: 'development',
        branch: 'main',
        version: '',
        description: '',
      });
      
    } catch (error) {
      console.error('Deployment failed:', error);
    } finally {
      setLoading(false);
    }
  }, [newDeployment]);

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Deployment & DevOps</Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            startIcon={<Deploy />}
            onClick={() => setDeployDialogOpen(true)}
          >
            New Deployment
          </Button>
          <Button variant="outlined" startIcon={<Refresh />}>
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Environment Status Cards */}
      <Grid container spacing={3} mb={3}>
        {Object.entries(environments).map(([key, env]) => {
          const pipeline = pipelines[key];
          const lastDeployment = deployments.find(d => d.environment === key);
          
          return (
            <Grid item xs={12} md={4} key={key}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box color={`${env.color}.main`}>
                        {env.icon}
                      </Box>
                      <Typography variant="h6">{env.name}</Typography>
                    </Box>
                    <Chip
                      label={env.status}
                      color={env.color}
                      size="small"
                    />
                  </Box>

                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    {env.url}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="body2">Pipeline Status</Typography>
                    {pipeline?.running ? (
                      <Box display="flex" alignItems="center" gap={1}>
                        <CircularProgress size={16} />
                        <Typography variant="caption">Running</Typography>
                      </Box>
                    ) : (
                      <Chip
                        label={pipeline?.success ? 'Success' : 'Failed'}
                        color={pipeline?.success ? 'success' : 'error'}
                        size="small"
                      />
                    )}
                  </Box>

                  {lastDeployment && (
                    <Box>
                      <Typography variant="caption" color="textSecondary">
                        Last deployment: {lastDeployment.version}
                      </Typography>
                      <Typography variant="caption" display="block" color="textSecondary">
                        {lastDeployment.timestamp.toLocaleString()}
                      </Typography>
                    </Box>
                  )}

                  <Box display="flex" gap={1} mt={2}>
                    <Button size="small" startIcon={<Visibility />}>
                      View
                    </Button>
                    <Button size="small" startIcon={<Settings />}>
                      Configure
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="Deployment History" />
          <Tab label="Pipeline Configuration" />
          <Tab label="Infrastructure" />
          <Tab label="Monitoring" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {tabValue === 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Deployments
            </Typography>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Status</TableCell>
                    <TableCell>Environment</TableCell>
                    <TableCell>Version</TableCell>
                    <TableCell>Commit</TableCell>
                    <TableCell>Author</TableCell>
                    <TableCell>Timestamp</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {deployments.slice(0, 10).map((deployment) => (
                    <TableRow key={deployment.id}>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Box color={`${getStatusColor(deployment.status)}.main`}>
                            {getStatusIcon(deployment.status)}
                          </Box>
                          <Typography variant="body2" textTransform="capitalize">
                            {deployment.status}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={environments[deployment.environment]?.name}
                          color={environments[deployment.environment]?.color}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{deployment.version}</TableCell>
                      <TableCell>
                        <Typography variant="body2" fontFamily="monospace">
                          {deployment.commit}
                        </Typography>
                      </TableCell>
                      <TableCell>{deployment.author}</TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {deployment.timestamp.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {deployment.status === 'in-progress' ? (
                          <LinearProgress sx={{ width: 60 }} />
                        ) : (
                          <Typography variant="body2">
                            {Math.floor(deployment.duration / 60)}m {deployment.duration % 60}s
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Box display="flex" gap={1}>
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => setSelectedDeployment(deployment)}
                            >
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                          {deployment.status === 'success' && (
                            <Tooltip title="Rollback">
                              <IconButton size="small" color="warning">
                                <Refresh />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {tabValue === 1 && (
        <Grid container spacing={3}>
          {/* CI/CD Pipeline */}
          <Grid item xs={12} lg={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  CI/CD Pipeline Configuration
                </Typography>
                
                <Stepper orientation="vertical">
                  {[
                    {
                      label: 'Source Control',
                      description: 'GitHub repository integration',
                      icon: <GitHub />,
                      status: 'completed',
                    },
                    {
                      label: 'Build Process',
                      description: 'Compile and bundle application',
                      icon: <Build />,
                      status: 'completed',
                    },
                    {
                      label: 'Testing',
                      description: 'Run automated tests',
                      icon: <CheckCircle />,
                      status: 'completed',
                    },
                    {
                      label: 'Security Scan',
                      description: 'Vulnerability assessment',
                      icon: <Security />,
                      status: 'active',
                    },
                    {
                      label: 'Deployment',
                      description: 'Deploy to target environment',
                      icon: <Deploy />,
                      status: 'pending',
                    },
                    {
                      label: 'Health Check',
                      description: 'Verify deployment success',
                      icon: <MonitorHeart />,
                      status: 'pending',
                    },
                  ].map((step, index) => (
                    <Step key={step.label} active={step.status === 'active'} completed={step.status === 'completed'}>
                      <StepLabel
                        StepIconComponent={() => (
                          <Box
                            sx={{
                              color: 
                                step.status === 'completed' ? 'success.main' :
                                step.status === 'active' ? 'primary.main' : 'grey.400',
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            {step.icon}
                          </Box>
                        )}
                      >
                        {step.label}
                      </StepLabel>
                      <StepContent>
                        <Typography variant="body2" color="textSecondary">
                          {step.description}
                        </Typography>
                      </StepContent>
                    </Step>
                  ))}
                </Stepper>
              </CardContent>
            </Card>
          </Grid>

          {/* Pipeline Settings */}
          <Grid item xs={12} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Pipeline Settings
                </Typography>
                
                <List>
                  <ListItem>
                    <ListItemText primary="Auto Deploy" secondary="Automatically deploy on push" />
                    <ListItemSecondaryAction>
                      <Switch defaultChecked />
                    </ListItemSecondaryAction>
                  </ListItem>
                  
                  <ListItem>
                    <ListItemText primary="Run Tests" secondary="Execute test suite before deploy" />
                    <ListItemSecondaryAction>
                      <Switch defaultChecked />
                    </ListItemSecondaryAction>
                  </ListItem>
                  
                  <ListItem>
                    <ListItemText primary="Security Scan" secondary="Perform security vulnerability scan" />
                    <ListItemSecondaryAction>
                      <Switch defaultChecked />
                    </ListItemSecondaryAction>
                  </ListItem>
                  
                  <ListItem>
                    <ListItemText primary="Notifications" secondary="Send deployment notifications" />
                    <ListItemSecondaryAction>
                      <Switch defaultChecked />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>

                <Box mt={2}>
                  <TextField
                    fullWidth
                    label="Build Timeout (minutes)"
                    type="number"
                    defaultValue={30}
                    size="small"
                    sx={{ mb: 2 }}
                  />
                  
                  <TextField
                    fullWidth
                    label="Deployment Branch"
                    defaultValue="main"
                    size="small"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {tabValue === 2 && (
        <Grid container spacing={3}>
          {/* Infrastructure Overview */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Infrastructure Resources
                </Typography>
                
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Computer />
                    </ListItemIcon>
                    <ListItemText
                      primary="Server Instances"
                      secondary="3 active instances"
                    />
                    <ListItemSecondaryAction>
                      <Chip label="Healthy" color="success" size="small" />
                    </ListItemSecondaryAction>
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <Database />
                    </ListItemIcon>
                    <ListItemText
                      primary="Database"
                      secondary="PostgreSQL 14.0"
                    />
                    <ListItemSecondaryAction>
                      <Chip label="Online" color="success" size="small" />
                    </ListItemSecondaryAction>
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <CloudQueue />
                    </ListItemIcon>
                    <ListItemText
                      primary="Load Balancer"
                      secondary="AWS Application Load Balancer"
                    />
                    <ListItemSecondaryAction>
                      <Chip label="Active" color="success" size="small" />
                    </ListItemSecondaryAction>
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <Storage />
                    </ListItemIcon>
                    <ListItemText
                      primary="File Storage"
                      secondary="S3 Bucket - 45.2 GB used"
                    />
                    <ListItemSecondaryAction>
                      <Chip label="75%" color="warning" size="small" />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Resource Metrics */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Resource Utilization
                </Typography>
                
                <Box mb={3}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">CPU Usage</Typography>
                    <Typography variant="body2">45%</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={45} color="info" />
                </Box>
                
                <Box mb={3}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Memory Usage</Typography>
                    <Typography variant="body2">67%</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={67} color="warning" />
                </Box>
                
                <Box mb={3}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Disk Usage</Typography>
                    <Typography variant="body2">34%</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={34} color="success" />
                </Box>
                
                <Box mb={3}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Network I/O</Typography>
                    <Typography variant="body2">23%</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={23} color="primary" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {tabValue === 3 && (
        <Grid container spacing={3}>
          {/* Health Monitoring */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Application Health
                </Typography>
                
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <MonitorHeart color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary="API Health"
                      secondary="All endpoints responding"
                    />
                    <ListItemSecondaryAction>
                      <Typography variant="body2" color="success.main">
                        99.9%
                      </Typography>
                    </ListItemSecondaryAction>
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <Speed color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Response Time"
                      secondary="Average API response time"
                    />
                    <ListItemSecondaryAction>
                      <Typography variant="body2">
                        142ms
                      </Typography>
                    </ListItemSecondaryAction>
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <NetworkCheck color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Network Latency"
                      secondary="Connection latency"
                    />
                    <ListItemSecondaryAction>
                      <Typography variant="body2">
                        28ms
                      </Typography>
                    </ListItemSecondaryAction>
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <Error color="warning" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Error Rate"
                      secondary="Application error rate"
                    />
                    <ListItemSecondaryAction>
                      <Typography variant="body2" color="warning.main">
                        0.1%
                      </Typography>
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Alerts & Notifications */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Alerts
                </Typography>
                
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Warning color="warning" />
                    </ListItemIcon>
                    <ListItemText
                      primary="High Memory Usage"
                      secondary="Production server memory at 85%"
                    />
                    <ListItemSecondaryAction>
                      <Typography variant="caption" color="textSecondary">
                        2h ago
                      </Typography>
                    </ListItemSecondaryAction>
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Deployment Successful"
                      secondary="v1.2.3 deployed to staging"
                    />
                    <ListItemSecondaryAction>
                      <Typography variant="caption" color="textSecondary">
                        4h ago
                      </Typography>
                    </ListItemSecondaryAction>
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <Error color="error" />
                    </ListItemIcon>
                    <ListItemText
                      primary="API Timeout"
                      secondary="Increased response times detected"
                    />
                    <ListItemSecondaryAction>
                      <Typography variant="caption" color="textSecondary">
                        6h ago
                      </Typography>
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Deploy Dialog */}
      <Dialog
        open={deployDialogOpen}
        onClose={() => setDeployDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>New Deployment</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Environment</InputLabel>
                <Select
                  value={newDeployment.environment}
                  onChange={(e) => setNewDeployment(prev => ({
                    ...prev,
                    environment: e.target.value
                  }))}
                  label="Environment"
                >
                  {Object.entries(environments).map(([key, env]) => (
                    <MenuItem key={key} value={key}>
                      <Box display="flex" alignItems="center" gap={1}>
                        {env.icon}
                        {env.name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Branch"
                value={newDeployment.branch}
                onChange={(e) => setNewDeployment(prev => ({
                  ...prev,
                  branch: e.target.value
                }))}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Version Tag (optional)"
                value={newDeployment.version}
                onChange={(e) => setNewDeployment(prev => ({
                  ...prev,
                  version: e.target.value
                }))}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={newDeployment.description}
                onChange={(e) => setNewDeployment(prev => ({
                  ...prev,
                  description: e.target.value
                }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeployDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleDeploy}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} /> : <Deploy />}
          >
            Deploy
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default {
  DeploymentDashboard,
};
