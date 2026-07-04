import React, { useEffect, useState } from "react";
import { readLocal, writeLocal } from "../lib/storage";

export function useLocalStorageState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => readLocal(key, initial));
  useEffect(() => { writeLocal(key, value); }, [key, value]);
  return [value, setValue] as const;
}

