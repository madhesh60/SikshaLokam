import { useState, useEffect, useCallback, useRef } from 'react';

export interface UseSpeechRecognitionProps {
  onResult?: (transcript: string, isFinal: boolean) => void;
  onInterimResult?: (transcript: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
  autoRestart?: boolean;
  autoRestartDelay?: number;
}

export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
  timestamp: number;
}

export const useSpeechRecognition = ({
  onResult,
  onInterimResult,
  onStart,
  onEnd,
  onError,
  lang = 'en-IN',
  continuous = true,
  interimResults = true,
  maxAlternatives = 1,
  autoRestart = false,
  autoRestartDelay = 1000
}: UseSpeechRecognitionProps = {}) => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [results, setResults] = useState<SpeechRecognitionResult[]>([]);
  const [isSupported, setIsSupported] = useState(false);

  const recognitionRef = useRef<any>(null);
  const onResultRef = useRef(onResult);
  const onInterimResultRef = useRef(onInterimResult);
  const onStartRef = useRef(onStart);
  const onEndRef = useRef(onEnd);
  const onErrorRef = useRef(onError);
  const autoRestartTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shouldRestartRef = useRef(false);
  const isManualStopRef = useRef(false);

  // Keep the latest callbacks in refs
  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  useEffect(() => {
    onInterimResultRef.current = onInterimResult;
  }, [onInterimResult]);

  useEffect(() => {
    onStartRef.current = onStart;
  }, [onStart]);

  useEffect(() => {
    onEndRef.current = onEnd;
  }, [onEnd]);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  useEffect(() => {
    // Check browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      const errorMsg = 'Browser does not support Speech Recognition';
      setError(errorMsg);
      if (onErrorRef.current) {
        onErrorRef.current(errorMsg);
      }
      return;
    }

    setIsSupported(true);
    const recognition = new SpeechRecognition();

    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    recognition.lang = lang;
    recognition.maxAlternatives = maxAlternatives;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
      isManualStopRef.current = false;
      if (onStartRef.current) {
        onStartRef.current();
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      if (onEndRef.current) {
        onEndRef.current();
      }

      // Auto-restart logic
      if (autoRestart && shouldRestartRef.current && !isManualStopRef.current) {
        autoRestartTimeoutRef.current = setTimeout(() => {
          try {
            recognition.start();
          } catch (e) {
            console.error('Auto-restart failed:', e);
          }
        }, autoRestartDelay);
      }
    };

    recognition.onerror = (event: any) => {
      // Handle specific error cases
      if (event.error === 'no-speech') {
        setIsListening(false);
        return;
      }

      if (event.error === 'aborted') {
        setIsListening(false);
        return;
      }

      let errorMessage = event.error;

      switch (event.error) {
        case 'network':
          errorMessage = 'Network error: Check your internet connection';
          break;
        case 'not-allowed':
        case 'permission-denied':
          errorMessage = 'Microphone access denied. Please allow microphone permissions';
          break;
        case 'audio-capture':
          errorMessage = 'No microphone detected';
          break;
        case 'service-not-allowed':
          errorMessage = 'Speech recognition service not allowed';
          break;
      }

      setError(errorMessage);
      setIsListening(false);

      if (onErrorRef.current) {
        onErrorRef.current(errorMessage);
      }

      console.error('Speech recognition error:', event.error);
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interim = '';
      const newResults: SpeechRecognitionResult[] = [];

      // Process all results
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        const transcriptText = result[0].transcript;

        if (result.isFinal) {
          finalTranscript += transcriptText + ' ';
          newResults.push({
            transcript: transcriptText,
            confidence: result[0].confidence || 0,
            isFinal: true,
            timestamp: Date.now()
          });
        } else {
          interim += transcriptText;
        }
      }

      // Update state
      if (finalTranscript) {
        setTranscript(prev => prev + finalTranscript);
        setResults(prev => [...prev, ...newResults]);

        if (onResultRef.current) {
          onResultRef.current(finalTranscript.trim(), true);
        }
      }

      if (interim) {
        setInterimTranscript(interim);

        if (onInterimResultRef.current) {
          onInterimResultRef.current(interim);
        }
      }
    };

    recognitionRef.current = recognition;

    // Cleanup
    return () => {
      if (autoRestartTimeoutRef.current) {
        clearTimeout(autoRestartTimeoutRef.current);
      }
      if (recognition) {
        recognition.abort();
      }
    };
  }, [lang, continuous, interimResults, maxAlternatives, autoRestart, autoRestartDelay]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      const errorMsg = 'Speech recognition not initialized';
      setError(errorMsg);
      if (onErrorRef.current) {
        onErrorRef.current(errorMsg);
      }
      return;
    }

    if (isListening) {
      return;
    }

    try {
      shouldRestartRef.current = true;
      isManualStopRef.current = false;
      recognitionRef.current.start();
    } catch (e: any) {
      if (e.message && !e.message.includes('already started')) {
        console.error('Speech recognition start error:', e);
        const errorMsg = 'Failed to start speech recognition';
        setError(errorMsg);
        if (onErrorRef.current) {
          onErrorRef.current(errorMsg);
        }
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        shouldRestartRef.current = false;
        isManualStopRef.current = true;

        if (autoRestartTimeoutRef.current) {
          clearTimeout(autoRestartTimeoutRef.current);
        }

        recognitionRef.current.stop();
      } catch (e) {
        console.error('Speech recognition stop error:', e);
      }
    }
  }, []);

  const abortListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        shouldRestartRef.current = false;
        isManualStopRef.current = true;

        if (autoRestartTimeoutRef.current) {
          clearTimeout(autoRestartTimeoutRef.current);
        }

        recognitionRef.current.abort();
      } catch (e) {
        console.error('Speech recognition abort error:', e);
      }
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setResults([]);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isListening,
    isSupported,
    error,
    transcript,
    interimTranscript,
    results,
    startListening,
    stopListening,
    abortListening,
    resetTranscript,
    clearError,
    hasSupport: isSupported
  };
};