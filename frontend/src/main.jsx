import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom' // <-- Thêm dòng này

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* <-- Bọc cái này vào */}
      <App />
    </BrowserRouter> {/* <-- Bọc cái này vào */}
  </React.StrictMode>,
)