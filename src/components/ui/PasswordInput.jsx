import { useState} from 'react'
import { Eye, LucideEyeOff } from 'lucide-react'


const PasswordInput = (
  { 
    className, 
    value, 
    placeholder, 
    onChange, 
    onBlur ,
    isDisabled, 
    icon, 
    didError, 
    maxLength, 
    onlyNumbers = false},
  
) => {

  const [isFocused, setIsFocused] = useState(false);
  const [prevValue, setPrevValue] = useState(value);
  const [ toggle, setToggle ] = useState(false)

  const handleInput = (e) => {
    if (onlyNumbers && e.currentTarget.value && !/^\d*$/.test(e.currentTarget.value)) {
      e.currentTarget.value = prevValue 
    } else {
      setPrevValue(e.currentTarget.value);
    }
  };

  return (
    <div 
      className={className +  ` 
        ${didError ? " ring-1 ring-rose-500": 
        (isDisabled ? "ring-1 ring-gray-100 cursor-not-allowed":"")} 
        flex px-2 h-10 items-center justify-center rounded-md ring-1 ` + 
        (isFocused && !didError ?  "ring-1 ring-amber-500 outline outline-offset-1 outline-2 outline-amber-200" : '  ring-gray-200')
      }
    >
      {icon ? (
        <div className="flex-shrink-0">
          {icon}
        </div>
        ) : null
      }
      <input 
        value={value}
        className={` ${didError ? "placeholder:text-rose-500 text-sm text-rose-500" :(isDisabled ? "placeholder:text-gray-300 cursor-not-allowed text-gray-300 bg-white": "placeholder:text-gray-500 font-normal text-gray-700 text-sm placeholder:font-normal placeholder:text-sm")} outline-none h-full w-full rounded-md px-2 flex-1  `}
        placeholder={placeholder} 
        type={toggle ? "text" : "password"}
        onChange={onChange} 
        onBlur={(e) => {
          setIsFocused(false);
          if (onBlur) onBlur(e);
        }}
        onFocus={() => setIsFocused(true)}
        disabled={isDisabled} 
        maxLength={maxLength}
        onKeyDown={onlyNumbers ? (e) => {
          if (!e.ctrlKey && !e.metaKey && !["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Backspace"].includes(e.key)) {
            e.preventDefault();
          }
        } : undefined}
        onInput={handleInput}
      />
      <button 
        type="button"
        className="w-7 h-7 "
        onClick={() => setToggle((prev) => !prev)}
      >
        {toggle ? (
          <LucideEyeOff className={didError ? " stroke-rose-500 w-5 h-5 " : "stroke-gray-500 w-5 h-5"} />
        ) : (
          <Eye className={didError ? " stroke-rose-500 w-5 h-5 " : "stroke-gray-500 w-5 h-5"} />
        )}
      </button>
    </div>
  )
}

export default PasswordInput