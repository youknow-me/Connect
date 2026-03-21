import { useRef, useCallback } from "react";

/**
 * Debounced typing emitter.
 * Emits "typing" on keypress, then "stop_typing" after `delay` ms of silence.
 */
export function useTyping(sendTyping, delay = 1500) {
  const timerRef = useRef(null);
  const isTypingRef = useRef(false);

  const handleTyping = useCallback(() => {
    if (!isTypingRef.current) {
      sendTyping(true);
      isTypingRef.current = true;
    }
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      sendTyping(false);
      isTypingRef.current = false;
    }, delay);
  }, [sendTyping, delay]);

  const stopTyping = useCallback(() => {
    clearTimeout(timerRef.current);
    if (isTypingRef.current) {
      sendTyping(false);
      isTypingRef.current = false;
    }
  }, [sendTyping]);

  return { handleTyping, stopTyping };
}
