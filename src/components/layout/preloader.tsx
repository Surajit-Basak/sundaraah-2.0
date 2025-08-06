
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getSettings } from "@/lib/data";
import type { Settings } from "@/types";
import { cn } from "@/lib/utils";

export function Preloader({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      const fetchedSettings = await getSettings();
      setSettings(fetchedSettings);
      // If preloader is disabled, or no logo, don't show it.
      if (!fetchedSettings.preloader_enabled || !fetchedSettings.header_logo_url) {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);
  
  useEffect(() => {
    if (settings) {
        // Minimum display time for the preloader
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000); 

        return () => clearTimeout(timer);
    }
  }, [settings])


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
          width={250} 
          height={80} 
          className="animate-pulse"
        />
      </div>
      {children}
    </>
  );
}
