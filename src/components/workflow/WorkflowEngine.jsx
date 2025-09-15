import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
  Collapse,
  Alert,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  Stop,
  Check,
  Close,
  Schedule,
  Person,
  Assignment,
  Comment,
  Edit,
  ExpandMore,
  ExpandLess,
  Refresh,
  Warning,
} from '@mui/icons-material';

const WorkflowEngine = ({
  workflow,
  onStepComplete,
  onStepReject,
  onCommentAdd,
  onWorkflowComplete,
  currentUser,
  readOnly = false,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [commentDialog, setCommentDialog] = useState({ open: false, stepId: null });
  const [editDialog, setEditDialog] = useState({ open: false, step: null });
  const [newComment, setNewComment] = useState('');
  const [expandedSteps, setExpandedSteps] = useState(new Set([0]));

  // Step status mapping
  const getStepStatus = useCallback((step, index) => {
    if (step.status === 'completed') return 'completed';
    if (step.status === 'rejected') return 'error';
    if (step.status === 'in_progress') return 'processing';
    if (index === activeStep) return 'active';
    if (index < activeStep) return 'completed';
    return 'pending';
  }, [activeStep]);

  // Check if user can perform action on step
  const canUserAct = useCallback((step) => {
    if (readOnly) return false;
    if (!step.assignedTo) return true;
    return step.assignedTo.includes(currentUser?.id);
  }, [currentUser, readOnly]);

  // Handle step completion
  const handleStepComplete = useCallback(async (step, index) => {
    try {
      await onStepComplete?.(step, index);
      if (index === workflow.steps.length - 1) {
        onWorkflowComplete?.(workflow);
      } else {
        setActiveStep(index + 1);
      }
    } catch (error) {
      console.error('Failed to complete step:', error);
    }
  }, [workflow, onStepComplete, onWorkflowComplete]);

  // Handle step rejection
  const handleStepReject = useCallback(async (step, index, reason) => {
    try {
      await onStepReject?.(step, index, reason);
    } catch (error) {
      console.error('Failed to reject step:', error);
    }
  }, [onStepReject]);

  // Handle comment addition
  const handleAddComment = useCallback(async () => {
    if (!newComment.trim()) return;
    
    try {
      await onCommentAdd?.(commentDialog.stepId, {
        text: newComment,
        author: currentUser,
        timestamp: new Date().toISOString(),
      });
      setNewComment('');
      setCommentDialog({ open: false, stepId: null });
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  }, [newComment, commentDialog.stepId, currentUser, onCommentAdd]);

  // Toggle step expansion
  const toggleStepExpansion = useCallback((index) => {
    setExpandedSteps(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(index)) {
        newExpanded.delete(index);
      } else {
        newExpanded.add(index);
      }
      return newExpanded;
    });
  }, []);

  // Calculate workflow progress
  const workflowProgress = useMemo(() => {
    const completedSteps = workflow.steps.filter(step => step.status === 'completed').length;
    return Math.round((completedSteps / workflow.steps.length) * 100);
  }, [workflow.steps]);

  // Render step actions
  const renderStepActions = useCallback((step, index) => {
    if (!canUserAct(step)) return null;

    const status = getStepStatus(step, index);
    
    if (status === 'completed' || status === 'error') {
      return (
        <Box display="flex" gap={1} alignItems="center">
          <Chip
            label={status === 'completed' ? 'Completed' : 'Rejected'}
            color={status === 'completed' ? 'success' : 'error'}
            size="small"
            icon={status === 'completed' ? <Check /> : <Close />}
          />
          <IconButton
            size="small"
            onClick={() => setCommentDialog({ open: true, stepId: step.id })}
          >
            <Comment />
          </IconButton>
        </Box>
      );
    }

    if (status === 'active' || status === 'processing') {
      return (
        <Box display="flex" gap={1}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<Check />}
            onClick={() => handleStepComplete(step, index)}
          >
            Complete
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            startIcon={<Close />}
            onClick={() => setCommentDialog({ open: true, stepId: step.id })}
          >
            Reject
          </Button>
          <IconButton
            size="small"
            onClick={() => setCommentDialog({ open: true, stepId: step.id })}
          >
            <Comment />
          </IconButton>
        </Box>
      );
    }

    return null;
  }, [canUserAct, getStepStatus, handleStepComplete]);

  // Render step timeline
  const renderStepTimeline = useCallback((step) => {
    if (!step.history || step.history.length === 0) return null;

    return (
      <Timeline position="left" sx={{ mt: 2 }}>
        {step.history.map((event, index) => (
          <TimelineItem key={index}>
            <TimelineOppositeContent color="text.secondary" variant="caption">
              {new Date(event.timestamp).toLocaleString()}
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot
                color={
                  event.action === 'completed' ? 'success' :
                  event.action === 'rejected' ? 'error' : 'primary'
                }
              >
                {event.action === 'completed' ? <Check /> :
                 event.action === 'rejected' ? <Close /> : <Schedule />}
              </TimelineDot>
              {index < step.history.length - 1 && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent>
              <Typography variant="body2">
                {event.description}
              </Typography>
              {event.comment && (
                <Typography variant="caption" color="text.secondary">
                  "{event.comment}"
                </Typography>
              )}
              <Typography variant="caption" display="block">
                by {event.author?.name || 'System'}
              </Typography>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    );
  }, []);

  return (
    <Paper elevation={1} sx={{ p: 3 }}>
      {/* Workflow Header */}
      <Box mb={3}>
        <Typography variant="h5" gutterBottom>
          {workflow.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {workflow.description}
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <Chip
            label={`${workflowProgress}% Complete`}
            color={workflowProgress === 100 ? 'success' : 'primary'}
            variant="outlined"
          />
          <Chip
            label={workflow.priority}
            color={
              workflow.priority === 'high' ? 'error' :
              workflow.priority === 'medium' ? 'warning' : 'default'
            }
            size="small"
          />
          {workflow.dueDate && (
            <Chip
              label={`Due: ${new Date(workflow.dueDate).toLocaleDateString()}`}
              icon={<Schedule />}
              size="small"
              variant="outlined"
            />
          )}
        </Box>
      </Box>

      {/* Workflow Steps */}
      <Stepper activeStep={activeStep} orientation="vertical" nonLinear>
        {workflow.steps.map((step, index) => {
          const isExpanded = expandedSteps.has(index);
          const status = getStepStatus(step, index);
          
          return (
            <Step key={step.id} completed={status === 'completed'}>
              <StepLabel
                error={status === 'error'}
                optional={
                  <Box display="flex" alignItems="center" gap={1}>
                    {step.assignedTo && (
                      <Chip
                        label={`Assigned to: ${step.assignedTo.map(id => 
                          workflow.users?.find(u => u.id === id)?.name || id
                        ).join(', ')}`}
                        size="small"
                        icon={<Person />}
                      />
                    )}
                    {step.estimatedDuration && (
                      <Chip
                        label={`~${step.estimatedDuration}`}
                        size="small"
                        icon={<Schedule />}
                      />
                    )}
                    <IconButton
                      size="small"
                      onClick={() => toggleStepExpansion(index)}
                    >
                      {isExpanded ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                  </Box>
                }
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="h6">{step.name}</Typography>
                  {status === 'error' && <Warning color="error" />}
                </Box>
              </StepLabel>
              
              <StepContent>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="body2" gutterBottom>
                      {step.description}
                    </Typography>
                    
                    {/* Step Requirements */}
                    {step.requirements && step.requirements.length > 0 && (
                      <Box mt={2}>
                        <Typography variant="subtitle2" gutterBottom>
                          Requirements:
                        </Typography>
                        <List dense>
                          {step.requirements.map((req, reqIndex) => (
                            <ListItem key={reqIndex} sx={{ py: 0 }}>
                              <ListItemText
                                primary={req.title}
                                secondary={req.description}
                              />
                              <ListItemSecondaryAction>
                                <Chip
                                  label={req.status || 'pending'}
                                  size="small"
                                  color={req.status === 'completed' ? 'success' : 'default'}
                                />
                              </ListItemSecondaryAction>
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}

                    {/* Step Comments */}
                    {step.comments && step.comments.length > 0 && isExpanded && (
                      <Box mt={2}>
                        <Typography variant="subtitle2" gutterBottom>
                          Comments:
                        </Typography>
                        <List dense>
                          {step.comments.map((comment, commentIndex) => (
                            <ListItem key={commentIndex}>
                              <ListItemAvatar>
                                <Avatar sx={{ width: 24, height: 24 }}>
                                  {comment.author?.name?.charAt(0) || '?'}
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={comment.text}
                                secondary={
                                  <Box component="span">
                                    {comment.author?.name} • {' '}
                                    {new Date(comment.timestamp).toLocaleString()}
                                  </Box>
                                }
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}

                    {/* Step Timeline */}
                    {isExpanded && renderStepTimeline(step)}
                  </CardContent>
                  
                  <CardActions>
                    {renderStepActions(step, index)}
                  </CardActions>
                </Card>
              </StepContent>
            </Step>
          );
        })}
      </Stepper>

      {/* Comment Dialog */}
      <Dialog
        open={commentDialog.open}
        onClose={() => setCommentDialog({ open: false, stepId: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Comment</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCommentDialog({ open: false, stepId: null })}>
            Cancel
          </Button>
          <Button onClick={handleAddComment} variant="contained">
            Add Comment
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default WorkflowEngine;
