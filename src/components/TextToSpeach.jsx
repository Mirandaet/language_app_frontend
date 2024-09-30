import React, { useState, useRef, useEffect } from 'react';
import LanguagesStore from '../store/LanguagesStore';
import TtsStore from '../store/TtsStore';
import AudioStore from '../store/AudioStore';

const TextToSpeech = ({ text, responseText }) => {
  const { language } = LanguagesStore();
  const { synthesizeSpeech } = TtsStore();
  const {audioURLs, setAudioURLs} = AudioStore();
  const [ttsText, setTtsText] = useState(text || '');
  const [ttsAudioURL, setTtsAudioURL] = useState('');
  const audioRef = useRef(null);

  useEffect(() => {
    const ttsFunction = async () => {
      try {
        setTtsText(responseText);
        const audioURL = await synthesizeSpeech(responseText, language);
        if (audioURL) {
          setTtsAudioURL(audioURL);
          setAudioURLs([...audioURLs, audioURL]);
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