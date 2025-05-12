
import React from 'react';

const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="bg-corporate-blue text-white font-bold p-2 rounded-md">
        A<span className="text-corporate-green">&eight</span>
      </div>
      <span className="font-semibold text-gray-700 hidden sm:block">Quadrante de Parceiros</span>
    </div>
  );
};

export default Logo;
