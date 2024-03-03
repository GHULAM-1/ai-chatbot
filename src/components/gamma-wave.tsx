"use client";
import React, { useEffect } from "react";
import { polarPath } from "@/./app/waveform-path";

interface CircularAudioVisualizerProps {
  mediaRecorder: MediaRecorder;
}

export default function GammaWave({
  mediaRecorder,
}: CircularAudioVisualizerProps) {
  useEffect(() => {
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    console.log(bufferLength);
    const dataArray = new Uint8Array(bufferLength);
    console.log("yahan", dataArray);

    const source = audioContext.createMediaStreamSource(
      mediaRecorder.stream as MediaStream
    );
    source.connect(analyser);

    const captureAudioData = () => {
      analyser.getByteFrequencyData(dataArray);
      alerterror(dataArray);
    };

    const intervalId = setInterval(captureAudioData, 100);

    return () => {
      clearInterval(intervalId);
      audioContext.close();
    };
  }, [mediaRecorder]);

  function alerterror(dataArray: Uint8Array) {
    const optionsMic2 = {
      samples: 90,
      type: "steps",
      left: 200,
      top: 200,
      distance: 100,
      length: 100,
      normalize: false,
      paths: [
        { d: "L", sdeg: 0, sr: 0, edeg: 0, er: 90 },
        {
          d: "A",
          sdeg: 0,
          sr: 90,
          edeg: 100,
          er: 90,
          rx: 5,
          ry: 5,
          angle: 100,
          arc: 1,
          sweep: 1,
        },
        { d: "L", sdeg: 100, sr: 90, edeg: 100, er: 0 },
      ],
    };
    const pathMic2 = polarPath(dataArray, optionsMic2);
    document.querySelector("#Mic2 path")?.setAttribute("d", pathMic2);
  }

  return (
    <>
      <svg className="round" id="Mic2" height="400px" width="400px">
        <path
          style={{ stroke: "url(#rgrad)", strokeWidth: "2px", fill: "none" }}
        />
      </svg>
    </>
  );
}
