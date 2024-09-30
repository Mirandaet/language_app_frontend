import React from 'react'


function GenerateResponse() {

const generateResponse = async (audioBlob) => {
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.wav");

    const response = await fetch("http://127.0.0.1:8000/transcribe", {
        method: "POST",
        body: formData,
    });}

  return (
    <div></div>
  )
}

export default GenerateResponse