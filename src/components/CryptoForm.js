import React, { useState } from "react";
import "../styles/CryptoForm.css";
import { Dropdown } from "primereact/dropdown";

const CryptoForm = () => {
  const [selectedCity, setSelectedCity] = useState(null);
  const cities = [
    { name: "New York", code: "NY" },
    { name: "Rome", code: "RM" },
    { name: "London", code: "LDN" },
    { name: "Istanbul", code: "IST" },
    { name: "Paris", code: "PRS" },
  ];

  return (
    <div className="form-container">
      <h2 className="header-text">Currency Converter</h2>
      <div className="card flex justify-content-center form-items">
        <label className="crypto-label">Select a Crypto</label>
        <br />
        <Dropdown
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.value)}
          options={cities}
          optionLabel="name"
          editable
          placeholder="Example: Bitcoin"
          id="crypto"
          className="w-full md:w-14rem crypto-inputbox"
        />
      </div>
      <div className="card flex justify-content-center form-items">
        <label className="currency-label">Select a Currency</label>
        <br />
        <Dropdown
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.value)}
          options={cities}
          optionLabel="name"
          editable
          placeholder="Example: USD"
          id="crypto"
          className="w-full md:w-14rem currnecy-input"
        />
      </div>
      <div className="form-items">
        <label htmlFor="amount" className="currency-label">
          Amount to Convert
        </label>
        <input
          type="text"
          id="amount"
          className="amount-input"
          placeholder="Example: 100"
        />
      </div>
      <div className="btn-Container">
        <button className="btn-submit">Submit</button>
      </div>
    </div>
  );
};

export default CryptoForm;
