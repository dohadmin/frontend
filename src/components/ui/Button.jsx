import React from 'react'

const Button = ({
  className,
  children,
  onClick,
  isDisabled = false
}) => {
  return (
    <button
      onClick={onClick}
      className={className + ` 
        h-10 rounded-md miw-20  text-white font-medium  transition-colors duration-500 ease-in-out 
        ${isDisabled ? ' cursor-not-allowed bg-gray-500 ' : ' cursor-pointer bg-gradient-to-r from-amber-500 to-amber-400 '}
        `}
      disabled={isDisabled}
    >
      {children}
    </button>
  )
}

export default Button