import React, { useState, useEffect, useRef } from "react";
import TextToSpeech from "./TextToSpeach";
import GenerateResponseStore from "../store/GenerateResponseStore";
import AudioStore from "../store/AudioStore";

function Message({
  message,
  index,}) {
  const { conversationHistory, setConversationHistory } = GenerateResponseStore();
  const {audioURLs} = AudioStore();
  const [isEditable, setIsEditable] = useState(false);
  const [inputValue, setInputValue] = useState(message["message"]);
  const textareaRef = useRef(null);
  const {responseText} = GenerateResponseStore();

  // Function to adjust textarea height based on content
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // Reset height to auto
      textarea.style.height = `${textarea.scrollHeight}px`; // Set height based on scroll height
    }
  };

  useEffect(() => {
    adjustTextareaHeight(); // Adjust height on component mount
  }, []);

  useEffect(() => {
    if (!isEditable) {
      adjustTextareaHeight(); // Adjust height when editing is toggled off
    }
  }, [isEditable]);

  const handleButtonClick = () => {
    if (isEditable) {
      const updatedHistory = [conversationHistory[0,index]];
      updatedHistory[index] = { ...message, message: inputValue };
      setConversationHistory(updatedHistory);
      console.log(conversationHistory)
    }
    setIsEditable(!isEditable);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    adjustTextareaHeight(); // Adjust height as user types
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
          rows={1} // Start with a single row
          style={{ minHeight: "2rem" }} // Minimum height
        />

        <div className="flex gap-4 justify-end w-full px-4">
          {message["role"] === "USER" ? (
            <audio
              className="rounded-lg w-12"
              src={audioURLs[index - Math.floor(index / 2)]}
              controls
            ></audio>
          ) : index === conversationHistory.length - 1 ? (
            <TextToSpeech
              text={message["message"]}
              responseText={responseText}
            />
          ) : (
            <TextToSpeech text={message["message"]} />
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
