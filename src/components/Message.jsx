import React, { useState, useEffect, useRef } from "react";
import TextToSpeech from "./TextToSpeach";
import GenerateResponseStore from "../store/GenerateResponseStore";
import AudioStore from "../store/AudioStore";
import LanguagesStore from "../store/LanguagesStore"; // Import LanguagesStore

function Message({ message, index }) {
  const { conversationHistory, setConversationHistory } = GenerateResponseStore();
  const { audioURLs } = AudioStore();
  const { language } = LanguagesStore(); // Get current language
  const [isEditable, setIsEditable] = useState(false);
  const [inputValue, setInputValue] = useState(message["content"]);
  const textareaRef = useRef(null);
  const audioRef = useRef(null);
  const { responseText } = GenerateResponseStore();

  // Function to adjust textarea height based on content
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, []);

  useEffect(() => {
    if (!isEditable) {
      adjustTextareaHeight();
    }
  }, [isEditable]);

  // Effect to pause audio when language changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [language]);

  const handleButtonClick = () => {
    if (isEditable) {
      const updatedHistory = [...conversationHistory];
      updatedHistory[index] = { ...message, content: inputValue };
      setConversationHistory(updatedHistory);
    }
    setIsEditable(!isEditable);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    adjustTextareaHeight();
  };

  return (
    <div className="m-4 p-4 rounded-lg gap-4 items-center">
      <span className="py-2 px-4 bg-blue-200 rounded-t-lg">
        {message["role"]} :{" "}
      </span>
      <div className="p-2 flex flex-col items-start gap-4 bg-blue-200 rounded-b-lg rounded-tr-lg w-full">
        <textarea
          ref={textareaRef}
          value={inputValue}
          className="p-2 bg-blue-200 rounded-lg w-full resize-none overflow-hidden"
          onChange={handleInputChange}
          disabled={!isEditable}
          rows={1}
          style={{ minHeight: "2rem" }}
        />

        <div className="flex gap-4 justify-end w-full px-4">
          {message["role"] === "USER" ? (
            <audio
              ref={audioRef}
              className="rounded-lg w-12"
              src={audioURLs[index - Math.floor(index / 2)]}
              controls
            ></audio>
          ) : index === conversationHistory.length - 1 ? (
            <TextToSpeech
              text={message["content"]}
              responseText={responseText}
            />
          ) : (
            <TextToSpeech text={message["content"]} />
          )}
          <button onClick={handleButtonClick}>
            {isEditable ? "Submit" : "Edit"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Message;