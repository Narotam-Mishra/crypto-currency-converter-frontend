/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import "../styles/CryptoForm.css";
import axios from "axios";

const CryptoForm = () => {
  const [sourceCrypto, setSourceCrypto] = useState("");
  const [cryptosList, setCryptosList] = useState([]);
  const [amount, setAmount] = useState(0);
  const [targetCurrency, setTargetCurrency] = useState("usd");
  const [error, setError] = useState(null);
  const [convertedAmount, setConvertedAmount] = useState(null);

  const getCryptoList = async () => {
    try {
      const response = await axios.get(
        "https://api.coingecko.com/api/v3/coins/list"
      );
      setCryptosList(response.data);
      // setCryptosList(response);
    } catch (error) {
      console.error(error);
      setError("Error fetching cryptocurrencies");
    }
  };

  useEffect(() => {
    getCryptoList();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get('http://localhost:7171/crypto-api/v1/convert', {
        params: {
          sourceCrypto,
          amount,
          targetCurrency,
        },
      });

      setConvertedAmount(response.data.convertedAmount);
      setError(null);
    } catch (error) {
      console.error(error);
      setError('Error converting currency');
      setConvertedAmount(null);
    }
  };

  return (
    <div className="form-container">
      <h2 className="header-text">Crypto Currency Converter</h2>
      <form className="form-items" onSubmit={handleSubmit}>
        <div className="form-content">
          <label htmlFor="src-crypto" className="crypto-label">
            Source Cryptocurrency:
            <select
              value={sourceCrypto}
              onChange={(e) => setSourceCrypto(e.target.value)}
              className="crypto-dropdown"
            >
              <option value="">Select Crypto</option>
              {cryptosList.map((crypto) => (
                <option key={crypto.id} value={crypto.id}>
                  {crypto.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="form-content">
          <label className="label-text">
            Select target Currency:
            <select
              value={targetCurrency}
              onChange={(e) => setTargetCurrency(e.target.value)}
              className="target-currency"
            >
              <option value="usd">USD</option>
              <option value="eur">EUR</option>
              {/* we can add more currency options as needed */}
            </select>
          </label>
        </div>

        <div className="form-content">
          <label className="label-text">
            Enter required Amount:
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="amount-input"
              min="0"
              required
            />
          </label>
        </div>

        <div className="btn-Container">
          <button type="submit" className="btn-submit">
            Convert
          </button>
        </div>
      </form>

      {error && <p className="error-message">{error}</p>}

      {convertedAmount !== null && (
        <p className="converted-amount">
          Converted Amount: {convertedAmount} {targetCurrency.toUpperCase()}
        </p>
      )}
    </div>
  );
};

export default CryptoForm;
