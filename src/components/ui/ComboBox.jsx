import { useEffect, useRef, useState } from "react";

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

const ComboBox = ({
  className,
  options,
  placeholder,
  value,
  onChange,
  didError,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropDownRef = useRef(null);

  useClickOutside(dropDownRef, () => setIsOpen(false));

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropDownRef}>
      <div
        className={` ring-1
          ${didError ? 'ring-red-500 text-rose-500 ' : "ring-gray-200 text-gray-500 "}
          h-10 flex items-center justify-between p-2 cursor-pointer rounded-md px-4 `}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`text-sm  ${value ? " text-gray-700 " : " text-gray-500 "}`}>{value || placeholder}</span>
      </div>
      {isOpen && (
        <ul className="absolute z-10 p-2 w-full bg-white border mt-2 rounded-md max-h-[12rem] overflow-y-scroll">
          {options.map((option) => (
            <li
              key={option}
              className="p-2 hover:bg-gray-100 rounded-md cursor-pointer text-sm"
              onClick={() => handleSelect(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ComboBox;