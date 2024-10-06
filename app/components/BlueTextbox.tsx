import React, { useState, useEffect } from 'react';

interface BlueTextboxProps {
  placeholder?: string;
  onChange?: (value: string) => void;
  givenText?: string;
}

const BlueTextbox: React.FC<BlueTextboxProps> = ({ placeholder, onChange, givenText }) => {
  const [value, setValue] = useState(givenText || '');

  useEffect(() => {
    if (givenText) {
      setValue(givenText);
    }
  }, [givenText]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!givenText) {
      const newValue = event.target.value;
      setValue(newValue);
      if (onChange) {
        onChange(newValue);
      }
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-[220px] h-[48px] border border-[#38369A] rounded-md px-3 focus:outline-none focus:ring-2 focus:ring-[#38369A] text-black"
        readOnly={!!givenText}
      />
    </div>
  );
};

export default BlueTextbox;
