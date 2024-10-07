import React, { useState, useRef } from "react";
import AudioStore from "../store/AudioStore";

function AudioRecorder({ setTranscription }) {
  const { addAudioURL } = AudioStore();
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("Audio stream created");
      
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      console.log("MediaRecorder created with mimeType:", mediaRecorderRef.current.mimeType);

      mediaRecorderRef.current.ondataavailable = (event) => {
        console.log("Data available event, data size:", event.data.size);
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        console.log("MediaRecorder stopped");
        setTimeout(() => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm;codecs=opus' });
          console.log("Audio Blob created, size:", audioBlob.size);
          const audioUrl = URL.createObjectURL(audioBlob);
          addAudioURL(audioUrl);
          audioChunksRef.current = [];
          transcribeAudio(audioBlob);
        }, 100);
      };

      mediaRecorderRef.current.start();
      console.log("MediaRecorder started");
      setIsRecording(true);
      setError(null);
      setMessage("Recording started...");
    } catch (err) {
      console.error("Error starting recording:", err);
      setError("Failed to start recording. Please check your microphone permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      console.log("MediaRecorder stop called");
      setIsRecording(false);
      setMessage("Processing audio...");
    }
  };

  const transcribeAudio = async (audioBlob, language = "EN") => {
    setIsProcessing(true);
    setError(null);
    setMessage("Transcribing audio...");
  
    try {
      const formData = new FormData();
      formData.append("file", audioBlob, "recording.webm");
      formData.append("language", language);
      
      console.log(`Sending audio for transcription in ${language}`);
      const response = await fetch("http://127.0.0.1:8000/transcribe", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log("Transcription result:", result);
  
      if (result) {
        setTranscription(result);
        setMessage("Transcription completed successfully.");
      } else {
        console.error("Unexpected transcription result structure:", result);
        setError("Failed to transcribe audio. Unexpected response format.");
      }
    } catch (err) {
      console.error("Error transcribing audio:", err);
      setError("Failed to transcribe audio. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="audio-recorder">
      <button
        className={`record-button ${isRecording ? 'recording' : ''}`}
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isProcessing || !!error}
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
      {error && <p className="error-message">{error}</p>}
      {message && <p className="info-message">{message}</p>}
      {isProcessing && <p className="processing-message">Processing audio...</p>}
    </div>
  );
}

export default AudioRecorder;