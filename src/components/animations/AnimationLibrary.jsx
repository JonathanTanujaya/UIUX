import React, { useState, useEffect } from 'react';
import {
  Box,
  Fade,
  Slide,
  Zoom,
  Grow,
  Collapse,
  useTheme,
} from '@mui/material';
import { useSpring, animated, useTransition, config } from '@react-spring/web';
import { useInView } from 'react-intersection-observer';

// Smooth page transitions
export const PageTransition = ({ children, direction = 'up' }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const slideProps = useSpring({
    transform: isVisible 
      ? 'translateY(0px) scale(1)' 
      : `translateY(${direction === 'up' ? '50px' : '-50px'}) scale(0.95)`,
    opacity: isVisible ? 1 : 0,
    config: config.gentle,
  });

  return (
    <animated.div style={slideProps}>
      {children}
    </animated.div>
  );
};

// Staggered list animations
export const StaggeredList = ({ children, delay = 100 }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const transitions = useTransition(
    isVisible ? React.Children.toArray(children) : [],
    {
      from: { opacity: 0, transform: 'translateX(-20px)' },
      enter: { opacity: 1, transform: 'translateX(0px)' },
      leave: { opacity: 0, transform: 'translateX(20px)' },
      trail: delay,
      config: config.gentle,
    }
  );

  return (
    <Box>
      {transitions((style, item) => (
        <animated.div style={style}>
          {item}
        </animated.div>
      ))}
    </Box>
  );
};

// Scroll-triggered animations
export const ScrollAnimation = ({ 
  children, 
  animationType = 'fadeUp',
  threshold = 0.1,
  triggerOnce = true 
}) => {
  const { ref, inView } = useInView({
    threshold,
    triggerOnce,
  });

  const animations = {
    fadeUp: {
      from: { opacity: 0, transform: 'translateY(30px)' },
      to: { opacity: inView ? 1 : 0, transform: inView ? 'translateY(0px)' : 'translateY(30px)' },
    },
    fadeLeft: {
      from: { opacity: 0, transform: 'translateX(-30px)' },
      to: { opacity: inView ? 1 : 0, transform: inView ? 'translateX(0px)' : 'translateX(-30px)' },
    },
    fadeRight: {
      from: { opacity: 0, transform: 'translateX(30px)' },
      to: { opacity: inView ? 1 : 0, transform: inView ? 'translateX(0px)' : 'translateX(30px)' },
    },
    scale: {
      from: { opacity: 0, transform: 'scale(0.8)' },
      to: { opacity: inView ? 1 : 0, transform: inView ? 'scale(1)' : 'scale(0.8)' },
    },
    bounce: {
      from: { opacity: 0, transform: 'translateY(-20px) scale(0.9)' },
      to: { 
        opacity: inView ? 1 : 0, 
        transform: inView ? 'translateY(0px) scale(1)' : 'translateY(-20px) scale(0.9)' 
      },
      config: config.wobbly,
    },
  };

  const springProps = useSpring({
    ...animations[animationType],
    config: animations[animationType].config || config.gentle,
  });

  return (
    <animated.div ref={ref} style={springProps}>
      {children}
    </animated.div>
  );
};

// Hover animations
export const HoverAnimation = ({ 
  children, 
  scale = 1.05, 
  lift = true, 
  glow = false,
  duration = 200 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const theme = useTheme();

  const hoverProps = useSpring({
    transform: isHovered 
      ? `scale(${scale}) ${lift ? 'translateY(-2px)' : ''}` 
      : 'scale(1) translateY(0px)',
    boxShadow: isHovered 
      ? glow 
        ? `0 8px 25px ${theme.palette.primary.main}33, 0 4px 10px rgba(0,0,0,0.12)`
        : '0 8px 25px rgba(0,0,0,0.15), 0 4px 10px rgba(0,0,0,0.1)'
      : '0 2px 4px rgba(0,0,0,0.1)',
    config: { tension: 300, friction: 20 },
  });

  return (
    <animated.div
      style={hoverProps}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </animated.div>
  );
};

// Loading animations
export const LoadingAnimation = ({ type = 'pulse', size = 40, color = 'primary' }) => {
  const theme = useTheme();
  const primaryColor = theme.palette[color]?.main || theme.palette.primary.main;

  const pulseAnimation = useSpring({
    from: { transform: 'scale(0.8)', opacity: 0.5 },
    to: async (next) => {
      while (true) {
        await next({ transform: 'scale(1.2)', opacity: 1 });
        await next({ transform: 'scale(0.8)', opacity: 0.5 });
      }
    },
    config: { duration: 1000 },
  });

  const spinAnimation = useSpring({
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
    loop: true,
    config: { duration: 1000 },
  });

  const waveAnimation = useSpring({
    from: { transform: 'translateY(0px)' },
    to: async (next) => {
      while (true) {
        await next({ transform: 'translateY(-10px)' });
        await next({ transform: 'translateY(0px)' });
      }
    },
    config: { tension: 200, friction: 10 },
  });

  const animations = {
    pulse: pulseAnimation,
    spin: spinAnimation,
    wave: waveAnimation,
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{ width: size, height: size }}
    >
      <animated.div style={animations[type]}>
        <Box
          sx={{
            width: size,
            height: size,
            borderRadius: type === 'spin' ? 0 : '50%',
            backgroundColor: type === 'spin' ? 'transparent' : primaryColor,
            border: type === 'spin' ? `3px solid ${primaryColor}` : 'none',
            borderTop: type === 'spin' ? `3px solid transparent` : 'none',
          }}
        />
      </animated.div>
    </Box>
  );
};

