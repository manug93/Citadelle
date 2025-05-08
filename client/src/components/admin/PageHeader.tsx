import React, { ReactNode } from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';
import { motion } from 'framer-motion';

const MotionPaper = motion(Paper);

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description, icon }) => {
  return (
    <MotionPaper
      elevation={0}
      sx={{ 
        p: 3, 
        mb: 4, 
        borderRadius: 2,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider'
      }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        {icon && (
          <Box 
            sx={{ 
              mr: 2, 
              display: 'flex',
              alignItems: 'center',
              color: 'primary.main',
              fontSize: '2rem'
            }}
          >
            {icon}
          </Box>
        )}
        <Typography variant="h4" component="h1" fontWeight="500">
          {title}
        </Typography>
      </Box>
      
      {description && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body1" color="text.secondary">
            {description}
          </Typography>
        </>
      )}
    </MotionPaper>
  );
};

export default PageHeader;