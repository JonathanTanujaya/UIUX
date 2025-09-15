import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Avatar,
  LinearProgress,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Tabs,
  Tab,
  Badge,
  Tooltip,
  Stack,
  Divider,
} from '@mui/material';
import {
  Assignment,
  Person,
  Schedule,
  Flag,
  MoreVert,
  Add,
  Edit,
  Delete,
  FilterList,
  Sort,
  Search,
  Notifications,
  TrendingUp,
  CheckCircle,
  Cancel,
  Pending,
} from '@mui/icons-material';

const TaskManager = ({
  tasks = [],
  projects = [],
  users = [],
  currentUser,
  onTaskCreate,
  onTaskUpdate,
  onTaskDelete,
  onTaskAssign,
  onTaskComplete,
  onFilterChange,
}) => {
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskDialog, setTaskDialog] = useState({ open: false, task: null, mode: 'create' });
  const [filterMenu, setFilterMenu] = useState(null);
  const [sortMenu, setSortMenu] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    assignee: 'all',
    project: 'all',
    dueDate: 'all',
  });
  const [sortBy, setSortBy] = useState('dueDate');
  const [searchTerm, setSearchTerm] = useState('');

  // Task form state
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'todo',
    assignedTo: '',
    projectId: '',
    dueDate: '',
    estimatedHours: '',
    tags: [],
  });

  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(task =>
        task.title.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower) ||
        task.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value === 'all') return;
      
      switch (key) {
        case 'status':
          result = result.filter(task => task.status === value);
          break;
        case 'priority':
          result = result.filter(task => task.priority === value);
          break;
        case 'assignee':
          result = result.filter(task => task.assignedTo === value);
          break;
        case 'project':
          result = result.filter(task => task.projectId === value);
          break;
        case 'dueDate':
          const now = new Date();
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          const nextWeek = new Date(today);
          nextWeek.setDate(nextWeek.getDate() + 7);
          
          result = result.filter(task => {
            if (!task.dueDate) return value === 'no_due_date';
            const dueDate = new Date(task.dueDate);
            
            switch (value) {
              case 'overdue':
                return dueDate < today;
              case 'today':
                return dueDate >= today && dueDate < tomorrow;
              case 'this_week':
                return dueDate >= today && dueDate < nextWeek;
              case 'no_due_date':
                return !task.dueDate;
              default:
                return true;
            }
          });
          break;
      }
    });

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        case 'status':
          return a.status.localeCompare(b.status);
        case 'created':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

    return result;
  }, [tasks, filters, sortBy, searchTerm]);

  // Group tasks by status for kanban view
  const tasksByStatus = useMemo(() => {
    const groups = {
      todo: { title: 'To Do', tasks: [], color: 'info' },
      in_progress: { title: 'In Progress', tasks: [], color: 'warning' },
      review: { title: 'Review', tasks: [], color: 'secondary' },
      done: { title: 'Done', tasks: [], color: 'success' },
    };

    filteredTasks.forEach(task => {
      if (groups[task.status]) {
        groups[task.status].tasks.push(task);
      }
    });

    return groups;
  }, [filteredTasks]);

  // Task statistics
  const taskStats = useMemo(() => {
    const stats = {
      total: tasks.length,
      completed: tasks.filter(t => t.status === 'done').length,
      overdue: tasks.filter(t => {
        if (!t.dueDate) return false;
        return new Date(t.dueDate) < new Date();
      }).length,
      myTasks: tasks.filter(t => t.assignedTo === currentUser?.id).length,
    };
    
    stats.completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
    
    return stats;
  }, [tasks, currentUser]);

  // Handle task form submission
  const handleTaskSubmit = useCallback(async () => {
    try {
      if (taskDialog.mode === 'create') {
        await onTaskCreate?.({
          ...taskForm,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          createdBy: currentUser?.id,
        });
      } else {
        await onTaskUpdate?.(taskDialog.task.id, taskForm);
      }
      
      setTaskDialog({ open: false, task: null, mode: 'create' });
      setTaskForm({
        title: '',
        description: '',
        priority: 'medium',
        status: 'todo',
        assignedTo: '',
        projectId: '',
        dueDate: '',
        estimatedHours: '',
        tags: [],
      });
    } catch (error) {
      console.error('Failed to save task:', error);
    }
  }, [taskForm, taskDialog, onTaskCreate, onTaskUpdate, currentUser]);

  // Handle filter change
  const handleFilterChange = useCallback((key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  }, [filters, onFilterChange]);

  // Get priority color
  const getPriorityColor = useCallback((priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  }, []);

  // Get status icon
  const getStatusIcon = useCallback((status) => {
    switch (status) {
      case 'done': return <CheckCircle color="success" />;
      case 'in_progress': return <Pending color="warning" />;
      case 'review': return <Assignment color="secondary" />;
      default: return <Cancel color="disabled" />;
    }
  }, []);

  // Render task card
  const renderTaskCard = useCallback((task) => {
    const project = projects.find(p => p.id === task.projectId);
    const assignee = users.find(u => u.id === task.assignedTo);
    
    return (
      <Card 
        key={task.id} 
        variant="outlined" 
        sx={{ 
          mb: 2, 
          '&:hover': { boxShadow: 2 },
          borderLeft: theme => `4px solid ${theme.palette[getPriorityColor(task.priority)].main}`,
        }}
      >
        <CardContent sx={{ pb: 1 }}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              {task.title}
            </Typography>
            <IconButton
              size="small"
              onClick={(e) => {
                setSelectedTask(task);
                setFilterMenu(e.currentTarget);
              }}
            >
              <MoreVert />
            </IconButton>
          </Box>
          
          {task.description && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {task.description.length > 100 
                ? `${task.description.substring(0, 100)}...` 
                : task.description}
            </Typography>
          )}
          
          <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
            <Chip
              label={task.status.replace('_', ' ')}
              size="small"
              color="primary"
              icon={getStatusIcon(task.status)}
            />
            <Chip
              label={task.priority}
              size="small"
              color={getPriorityColor(task.priority)}
            />
            {project && (
              <Chip label={project.name} size="small" variant="outlined" />
            )}
          </Box>
          
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={1}>
              {assignee && (
                <Tooltip title={`Assigned to ${assignee.name}`}>
                  <Avatar sx={{ width: 24, height: 24 }}>
                    {assignee.name.charAt(0)}
                  </Avatar>
                </Tooltip>
              )}
              {task.dueDate && (
                <Chip
                  label={new Date(task.dueDate).toLocaleDateString()}
                  size="small"
                  icon={<Schedule />}
                  color={new Date(task.dueDate) < new Date() ? 'error' : 'default'}
                />
              )}
            </Box>
            
            {task.estimatedHours && (
              <Typography variant="caption" color="text.secondary">
                ~{task.estimatedHours}h
              </Typography>
            )}
          </Box>
          
          {task.tags && task.tags.length > 0 && (
            <Box mt={1} display="flex" gap={0.5} flexWrap="wrap">
              {task.tags.map((tag, index) => (
                <Chip key={index} label={tag} size="small" variant="outlined" />
              ))}
            </Box>
          )}
        </CardContent>
        
        <CardActions size="small">
          <Button
            size="small"
            onClick={() => {
              setTaskForm({ ...task });
              setTaskDialog({ open: true, task, mode: 'edit' });
            }}
          >
            Edit
          </Button>
          {task.status !== 'done' && (
            <Button
              size="small"
              color="success"
              onClick={() => onTaskComplete?.(task.id)}
            >
              Complete
            </Button>
          )}
        </CardActions>
      </Card>
    );
  }, [projects, users, getPriorityColor, getStatusIcon, onTaskComplete]);

  const tabLabels = ['List View', 'Kanban Board', 'My Tasks', 'Analytics'];

  return (
    <Box>
      {/* Header */}
      <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5">Task Manager</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setTaskDialog({ open: true, task: null, mode: 'create' })}
          >
            New Task
          </Button>
        </Box>
        
        {/* Stats */}
        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {taskStats.total}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Tasks
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="success.main">
                  {taskStats.completed}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Completed
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="error.main">
                  {taskStats.overdue}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Overdue
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4">
                  {taskStats.completionRate}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Completion Rate
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={taskStats.completionRate} 
                  sx={{ mt: 1 }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        {/* Filters and Search */}
        <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
          <TextField
            size="small"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            sx={{ minWidth: 200 }}
          />
          
          <Button
            startIcon={<FilterList />}
            onClick={(e) => setFilterMenu(e.currentTarget)}
            variant="outlined"
            size="small"
          >
            Filters
          </Button>
          
          <Button
            startIcon={<Sort />}
            onClick={(e) => setSortMenu(e.currentTarget)}
            variant="outlined"
            size="small"
          >
            Sort: {sortBy}
          </Button>
        </Box>
      </Paper>

      {/* Tabs */}
      <Paper elevation={1}>
        <Tabs value={currentTab} onChange={(e, v) => setCurrentTab(v)}>
          {tabLabels.map((label, index) => (
            <Tab key={index} label={label} />
          ))}
        </Tabs>
        
        <Box p={2}>
          {/* List View */}
          {currentTab === 0 && (
            <Grid container spacing={2}>
              {filteredTasks.map(task => (
                <Grid item xs={12} sm={6} md={4} key={task.id}>
                  {renderTaskCard(task)}
                </Grid>
              ))}
            </Grid>
          )}
          
          {/* Kanban Board */}
          {currentTab === 1 && (
            <Grid container spacing={2}>
              {Object.entries(tasksByStatus).map(([status, group]) => (
                <Grid item xs={12} sm={6} md={3} key={status}>
                  <Paper elevation={2} sx={{ p: 2, height: '70vh', overflow: 'auto' }}>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <Typography variant="h6">
                        {group.title}
                      </Typography>
                      <Badge badgeContent={group.tasks.length} color={group.color} />
                    </Box>
                    {group.tasks.map(renderTaskCard)}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
          
          {/* My Tasks */}
          {currentTab === 2 && (
            <Grid container spacing={2}>
              {filteredTasks
                .filter(task => task.assignedTo === currentUser?.id)
                .map(task => (
                  <Grid item xs={12} sm={6} md={4} key={task.id}>
                    {renderTaskCard(task)}
                  </Grid>
                ))}
            </Grid>
          )}
          
          {/* Analytics */}
          {currentTab === 3 && (
            <Typography variant="h6" color="text.secondary" textAlign="center">
              Analytics view coming soon...
            </Typography>
          )}
        </Box>
      </Paper>

      {/* Task Dialog */}
      <Dialog
        open={taskDialog.open}
        onClose={() => setTaskDialog({ open: false, task: null, mode: 'create' })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {taskDialog.mode === 'create' ? 'Create New Task' : 'Edit Task'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={taskForm.title}
                onChange={(e) => setTaskForm(prev => ({ ...prev, title: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={taskForm.description}
                onChange={(e) => setTaskForm(prev => ({ ...prev, description: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={taskForm.priority}
                  onChange={(e) => setTaskForm(prev => ({ ...prev, priority: e.target.value }))}
                  label="Priority"
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={taskForm.status}
                  onChange={(e) => setTaskForm(prev => ({ ...prev, status: e.target.value }))}
                  label="Status"
                >
                  <MenuItem value="todo">To Do</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="review">Review</MenuItem>
                  <MenuItem value="done">Done</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Assignee</InputLabel>
                <Select
                  value={taskForm.assignedTo}
                  onChange={(e) => setTaskForm(prev => ({ ...prev, assignedTo: e.target.value }))}
                  label="Assignee"
                >
                  {users.map(user => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Project</InputLabel>
                <Select
                  value={taskForm.projectId}
                  onChange={(e) => setTaskForm(prev => ({ ...prev, projectId: e.target.value }))}
                  label="Project"
                >
                  {projects.map(project => (
                    <MenuItem key={project.id} value={project.id}>
                      {project.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Due Date"
                value={taskForm.dueDate}
                onChange={(e) => setTaskForm(prev => ({ ...prev, dueDate: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Estimated Hours"
                value={taskForm.estimatedHours}
                onChange={(e) => setTaskForm(prev => ({ ...prev, estimatedHours: e.target.value }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTaskDialog({ open: false, task: null, mode: 'create' })}>
            Cancel
          </Button>
          <Button onClick={handleTaskSubmit} variant="contained">
            {taskDialog.mode === 'create' ? 'Create' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Filter Menu */}
      <Menu
        anchorEl={filterMenu}
        open={Boolean(filterMenu)}
        onClose={() => setFilterMenu(null)}
      >
        <MenuItem onClick={() => setFilterMenu(null)}>
          <Typography variant="subtitle2">Filter by Status</Typography>
        </MenuItem>
        {['all', 'todo', 'in_progress', 'review', 'done'].map(status => (
          <MenuItem
            key={status}
            onClick={() => {
              handleFilterChange('status', status);
              setFilterMenu(null);
            }}
            selected={filters.status === status}
          >
            {status === 'all' ? 'All Status' : status.replace('_', ' ')}
          </MenuItem>
        ))}
      </Menu>

      {/* Sort Menu */}
      <Menu
        anchorEl={sortMenu}
        open={Boolean(sortMenu)}
        onClose={() => setSortMenu(null)}
      >
        {['title', 'priority', 'dueDate', 'status', 'created'].map(sort => (
          <MenuItem
            key={sort}
            onClick={() => {
              setSortBy(sort);
              setSortMenu(null);
            }}
            selected={sortBy === sort}
          >
            Sort by {sort.replace(/([A-Z])/g, ' $1').toLowerCase()}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default TaskManager;
