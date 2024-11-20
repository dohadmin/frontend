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

const SelectCertificateInput = ({
  className,
  certificates,
  placeholder,
  value,
  onChange,
  selected,
  didError,
  
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropDownRef = useRef(null);

  useClickOutside(dropDownRef, () => setIsOpen(false));

  const handleSelect = (e, certificate) => {
    onChange(e, certificate);
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
        <span className={`text-sm ${value ? "text-gray-700" : "text-gray-500"}`}>
          {selected.length} {selected.length === 1 ? "certificate" : "certificates"} selected
        </span>
      </div>
      {isOpen && (
        <ul className="absolute z-10 p-2 w-full bg-white border mt-2 rounded-md max-h-[12rem] overflow-y-scroll">
          {certificates.map((certificate, index) => (
            <li
              key={index}
              className="p-2 hover:bg-gray-100 rounded-md cursor-pointer text-sm"
              onClick={(e) => handleSelect(e, certificate)}
            >
              {certificate.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SelectCertificateInput;
