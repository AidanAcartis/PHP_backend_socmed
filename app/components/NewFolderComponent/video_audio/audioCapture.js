import React, { useState, useRef } from 'react';

const AudioCapture = () => {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [wavURL, setWavURL] = useState(null);
  const audioRef = useRef(null);
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

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });

        // Convertir en .wav
        const wavBlob = await convertWebMToWav(audioBlob);
        const wavUrl = URL.createObjectURL(wavBlob);
        setWavURL(wavUrl);

        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
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

  const stopAudioPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;  // Reset the playback to the start
    }
    setAudioURL(null);  // Hide the audio player by resetting audioURL
  };

  // Fonction pour convertir un audio WebM en WAV
  const convertWebMToWav = async (blob) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const arrayBuffer = await blob.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    const wavData = audioBufferToWav(audioBuffer);

    return new Blob([wavData], { type: 'audio/wav' });
  };

  // Fonction pour convertir un AudioBuffer en WAV
  const audioBufferToWav = (buffer) => {
    const numOfChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1; // Format PCM
    const bitsPerSample = 16;
    const byteRate = sampleRate * numOfChannels * bitsPerSample / 8;
    const blockAlign = numOfChannels * bitsPerSample / 8;
    const dataLength = buffer.length * numOfChannels * bitsPerSample / 8;
    const bufferLength = 44 + dataLength;

    const wavArrayBuffer = new ArrayBuffer(bufferLength);
    const view = new DataView(wavArrayBuffer);

    // Write the "RIFF" identifier
    writeString(view, 0, 'RIFF');
    view.setUint32(4, bufferLength - 8, true);
    writeString(view, 8, 'WAVE');
    
    // Write the "fmt " chunk
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
    view.setUint16(20, format, true); // Audio format (1 for PCM)
    view.setUint16(22, numOfChannels, true); // Number of channels
    view.setUint32(24, sampleRate, true); // Sample rate
    view.setUint32(28, byteRate, true); // Byte rate
    view.setUint16(32, blockAlign, true); // Block align
    view.setUint16(34, bitsPerSample, true); // Bits per sample

    // Write the "data" chunk
    writeString(view, 36, 'data');
    view.setUint32(40, dataLength, true);

    // Write the audio data
    const channelData = [];
    for (let i = 0; i < numOfChannels; i++) {
      channelData[i] = buffer.getChannelData(i);
    }
    let offset = 44;
    for (let i = 0; i < buffer.length; i++) {
      for (let channel = 0; channel < numOfChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, channelData[channel][i]));
        view.setInt16(offset, sample * 0x7FFF, true);
        offset += 2;
      }
    }

    return wavArrayBuffer;
  };

  // Fonction pour écrire une chaîne de caractères dans un DataView
  const writeString = (view, offset, str) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
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
          <audio ref={audioRef} controls src={audioURL} className="w-full" />
          <button 
            onClick={stopAudioPlayback} 
            className="mt-2 p-2 bg-gray-500 text-white rounded-lg"
          >
            Arrêter l'audio
          </button>
          {wavURL && (
        <div className="mt-4">
          <a href={wavURL} download="audio.wav" className="text-blue-500">Télécharger en WAV</a>
        </div>
      )}
        </div>
        
      )}

    </div>
  );
};

export default AudioCapture;
