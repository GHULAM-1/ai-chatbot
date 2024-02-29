"use client";
import { useEffect, useState } from "react";
import useSpeechRecognition from "@/hooks/useSpeechRecognition";
import { useChat } from "ai/react";

export default function Sound() {
  const [res, setRes] = useState("");
  const {
    hasRecognitionSupport,
    isListening,
    startListening,
    stopListening,
    text,
  } = useSpeechRecognition();
  const { messages, append } = useChat();

  useEffect(() => {
    if (!isListening && text) {
      console.log("in the fetch req");
      const message = {
        role: "system",
        content: text,
      };

      // Perform fetch request here
      fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: [message] }), // Send the message in the request body
      })
        .then((response) => response.text())
        .then((data) => {
          // Handle the response data here
          console.log(data);
          setRes(data);
        })
        .catch((error) => {
          // Handle any errors here
          console.error("Error:", error);
        });
    }
    
  }, [isListening, text, append]);

  return (
    <>
      <div>
        {hasRecognitionSupport ? (
          <>
            <div>
              <button onClick={startListening}>start listening</button>
            </div>
            {isListening ? <div>browser is listening</div> : null}
            {text}
          </>
        ) : (
          <h1>no speech recognition device</h1>
        )}
      </div>
      <div>{res}</div>
    </>
  );
}
