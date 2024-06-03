import "./App.css";
import React, { useEffect } from "react";
import "./App.css";
import AppRouter from "./routes/AppRouter";
import { useAppSelector } from "./app/hooks";
import { selectDisplayMode } from "./app/features/appSlice";

const App: React.FC = () => {
  const displayMode = useAppSelector(selectDisplayMode);
  const root = document.documentElement;
  useEffect(() => {
    if (displayMode === "dark") {
      root.style.setProperty("--primary-color", "black");
      root.style.setProperty("--font-color", "white");
      root.style.setProperty("--secondary-font-color", "#a8a8a8");
      root.style.setProperty("--font-color-1", "rgb(204, 204, 204)");
      root.style.setProperty("--modal-color", "#232323");
      root.style.setProperty("--hover-color-1", "#1a1a1a");
      root.style.setProperty("--hover-color-2", "#302f2f");
      root.style.setProperty("--btn-bg-color", "#3b3b3b");
    } else {
      root.style.setProperty("--primary-color", "white");
      root.style.setProperty("--font-color", "black");
      root.style.setProperty("--font-color-1", "black");
      root.style.setProperty("--secondary-font-color", "#464646");
      root.style.setProperty("--modal-color", "#bbbbbb");
      root.style.setProperty("--hover-color-1", "#c3c3c3");
      root.style.setProperty("--hover-color-2", "#d2d2d2");
      root.style.setProperty("--btn-bg-color", "#959595");
    }
  }, [displayMode]);
  return (
    <div className="App">
      <AppRouter />
    </div>
  );
};

export default App;
