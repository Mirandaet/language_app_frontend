import React, { useState, useRef, useEffect } from "react";
import AudioStore from "../store/AudioStore";

function AudioRecorder({ setTranscription }) {
  const {audioURLs, setAudioURLs} = AudioStore();
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };
    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioURLs([...audioURLs, audioUrl]);
      audioChunksRef.current = [];

      // Transcribe the audio
      transcribeAudio(audioBlob);
    };
    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const transcribeAudio = async (audioBlob) => {
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.wav");

    const response = await fetch("http://127.0.0.1:8000/transcribe", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    setTranscription(result[0]);
  };

  return (
    <div>
      <button
        className={`py-2 mt-2 rounded-lg bg-blue-600 px-4 hover:bg-blue-700 dark:hover:bg-gray-600 cursor-pointer text-white ${
            isRecording ? "bg-blue-200 hover:bg-blue-300 text-white" : ""
        }`}
        onClick={isRecording ? stopRecording : startRecording}
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
    </div>
  );
}

export default AudioRecorder;
