"use client";

import { useEffect } from "react";

export function useKeyboardShortcuts(shortcuts: Record<string, () => void>) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const key = [
        event.metaKey || event.ctrlKey ? "mod" : "",
        event.shiftKey ? "shift" : "",
        event.key.toLowerCase()
      ]
        .filter(Boolean)
        .join("+");

      const handler = shortcuts[key];
      if (handler) {
        event.preventDefault();
        handler();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [shortcuts]);
}
