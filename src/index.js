import React from "react";
import ReactDOM from "react-dom/client";
import { Navbar, Footer } from "./pages/layout.js";
import { Home } from './pages/home.js';
import { Products } from './pages/products.js';
import { BrowserRouter,Routes,Route } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/products' element={<Products/>} />
        </Routes>
        <Footer />
      </BrowserRouter>
     
    </>
  );
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
