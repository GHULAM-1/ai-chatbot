"use client";
import { useChat } from "ai/react";
import { useEffect, useRef } from "react";
import useSpeechRecognition from "@/hooks/useSpeechRecognition";
export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, setInput, append } =
    useChat();
  const { hasRecognitionSupport, isListening, startListening, text } =
    useSpeechRecognition();

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!isListening && text) {
      console.log(text);
      append({
        content: text,
        role: "user",
      });
    }
  }, [isListening, text]);

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      <div className="flex gap-4  items-center">
        {hasRecognitionSupport ? (
          <>
            <div>
              <button
                className="bg-red-500 rounded py-2 px-4"
                onClick={startListening}
              >
                start listening
              </button>
            </div>
            {isListening ? (
              <div className="text-yellow-400"> listening ....</div>
            ) : null}
            {/* {text} */}
          </>
        ) : (
          <h1>no speech recognition device</h1>
        )}
      </div>

      <div className="mt-4">
        {messages.map((m) => (
          <div key={m.id} className="whitespace-pre-wrap mb-4">
            {m.role === "user" ? (
              <span className="text-white font-bold ">user : </span>
            ) : (
              <span className="text-green-500 font-bold">AI : </span>
            )}
            {m.content}
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
    </div>
  );
}
