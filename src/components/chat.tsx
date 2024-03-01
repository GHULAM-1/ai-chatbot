"use client";
import axios from "axios";
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

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    append,
    isLoading,
  } = useChat({
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

  const splitIntoSentences = (text: string) => {
    return text.match(/[^\.!\?]+[\.!\?]+/g) || [];
  };

  const speakLangElevenlabs = async (text: string) => {
    const sentences = splitIntoSentences(text);

    for (const sentence of sentences) {
      const startAudioTime = Date.now();
      try {
        const response = await axios.post(
          "https://api.elevenlabs.io/v1/text-to-speech/iP95p4xoKVk53GoZ742B/stream?optimize_streaming_latency=4&output_format=mp3_22050_32",
          {
            model_id: "eleven_multilingual_v2",
            voice_settings: {
              stability: 0.8,
              use_speaker_boost: true,
              similarity_boost: 0.7,
            },
            text: sentence,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "xi-api-key": "3078bef05b30dd40b66b2198223697aa",
            },
            responseType: "arraybuffer",
          }
        );

        const blob = new Blob([response.data], { type: "audio/mp3" });
        const audio = new Audio();
        audio.src = URL.createObjectURL(blob);

        // Warten, bis die Audio-Wiedergabe beendet ist
        await new Promise((resolve) => {
          audio.onended = resolve;
          audio.onplay = () => {
            console.log(
              "Dauer bis zum Abspielen des Audios:",
              Date.now() - startAudioTime,
              "ms"
            );
          };
          audio.play();
        });
      } catch (error) {
        console.error("Error occurred while fetching audio:", error);
      }
    }
  };

  const assistantSpeak = (content: string, role: string) => {
    console.log("in the game", content, role);
    if (role !== "user") {
      speakLangElevenlabs(content);
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
      <div className="mt-4 h-[63vh] mb-4  justify-center items-center w-full overflow-y-auto p-4">
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

      <div className="flex gap-4 items-center flex-col justify-center w-full">
        {hasRecognitionSupport ? (
          <>
            {!isLoading ? (
              <div
                className={`${
                  isLoading ? "flex" : "hidden"
                } font-bold text-gray-500 opacity-70 -tracking-tight`}
              >
                Thinking
              </div>
            ) : null}
            <button
              className={`bg-[#2d47fe] mb-4 rounded-full w-[70px] h-[70px] flex justify-center items-center ${
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
