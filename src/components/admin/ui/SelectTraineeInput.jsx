import React, { useState } from 'react'
import { getColorForInitial } from '../../../utils/NameColor';

const SelectTraineeInput = ({
  trainees,
  className, 
  value, 
  handleSelect,
  placeholder, 
  type = "text", 
  onChange, 
  onBlur ,
  isDisabled, 
  didError, 
  maxLength, 
}) => {



  const [isFocused, setIsFocused] = useState(false);


  return (
    <div 
      className={className +  ` 
        ${didError ? " ring-1 ring-rose-500 ": 
        (isDisabled ? "ring-1 ring-gray-100 cursor-not-allowed":"")} 
        flex px-2 h-10 items-center justify-center rounded-md ring-1 relative ` + 
        (isFocused && !didError ?  "ring-1 ring-amber-500 outline outline-offset-1 outline-2 outline-amber-200" : '  ring-gray-200')
      }
    >
      <input 
        value={value}
        className={` ${didError ? "placeholder:text-rose-500 text-sm text-rose-500" :(isDisabled ? "placeholder:text-gray-300 cursor-not-allowed text-gray-300 bg-white": "placeholder:text-gray-500 font-normal text-gray-700 text-sm placeholder:font-normal placeholder:text-sm")} outline-none h-full w-full rounded-md px-2 flex-1  `}
        placeholder={placeholder} 
        type={type} 
        onChange={onChange} 
        onBlur={(e) => {
          setIsFocused(false);
          if (onBlur) onBlur(e);
        }}
        onFocus={() => setIsFocused(true)}
        disabled={isDisabled} 
        maxLength={maxLength}
      />
      {trainees.length > 0 && (
        <div 
          className="absolute top-14 left-0 w-full bg-white ring-1 ring-gray-200 rounded-md z-10 p-4 flex flex-col gap-1"
        >
          {trainees.map((trainee, index) => {
            const initials = trainee.firstName[0] + trainee.lastName[0];
            const bgColor = getColorForInitial(initials ? initials[0] : "");
            return(
              <div 
                key={index} 
                className="w-full h-fit hover:bg-gray-50 rounded-md flex items-center justify-start gap-2 p-1 cursor-pointer"
                onClick={(e) => handleSelect(e, trainee)}
              >
                <div>
                  {trainee.avatar ? (
                    <img src={trainee.avatar} alt="trainee" className="bg-black w-9 h-9 flex-shrink-0 rounded-full" />
                  ) : (
                    <div className={`w-9 h-9 rounded-full ${bgColor} text-white flex items-center justify-center flex-shrink-0`}>
                      {initials}
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-start">
                  <span className="text-gray-700 font-medium">
                    {trainee.firstName} {trainee.middleInitial} {trainee.lastName}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {trainee.email}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default SelectTraineeInput