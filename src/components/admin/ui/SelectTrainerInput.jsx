import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getColorForInitial } from "../../../utils/NameColor";

const useClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};

const SelectTrainerInput = ({
  className,
  trainers,
  placeholder,
  value,
  onChange,
  didError,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropDownRef = useRef(null);

  useClickOutside(dropDownRef, () => setIsOpen(false));

  const handleSelect = (id) => {
    onChange(id);
    setIsOpen(false);
  };

  // Find the selected trainer based on the value
  const selectedTrainer = trainers.find(trainer => trainer._id === value);
  const initialsSelected = selectedTrainer?.firstName[0] + selectedTrainer?.lastName[0];
  const bgColorSelected = getColorForInitial(initialsSelected ? initialsSelected[0] : "");

  return (
    <div className={`relative ${className}`} ref={dropDownRef}>
      <div
        className={`ring-1
          ${didError ? 'ring-red-500 text-rose-500 ' : "ring-gray-200 text-gray-500 "}
          h-10 flex items-center justify-between p-2 cursor-pointer rounded-md px-4 `}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`text-sm ${value ? "text-gray-700" : "text-gray-500"}`}>
          {selectedTrainer ? (
            <div className="flex items-center justify-start gap-2">
              <div>
                {selectedTrainer.avatar ? (
                <img src={selectedTrainer.avatar} alt="trainer" className="w-7 h-7 rounded-full flex-shrink-0" />
              ) : (
                  <div className={`w-7 h-7 rounded-full ${bgColorSelected} text-white flex items-center justify-center flex-shrink-0`}>
                    {initialsSelected}
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-start">
                <span className="text-gray-700 font-medium">
                  {selectedTrainer.firstName} {selectedTrainer.middleInitial} {selectedTrainer.lastName}
                </span>
              </div>
            </div>
          ) : 
            <span className={`${didError ? " text-rose-500 " : " text-gray-500 "}`} >{placeholder}</span>
          }
        </span>
        <ChevronDown className="w-5 h-5 stroke-1 stroke-gray-500" />
      </div>
      {isOpen && (
        <ul className="absolute z-10 p-2 w-full bg-white border mt-2 rounded-md max-h-[20rem] overflow-y-scroll">
          {trainers.map((trainer, index) => {
            const initials = trainer.firstName[0] + trainer.lastName[0];
            const bgColor = getColorForInitial(initials ? initials[0] : "");
            return (              
              <li
                key={index}
                className="p-2 hover:bg-gray-50 cursor-pointer text-sm flex items-center justify-start gap-4 rounded-md"
                onClick={() => handleSelect(trainer._id)}
              >
                <div>
                  {trainer.avatar ? (
                    <img src={trainer.avatar} alt="trainer" className="w-8 h-8 flex-shrink-0 rounded-full" />
                  ) : (
                    <div className={`w-8 h-8 rounded-full ${bgColor} text-white flex items-center justify-center flex-shrink-0`}>
                      {initials}
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-start">
                  <span className="text-gray-700 font-medium">
                    {trainer.firstName} {trainer.middleInitial} {trainer.lastName}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {trainer.email}
                  </span>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  );
};

export default SelectTrainerInput;