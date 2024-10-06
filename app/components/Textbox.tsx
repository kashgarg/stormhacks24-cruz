import React, { useState } from 'react';

interface TextboxProps {
  onSave: (text: string) => Promise<boolean>;
  placeholder?: string;
  isSaved: boolean;
}

const Textbox: React.FC<TextboxProps> = ({ onSave, placeholder = "Enter text here", isSaved }) => {
  const [text, setText] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      await onSave(text);
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={text}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        className="w-[299px] h-[54px] border border-orange-500 rounded-lg px-3 pr-12 focus:outline-none focus:ring-2 focus:ring-orange-300 text-black"
        placeholder={placeholder}
      />
      {isSaved && (
        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black text-2xl font-bold">
          ✓
        </span>
      )}
    </div>
  );
};

export default Textbox;