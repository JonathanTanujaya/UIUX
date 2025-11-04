import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  CircularProgress,
  Alert,
  Fab,
  useTheme,
  useMediaQuery,
  Slide,
} from '@mui/material';
import {
  CameraAlt,
  FlashOn,
  FlashOff,
  CameraRear,
  CameraFront,
  Close,
  QrCodeScanner,
} from '@mui/icons-material';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const MobileBarcodeScanner = ({
  open,
  onClose,
  onScanResult,
  title = 'Scan Barcode',
  description = 'Point your camera at a barcode or QR code',
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isScanning, setIsScanning] = useState(false);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [cameraFacing, setCameraFacing] = useState('back');
  const [error, setError] = useState('');
  const [permissionGranted, setPermissionGranted] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const scannerRef = useRef(null);

  // Request camera permissions on mount
  useEffect(() => {
    if (open) {
      requestCameraPermission();
    }
    return () => {
      stopCamera();
    };
  }, [open]);

  // Swipe handlers for mobile gestures
  const swipeHandlers = useSwipeable({
    onSwipedDown: () => onClose(),
    onSwipedLeft: () => switchCamera(),
    onSwipedRight: () => toggleFlash(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: false,
  });

  const requestCameraPermission = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: cameraFacing === 'back' ? 'environment' : 'user',
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        });
        setPermissionGranted(true);
        setError('');
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
        }
      } else {
        // Fallback to Capacitor Camera for native apps
        await requestCapacitorCamera();
      }
    } catch (err) {
      console.error('Camera permission error:', err);
      setError('Camera access denied. Please enable camera permissions.');
      setPermissionGranted(false);
    }
  };

  const requestCapacitorCamera = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });

      // Process the captured image for barcode detection
      processCapturedImage(image.dataUrl);
    } catch (error) {
      console.error('Capacitor camera error:', error);
      setError('Unable to access camera. Please check permissions.');
    }
  };

  const processCapturedImage = async imageDataUrl => {
    try {
      setIsScanning(true);

      // Here you would integrate with a barcode detection library
      // For now, we'll simulate barcode detection immediately
      
      // Simulate barcode result
      const mockBarcode = '1234567890123';
      onScanResult({
        text: mockBarcode,
        format: 'EAN13',
        source: 'camera',
      });

      setIsScanning(false);
      onClose();
    } catch (error) {
      setError('Failed to process barcode. Please try again.');
      setIsScanning(false);
    }
  };

  const startScanning = async () => {
    if (!permissionGranted) {
      await requestCameraPermission();
      return;
    }

    try {
      setIsScanning(true);
      setError('');

      // Start barcode detection
      if (videoRef.current) {
        // Initialize barcode scanner (you would use a library like QuaggaJS or ZXing)
        simulateBarcodeDetection();
      }
    } catch (error) {
      setError('Failed to start scanning. Please try again.');
      setIsScanning(false);
    }
  };

  const simulateBarcodeDetection = () => {
    // Simulate barcode detection for demo
    const detectionInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        // 30% chance of "detecting" a barcode
        const mockBarcode = Math.floor(Math.random() * 1000000000000);
        onScanResult({
          text: mockBarcode.toString(),
          format: 'EAN13',
          source: 'camera',
        });
        clearInterval(detectionInterval);
        setIsScanning(false);
        onClose();
      }
    }, 500);

    // Stop after 10 seconds
    setTimeout(() => {
      clearInterval(detectionInterval);
      if (isScanning) {
        setError('No barcode detected. Please try again.');
        setIsScanning(false);
      }
    }, 10000);
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const switchCamera = () => {
    setCameraFacing(prev => (prev === 'back' ? 'front' : 'back'));
    stopCamera();
    setTimeout(() => {
      requestCameraPermission();
    }, 100);
  };

  const toggleFlash = () => {
    setFlashEnabled(prev => !prev);
    if (streamRef.current) {
      const track = streamRef.current.getVideoTracks()[0];
      if (track && track.getCapabilities().torch) {
        track.applyConstraints({
          advanced: [{ torch: !flashEnabled }],
        });
      }
    }
  };

  const handleManualEntry = () => {
    // Trigger manual barcode entry
    const manualCode = prompt('Enter barcode manually:');
    if (manualCode) {
      onScanResult({
        text: manualCode,
        format: 'MANUAL',
        source: 'manual',
      });
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={isMobile}
      maxWidth="md"
      fullWidth
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          bgcolor: 'black',
          color: 'white',
          ...(!isMobile && {
            borderRadius: 2,
            maxHeight: '90vh',
          }),
        },
      }}
      {...(isMobile ? swipeHandlers : {})}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          bgcolor: 'rgba(0,0,0,0.8)',
          color: 'white',
        }}
      >
        <Typography variant="h6">{title}</Typography>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, position: 'relative', minHeight: isMobile ? '100%' : 400 }}>
        {error ? (
          <Box sx={{ p: 2 }}>
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
            <Button variant="contained" onClick={requestCameraPermission} fullWidth sx={{ mb: 2 }}>
              Retry Camera Access
            </Button>
            <Button variant="outlined" onClick={handleManualEntry} fullWidth>
              Enter Barcode Manually
            </Button>
          </Box>
        ) : (
          <>
            {/* Camera Preview */}
            <Box sx={{ position: 'relative', width: '100%', height: isMobile ? '100%' : 400 }}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />

              {/* Scanning Overlay */}
              <AnimatePresence>
                {isScanning && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'rgba(0,0,0,0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                    }}
                  >
                    <CircularProgress sx={{ color: 'white', mb: 2 }} />
                    <Typography variant="body1" sx={{ color: 'white' }}>
                      Scanning for barcode...
                    </Typography>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Scan Target Overlay */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 250,
                  height: 150,
                  border: '2px solid rgba(255,255,255,0.8)',
                  borderRadius: 2,
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -2,
                    left: -2,
                    right: -2,
                    bottom: -2,
                    border: '2px solid #4CAF50',
                    borderRadius: 2,
                    animation: 'pulse 2s infinite',
                  },
                }}
              />

              {/* Instructions */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 20,
                  left: 20,
                  right: 20,
                  textAlign: 'center',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: 'white',
                    bgcolor: 'rgba(0,0,0,0.6)',
                    p: 1,
                    borderRadius: 1,
                  }}
                >
                  {description}
                </Typography>
              </Box>
            </Box>

            {/* Mobile Gesture Hints */}
            {isMobile && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 20,
                  left: 20,
                  right: 20,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Swipe ← → for flash • Swipe ↓ to close
                </Typography>
              </Box>
            )}
          </>
        )}
      </DialogContent>

      {/* Camera Controls */}
      <DialogActions
        sx={{
          justifyContent: 'space-around',
          bgcolor: 'rgba(0,0,0,0.8)',
          p: 2,
        }}
      >
        <Fab
          size="small"
          onClick={switchCamera}
          sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
        >
          {cameraFacing === 'back' ? <CameraRear /> : <CameraFront />}
        </Fab>

        <Fab
          size="large"
          onClick={isScanning ? () => setIsScanning(false) : startScanning}
          disabled={!permissionGranted}
          sx={{
            bgcolor: isScanning ? '#f44336' : '#4CAF50',
            color: 'white',
            '&:hover': {
              bgcolor: isScanning ? '#d32f2f' : '#45a049',
            },
          }}
        >
          {isScanning ? <Close /> : <QrCodeScanner />}
        </Fab>

        <Fab
          size="small"
          onClick={toggleFlash}
          sx={{
            bgcolor: flashEnabled ? '#FFC107' : 'rgba(255,255,255,0.2)',
            color: flashEnabled ? 'black' : 'white',
          }}
        >
          {flashEnabled ? <FlashOn /> : <FlashOff />}
        </Fab>
      </DialogActions>

      <style jsx>{`
        @keyframes pulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </Dialog>
  );
};

export default MobileBarcodeScanner;
