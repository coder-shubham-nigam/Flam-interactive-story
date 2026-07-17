import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './style.css' 

// Note: If you named your CSS file style.css earlier, 
// change the line above to: import './style.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)