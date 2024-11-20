import React from 'react';
import { useFocusTrap } from '@mantine/hooks';
import { X } from 'lucide-react';

const DeleteModal = ({
  isOpen,
  setOpen,
  title,
  subtitle, // Add a prop for the subtitle
  children,
  onDelete // Add a prop for the delete action
}) => {
  const ref = useFocusTrap();

  return (
    isOpen && (
      <div
        ref={ref}
        className="fixed top-0 right-0 z-50 h-screen w-screen bg-stone-950/40 flex items-center justify-center"
        onClick={() => setOpen(false)} // Close modal when clicking outside
      >
        <div
          className="w-[32rem] rounded-xl bg-white flex flex-col items-center justify-center"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
        >
          <div className="w-full flex items-center justify-between p-4">
            <h1 className="text-xl font-semibold text-stone-950">{title}</h1>
            <button
              className=""
              onClick={() => setOpen(false)}
            >
              <X className="w-7 h-7 stroke-rose-500" />
            </button>
          </div>
          {subtitle && (
            <div className="w-full px-4">
              <h2 className="text-base font-normal text-stone-700">{subtitle}</h2>
            </div>
          )}
          <div className="flex flex-col w-full h-full p-4">
            {children}
          </div>
          <div className="w-full flex justify-end p-4">
            <button
              className=" text-stone-900 px-4 py-2 rounded-md mr-2"
              onClick={() => setOpen(false)} // Close modal when clicking cancel              
            >
              Cancel
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-md"
              onClick={onDelete} // Call the delete action
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default DeleteModal;