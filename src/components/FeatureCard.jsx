import React from 'react';

const FeatureCard = ({ title, description, icon, color }) => {
  return (
    <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden border border-gray-100">
      <div className={`h-2 bg-${color}-600 w-full absolute top-0`}></div>
      <div className="p-8">
        <div className={`flex items-center justify-center w-12 h-12 rounded-full bg-${color}-100 text-${color}-600 mb-5 mx-auto`}>
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <p className="mt-4 text-gray-500 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

export default FeatureCard; 