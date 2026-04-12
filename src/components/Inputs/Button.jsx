import React from 'react'

const Button = ({className, children, handleClick, disabled=false, type='button', tabIndex}) => {
  return (
    <button className={className} onClick={handleClick} type={type} disabled={disabled} tabIndex={tabIndex}>{children}</button>
  )
}

export default Button