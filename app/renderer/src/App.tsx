import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ClipBoard from './pages/main';
import { Settings } from './pages/setting';

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<ClipBoard />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
};
