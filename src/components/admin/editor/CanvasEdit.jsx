import React, { useState, useEffect } from 'react';
import { Stage, Layer, Text, Image, Group } from 'react-konva';
import useImage from 'use-image';

const CanvasEdit = ({ layers, onLayerChange, backgroundImage, setSelectedLayer, selectedSize, selectedCertificate }) => {
  const [image] = useImage(backgroundImage);
  const [image1] = useImage(selectedCertificate.template);

  // Define dimensions for A4 and A5 sizes
  const sizes = {
    A4: { width: 1123, height: 794 },
    A5: { width: 794, height: 559 }
  };


  // Set canvas dimensions based on selectedSize prop
  const { width: canvasWidth, height: canvasHeight } = sizes[selectedSize] || sizes.A4;

  const [positions, setPositions] = useState(layers.map(layer => ({ x: layer.x, y: layer.y })));

  useEffect(() => {
    setPositions(layers.map(layer => ({ x: layer.x, y: layer.y })));
  }, [layers]);

  const handleDragEnd = (index, e) => {
    const newLayers = [...layers];
    newLayers[index] = { ...newLayers[index], x: e.target.x(), y: e.target.y() };
    onLayerChange(newLayers);
    const newPositions = [...positions];
    newPositions[index] = { x: e.target.x(), y: e.target.y() };
    setPositions(newPositions);
  };

  const handleDragMove = (index, e) => {
    const newPositions = [...positions];
    newPositions[index] = { x: e.target.x(), y: e.target.y() };
    setPositions(newPositions);
  };

  return (
    <div className="ring-1 ring-amber-500">
      <Stage width={canvasWidth} height={canvasHeight} id="canvas-container">
        <Layer>
        {image ? (
          <Image image={image} width={canvasWidth} height={canvasHeight} />
        ) : (
          <Image image={image1} width={canvasWidth} height={canvasHeight} />
        )}          
        {layers.map((layer, index) => {
            const isVisible = layer.visible;
            if (!isVisible) return null;
            return (
              <Group
                key={index}
                x={positions[index]?.x}
                y={positions[index]?.y}
                draggable
                onDragEnd={(e) => handleDragEnd(index, e)}
                onDragMove={(e) => handleDragMove(index, e)}
                onClick={() => setSelectedLayer(index)}
              >
                <Text text={layer.text} fontSize={layer.size} verticalAlign='middle' align='center' />
              </Group>
            );
          })}
        </Layer>
      </Stage>
    </div>
  );
};

export default CanvasEdit;