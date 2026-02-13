import React from 'react'

const Button = ({className, children, handleClick, disabled=false, type='button'}) => {
  return (
    <button className={className} onClick={handleClick} type={type} disabled={disabled}>{children}</button>
  )
}

export default Button