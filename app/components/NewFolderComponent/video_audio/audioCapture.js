'use client';

import React, { useState, useRef } from 'react';

const AudioCapture = () => {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const mediaRecorderRef = useRef(null);

  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      let chunks = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        setAudioURL(URL.createObjectURL(audioBlob));
        chunks = [];
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setRecording(true);
    } catch (error) {
      console.error('Erreur lors de l’accès au micro:', error);
    }
  };

  const stopAudioRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const handleAudioRecording = () => {
    if (recording) {
      stopAudioRecording();
    } else {
      startAudioRecording();
    }
  };

  return (
    <div className="p-4 border-2 border-gray-400 rounded-lg shadow-lg bg-white">
      <button
        type="button"
        className={`p-2 rounded-lg ${recording ? 'bg-red-500' : 'bg-green-500'} text-white hover:opacity-80`}
        onClick={handleAudioRecording}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 inline-block mr-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"
          />
        </svg>
        {recording ? 'Arrêter' : 'Démarrer'} l'enregistrement audio
      </button>

      {audioURL && (
        <div className="mt-4">
          <audio controls src={audioURL} className="w-full" />
        </div>
      )}
    </div>
  );
};

export default AudioCapture;
