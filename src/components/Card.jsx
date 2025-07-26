import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  padding = 'default',
  shadow = 'sm',
  hover = false,
  ...props 
}) => {
  const paddings = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8',
  };
  
  const shadows = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  };
  
  const hoverEffect = hover ? 'hover:shadow-md transition-shadow duration-200' : '';
  
  const classes = `bg-white rounded-lg ${shadows[shadow]} ${paddings[padding]} ${hoverEffect} ${className}`;
  
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default Card;
