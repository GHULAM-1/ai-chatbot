import React, { useEffect, useState } from "react";
import CircularAudioVisualizer from "./CircularAudioVisualizer";

function AV() {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: false, audio: true })
      .then((stream) => {
        const recorder = new MediaRecorder(stream);
        recorder.start();
        setMediaRecorder(recorder);
      })
      .catch((err) => {
        console.error(`getUserMedia got an error: ${err}`);
      });
  }, []);

  return (
    <div>
      {mediaRecorder && (
        <CircularAudioVisualizer mediaRecorder={mediaRecorder} />
      )}
    </div>
  );
}

export default AV;
