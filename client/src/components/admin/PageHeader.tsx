import React, { ReactNode } from 'react';
import { Box, Typography, Paper, Divider, useTheme, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';

const MotionPaper = motion(Paper);

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description, icon }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <MotionPaper
      elevation={0}
      sx={{ 
        p: { xs: 2, sm: 3 }, 
        mb: { xs: 3, sm: 4 }, 
        borderRadius: 2,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        overflow: 'hidden'
      }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'flex-start' : 'center', 
        mb: 1
      }}>
        {icon && (
          <Box 
            sx={{ 
              mr: isMobile ? 0 : 2,
              mb: isMobile ? 1 : 0,
              display: 'flex',
              alignItems: 'center',
              color: 'primary.main',
              fontSize: { xs: '1.75rem', sm: '2rem' }
            }}
          >
            {icon}
          </Box>
        )}
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          component="h1" 
          fontWeight="500"
          sx={{ 
            wordBreak: 'break-word',
            hyphens: 'auto'
          }}
        >
          {title}
        </Typography>
      </Box>
      
      {description && (
        <>
          <Divider sx={{ my: { xs: 1.5, sm: 2 } }} />
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ 
              fontSize: { xs: '0.9rem', sm: '1rem' },
              wordBreak: 'break-word'
            }}
          >
            {description}
          </Typography>
        </>
      )}
    </MotionPaper>
  );
};

export default PageHeader;