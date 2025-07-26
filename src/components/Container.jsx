import React from 'react';

const Container = ({ 
  children, 
  size = 'default',
  className = '',
  ...props 
}) => {
  const sizes = {
    sm: 'max-w-3xl',
    default: 'max-w-7xl',
    lg: 'max-w-screen-xl',
    full: 'max-w-full',
  };
  
  const classes = `${sizes[size]} mx-auto px-4 sm:px-6 lg:px-8 ${className}`;
  
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default Container;
