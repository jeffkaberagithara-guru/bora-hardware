"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Route announcer.
 *
 * A client-side navigation changes the document silently: focus stays where it
 * was, the screen reader hears nothing, and a reader who was mid-page has no
 * idea the page under them is now a different one. This repeats the new
 * document title into a polite live region after every route change, which is
 * the announcement the browser itself would have made on a full page load.
 *
 * It stays silent on first paint — the reader already has the page they
 * arrived on.
 */
export function RouteAnnouncer() {
  const pathname = usePathname();
  const [message, setMessage] = useState("");
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    // Clear first: a live region whose text does not change does not announce,
    // and two routes can legitimately share a title.
    setMessage("");
    const announce = setTimeout(() => setMessage(document.title), 150);
    return () => clearTimeout(announce);
  }, [pathname]);

  return (
    <div role="status" aria-live="polite" className="sr-only">
      {message}
    </div>
  );
}
