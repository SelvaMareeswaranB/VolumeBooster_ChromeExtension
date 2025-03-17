import { ChangeEvent, useEffect, useState } from "react";
import volumeUp from "./assets/highVolume.png";
import volumeDown from "./assets/lowVolume.png";
import "./App.css";

const App = () => {
  const [volume, setVolume] = useState<number>(10);
  const [status, setStatus] = useState<boolean>(true);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(event.target.value);
    setVolume(newVolume);
    sendAudioMessage({
      message: "audio status",
      status,
      volume: newVolume,
    });
  };

  function handleStatus() {
    setStatus((prev) => !prev);
    sendAudioMessage({
      message: "audio status",
      status: !status,
      volume,
    });
  }

  function sendAudioMessage(messageObj: Record<string, any>): void {
   chrome.runtime.sendMessage(messageObj)
  }

  useEffect(() => {
    sendAudioMessage({ message: "audio status", status, volume });
  }, []);

  return (
    <div className="wrapper">
      <div className="inputWrapper">
        <img src={volumeDown} alt="down volume" />
        <input
          type="range"
          value={volume}
          min={1}
          max={100}
          step={2}
          onChange={handleChange}
          className="rangeInput"
        />
        <img src={volumeUp} alt="up volume" />
      </div>
      <p>{volume}</p>
      <button onClick={handleStatus}>Turn {status ? "off" : "on"}</button>
    </div>
  );
};

export default App;
