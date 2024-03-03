import React, { useEffect, useState } from "react";
import CircularAudioVisualizer from "./CircularAudioVisualizer";
import GammaWave from "./gamma-wave";
import GammaWave2 from "./gamma-wave2/gamma-wave2";

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

  return <div>{<GammaWave2 />}</div>;
}

export default AV;
