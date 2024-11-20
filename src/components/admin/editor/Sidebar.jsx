// src/components/SideBar.js
import { CaseUpper, Eye, EyeOff, ImagePlus, Lock, Text, Type, X } from 'lucide-react';
import React from 'react';
import Input from '../../ui/Input'

const SideBar = ({ onAddText, addBackgroundImage,layers, onLayerChange, selectedSize, setSelectedSize }) => {

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      addBackgroundImage(e.target.files[0]);
    }
  };


  return (
    <div className="p-4 w-full flex flex-col gap-6 overflow-y-scroll h-full">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="upload-background"
      />
      <div className="flex flex-col">
        <h2 className="text-lg font-semibold mb-4">Paper Sizes</h2>
        <div className="flex gap-4  ">
          <button 
            onClick={()=>setSelectedSize("A4")} 
            className={` ${selectedSize === "A4" ? " bg-gradient-to-r from-amber-500 to-amber-400 text-white " :  " bg-white text-amber-500 hover:text-amber-500 "} text-sm font-semibold w-full h-full ring-1 amber-500  transition-all duration-300 ease-in-out rounded-md flex items-center justify-center flex-col p-2 gap-2 ring-amber-500 `}
          >
            A4
          </button>
          <button 
            onClick={()=>setSelectedSize("A5")} 
            className={` ${selectedSize === "A5" ? " bg-gradient-to-r from-amber-500 to-amber-400 text-white  " :  " bg-white text-amber-500 hover:text-amber-500 "} text-sm font-semibold w-full h-full ring-1 amber-500  transition-all duration-300 ease-in-out rounded-md flex items-center justify-center flex-col p-2 gap-2 ring-amber-500 `}
          >
            A5
          </button>
        </div>
      </div>
      <div className="flex flex-col">
        <h2 className="text-lg font-semibold mb-4">Tools</h2>
        <div className="flex gap-4  ">
          <button onClick={onAddText} className="w-full h-full ring-1 amber-500 hover:bg-amber-50 transition-all duration-300 ease-in-out hover:text-amber-500 rounded-md flex items-center justify-center flex-col text-sm py-4 p-2 gap-2 ring-amber-500">
            
            <Type className="w-6 h-6 stroke-2 stroke-amber-500" />
            Add Text

          </button>
          <label htmlFor="upload-background" className="cursor-pointer hover:bg-amber-50 transition-all duration-300 ease-in-out hover:text-amber-500 w-full h-full ring-1 amber-500 rounded-md flex items-center justify-center flex-col text-sm py-4 p-2 gap-2 ring-amber-500">
            <ImagePlus className="w-6 h-6 stroke-2 stroke-amber-500" />
            Add Image
          </label>
        </div>
      </div>
      <div className="flex flex-col items-start justify-center">
        <h2 className="text-lg font-semibold mb-4">Layers</h2>
        {layers.map((layer, index) => {
          const isStatic= layer.status === "static";
          const isVisble = layer.visible;

          return(
            
            <div className="flex items-center mb-4 w-full bg-white p-4 rounded ring-1 ring-gray-200 flex-1" key={index}>

              <div className=" w-full">
                <div className="flex items-center justify-between">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      className="flex w-6 h-6 items-center justify-center"
                      onClick={() => {
                        const newLayers = [...layers];
                        newLayers[index].visible = !isVisble;
                        onLayerChange(newLayers);
                      }}
                    >
                      {isVisble ? (
                        <Eye className="w-4 h-4 text-gray-500" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-gray-500" />
                      )}
                    </button>
                    <span className={`text-sm ${isStatic ? "text-gray-700 font-medium" : "text-gray-500 "}`}>
                      {isStatic ? layer.text : "Text " +(index + 1)}
                    </span>
                  </div>
                  {isStatic ? (
                    <Lock className="w-4 h-4 text-gray-500 cursor-not-allowed " />
                  ) : (
                    <button 
                      className="text-rose-500 text-md"
                      onClick={() => {  
                        const newLayers = [...layers];
                        newLayers.splice(index, 1);
                        onLayerChange(newLayers);
                      }}
                    >
                      <X className="w-6 h-6 stroke-2 stroke-rose-500" />
                    </button>
                  )}
                </div>
                <div className="my-6">
                  {!isStatic && (
                    <Input 
                      placeholder="Type a text..."
                      value={layer.text}
                      onChange={(e) => {
                        const newLayers = [...layers];
                        newLayers[index].text = e.target.value;
                        onLayerChange(newLayers);
                      }}
                    />
                  )}
                </div>
                <div className="flex items-center justify-between gap-4 w-full">
                  <input
                    type="range" 
                    max={500}
                    min={10}
                    step={1}
                    className="appearance-none w-full bg-transparent 
                      [&::-webkit-slider-runnable-track]:bg-gray-200 
                      [&::-webkit-slider-runnable-track]:rounded-full
                      [&::-webkit-slider-runnable-track]:ring-1
                      [&::-webkit-slider-runnable-track]:ring-gray-200
                      [&::-webkit-slider-runnable-track]:h-1
                      [&::-webkit-slider-thumb]:appearance-none
                      [&::-webkit-slider-thumb]:w-4
                      [&::-webkit-slider-thumb]:h-4
                      [&::-webkit-slider-thumb]:bg-white
                      [&::-webkit-slider-thumb]:ring-[4px]
                      [&::-webkit-slider-thumb]:ring-amber-500
                      [&::-webkit-slider-thumb]:rounded-full
                      [&::-webkit-slider-thumb]:transform translate-y-[-40%]
                    "
                    value={layer.size}
                    onChange={(e) => {
                      const newLayers = [...layers];
                      newLayers[index].size = parseInt(e.target.value, 10);
                      onLayerChange(newLayers);
                    }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>

    </div>
  );
};

export default SideBar;
