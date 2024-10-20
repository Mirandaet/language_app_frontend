import React, { useState, useRef, useEffect } from 'react';
import LanguagesStore from '../store/LanguagesStore';
import TtsStore from '../store/TtsStore';
import AudioStore from '../store/AudioStore';

const TextToSpeech = ({ text, responseText }) => {
  const { language } = LanguagesStore();
  const { synthesizeSpeech } = TtsStore();
  const { audioURLs, addAudioURL } = AudioStore();
  const [ttsText, setTtsText] = useState(text || '');
  const [ttsAudioURL, setTtsAudioURL] = useState('');
  const audioRef = useRef(null);
  const lastProcessedResponseRef = useRef('');

  useEffect(() => {
    const ttsFunction = async () => {
      try {
        // Only process if it's a new response
        if (responseText && responseText !== lastProcessedResponseRef.current) {
          setTtsText(responseText);
          const audioURL = await synthesizeSpeech(responseText, language);
          if (audioURL) {
            setTtsAudioURL(audioURL);
            addAudioURL([...audioURLs, audioURL]);
          }
          lastProcessedResponseRef.current = responseText;
        }
      } catch (error) {
        console.error('Error during TTS synthesis:', error);
      }
    };

    if (responseText) {
      ttsFunction();
    }
  }, [responseText, synthesizeSpeech, language]);

  useEffect(() => {
    if (ttsAudioURL && audioRef.current) {
      audioRef.current.src = ttsAudioURL;
      audioRef.current.play().catch((error) => {
        console.error('Error playing audio:', error);
      });
    }
  }, [ttsAudioURL]);

  const handleButtonClick = async () => {
    try {
      const audioURL = await synthesizeSpeech(ttsText, language);
      if (audioURL) {
        setTtsAudioURL(audioURL);
      }
    } catch (error) {
      console.error('Error synthesizing speech:', error);
    }
  };

  return (
    <div className="flex items-center">
      <button onClick={handleButtonClick}></button>
      <audio className="rounded-lg w-12" ref={audioRef} controls></audio>
    </div>
  );
};

export default TextToSpeech;