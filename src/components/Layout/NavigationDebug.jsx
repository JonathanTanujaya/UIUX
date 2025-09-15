import React from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigation } from '../../contexts/NavigationContext';

const NavigationDebug = () => {
  const location = useLocation();
  const { activeCategory, navigationConfig, activeItems, activeCategoryConfig } = useNavigation();

  return (
    <div
      style={{
        position: 'fixed',
        top: 70,
        right: 10,
        background: 'white',
        border: '1px solid #ccc',
        padding: '10px',
        fontSize: '12px',
        zIndex: 9999,
        maxWidth: '300px',
      }}
    >
      <h4>Navigation Debug</h4>
      <p>
        <strong>Current Path:</strong> {location.pathname}
      </p>
      <p>
        <strong>Active Category:</strong> {activeCategory}
      </p>
      <p>
        <strong>Active Items Count:</strong> {activeItems?.length || 0}
      </p>
      <p>
        <strong>Category Config:</strong> {activeCategoryConfig?.label || 'None'}
      </p>
      <div>
        <strong>Available Categories:</strong>
        <ul>
          {Object.keys(navigationConfig).map(key => (
            <li key={key}>
              {key} ({navigationConfig[key].items?.length || 0} items)
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NavigationDebug;
