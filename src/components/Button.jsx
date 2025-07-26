import React from 'react';
import { Link } from 'react-router-dom';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  to, 
  href, 
  onClick, 
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'font-medium rounded-lg transition-colors duration-200 inline-flex items-center justify-center';
  
  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white disabled:bg-gray-400',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 disabled:bg-gray-100 disabled:text-gray-400',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white disabled:border-gray-300 disabled:text-gray-400',
    ghost: 'text-primary-600 hover:bg-primary-50 disabled:text-gray-400',
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
  
  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }
  
  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }
  
  return (
    <button 
      className={classes} 
      onClick={onClick} 
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
