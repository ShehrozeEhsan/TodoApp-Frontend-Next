import React from 'react';
// import HomePage from '../../pages'; 

import dynamic from 'next/dynamic';

const HomePage = dynamic(() => import('../../pages/index'));

const RootLayout: React.FC = () => {
  return (
    <div>
      <HomePage />
    </div>
  );
};

export default RootLayout;
