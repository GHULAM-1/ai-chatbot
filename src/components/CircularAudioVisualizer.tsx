import React, { useEffect, useRef } from "react";

interface CircularAudioVisualizerProps {
  mediaRecorder: MediaRecorder;
}

const CircularAudioVisualizer: React.FC<CircularAudioVisualizerProps> = ({
  mediaRecorder,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const audioContext = new (window.AudioContext || window.AudioContext)();
    const analyser = audioContext.createAnalyser();

    
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const source = audioContext.createMediaStreamSource(
      mediaRecorder.stream as MediaStream
    );
    source.connect(analyser);

    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      dataArray.forEach((item, index) => {
        const hue = (index / bufferLength) * 360;
        ctx.strokeStyle = `hsla(${hue}, 100%, 50%, 1)`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, item, 0, 2 * Math.PI);
        ctx.stroke();
      });

      requestAnimationFrame(draw);
    };

    draw();

    return () => {
      audioContext.close();
    };
  }, [mediaRecorder]);
  return (
    <>
      <svg className="round" id="Mic2" height="400px" width="400px">
        <path
          style={{ stroke: "url(#rgrad)", strokeWidth: "2px", fill: "none" }}
        />
      </svg>
    </>
  );
};

export default CircularAudioVisualizer;

// return <canvas className="circular-visualizer h-20" ref={canvasRef} />;
