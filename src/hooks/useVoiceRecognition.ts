"use client";
import { useState, useEffect } from "react";

let recognition: any = null;
if (typeof window !== "undefined") {
  if ("webkitSpeechRecognition" in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "de";
    // recognition.interimResults = false;
    // recognition.maxAlternatives = 1;
  }
}
const useVoiceRecognition = () => {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  useEffect(() => {
    if (!recognition) return;
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      console.log("onresult event: ", event);
      setText(event.results[0][0].transcript);
      recognition.stop();
      setIsListening(false);
    };
  }, []);
  const startListening = () => {
    setText("");
    setIsListening(true);
    recognition.start();
  };

  const stopListening = () => {
    setIsListening(false);
    recognition.stop();
  };
  return {
    text,
    isListening,
    startListening,
    stopListening,
    hasRecognitionSupport: !!recognition,
  };
};

export default useVoiceRecognition;
