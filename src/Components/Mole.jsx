import React from 'react';

const Mole = ({ isVisible, onClick }) => {
  return (
    <div className="hole" onClick={onClick}>
      <div className={`mole ${isVisible ? 'visible' : ''}`}></div>
    </div>
  );
};

export default Mole;
