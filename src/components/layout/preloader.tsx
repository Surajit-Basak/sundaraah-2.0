
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { Settings } from "@/types";
import { cn } from "@/lib/utils";

export function Preloader({ children, settings }: { children: React.ReactNode, settings: Settings | null }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!settings || !settings.preloader_enabled || !settings.header_logo_url) {
      setLoading(false);
      return;
    }

    const timer = setTimeout(() => {
        setLoading(false);
    }, 1000); 

    return () => clearTimeout(timer);
  }, [settings]);

  if (!settings || !settings.preloader_enabled || !settings.header_logo_url) {
    return <>{children}</>;
  }

  return (
    <>
      <div 
        className={cn(
            "fixed inset-0 z-[200] flex items-center justify-center bg-background transition-opacity duration-500",
            loading ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <Image 
          src={settings.header_logo_url} 
          alt={`${settings.site_name} logo`} 
          width={300} 
          height={75} 
          className="animate-pulse object-contain h-16 w-auto"
          priority
        />
      </div>
      {children}
    </>
  );
}
