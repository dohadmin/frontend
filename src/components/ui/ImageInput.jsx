import { CameraIcon, DeleteIcon, ImageIcon, TrashIcon } from 'lucide-react';
import React, { useState, useCallback, useRef } from 'react';

const ImageInput = ({ onChange, value, person }) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      onChange(droppedFile);
    }
  }, [onChange]);

  const handleFileChange = useCallback((e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onChange(selectedFile);
      e.target.value = ''; // Reset the input value
    }
  }, [onChange]);

  const handleDelete = useCallback((e) => {
    e.stopPropagation(); // Prevent the label click event
    onChange(null);
  }, [onChange]);


  return (
    <article className="flex items-center justify-start gap-6 w-full">
      <section
        className={`relative rounded-full ring-1 ${isDragging ? 'ring-lime-500' : 'ring-gray-200'} w-24 h-24 flex items-center justify-center flex-shrink-0`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <label
          className="flex flex-col items-center justify-center object-cover w-full h-full overflow-clip rounded-full cursor-pointer"
          htmlFor="image-upload"
        >
          {value ? (
            <img
              src={typeof value === 'string' ? value : URL.createObjectURL(value)}
              alt="Uploaded"
              className="w-full h-full object-cover rounded-md overflow-clip"
            />
          ) : (
            <div className="flex items-center justify-center">
              <ImageIcon className="w-8 h-8 stroke-1 stroke-gray-300" />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="image-upload"
            ref={inputRef}
          />
        </label>
        {value && (
          <button
            className="text-sm w-8 h-8 bg-white rounded-full ring-1 ring-gray-200 absolute top-0 right-0 flex items-center justify-center"
            type="button"
            onClick={handleDelete}
          >
            <TrashIcon className="w-5 h-5 stroke-rose-500" />
          </button>
        )}
      </section>
      <section>
      <p className="text-sm text-gray-500">For optimal results, please upload a square image of the {person}. A size of 
        <span className="text-amber-500 font-medium mx-1">500px by 500px</span> with a 
        <span className="text-amber-500 font-medium mx-1">1:1</span> aspect ratio is recommended.
      </p>
      </section>
    </article>
  );
};

export default ImageInput;