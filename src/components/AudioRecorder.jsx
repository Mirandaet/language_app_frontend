import React, { useState, useRef, useEffect } from "react";
import AudioStore from "../store/AudioStore";
import LanguagesStore from "../store/LanguagesStore";

function AudioRecorder({ setTranscription }) {
  const { addAudioURL } = AudioStore();
  const { language } = LanguagesStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const silenceTimerRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  
  const silenceDuration = 1000; // 2 seconds of silence before stopping the recording
  const speechThreshold = 13; 

  useEffect(() => {
    console.log("Language changed:", language);
    stopMonitoring();
    startMonitoring();
    
    return () => {
      stopMonitoring();
    };
  }, [language]);

  const startMonitoring = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;

      source.connect(analyser);
      analyserRef.current = analyser;

      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm; codecs=opus' });
      monitorAudioLevels();
      setMessage("Listening for speech...");
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setError("Failed to access the microphone. Please check permissions.");
    }
  };

  const stopMonitoring = () => {
    if (mediaRecorderRef.current) {
      if (mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    resetSilenceTimer();
    setMessage(null);
  };

  const monitorAudioLevels = () => {
    const analyser = analyserRef.current;
    const dataArray = new Uint8Array(analyser.fftSize);

    const checkForSpeech = () => {
      analyser.getByteFrequencyData(dataArray);

      const averageVolume = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;

      if (averageVolume > speechThreshold) {
        if (mediaRecorderRef.current?.state === "inactive") {
          startRecording();
        }
        resetSilenceTimer();
      } else if (mediaRecorderRef.current?.state === "recording" && averageVolume <= speechThreshold) {
        startSilenceTimer();
      }

      requestAnimationFrame(checkForSpeech);
    };

    checkForSpeech();
  };

  const startSilenceTimer = () => {
    if (!silenceTimerRef.current) {
      silenceTimerRef.current = setTimeout(() => {
        stopRecording();
      }, silenceDuration);
    }
  };

  const resetSilenceTimer = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  };

  const startRecording = () => {
    if (mediaRecorderRef.current?.state !== "inactive") return;

    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm; codecs=opus' });
      const audioUrl = URL.createObjectURL(audioBlob);
      addAudioURL(audioUrl);
      audioChunksRef.current = [];
      transcribeAudio(audioBlob);
    };

    mediaRecorderRef.current.start();
    setMessage("Recording...");
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      setMessage("Processing audio...");
      resetSilenceTimer();
    }
  };

  const transcribeAudio = async (audioBlob) => {
    setIsProcessing(true);
    setMessage("Transcribing audio...");

    try {
      const formData = new FormData();
      formData.append("file", audioBlob, "recording.webm");
      formData.append("language", language);

      const response = await fetch("http://127.0.0.1:8000/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setTranscription(result);
      setMessage("Transcription completed successfully.");

      startMonitoring();
      
    } catch (err) {
      console.error("Error transcribing audio:", err);
      setError("Failed to transcribe audio. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClick = () => {
    if (isProcessing || message === "Transcription completed successfully.") {
      return;
    }

    if (mediaRecorderRef.current?.state === "recording") {
      stopRecording();
    } else {
      startMonitoring();
    }
  };

  return (
    <div className="audio-recorder">
      <button
        className={`record-button ${mediaRecorderRef.current?.state === "recording" ? 'recording' : ''}`}
        onClick={handleClick}
        disabled={isProcessing || !!error}
      >
        {mediaRecorderRef.current?.state === "recording" ? "Stop Recording" : "Start Listening"}
      </button>
      {error && <p className="error-message">{error}</p>}
      {message && <p className="info-message">{message}</p>}
      {isProcessing && <p className="processing-message">Processing audio...</p>}
    </div>
  );
}

export default AudioRecorder;