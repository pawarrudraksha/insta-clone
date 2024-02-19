import  "./App.css"
import React from 'react';
import './App.css';
import AppRouter from './routes/AppRouter';
import Sidebar from "./components/miscellaneous/Sidebar";

function App() {
  return (
    <div className="App">
    <AppRouter/>
    </div>
  );
}

export default App;
