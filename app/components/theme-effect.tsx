"use client";

import { useEffect } from "react";
import { useUiStore } from "../lib/store/ui-store";

export function ThemeEffect() {
  const darkMode = useUiStore((s) => s.darkMode);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return null;
}
