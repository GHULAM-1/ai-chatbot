"use client";
import React, { useEffect, useState } from "react";
import "@/styles/style.css";
import {
  getAudioData,
  linearPath,
  polarPath,
} from "@/scripts/waveform-path.min.js";

const AudioVisualizer = () => {
  const element = document.getElementById("startmic");

  element?.addEventListener("click", startMic);

  function startMic() {
    navigator.getUserMedia({ audio: true }, gotStream, alerterror);
  }

  function gotStream(stream) {
    const context = new AudioContext();
    const source = context.createMediaStreamSource(stream);
    const processor = context.createScriptProcessor(2048, 1, 1);
    source.connect(processor);
    processor.connect(context.destination);

    processor.onaudioprocess = function (e) {
      const optionsMic1 = {
        samples: 100,
        type: "bars",
        top: 20,
        normalize: false,
        paths: [{ d: "V", sy: 0, x: 50, ey: 100 }],
      };
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
      const pathMic1 = linearPath(e.inputBuffer, optionsMic1);
      const pathMic2 = polarPath(e.inputBuffer, optionsMic2);
      document.querySelector("#Mic1 path").setAttribute("d", pathMic1);
      document.querySelector("#Mic2 path").setAttribute("d", pathMic2);
    };
  } // Empty dependency array ensures the effect runs only once after initial render

  return (
    <>
      <svg id="Mic1" height="140px" width="800px">
        <path
          style={{
            fill: "none",
            strokeWidth: "4px",
            strokeLinecap: "round",
            stroke: "url(#lgrad)",
          }}
        />
      </svg>

      <button id="startmic">Start</button>

      <svg className="round" id="Mic2" height="400px" width="400px">
        <path
          style={{ stroke: "url(#rgrad)", strokeWidth: "2px", fill: "none" }}
        />
      </svg>
    </>
  );
};

export default AudioVisualizer;
