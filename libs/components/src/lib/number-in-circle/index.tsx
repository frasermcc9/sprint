import React from "react";

interface NumberInCircleProps {
  number: number;
}

const NumberInCircle: React.FC<NumberInCircleProps> = ({ number }) => {
  return (
    <div>
      {number >= 6 && number <= 10 && (
        <div className="h-8 w-8 rounded-full border-2 border-emerald-600 bg-transparent text-center text-emerald-600">
          {number}
        </div>
      )}
      {number >= 11 && number <= 16 && (
        <div className="h-8 w-8  rounded-full border-2 border-orange-500 bg-transparent text-center text-orange-500">
          {number}
        </div>
      )}
      {number >= 17 && (
        <div className="h-8 w-8 rounded-full border-2 border-red-600 bg-transparent text-center text-red-600">
          {number}
        </div>
      )}
    </div>
  );
};

export default NumberInCircle;
