import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Home from './pages/Home';
import Layout from './pages/Layout';
import { Routes, Route, BrowserRouter } from "react-router-dom";


function App() {
  return (
    <>
      <div>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout/>}>
            <Route path="/" element={<Home/>} ></Route>
          </Route>
        </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <App />
)
