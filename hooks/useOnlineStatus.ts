import React, { useEffect, useRef, useState } from "react";

export function useOnlineStatus() {
  const [online, setOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);
  // Показываем короткое подтверждение восстановления связи, а не просто
  // молча прячем баннер — иначе непонятно, синхронизировалось ли что-то.
  const [justReconnected, setJustReconnected] = useState(false);
  const wasOffline = useRef(false);
  useEffect(() => {
    const goOnline = () => {
      setOnline(true);
      if (wasOffline.current) {
        setJustReconnected(true);
        setTimeout(() => setJustReconnected(false), 2000);
      }
      wasOffline.current = false;
    };
    const goOffline = () => { setOnline(false); wasOffline.current = true; };
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => { window.removeEventListener("online", goOnline); window.removeEventListener("offline", goOffline); };
  }, []);
  return { online, justReconnected };
}

