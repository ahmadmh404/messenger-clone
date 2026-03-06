import React from "react";

export function SlimLoader() {
  return (
    <div className="fixed top-0 left-0 right-0 z-9999 pointer-events-none">
      {/* The background track (optional) */}
      <div className="h-0.75 w-full bg-sky-500/10 overflow-hidden">
        {/* The moving indicator */}
        <div className="h-full w-full bg-sky-500 shadow-[0_0_10px_#0284c7] animate-progress-bar origin-left transition-transform" />
      </div>

      {/* Optional: A subtle blur/glow effect under the bar */}
      <div className="h-8 w-full bg-linear-to-b from-sky-500/5 to-transparent" />
    </div>
  );
}
