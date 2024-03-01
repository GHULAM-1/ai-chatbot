"use client";
import { useState, useRef, useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
export default function GetKeyModal() {
  const [isApiKey, setApiKey] = useState(false);
  const keyInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const storedValue = localStorage.getItem("clientApiKey");
    if (storedValue) {
      setApiKey(true);
      if (keyInputRef.current) {
        keyInputRef.current.value = storedValue;
      }
    }
  }, []);

  const handleRemoveClick = () => {
    setApiKey(!isApiKey);
    const storedValue = localStorage.getItem("clientApiKey");
    if (storedValue) {
      if (keyInputRef.current) {
        localStorage.removeItem("clientApiKey");
        keyInputRef.current.value = "";
      }
    }
  };
  const handleSaveClick = () => {
    setApiKey(!isApiKey);
    const value = keyInputRef.current?.value;
    if (value) {
      localStorage.setItem("clientApiKey", value);
    }
  };

  return (
    <>
      <div className="shadow-lg flex flex-col gap-4">
        <div className="font-bold text-2xl">OpenAI API key</div>
        <div className="flex gap-2">
          <Input placeholder="API key" ref={keyInputRef}></Input>
          {isApiKey ? (
            <Button
              onClick={handleRemoveClick}
              className="bg-[#EF4444] hover:bg-[#EF4444]"
            >
              Remove
            </Button>
          ) : (
            <Button
              onClick={handleSaveClick}
              className="bg-[#4299E1] hover:bg-[#4299E1]"
            >
              Save
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