// Card flip animation
export const FlipCard = ({ front, back, flipped, onClick }) => {
  const { transform, opacity } = useSpring({
    opacity: flipped ? 1 : 0,
    transform: `perspective(600px) rotateY(${flipped ? 180 : 0}deg)`,
    config: { mass: 5, tension: 500, friction: 80 },
  });

  return (
    <Box
      onClick={onClick}
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        cursor: 'pointer',
        transformStyle: 'preserve-3d',
      }}
    >
      <animated.div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backfaceVisibility: 'hidden',
          transform: transform.to(t => `${t}`),
        }}
      >
        {front}
      </animated.div>
      <animated.div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backfaceVisibility: 'hidden',
          transform: transform.to(t => `${t} rotateY(180deg)`),
        }}
      >
        {back}
      </animated.div>
    </Box>
  );
};

// Progress bar animation
export const AnimatedProgressBar = ({ 
  value, 
  max = 100, 
  height = 8, 
  color = 'primary',
  showLabel = false,
  duration = 1000 
}) => {
  const theme = useTheme();
  const percentage = (value / max) * 100;
  
  const progressProps = useSpring({
    width: `${percentage}%`,
    config: { duration },
  });

  const labelProps = useSpring({
    number: percentage,
    config: { duration },
  });

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          width: '100%',
          height,
          backgroundColor: theme.palette.grey[200],
          borderRadius: height / 2,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <animated.div
          style={{
            ...progressProps,
            height: '100%',
            backgroundColor: theme.palette[color].main,
            borderRadius: height / 2,
            transition: 'all 0.3s ease',
          }}
        />
      </Box>
      {showLabel && (
        <Box sx={{ textAlign: 'center', mt: 1 }}>
          <animated.span>
            {labelProps.number.to(n => `${Math.round(n)}%`)}
          </animated.span>
        </Box>
      )}
    </Box>
  );
};

// Notification toast animation
export const NotificationToast = ({ 
  message, 
  type = 'info', 
  visible, 
  onClose,
  position = 'top-right' 
}) => {
  const theme = useTheme();
  
  const slideProps = useSpring({
    transform: visible 
      ? 'translateX(0px) scale(1)' 
      : position.includes('right') 
        ? 'translateX(100px) scale(0.95)' 
        : 'translateX(-100px) scale(0.95)',
    opacity: visible ? 1 : 0,
    config: config.gentle,
  });

  const typeColors = {
    info: theme.palette.info.main,
    success: theme.palette.success.main,
    warning: theme.palette.warning.main,
    error: theme.palette.error.main,
  };

  return (
    <animated.div
      style={{
        ...slideProps,
        position: 'fixed',
        top: position.includes('top') ? 20 : 'auto',
        bottom: position.includes('bottom') ? 20 : 'auto',
        right: position.includes('right') ? 20 : 'auto',
        left: position.includes('left') ? 20 : 'auto',
        zIndex: 9999,
        backgroundColor: typeColors[type],
        color: 'white',
        padding: '12px 16px',
        borderRadius: 8,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        cursor: 'pointer',
      }}
      onClick={onClose}
    >
      {message}
    </animated.div>
  );
};

export default {
  PageTransition,
  StaggeredList,
  ScrollAnimation,
  HoverAnimation,
  LoadingAnimation,
  FlipCard,
  AnimatedProgressBar,
  NotificationToast,
};
