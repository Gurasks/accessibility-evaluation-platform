import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import AccessibilitySettingsButton from './AccessibilitySettingsButton';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <AccessibilitySettingsButton />
    </div>
  );
};

export default Layout;