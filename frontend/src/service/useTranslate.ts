"use client";
import { useEffect, useState } from "react";
import api from "@/service/apiService";

// debounce helper
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export function useTranslate(text: string, source: string, target: string) {
  const [translated, setTranslated] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedText = useDebounce(text, 500);

  useEffect(() => {
    if (!debouncedText.trim()) {
      setTranslated("");
      setError(null);
      return;
    }

    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await api.post("/translate", {
          text: debouncedText,
          source,
          target,
        });

        if (isMounted) setTranslated(res.data.translatedText);
      } catch (err: any) {
        if (isMounted) {
          setError(err?.response?.data?.message || "Error while translating");
          setTranslated("");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [debouncedText, source, target]);

  return { translated, loading, error };
}
