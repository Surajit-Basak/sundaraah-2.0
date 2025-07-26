
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUp } from 'lucide-react';
import { WhatsappIcon } from '@/components/icons/WhatsappIcon';
import { cn } from '@/lib/utils';

const FloatingButtons = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [whatsappEnabled, setWhatsappEnabled] = useState(true); // Default to true
  const [whatsappNumber, setWhatsappNumber] = useState('1234567890'); // Placeholder

  useEffect(() => {
    setIsMounted(true);
    
    // In a real app, you would fetch these settings from a CMS or API
    // For now, we'll just use the default state values.

    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-4">
      {whatsappEnabled && whatsappNumber && (
         <Link 
            href={`https://wa.me/${whatsappNumber}`} 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-transform hover:scale-110"
        >
            <WhatsappIcon className="w-8 h-8"/>
        </Link>
      )}
      <button
        aria-label="Scroll to top"
        onClick={scrollToTop}
        className={cn(
            'flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all hover:scale-110',
            isVisible ? 'opacity-100 visible' : 'opacity-0 invisible'
        )}
      >
        <ArrowUp className="h-6 w-6" />
      </button>
    </div>
  );
};

export default FloatingButtons;
