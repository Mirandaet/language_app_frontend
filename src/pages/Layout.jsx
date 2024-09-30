import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';
import NavBar from '../components/NavBar';

function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div className="flex-auto">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default Layout;
