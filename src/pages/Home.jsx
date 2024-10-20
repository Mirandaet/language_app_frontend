import React, { useEffect, useState } from "react";
import AudioRecorder from "../components/AudioRecorder";
import ChatDisplay from "../components/ChatDisplay";
import LanguageChanger from "../components/LanguageChanger";
import LanguagesStore from "../store/LanguagesStore";
import GenerateResponseStore from "../store/GenerateResponseStore";

function Home() {
  const [transcription, setTranscription] = useState("");
  // const [conversationHistory, setConversationHistory] = useState([]);
  const {languages, fetchLanguages, language, setLanguage} = LanguagesStore();
  const {generateResponse, conversationHistory, setConversationHistory, responseText} = GenerateResponseStore();
  useEffect(() => {
    if (transcription != "") {
      setConversationHistory([
        ...conversationHistory,
        { role: "USER", content: transcription },
      ]);
    }
  }, [transcription]);
  useEffect(() => {
    if (conversationHistory[conversationHistory.length - 1]) {
      if (
        conversationHistory[conversationHistory.length - 1]["role"] == "USER"
      ) {
        generateResponse(language);
      }
    }
  }, [conversationHistory]);

  // const generateResponse = async () => {

  //   const response = await fetch("http://127.0.0.1:8000/generate", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       chat_history: conversationHistory,
  //       language: language,
  //     }),
  //   });
  //   const result = await response.json();
  //   setConversationHistory([
  //     ...conversationHistory,
  //     { role: "AI", message: result },
  //   ]);
  //   setResponseText(result);
  // };

  return (
    <div className="container mx-auto flex flex-col justify-center items-center ">
      <LanguageChanger/>
      <ChatDisplay
        conversationHistory={conversationHistory}
        responseText={responseText}
        setConversationHistory={setConversationHistory}
      />
      <AudioRecorder
        setTranscription={setTranscription}
      />
    </div>
  );
}

export default Home;
