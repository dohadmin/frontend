import React, { useState } from 'react';
import CanvasEdit from '../editor/CanvasEdit';
import SideBar from '../editor/Sidebar';

const UpdateEditorBranch = ({ selectedSize, setEditSize, layers, setLayers, selectedCertificate, setEditTemplate  }) => {


  const [backgroundImage, setBackgroundImage] = useState(null);
  const [selectedLayer, setSelectedLayer] = useState(null);


  const addText = () => {
    setLayers([...layers, { type: 'text', text: 'New Text', x: 100, y: 100, size: 40 , status: "dynamic", visible: true }]);
  };

  const addBackgroundImage = (file) => {
    const imageUrl = URL.createObjectURL(file);
    setBackgroundImage(imageUrl);
    setEditTemplate(file);
  };

  const handleLayerChange = (newLayers) => {
    setLayers(newLayers);
  };



  return (
    <div className="w-full h-full overflow-x-hidden flex">
      <div className="w-full h-full flex items-center justify-center">
        <CanvasEdit layers={layers} onLayerChange={handleLayerChange} backgroundImage={backgroundImage} setSelectedLayer={setSelectedLayer} selectedSize={selectedSize} selectedCertificate={selectedCertificate}/>
      </div>
      <div className="w-[20rem] h-full flex flex-col bg-white border-gray-200 border-l ">
        <SideBar onAddText={addText} addBackgroundImage={addBackgroundImage} layers={layers} onLayerChange={handleLayerChange} selectedSize={selectedSize} setSelectedSize={setEditSize} />
      </div>
    </div>
  );
}

export default UpdateEditorBranch
