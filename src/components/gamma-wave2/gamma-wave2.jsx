"use client";
import React from "react";
import { getAudioData, linearPath, polarPath } from "./waveform-path.min.js";

export default function GammaWave2() {
  navigator.getUserMedia({ audio: true }, gotStream, alerterror);
  function gotStream(stream) {
    const context = new AudioContext();
    const source = context.createMediaStreamSource(stream);
    const processor = context.createScriptProcessor(2048, 1, 1);
    source.connect(processor);
    processor.connect(context.destination);

    processor.onaudioprocess = function (e) {
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

      const pathMic2 = polarPath(e.inputBuffer, optionsMic2);
      document?.querySelector("#Mic2 path").setAttribute("d", pathMic2);
    };
  }

  function alerterror() {
    alert("error");
  }
  return (
    <>
      <div className="wrapper">
        <div className="examples">
          <svg className="round" id="Mic2" height="400px" width="400px">
            <defs>
              <radialGradient id="rgrad" cx="50%" cy="50%" r="50%">
                <stop
                  offset="0%"
                  style={{ stopColor: "rgb(0, 255, 10)", stopOpacity: 1 }}
                />
                <stop
                  offset="25%"
                  style={{ stopColor: "rgb(0, 188, 212)", stopOpacity: 0.7 }}
                />
                <stop
                  offset="50%"
                  style={{ stopColor: "rgb(238, 130, 238)", stopOpacity: 1 }}
                />
                <stop
                  offset="75%"
                  style={{ stopColor: "rgb(103, 58, 183)", stopOpacity: 0.7 }}
                />
                <stop
                  offset="100%"
                  style={{ stopColor: "rgb(233, 30, 99)", stopOpacity: 1 }}
                />
              </radialGradient>
            </defs>
            <path
              style={{
                stroke: "url(#rgrad)",
                strokeWidth: "2px",
                fill: "none",
              }}
            />
          </svg>

      

          
        </div>
      </div>
    </>
  );
}
