import React from 'react';

const TestPage = ({ title, description, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    green: 'bg-green-100 text-green-800 border-green-200',
    purple: 'bg-purple-100 text-purple-800 border-purple-200',
    orange: 'bg-orange-100 text-orange-800 border-orange-200',
  };

  return (
    <div className="p-6">
      <div className={`${colorClasses[color]} border-2 rounded-lg p-8 text-center`}>
        <h1 className="text-4xl font-bold mb-4">✅ {title}</h1>
        <p className="text-lg mb-6">{description}</p>
        <p className="text-sm opacity-75">
          Route berhasil dimuat! Sistem routing berfungsi dengan baik.
        </p>
      </div>
    </div>
  );
};

export default TestPage;
