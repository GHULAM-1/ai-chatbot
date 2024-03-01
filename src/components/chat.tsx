"use client";
import { useChat } from "ai/react";
import { useEffect, useRef, useState } from "react";
import useSpeechRecognition from "@/hooks/useSpeechRecognition";
import LoadingIndicator from "./talkingWave";

export default function Chat() {
  const [key, setKey] = useState("df");

  const { messages, input, handleInputChange, handleSubmit, append } = useChat({
    body: {
      sessionId: key,
    },
  });

  const { hasRecognitionSupport, isListening, startListening, text } =
    useSpeechRecognition();

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

  return (
    <div className="flex flex-col w-full">
      <div className="mt-4 h-[70vh] justify-center items-center w-full overflow-y-auto p-4">
        {messages.map((m, index) => (
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
        ))}
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
            {isListening && <LoadingIndicator />}
            <button
              className="bg-red-500 rounded py-2 px-4"
              onClick={startListening}
            >
              Start Listening
            </button>
            {/* {isListening && <div className="text-yellow-400">Listening...</div>} */}
          </>
        ) : (
          <h1>No speech recognition device</h1>
        )}
      </div>
    </div>
  );
}
