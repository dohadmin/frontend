import React, { useState, useEffect, forwardRef } from 'react';
import { Stage, Layer, Text, Image, Group } from 'react-konva';
import useImage from 'use-image';

const PrintCanvas = forwardRef(({ layers, template, selectedSize }, ref) => {
  // Add crossOrigin to allow the image to be loaded with proper CORS settings
  const [image] = useImage(template, 'anonymous');

  const sizes = {
    A4: { width: 1123, height: 794 },
    A5: { width: 794, height: 559 },
  };

  const { width: canvasWidth, height: canvasHeight } = sizes[selectedSize] || sizes.A4;
  const [positions, setPositions] = useState(layers.map(layer => ({ x: layer.x, y: layer.y })));

  useEffect(() => {
    setPositions(layers.map(layer => ({ x: layer.x, y: layer.y })));
  }, [layers]);

  return (
    <div className="ring-1 ring-amber-500">
      <Stage width={canvasWidth} height={canvasHeight} ref={ref}>
        <Layer>
          {image && <Image image={image} width={canvasWidth} height={canvasHeight} />}
          {layers.map((layer, index) => {

            if (!layer.visible) return null;

            const text = layer.status === "static" ? layer.nameLabel : layer.text 
            return (
              <Group key={index} x={positions[index]?.x} y={positions[index]?.y}>
                <Text text={text} fontSize={layer.size} verticalAlign="middle" align="center" />
              </Group>
            );
          })}
        </Layer>
      </Stage>
    </div>
  );
});

export default PrintCanvas;
