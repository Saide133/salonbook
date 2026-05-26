import { Mic, MicOff } from "lucide-react";
import useSpeech from "../hooks/useSpeech";

const MicButton = ({ onResult, append = true, currentValue = "" }) => {
  const handleResult = (text) => {
    if (append && currentValue) {
      onResult(currentValue + " " + text);
    } else {
      onResult(text);
    }
  };

  const { listening, startListening, stopListening } = useSpeech(handleResult);

  return (
    <button
      type="button"
      className={`mic-btn ${listening ? "mic-btn-active" : ""}`}
      onClick={listening ? stopListening : startListening}
      title={listening ? "Detener dictado" : "Dictar por voz"}
    >
      {listening ? <MicOff size={14} /> : <Mic size={14} />}
    </button>
  );
};

export default MicButton;