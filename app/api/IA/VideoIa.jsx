"use client"

import React, { useRef, useState, useEffect } from "react";

const VideoCapture = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [screenshot, setScreenshot] = useState(null);
  const [prediction, setPrediction] = useState("");
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Erreur lors de l'accès à la caméra :", error);
      }
    };

    startCamera();
  }, []);

  useEffect(() => {
    let interval;

    if (isCapturing) {
      interval = setInterval(() => {
        captureAndSend();
      }, 3000); // Capture toutes les 3 secondes
    }

    return () => clearInterval(interval); // Nettoyage de l'intervalle lors du démontage ou de l'arrêt
  }, [isCapturing]);

  const captureAndSend = async () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (!canvas || !video) return;

    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL("image/png");
    setScreenshot(imageData);

    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append("file", blob, `capture_${Date.now()}.png`);

      try {
        const response = await fetch("http://192.168.1.158:8000/upload/", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        setPrediction((prev) => prev + (data.prediction || ""));
      } catch (error) {
        console.error("Erreur lors de l'envoi de l'image :", error);
      }
    }, "image/png");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Capture automatique des frames vidéo
      </h1>
      <div className="relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-80 h-60 border border-gray-300 rounded shadow-md"
        ></video>
        <canvas
          ref={canvasRef}
          width="640"
          height="480"
          className="hidden"
        ></canvas>
      </div>
      <div className="mt-4">
        <button
          onClick={() => setIsCapturing((prev) => !prev)}
          className={`px-4 py-2 font-semibold rounded shadow ${
            isCapturing ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
          } text-white`}
        >
          {isCapturing ? "Arrêter la capture" : "Commencer la capture"}
        </button>
      </div>
      {screenshot && (
        <img
          src={screenshot}
          alt="Screenshot"
          className="mt-4 border border-gray-300 rounded shadow-md"
        />
      )}
      {prediction && (
        <p className="mt-2 text-lg text-gray-800 font-medium">
          Prédiction : {prediction}
        </p>
      )}
    </div>
  );
};

export default VideoCapture;

