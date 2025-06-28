// src/components/ui/Card.tsx
import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = "" }) => {
  return (
    <div
      className={`w-[90%] max-w-[400px] sm:max-w-[450px] md:max-w-[500px] mx-auto bg-[#f8f8f8] rounded-[16px] shadow-md z-20 relative ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;