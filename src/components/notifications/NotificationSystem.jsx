import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  Chip,
  Button,
  Divider,
  Tooltip,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  FormGroup,
  Card,
  CardContent,
} from '@mui/material';
import {
  Notifications,
  NotificationsActive,
  NotificationsOff,
  MarkAsUnread,
  Delete,
  Settings,
  Circle,
  Info,
  Warning,
  Error,
  CheckCircle,
  Message,
  Assignment,
  Person,
  Business,
  TrendingUp,
  Clear,
  Refresh,
} from '@mui/icons-material';

const NotificationSystem = ({
  notifications = [],
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onDeleteAll,
  onNotificationClick,
  maxDisplayCount = 5,
  enableSound = true,
  enablePush = true,
  position = 'top-right', // top-right, top-left, bottom-right, bottom-left
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [toast, setToast] = useState({ open: false, notification: null });
  const [settings, setSettings] = useState({
    sound: enableSound,
    push: enablePush,
    email: true,
    types: {
      info: true,
      warning: true,
      error: true,
      success: true,
      message: true,
      task: true,
      system: true,
    },
  });
  const audioRef = useRef(null);
  const previousNotificationCount = useRef(notifications.length);

  // Unread notifications
  const unreadNotifications = notifications.filter(n => !n.read);
  const unreadCount = unreadNotifications.length;

  // Show toast for new notifications
  useEffect(() => {
    const newNotifications = notifications.slice(0, notifications.length - previousNotificationCount.current);
    
    if (newNotifications.length > 0) {
      const latestNotification = newNotifications[0];
      
      // Show toast
      if (settings.types[latestNotification.type]) {
        setToast({ open: true, notification: latestNotification });
        
        // Play sound
        if (settings.sound && audioRef.current) {
          audioRef.current.play().catch(() => {
            // Ignore audio play errors (user interaction required)
          });
        }
        
        // Show browser notification
        if (settings.push && 'Notification' in window && Notification.permission === 'granted') {
          new Notification(latestNotification.title, {
            body: latestNotification.message,
            icon: '/favicon.ico',
            tag: latestNotification.id,
          });
        }
      }
    }
    
    previousNotificationCount.current = notifications.length;
  }, [notifications, settings]);

  // Request notification permission
  useEffect(() => {
    if (settings.push && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [settings.push]);

  // Get notification icon based on type
  const getNotificationIcon = useCallback((type) => {
    switch (type) {
      case 'info': return <Info color="info" />;
      case 'warning': return <Warning color="warning" />;
      case 'error': return <Error color="error" />;
      case 'success': return <CheckCircle color="success" />;
      case 'message': return <Message color="primary" />;
      case 'task': return <Assignment color="secondary" />;
      case 'user': return <Person color="primary" />;
      case 'business': return <Business color="primary" />;
      case 'analytics': return <TrendingUp color="primary" />;
      default: return <Circle color="disabled" />;
    }
  }, []);

  // Get notification color
  const getNotificationColor = useCallback((type) => {
    switch (type) {
      case 'info': return 'info';
      case 'warning': return 'warning';
      case 'error': return 'error';
      case 'success': return 'success';
      default: return 'primary';
    }
  }, []);

  // Format time ago
  const formatTimeAgo = useCallback((timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now - notificationTime) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return notificationTime.toLocaleDateString();
  }, []);

  // Handle notification click
  const handleNotificationClick = useCallback((notification) => {
    if (!notification.read) {
      onMarkAsRead?.(notification.id);
    }
    onNotificationClick?.(notification);
    setAnchorEl(null);
  }, [onMarkAsRead, onNotificationClick]);

  // Handle settings change
  const handleSettingsChange = useCallback((key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  // Handle type settings change
  const handleTypeSettingsChange = useCallback((type, enabled) => {
    setSettings(prev => ({
      ...prev,
      types: {
        ...prev.types,
        [type]: enabled,
      },
    }));
  }, []);

  // Render notification list
  const renderNotificationList = () => {
    const displayNotifications = notifications.slice(0, maxDisplayCount);
    
    if (displayNotifications.length === 0) {
      return (
        <Box p={2} textAlign="center">
          <Typography variant="body2" color="text.secondary">
            No notifications
          </Typography>
        </Box>
      );
    }
    
    return (
      <List sx={{ py: 0, maxHeight: 400, overflow: 'auto' }}>
        {displayNotifications.map((notification, index) => (
          <React.Fragment key={notification.id}>
            <ListItem
              button
              onClick={() => handleNotificationClick(notification)}
              sx={{
                bgcolor: notification.read ? 'transparent' : 'action.hover',
                '&:hover': { bgcolor: 'action.selected' },
              }}
            >
              <ListItemAvatar>
                <Avatar
                  sx={{
                    bgcolor: notification.read ? 'grey.300' : `${getNotificationColor(notification.type)}.main`,
                    width: 32,
                    height: 32,
                  }}
                >
                  {getNotificationIcon(notification.type)}
                </Avatar>
              </ListItemAvatar>
              
              <ListItemText
                primary={
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: notification.read ? 'normal' : 'bold',
                        flexGrow: 1,
                      }}
                    >
                      {notification.title}
                    </Typography>
                    {!notification.read && (
                      <Circle sx={{ fontSize: 8, color: 'primary.main' }} />
                    )}
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {notification.message}
                    </Typography>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={0.5}>
                      <Typography variant="caption" color="text.secondary">
                        {formatTimeAgo(notification.timestamp)}
                      </Typography>
                      <Chip
                        label={notification.type}
                        size="small"
                        color={getNotificationColor(notification.type)}
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                }
              />
              
              <ListItemSecondaryAction>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.(notification.id);
                  }}
                >
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            {index < displayNotifications.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    );
  };

  return (
    <>
      {/* Notification Bell */}
      <Tooltip title="Notifications">
        <IconButton
          onClick={(e) => setAnchorEl(e.currentTarget)}
          color="inherit"
        >
          <Badge badgeContent={unreadCount} color="error" max={99}>
            {unreadCount > 0 ? <NotificationsActive /> : <Notifications />}
          </Badge>
        </IconButton>
      </Tooltip>

      {/* Notification Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          sx: { width: 400, maxHeight: 600 }
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {/* Header */}
        <Box p={2} borderBottom={1} borderColor="divider">
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              Notifications
              {unreadCount > 0 && (
                <Chip
                  label={unreadCount}
                  size="small"
                  color="primary"
                  sx={{ ml: 1 }}
                />
              )}
            </Typography>
            <Box>
              <Tooltip title="Settings">
                <IconButton size="small" onClick={() => setSettingsOpen(true)}>
                  <Settings />
                </IconButton>
              </Tooltip>
              <Tooltip title="Refresh">
                <IconButton size="small" onClick={() => window.location.reload()}>
                  <Refresh />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          
          {unreadCount > 0 && (
            <Box mt={1} display="flex" gap={1}>
              <Button
                size="small"
                startIcon={<MarkAsUnread />}
                onClick={() => {
                  onMarkAllAsRead?.();
                  setAnchorEl(null);
                }}
              >
                Mark all read
              </Button>
              <Button
                size="small"
                startIcon={<Clear />}
                onClick={() => {
                  onDeleteAll?.();
                  setAnchorEl(null);
                }}
                color="error"
              >
                Clear all
              </Button>
            </Box>
          )}
        </Box>

        {/* Notification List */}
        {renderNotificationList()}

        {/* Footer */}
        {notifications.length > maxDisplayCount && (
          <Box p={1} borderTop={1} borderColor="divider" textAlign="center">
            <Button size="small" fullWidth>
              View all {notifications.length} notifications
            </Button>
          </Box>
        )}
      </Menu>

      {/* Settings Dialog */}
      <Dialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Notification Settings</DialogTitle>
        <DialogContent>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.sound}
                  onChange={(e) => handleSettingsChange('sound', e.target.checked)}
                />
              }
              label="Sound notifications"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.push}
                  onChange={(e) => handleSettingsChange('push', e.target.checked)}
                />
              }
              label="Browser push notifications"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.email}
                  onChange={(e) => handleSettingsChange('email', e.target.checked)}
                />
              }
              label="Email notifications"
            />
          </FormGroup>
          
          <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
            Notification Types
          </Typography>
          
          <FormGroup>
            {Object.entries(settings.types).map(([type, enabled]) => (
              <FormControlLabel
                key={type}
                control={
                  <Switch
                    checked={enabled}
                    onChange={(e) => handleTypeSettingsChange(type, e.target.checked)}
                    size="small"
                  />
                }
                label={
                  <Box display="flex" alignItems="center" gap={1}>
                    {getNotificationIcon(type)}
                    <Typography variant="body2">
                      {type.charAt(0).toUpperCase() + type.slice(1)} notifications
                    </Typography>
                  </Box>
                }
              />
            ))}
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Toast Notification */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast({ open: false, notification: null })}
        anchorOrigin={{
          vertical: position.includes('top') ? 'top' : 'bottom',
          horizontal: position.includes('right') ? 'right' : 'left',
        }}
      >
        {toast.notification && (
          <Alert
            onClose={() => setToast({ open: false, notification: null })}
            severity={getNotificationColor(toast.notification.type)}
            variant="filled"
            icon={getNotificationIcon(toast.notification.type)}
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => {
                  handleNotificationClick(toast.notification);
                  setToast({ open: false, notification: null });
                }}
              >
                View
              </Button>
            }
          >
            <Typography variant="subtitle2">
              {toast.notification.title}
            </Typography>
            <Typography variant="body2">
              {toast.notification.message}
            </Typography>
          </Alert>
        )}
      </Snackbar>

      {/* Audio element for notification sounds */}
      <audio ref={audioRef} preload="auto">
        <source src="/notification-sound.mp3" type="audio/mpeg" />
        <source src="/notification-sound.wav" type="audio/wav" />
      </audio>
    </>
  );
};

export default NotificationSystem;
