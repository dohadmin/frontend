import { useState, ChangeEvent, ReactNode, ForwardRefRenderFunction, forwardRef } from 'react'
import { TextareaAutosize } from '@mui/base/TextareaAutosize'

const TextArea = (
  { 
    className, 
    value, 
    placeholder, 
    onChange, 
    onBlur, 
    isDisabled , 
    button, 
    didError, 
    maxLength,
    maxRows
  },
) => {

  const [isFocused, setIsFocused] = useState(false);

  return (
    <div 
      className={className +  ` 
        ${didError ? " ring-1 ring-rose-500 ": 
        (isDisabled ? "ring-1 ring-gray-100 cursor-not-allowed":"")} 
        flex  items-center justify-center rounded-md ring-1 ` + 
        (isFocused && !didError ?  "ring-1 ring-amber-500 outline outline-offset-1 outline-2 outline-amber-200" : '  ring-gray-200')
      }
    >      
      <TextareaAutosize 
        value={value}
        className={` ${didError ? "placeholder:text-rose-500 text-sm" :(isDisabled ? "placeholder:text-gray-300 cursor-not-allowed text-gray-300 bg-white": "placeholder:text-gray-500 font-normal text-gray-700 text-sm placeholder:font-normal placeholder:text-sm")} outline-none h-full w-full rounded-md px-4 py-2  flex-1 resize-none`}
        placeholder={placeholder}
        onBlur={(e) => {
          setIsFocused(false);
          if (onBlur) onBlur(e);
        }}
        minRows={3}
        onFocus={() => setIsFocused(true)}
        onChange={onChange}
        disabled={isDisabled}
        maxLength={maxLength}
        maxRows={maxRows}
      />
      {button ? (
        <div className="flex-shrink-0">
          {button}
        </div>
        ) : null
      }
    </div>
  )
}

export default TextArea