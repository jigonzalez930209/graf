import React from 'react';
import InputColor from 'react-input-color';

type ColorPickerProp = {
  color: string,
  setColor: (color: string) => void
}

const ColorPicker = ({ color, setColor }: ColorPickerProp) => {
  const onChange = (col) => {
    setColor(col.hex)
  }
  return (
    <div style={{ zIndex: 5000 }}>
      <InputColor
        initialValue={color}
        onChange={onChange}
        placement="right"
      />
    </div>
  );
}

export default ColorPicker;