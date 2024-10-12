import React from "react";

type ButtonProps = {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
};

const Button: React.FC<ButtonProps> = ({ label, onClick, disabled }) => {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      className={` ${
        disabled ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-700"
      } text-white font-bold py-2 px-4 rounded`}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default Button;
