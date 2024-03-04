"use client";
import axios from "axios";
import { useChat } from "ai/react";
import { Mic } from "lucide-react";

import { useEffect, useRef, useState } from "react";
import useVoiceRecognition from "@/hooks/useVoiceRecognition";
import TalkingWave from "./talkingWave";
import GammaWave2 from "./gamma-wave2/gamma-wave2";

export default function Chat() {
  const [key, setKey] = useState("df");
  const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false);

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
    setIsAssistantSpeaking(true);
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
    setIsAssistantSpeaking(false);
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

  const giveIcon = () => {
    if (isListening) {
      return (
        <svg
          className="absolute fill-white w-[24px] h-[24px]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 576 512"
        >
          <path d="M268.2 126.4C244.8 107.9 221.7 96 200 96c-7.8 0-22.7 3.4-42.7 12.1c-19.2 8.4-40.4 20.4-60.1 34.6C77.4 157 60.3 172.7 48.5 188C36.2 203.8 32 216 32 224c0 15.5 6.2 33.6 17.8 53.5C61.1 297.1 76 315.8 90 332c38 44 94 84 166 84h64c72 0 128-40 166-84c13.6-15.7 28.5-34.7 40-54.6c11.7-20.4 18-38.6 18-53.4c0-8-4.2-20.2-16.5-36c-11.9-15.3-29-31-48.7-45.3c-19.6-14.2-40.8-26.2-60.1-34.6C398.7 99.4 383.8 96 376 96c-21.7 0-44.8 11.9-68.2 30.4c-11.6 9.2-28.1 9.2-39.7 0zM510.2 352.9C468.8 400.9 404.7 448 320 448H256c-84.7 0-148.8-47.1-190.2-95.1C36.9 319.5 0 271 0 224C0 151.5 142.5 64 200 64c32.7 0 63 17.5 88 37.3C313 81.5 343.3 64 376 64c57.5 0 200 87.5 200 160c0 45.8-37.5 96.2-65.8 128.9zm-153.9-136c-11.6 3.6-44 13.1-68.3 13.1s-56.7-9.5-68.3-13.1c-2-.6-3.8-.9-5.4-.9c-38.1 .4-66.1 5.6-84.1 11.1c-4.7 1.4-8.5 2.9-11.7 4.2c.4 .4 .9 .9 1.3 1.3c7.5 7.4 19 16.9 34.3 26.4c30.5 18.8 75.6 37 133.9 37s103.4-18.2 133.9-37c15.3-9.4 26.8-19 34.3-26.4c.5-.5 .9-.9 1.3-1.3c-3.2-1.3-7.1-2.8-11.7-4.2c-18-5.5-46-10.7-84.1-11.1c-1.6 0-3.4 .2-5.4 .9zm5.7-32.9c40.7 .5 71.7 5.9 93.1 12.5c10.6 3.3 19.2 6.9 25.5 10.6c3.1 1.8 6.2 3.9 8.7 6.4c1.7 1.7 6.7 6.8 6.7 14.5c0 3.1-.9 5.5-1.3 6.6c-.5 1.3-1.1 2.5-1.6 3.4c-1 1.8-2.3 3.6-3.6 5.4c-2.7 3.5-6.4 7.7-11 12.2c-9.2 9-22.6 20-39.9 30.7C404 307.6 353.2 328 288 328s-116-20.4-150.7-41.8c-17.3-10.7-30.7-21.7-39.9-30.7c-4.6-4.5-8.3-8.6-11-12.1c-1.3-1.7-2.6-3.6-3.6-5.4c-.5-.9-1.1-2-1.6-3.4c-.4-1.1-1.3-3.5-1.3-6.6c0-7.8 5-12.9 6.7-14.5c2.5-2.5 5.6-4.6 8.7-6.4c6.3-3.7 14.9-7.3 25.5-10.6c21.4-6.6 52.4-12 93.1-12.5c5.4-.1 10.5 .8 15.3 2.3c12 3.8 40 11.7 58.8 11.7s46.7-7.9 58.8-11.7c4.7-1.5 9.9-2.4 15.3-2.3z" />
        </svg>
      );
    } else {
      if (isAssistantSpeaking) {
        return (
          <svg
            className="absolute fill-white w-[24px] h-[24px]"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
          >
            <path d="M352 192c0-88.4-71.6-160-160-160S32 103.6 32 192V368c0 61.9 50.1 112 112 112s112-50.1 112-112c0-16.4 8.2-32.2 22.5-41.4C322.8 298.1 352 248.5 352 192zm32 0c0 67.8-35.1 127.4-88.2 161.5c-4.9 3.2-7.8 8.6-7.8 14.5c0 79.5-64.5 144-144 144S0 447.5 0 368V192C0 86 86 0 192 0S384 86 384 192zm-272 0v6.3c0 10.7 5.3 20.7 14.2 26.6l8.9 5.9c15.5 10.4 24.9 27.8 24.9 46.5c0 16.6-7.4 32.3-20.1 42.9l-33.7 28c-6.8 5.7-16.9 4.7-22.5-2s-4.7-16.9 2-22.5l33.7-28c5.4-4.5 8.6-11.2 8.6-18.3c0-8-4-15.4-10.6-19.9l-8.9-5.9C90.7 239.7 80 219.7 80 198.3V192c0-61.9 50.1-112 112-112s112 50.1 112 112v16c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-44.2-35.8-80-80-80s-80 35.8-80 80z" />
          </svg>
        );
      }
      if (isLoading) {
        return (
          <svg
            className="absolute fill-white w-[24px] h-[24px]"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path d="M192 32h48V80v48H212.7c-6.2-14.1-20.3-24-36.7-24c-22.1 0-40 17.9-40 40s17.9 40 40 40c16.4 0 30.5-9.9 36.7-24H240V272H160 144v16 27.3c-14.1 6.2-24 20.3-24 36.7c0 22.1 17.9 40 40 40s40-17.9 40-40c0-16.4-9.9-30.5-24-36.7V304h64V432v48H192c-20.4 0-37.9-12.8-44.8-30.8L142.5 437l-12.9 2.2c-3.1 .5-6.3 .8-9.5 .8c-30.9 0-56-25.1-56-56c0-7.8 1.6-15.2 4.4-21.8l5.3-12.6-11.6-7.2C44 331 32 310.9 32 288c0-19.1 8.4-36.3 21.7-48.1l7.9-7-3.3-10c-1.5-4.7-2.4-9.7-2.4-15c0-20.4 12.8-38 30.9-44.9l12.5-4.8-2.5-13.2c-.6-3-.9-6-.9-9.2c0-22.4 15.4-41.3 36.2-46.5l11-2.8 1.1-11.3C146.5 51.1 167 32 192 32zm80 128h64v27.3c-14.1 6.2-24 20.3-24 36.7c0 22.1 17.9 40 40 40s40-17.9 40-40c0-16.4-9.9-30.5-24-36.7V144 128H352 272V80 32h48c25 0 45.5 19.1 47.8 43.4l1.1 11.3 11 2.8C400.6 94.7 416 113.6 416 136c0 3.1-.3 6.2-.9 9.2l-2.5 13.2 12.5 4.8C443.2 170 456 187.6 456 208c0 5.2-.8 10.3-2.4 15l-3.3 10 7.9 7C471.6 251.7 480 268.9 480 288c0 22.9-12 43-30.2 54.3l-11.6 7.2 5.3 12.6c2.8 6.7 4.4 14.1 4.4 21.8c0 30.9-25.1 56-56 56c-3.3 0-6.5-.3-9.5-.8L369.5 437l-4.7 12.2c-6.9 18-24.4 30.8-44.8 30.8H272V432 384h59.3c6.2 14.1 20.3 24 36.7 24c22.1 0 40-17.9 40-40s-17.9-40-40-40c-16.4 0-30.5 9.9-36.7 24H272V160zM192 512h48 16 16 48c29.6 0 55.5-16.1 69.3-40c.9 0 1.8 0 2.7 0c48.6 0 88-39.4 88-88c0-7.6-1-15-2.8-22c21.2-17.6 34.8-44.2 34.8-74c0-25.1-9.6-48-25.4-65c.9-4.9 1.4-9.9 1.4-15c0-29.6-16.1-55.5-40-69.3c0-.9 0-1.8 0-2.7c0-33.6-20.7-62.4-50.1-74.2C389.7 26.4 357.9 0 320 0H272 256 240 192c-37.9 0-69.7 26.4-77.9 61.8C84.7 73.6 64 102.4 64 136c0 .9 0 1.8 0 2.7C40.1 152.5 24 178.4 24 208c0 5.1 .5 10.1 1.4 15C9.6 240 0 262.9 0 288c0 29.8 13.6 56.4 34.8 74C33 369 32 376.4 32 384c0 48.6 39.4 88 88 88c.9 0 1.8 0 2.7 0c13.8 23.9 39.7 40 69.3 40zM176 128a16 16 0 1 1 0 32 16 16 0 1 1 0-32zM160 336a16 16 0 1 1 0 32 16 16 0 1 1 0-32zM336 224a16 16 0 1 1 32 0 16 16 0 1 1 -32 0zm32 128a16 16 0 1 1 0 32 16 16 0 1 1 0-32z" />
          </svg>
        );
      }

      return (
        <svg
          className="absolute fill-white w-[24px] h-[24px]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 384 512"
        >
          <path d="M128 32H256V256c0 35.3-28.7 64-64 64s-64-28.7-64-64V32zM96 0V32 256c0 53 43 96 96 96s96-43 96-96V32 0H256 128 96zM64 208V192H32v16 48c0 83 63.1 151.2 144 159.2V480H112 96v32h16 80 80 16V480H272 208V415.2c80.9-8 144-76.2 144-159.2V208 192H320v16 48c0 70.7-57.3 128-128 128s-128-57.3-128-128V208z" />
        </svg>
      );
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="mt-4 h-[63vh] mb-4  justify-center items-center w-full overflow-y-auto p-4">
        {messages.map((m, index) => {
          return (
            <div
              key={index}
              className={`flex mb-4 ${
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
              disabled={isLoading || isAssistantSpeaking}
              className={`bg-[#2d47fe]  mb-4 rounded-full w-[70px] h-[70px] flex justify-center items-center relative ${
                isListening ? "hover:bg-red-600" : "hover:opacity-90"
              }`}
              onClick={handleListeningButton}
            >
              {isListening ? <TalkingWave></TalkingWave> : null}
              {giveIcon()}
            </button>
          </>
        ) : (
          <h1>No speech recognition device</h1>
        )}
      </div>
    </div>
  );
}
