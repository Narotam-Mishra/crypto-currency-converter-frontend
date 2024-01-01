/* eslint-disable no-unused-vars */
import './App.css';

import CryptoForm from './components/CryptoForm';
import CryptoForm1 from "./components/CryptoForm1";
import "primereact/resources/themes/saga-blue/theme.css"; 
import "primereact/resources/primereact.min.css";
import "primeflex/primeflex.css";
import CryptoFormTest from './components/CryptoFormTest';
import DummyCryptoForm from './components/DummyCryptoForm';

function App() {
  return (
    <div className="App">
      <CryptoForm1 />
      {/* <CryptoFormTest /> */}
      {/* <DummyCryptoForm/> */}
    </div>
  );
}

export default App;
