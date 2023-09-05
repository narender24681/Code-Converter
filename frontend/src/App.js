import React, { useState } from "react";
import MonacoEditor from "react-monaco-editor";
import axios from "axios";

import "./App.css";

function App() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("JavaScript");
  const [output, setOutput] = useState("");
  const [error, setError] = useState(null);
  console.log(output);

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleConvert = async () => {
    try {
      setError(null);
      const response = await axios.post("http://localhost:8080/api/convert", {
        code,
        language,
      });
      setOutput(response.data.result);
    } catch (error) {
      setError("Error converting code. Please try again.");
    }
  };

  const handleDebug = async () => {
    try {
      setError(null);
      const response = await axios.post("http://localhost:8080/api/debug", {
        code,
      });
      setOutput(response.data.debuggedCode);
    } catch (error) {
      setError("Error debugging code. Please try again.");
    }
  };

  const handleQuality = async () => {
    try {
      setError(null);
      const response = await axios.post("http://localhost:8080/api/quality", {
        code,
      });
      setOutput(response.data.qualitySummary);
    } catch (error) {
      setError("Error getting code quality summary. Please try again.");
    }
  };

  return (
    <div className="app-container">
      <div className="header">
        <div className="controls-container">
          <select className="language-select" value={language} onChange={handleLanguageChange}>
            <option value="">Select Language</option>
            <option defaultChecked value="JavaScript">JavaScript</option>
            <option value="Python">Python</option>
            <option value="Kotlin">Kotlin</option>
            <option value="Swift">Swift</option>
            <option value="Java">Java</option>
          </select>
          <div className="action-buttons">
            <button className="action-button" onClick={handleConvert}>
              Convert
            </button>
            <button className="action-button" onClick={handleDebug}>
              Debug
            </button>
            <button className="action-button" onClick={handleQuality}>
              Quality
            </button>
          </div>
        </div>
      </div>
      {error && <div className="error-message">{error}</div>}
      <div className="editor-container">
        <div className="editor">
          <MonacoEditor
            language={language}
            value={code}
            onChange={(value) => setCode(value)}
            height="400"
            options={{
              selectOnLineNumbers: true,
              roundedSelection: false,
              readOnly: false,
              cursorStyle: "line",
              automaticLayout: true,
            }}
          />
        </div>
        <div className="result-editor">
          {/* <h3>Output:</h3> */}
          <MonacoEditor
            language={language}
            value={output}
            height="400"
            options={{
              readOnly: true,
              cursorStyle: "line",
              automaticLayout: true,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
