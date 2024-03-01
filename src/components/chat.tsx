"use client";
import { useChat } from "ai/react";
import { Mic } from "lucide-react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

import { useEffect, useRef, useState } from "react";
import useVoiceRecognition from "@/hooks/useVoiceRecognition";
import LoadingIndicator from "./talkingWave";

export default function Chat() {
  const [key, setKey] = useState("df");

  const { messages, input, handleInputChange, handleSubmit, append } = useChat({
    onFinish: (messages) => assistantSpeak(messages.content, messages.role),
    body: {
      sessionId: key,
    },
  });

  const {
    hasRecognitionSupport,
    isListening,
    stopListening,
    startListening,
    text,
  } = useVoiceRecognition();

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const clientApiKey = localStorage.getItem("clientApiKey");

    console.log(clientApiKey, "from req");
    if (clientApiKey) {
      setKey(clientApiKey);
    }

    if (!isListening && text) {
      console.log(text);

      append({
        content: text,
        role: "user",
      });
    }
  }, [isListening, text]);

  const assistantSpeak = (content: string, role: string) => {
    if (role !== "user") {
      console.log("in the game", content, role);

      const speechSynthesis = window.speechSynthesis;

      const speech = new SpeechSynthesisUtterance(content);

      speech.lang = "de-DE";
      speechSynthesis.speak(speech);
    }
  };

  const handleListeningButton = () => {
    if (!localStorage.getItem("clientApiKey")) {
      alert("please ,  set api key first");
    } else {
      if (isListening) {
        stopListening();
      } else {
        startListening();
      }
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="mt-4 h-[70vh] justify-center items-center w-full overflow-y-auto p-4">
        {messages.map((m, index) => {
          return (
            <div
              key={index}
              className={`flex ${
                m.role === "user" ? "flex-row" : "flex-row-reverse"
              } w-full`}
            >
              <div
                className={`w-full max-w-[217px] ${
                  m.role === "user"
                    ? "bg-[#233AA9] text-[#F1FFFF]"
                    : "bg-[#182c55] text-[#F1FFFF]"
                } text-[14px] rounded-[2em] p-7`}
              >
                {m.content}
              </div>
            </div>
          );
        })}
      </div>

      <form ref={formRef} onSubmit={handleSubmit}>
        <input
          hidden
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border text-black border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
        <button type="submit" style={{ display: "none" }}></button>
      </form>

      <div className="flex gap-4 items-center justify-center w-full">
        {hasRecognitionSupport ? (
          <>
            <button
              className={`bg-[#2d47fe] rounded-full w-[70px] h-[70px] flex justify-center items-center ${
                isListening ? "hover:bg-red-600" : "hover:opacity-90"
              }`}
              onClick={handleListeningButton}
            >
              {isListening ? (
                <LoadingIndicator />
              ) : (
                <Mic strokeWidth={2} className="stroke-white"></Mic>
              )}
            </button>
          </>
        ) : (
          <h1>No speech recognition device</h1>
        )}
      </div>
    </div>
  );
}
