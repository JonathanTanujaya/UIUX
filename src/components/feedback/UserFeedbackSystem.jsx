import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Rating,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
  Card,
  CardContent,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Paper,
  Divider,
  Tooltip,
  Snackbar,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  Feedback,
  Close,
  Send,
  Star,
  BugReport,
  Lightbulb,
  ThumbUp,
  ThumbDown,
  QuestionMark,
  Mood,
  MoodBad,
  SentimentSatisfied,
  TrendingUp,
  Assessment,
  CheckCircle,
} from '@mui/icons-material';

// Feedback categories with icons
const FEEDBACK_CATEGORIES = {
  bug: { label: 'Bug Report', icon: <BugReport />, color: 'error' },
  feature: { label: 'Feature Request', icon: <Lightbulb />, color: 'info' },
  improvement: { label: 'Improvement', icon: <TrendingUp />, color: 'warning' },
  question: { label: 'Question', icon: <QuestionMark />, color: 'secondary' },
  compliment: { label: 'Compliment', icon: <ThumbUp />, color: 'success' },
  complaint: { label: 'Complaint', icon: <ThumbDown />, color: 'error' },
};

// User feedback widget
export const UserFeedbackWidget = ({
  position = 'bottom-right',
  onSubmitFeedback,
  enableScreenshot = true,
  enableAnalytics = true,
}) => {
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState({
    category: '',
    rating: 0,
    title: '',
    description: '',
    email: '',
    priority: 'medium',
    page: window.location.pathname,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [screenshot, setScreenshot] = useState(null);

  // Capture screenshot
  const captureScreenshot = useCallback(async () => {
    if (!enableScreenshot || !window.html2canvas) return null;
    
    try {
      const canvas = await window.html2canvas(document.body, {
        height: window.innerHeight,
        width: window.innerWidth,
        useCORS: true,
      });
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.warn('Screenshot capture failed:', error);
      return null;
    }
  }, [enableScreenshot]);

  // Handle feedback submission
  const handleSubmit = useCallback(async () => {
    if (!feedback.category || !feedback.description.trim()) {
      return;
    }

    setSubmitting(true);
    
    try {
      // Capture screenshot if enabled
      const screenshotData = await captureScreenshot();
      
      const feedbackData = {
        ...feedback,
        screenshot: screenshotData,
        id: Date.now().toString(),
      };

      await onSubmitFeedback?.(feedbackData);
      
      setSubmitted(true);
      setTimeout(() => {
        setOpen(false);
        setSubmitted(false);
        setFeedback({
          category: '',
          rating: 0,
          title: '',
          description: '',
          email: '',
          priority: 'medium',
          page: window.location.pathname,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
        });
      }, 2000);
      
    } catch (error) {
      console.error('Feedback submission failed:', error);
    } finally {
      setSubmitting(false);
    }
  }, [feedback, onSubmitFeedback, captureScreenshot]);

  // Get mood icon based on rating
  const getMoodIcon = (rating) => {
    if (rating <= 2) return <MoodBad color="error" />;
    if (rating <= 3) return <SentimentSatisfied color="warning" />;
    return <Mood color="success" />;
  };

  // Position styles
  const positionStyles = {
    'bottom-right': { bottom: 16, right: 16 },
    'bottom-left': { bottom: 16, left: 16 },
    'top-right': { top: 16, right: 16 },
    'top-left': { top: 16, left: 16 },
  };

  if (submitted) {
    return (
      <Snackbar
        open={submitted}
        autoHideDuration={6000}
        onClose={() => setSubmitted(false)}
        anchorOrigin={{
          vertical: position.includes('top') ? 'top' : 'bottom',
          horizontal: position.includes('right') ? 'right' : 'left',
        }}
      >
        <Alert
          onClose={() => setSubmitted(false)}
          severity="success"
          variant="filled"
          icon={<CheckCircle />}
        >
          Thank you for your feedback! We'll review it soon.
        </Alert>
      </Snackbar>
    );
  }

  return (
    <>
      {/* Feedback FAB */}
      <Fab
        color="primary"
        onClick={() => setOpen(true)}
        sx={{
          position: 'fixed',
          ...positionStyles[position],
          zIndex: 1000,
        }}
      >
        <Feedback />
      </Fab>

      {/* Feedback Dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Share Your Feedback</Typography>
            <IconButton onClick={() => setOpen(false)} size="small">
              <Close />
            </IconButton>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Help us improve your experience
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={3}>
            {/* Category Selection */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                What's this about? *
              </Typography>
              <Grid container spacing={1}>
                {Object.entries(FEEDBACK_CATEGORIES).map(([key, category]) => (
                  <Grid item xs={6} sm={4} key={key}>
                    <Card
                      variant={feedback.category === key ? 'elevation' : 'outlined'}
                      sx={{
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        borderColor: feedback.category === key ? `${category.color}.main` : 'divider',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: 2,
                        },
                      }}
                      onClick={() => setFeedback(prev => ({ ...prev, category: key }))}
                    >
                      <CardContent sx={{ textAlign: 'center', py: 1.5 }}>
                        <Box color={`${category.color}.main`} mb={1}>
                          {category.icon}
                        </Box>
                        <Typography variant="caption" display="block">
                          {category.label}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/* Rating */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                How would you rate your experience?
              </Typography>
              <Box display="flex" alignItems="center" gap={2}>
                <Rating
                  value={feedback.rating}
                  onChange={(e, value) => setFeedback(prev => ({ ...prev, rating: value }))}
                  size="large"
                  emptyIcon={<Star style={{ opacity: 0.3 }} fontSize="inherit" />}
                />
                {feedback.rating > 0 && getMoodIcon(feedback.rating)}
              </Box>
            </Grid>

            {/* Title */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title (optional)"
                placeholder="Brief summary of your feedback"
                value={feedback.title}
                onChange={(e) => setFeedback(prev => ({ ...prev, title: e.target.value }))}
                size="small"
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                multiline
                rows={4}
                label="Description"
                placeholder="Please provide details about your feedback..."
                value={feedback.description}
                onChange={(e) => setFeedback(prev => ({ ...prev, description: e.target.value }))}
                helperText={`${feedback.description.length}/500 characters`}
                inputProps={{ maxLength: 500 }}
              />
            </Grid>

            {/* Priority and Email */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Priority</InputLabel>
                <Select
                  value={feedback.priority}
                  onChange={(e) => setFeedback(prev => ({ ...prev, priority: e.target.value }))}
                  label="Priority"
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="urgent">Urgent</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Email (optional)"
                type="email"
                placeholder="For follow-up"
                value={feedback.email}
                onChange={(e) => setFeedback(prev => ({ ...prev, email: e.target.value }))}
              />
            </Grid>

            {/* Technical Info */}
            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                  Technical Information (automatically included):
                </Typography>
                <Box display="flex" gap={1} flexWrap="wrap">
                  <Chip label={`Page: ${feedback.page}`} size="small" variant="outlined" />
                  <Chip label={`Browser: ${navigator.userAgent.split(' ')[0]}`} size="small" variant="outlined" />
                  {enableScreenshot && (
                    <Chip label="Screenshot: Included" size="small" variant="outlined" />
                  )}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setOpen(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!feedback.category || !feedback.description.trim() || submitting}
            startIcon={submitting ? null : <Send />}
          >
            {submitting ? <LinearProgress sx={{ width: 60 }} /> : 'Send Feedback'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// Feedback analytics dashboard (for admin)
export const FeedbackAnalytics = ({ feedbackData = [] }) => {
  const [timeRange, setTimeRange] = useState('7days');

  // Calculate analytics
  const analytics = React.useMemo(() => {
    const now = new Date();
    const timeRanges = {
      '7days': 7 * 24 * 60 * 60 * 1000,
      '30days': 30 * 24 * 60 * 60 * 1000,
      '90days': 90 * 24 * 60 * 60 * 1000,
    };
    
    const cutoff = now.getTime() - timeRanges[timeRange];
    const filteredData = feedbackData.filter(item => 
      new Date(item.timestamp).getTime() > cutoff
    );

    const categoryStats = {};
    const priorityStats = {};
    const ratingStats = { total: 0, sum: 0, average: 0 };
    
    filteredData.forEach(item => {
      // Category stats
      categoryStats[item.category] = (categoryStats[item.category] || 0) + 1;
      
      // Priority stats
      priorityStats[item.priority] = (priorityStats[item.priority] || 0) + 1;
      
      // Rating stats
      if (item.rating > 0) {
        ratingStats.total += 1;
        ratingStats.sum += item.rating;
      }
    });
    
    ratingStats.average = ratingStats.total > 0 ? 
      Math.round((ratingStats.sum / ratingStats.total) * 10) / 10 : 0;

    return {
      total: filteredData.length,
      categories: categoryStats,
      priorities: priorityStats,
      ratings: ratingStats,
      recent: filteredData.slice(0, 5),
    };
  }, [feedbackData, timeRange]);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Feedback Analytics</Typography>
        <FormControl size="small">
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <MenuItem value="7days">Last 7 days</MenuItem>
            <MenuItem value="30days">Last 30 days</MenuItem>
            <MenuItem value="90days">Last 90 days</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {analytics.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Feedback
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {analytics.ratings.average || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Average Rating
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">
                {analytics.priorities.high || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                High Priority
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="error.main">
                {analytics.priorities.urgent || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Urgent Issues
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Category Breakdown */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Feedback by Category
              </Typography>
              <List>
                {Object.entries(analytics.categories).map(([category, count]) => {
                  const categoryInfo = FEEDBACK_CATEGORIES[category];
                  return (
                    <ListItem key={category}>
                      <ListItemIcon>
                        <Box color={`${categoryInfo.color}.main`}>
                          {categoryInfo.icon}
                        </Box>
                      </ListItemIcon>
                      <ListItemText
                        primary={categoryInfo.label}
                        secondary={`${count} feedback`}
                      />
                      <ListItemSecondaryAction>
                        <Chip
                          label={Math.round((count / analytics.total) * 100) + '%'}
                          size="small"
                          color={categoryInfo.color}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  );
                })}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Feedback */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Feedback
              </Typography>
              <List>
                {analytics.recent.map((item, index) => {
                  const categoryInfo = FEEDBACK_CATEGORIES[item.category];
                  return (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <Box color={`${categoryInfo.color}.main`}>
                          {categoryInfo.icon}
                        </Box>
                      </ListItemIcon>
                      <ListItemText
                        primary={item.title || categoryInfo.label}
                        secondary={
                          <Box>
                            <Typography variant="body2">
                              {item.description.length > 60
                                ? `${item.description.substring(0, 60)}...`
                                : item.description}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(item.timestamp).toLocaleDateString()}
                              {item.rating > 0 && ` • ${item.rating}★`}
                            </Typography>
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Chip
                          label={item.priority}
                          size="small"
                          color={
                            item.priority === 'urgent' ? 'error' :
                            item.priority === 'high' ? 'warning' : 'default'
                          }
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  );
                })}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default {
  UserFeedbackWidget,
  FeedbackAnalytics,
};
