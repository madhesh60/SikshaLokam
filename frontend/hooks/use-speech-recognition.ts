import { useState, useEffect, useCallback, useRef } from 'react';

export interface UseSpeechRecognitionProps {
  onResult?: (transcript: string) => void;
  lang?: string;
}

export const useSpeechRecognition = ({ onResult, lang = 'en-IN' }: UseSpeechRecognitionProps = {}) => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const onResultRef = useRef(onResult);

  // Keep the latest onResult callback in a ref to avoid re-triggering the effect
  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  useEffect(() => {
    // Check browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true; // Continuous for better dictation flow
      recognition.interimResults = true; // Real-time results

      // Default to user's language or browser default
      recognition.lang = lang || 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        // If "no-speech" error, we usually just want to stop listening without a scary error
        if (event.error === 'no-speech') {
          setIsListening(false);
          return;
        }

        let errorMessage = event.error;
        if (event.error === 'network') {
          errorMessage = 'Network error: Check internet connection.';
        } else if (event.error === 'not-allowed') {
          errorMessage = 'Microphone blocked. Allow access.';
        } else if (event.error === 'aborted') {
          // Created by manual stop or updates, ignore
          setIsListening(false);
          return;
        }

        setError(errorMessage);
        setIsListening(false);
        console.error('Speech recognition error:', event.error);
      };

      recognition.onresult = (event: any) => {
        let finalTranscript = '';

        // Iterate through all results to build the full transcript for this session
        for (let i = 0; i < event.results.length; i++) {
          finalTranscript += event.results[i][0].transcript;
        }

        if (onResultRef.current) {
          onResultRef.current(finalTranscript);
        }
      };

      recognitionRef.current = recognition;

      // Cleanup
      return () => {
        if (recognition) {
          recognition.abort();
        }
      };
    } else {
      setError("Browser not supported");
    }
  }, [lang]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      setError('Browser does not support Speech Recognition.');
      return;
    }

    // If instance exists but not listening, start
    // Note: checking isListening state might be delayed, so rely on try-catch as well
    try {
      recognitionRef.current.start();
    } catch (e) {
      // "Failed to execute 'start' on 'SpeechRecognition': recognition has already started."
      console.error("Speech recognition start error", e);
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.error("Speech recognition stop error", e);
      }
    }
  }, []);

  return {
    isListening,
    error,
    startListening,
    stopListening,
    hasSupport: typeof window !== 'undefined' && !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)
  };
};
