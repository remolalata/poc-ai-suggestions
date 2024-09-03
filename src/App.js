import { AppProvider } from "./context/AppContext";

import Home from "./pages/Home";

import "./App.css";

function App() {
  return (
    <AppProvider>
      <Home/>
    </AppProvider>
  )
}

export default App;
