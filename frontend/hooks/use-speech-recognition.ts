import { useState, useEffect, useCallback, useRef } from 'react';

export interface UseSpeechRecognitionProps {
  onResult?: (transcript: string) => void;
  lang?: string;
}

export const useSpeechRecognition = ({ onResult, lang = 'en-IN' }: UseSpeechRecognitionProps = {}) => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false; // Non-continuous as requested
      recognition.interimResults = false; // Final results only
      recognition.lang = lang;

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        let errorMessage = event.error;
        if (event.error === 'network') {
          errorMessage = 'Network error: speech recognition requires an internet connection.';
        } else if (event.error === 'not-allowed') {
          errorMessage = 'Microphone access denied. Please allow microphone access.';
        } else if (event.error === 'no-speech') {
          errorMessage = 'No speech detected. Please try again.';
        }

        setError(errorMessage);
        console.error('Speech recognition error', event.error);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (onResult) {
          onResult(transcript);
        }
      };

      recognitionRef.current = recognition;
    }
  }, [lang, onResult]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      setError('Browser does not support Speech Recognition.');
      return;
    }

    if (!isListening) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error("Speech recognition start error", e);
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  return {
    isListening,
    error,
    startListening,
    stopListening,
    hasSupport: typeof window !== 'undefined' && !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)
  };
};
