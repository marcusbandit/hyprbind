import { useEffect, useState } from "react";

export type KeyDef = { label: string; class?: string; code?: string };

export type LayoutData = {
  keyboard: KeyDef[][];
  nav: KeyDef[][];
  numpad: KeyDef[][];
};

/**
 * Hook to fetch and load a keyboard layout JSON by name.
 * @param layoutName - The name of the layout (e.g., "en-qwerty").
 * @returns The parsed LayoutData or null if loading/parse fails.
 */
export function useLayout(layoutName: string): LayoutData | null {
  const [layout, setLayout] = useState<LayoutData | null>(null);

  useEffect(() => {
    fetch(`/layouts/${layoutName}.json`)
      .then((res) => res.json())
      .then(setLayout)
      .catch(() => setLayout(null));
  }, [layoutName]);

  return layout;
} 