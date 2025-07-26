import React from 'react';

const Section = ({ 
  children, 
  className = '', 
  background = 'white',
  padding = 'default',
  ...props 
}) => {
  const backgrounds = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    primary: 'bg-primary-600',
    gradient: 'bg-gradient-to-br from-primary-50 to-white',
  };
  
  const paddings = {
    none: '',
    sm: 'py-8 px-4 sm:px-6 lg:px-8',
    default: 'py-16 px-4 sm:px-6 lg:px-8',
    lg: 'py-24 px-4 sm:px-6 lg:px-8',
  };
  
  const classes = `${backgrounds[background]} ${paddings[padding]} ${className}`;
  
  return (
    <section className={classes} {...props}>
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </section>
  );
};

export default Section;
