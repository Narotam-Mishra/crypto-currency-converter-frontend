import React, { useState, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import axios from "axios";
import "primeflex/primeflex.css";
import "../styles/DropDown.css";

function DummyCryptoForm() {
  const [value, setValue] = useState("");
  const [cryptosList, setCryptosList] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [supportedCurrencies, setSupportedCurrencies] = useState([]);
  const [currencies, setCurrencies] = useState("usd");
  const [error, setError] = useState(null);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [coinNames, setCoinNames] = useState([]);

  const fetchCryptoData = async () => {
    try {
      const [listResponse, currenciesResponse] = await Promise.all([
        axios.get("https://api.coingecko.com/api/v3/coins/list"),
        axios.get("https://api.coingecko.com/api/v3/simple/supported_vs_currencies"),
      ]);

      const cryptoNames = listResponse.data
        .slice(0, 100)
        .map((item) => ({ label: item.name, value: item.name }));

      setCryptosList(cryptoNames);

      const currencies = currenciesResponse.data.map((currency) => ({
        label: currency,
        value: currency,
      }));
      setSupportedCurrencies(currencies);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchCryptoCurrencyNames = async () => {
    // Check if coinNames has been fetched before making the call again
    if (coinNames.length === 0) {
      try {
        const response = await axios.get(
          "http://localhost:7171/crypto-api/v1/crpto-list"
        );

        const names = response.data.map((coin) => coin.name);
        console.log(names);
        setCoinNames(names);
        setError(null);
      } catch (error) {
        console.error("Error fetching coin names:", error);
        setError("Error fetching coin names");
        setCoinNames([]);
      }
    }
  };

  useEffect(() => {
    // Call the combined API fetching function
    fetchCryptoData();

    // Call the API fetching function for coin names
    fetchCryptoCurrencyNames();
  }, []);

  // Merge the cryptoNames from /coins/list and coinNames from /coins/markets
  const allCryptos = [...cryptosList, ...coinNames];

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get(
        "http://localhost:7171/crypto-api/v1/convert",
        {
          params: {
            sourceCrypto: selectedCrypto,
            amount: value,
            targetCurrency: currencies,
          },
        }
      );

      setConvertedAmount(response.data.convertedAmount);
      setError(null);
    } catch (error) {
      console.error(error);
      setError("Error converting currency");
      setConvertedAmount(null);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1 className="heading">CURRENCY CONVERTER</h1>
        <div className="dropdown-Con">
          <label
            htmlFor="amount"
            style={{ fontSize: "20px", fontWeight: "600" }}
          >
            Select any Crypto Currency
          </label>

          <Dropdown
            value={selectedCrypto}
            onChange={(e) => setSelectedCrypto(e.value)}
            options={allCryptos}
            placeholder="Select a Cryptocurrency"
            className="w-full md:w-35rem"
            style={{
              width: "60%",
              height: "7vh",
              padding: "7px",
              borderRadius: "7px",
              marginTop: "5px",
            }}
          />
        </div>
        <div className="dropdown-Con">
          <label
            htmlFor="amount"
            style={{ fontSize: "20px", fontWeight: "600" }}
          >
            Select Target Currency
          </label>
          <Dropdown
            value={currencies}
            onChange={(e) => setCurrencies(e.value)}
            options={supportedCurrencies}
            placeholder="Select a Currency"
            className="w-full md:w-35rem"
            style={{
              width: "60%",
              height: "7vh",
              padding: "7px",
              borderRadius: "7px",
              marginTop: "5px",
            }}
          />
        </div>
        <div className="dropdown-Con">
          <label
            htmlFor="amount"
            style={{ fontSize: "20px", fontWeight: "600" }}
          >
            Amount
          </label>
          <InputText
            type="number"
            min={"0"}
            value={value}
            onChange={(e) => setValue(Math.max(0, e.target.value))}
            style={{
              width: "100%",
              height: "7vh",
              padding: "5px",
              borderRadius: "7px",
              marginTop: "5px",
            }}
          />
        </div>
        <div className="convert-button">
          <Button
            onClick={submitHandler}
            label="CONVERT"
            style={{
              width: "180px",
              height: "40px",
              fontWeight: "600",
              fontSize: "18px",
            }}
          />
        </div>
        {error && <p className="error-message">{error}</p>}

        {convertedAmount !== null && (
          <p className="converted-amount">
            Converted Amount: {convertedAmount} {currencies.toUpperCase()}
          </p>
        )}
      </div>
    </div>
  );
}

export default DummyCryptoForm;
