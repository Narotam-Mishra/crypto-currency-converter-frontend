import React, { useState, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import axios from "axios";
import "primeflex/primeflex.css";
import "../styles/DropDown.css";

// locally available crypto currencies
const local_crypto_currencies = [
  { id: "bitcoin", name: "Bitcoin" },
  { id: "ethereum", name: "Ethereum" },
  { id: "tether", name: "Tether" },
  { id: "binancecoin", name: "BNB" },
  { id: "solana", name: "Solana" },
  { id: "ripple", name: "XRP" },
  { id: "usd-coin", name: "USDC" },
  { id: "cardano", name: "Cardano" },
  { id: "dogecoin", name: "Dogecoin" },
  { id: "polkadot", name: "Polkadot" }
];

function CryptoFormComp() {
  const [value, setValue] = useState("");
  const [cryptosList, setCryptosList] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [supportedCurrencies, setSupportedCurrencies] = useState([]);
  const [currencies, setCurrencies] = useState("usd");
  const [error, setError] = useState(null);
  const [convertedAmount, setConvertedAmount] = useState(null);
  
  const getCryptoList = async () => {
    try {
      const response = await axios.get(
        "https://api.coingecko.com/api/v3/coins/list"
      );
      
      const cryptoNames = response.data
        .slice(0, 100)
        .map((item) => ({ label: item.name, value: item.name }));
      // console.log("response",cryptoNames);

      const localCryptoNames = local_crypto_currencies.map((crypto) => ({
        label: crypto.name,
        value: crypto.id,
      }));
      setCryptosList([...localCryptoNames, ...cryptoNames]);
    } catch (error) {
      console.error(error);

       // If fetching from API fails, set local crypto currencies as a fallback
       const localCryptoNames = local_crypto_currencies.map((crypto) => ({
        label: crypto.name,
        value: crypto.id,
      }));
  
      setCryptosList(localCryptoNames);
    }
  };

  const fetchSupportedCurrencies = async () => {
    try {
      const response = await axios.get(
        "https://api.coingecko.com/api/v3/simple/supported_vs_currencies"
      );
      const currencies = response.data.map((currency) => ({
        label: currency,
        value: currency,
      }));
      setSupportedCurrencies(currencies);
    } catch (error) {
      console.error('Error fetching supported currencies:', error);
    }
  };

  // calling getCryptoList & fetchSupportedCurrencies functions under useEffect 
  // as we are making APIs calls
  useEffect(() => {
     getCryptoList();
     fetchSupportedCurrencies();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();

    // if all required fields is not present then show erorr on UI
    if (!selectedCrypto || !value || !currencies) {
      setError("Please select all fields");
    }

    try {
      // call to backend APIs to convert crypto currency amount
      const response = await axios.get('https://crypto-currency-converter-naru.onrender.com/crypto-api/v1/convert', {
        params: {
          sourceCrypto: selectedCrypto,  // Use selectedCrypto 
          amount: value,                 // Use value for amount
          targetCurrency: currencies,    // Use currencies for target currencies
        },
      });

      const statusCode = response.status;
      const responseData = response.data;

      // Handle different status codes error
      if (statusCode === 200) {
        setConvertedAmount(responseData.convertedAmount);
        setError(null);
      } else if(statusCode === 400){
        setError("Invalid exchange rate. Please try using differnt currency combination.");
        setConvertedAmount(null);
      }else if(statusCode === 500){
        setError("Internal Server Error");
        setConvertedAmount(null);
      }else if (statusCode === 429) {
        setError("Too many requests. Please try again later.");
        setConvertedAmount(null);
      } else {
        setError("Error converting currency. Please try again.");
        setConvertedAmount(null);
      }
    } catch (error) {
      console.error(error);
      setError(error.message);
      setConvertedAmount(null);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1 className="heading">CRYPTO CURRENCY CONVERTER</h1>
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
            options={cryptosList}
            // optionLabel="name"
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
            // optionLabel="name"
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

export default CryptoFormComp;
