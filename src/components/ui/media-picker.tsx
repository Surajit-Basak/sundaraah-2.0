
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getMedia } from '@/lib/data';
import type { Media } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle } from 'lucide-react';

interface MediaPickerProps {
  value?: string;
  onChange: (value: string) => void;
}

export function MediaPicker({ value, onChange }: MediaPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mediaItems, setMediaItems] = useState<Media[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      const fetchMedia = async () => {
        setIsLoading(true);
        try {
          const items = await getMedia();
          setMediaItems(items);
        } catch (error) {
          toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch media.' });
        } finally {
          setIsLoading(false);
        }
      };
      fetchMedia();
    }
  }, [isOpen, toast]);

  const handleSelect = (url: string) => {
    onChange(url);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex items-center gap-4">
        {value && <Image src={value} alt="Current selection" width={64} height={64} className="rounded-md object-cover" />}
        <DialogTrigger asChild>
          <Button variant="outline">
            {value ? 'Change Image' : 'Select Image'}
          </Button>
        </DialogTrigger>
      </div>

      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Select Media</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-grow">
          <div className="p-4">
            {isLoading ? (
              <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
                {[...Array(12)].map((_, i) => <Skeleton key={i} className="aspect-square w-full" />)}
              </div>
            ) : mediaItems.length > 0 ? (
              <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
                {mediaItems.map(item => (
                  <button
                    key={item.id}
                    className="relative group aspect-square focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md"
                    onClick={() => handleSelect(item.url!)}
                  >
                    <Image
                      src={item.url!}
                      alt={item.alt_text || item.file_name || 'Uploaded media'}
                      fill
                      className="object-cover rounded-md border"
                    />
                    {value === item.url && (
                      <div className="absolute inset-0 bg-primary/70 flex items-center justify-center">
                        <CheckCircle className="w-10 h-10 text-primary-foreground" />
                      </div>
                    )}
                     <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <p className="text-white text-xs text-center p-1 truncate">{item.file_name}</p>
                     </div>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">Your media library is empty.</p>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
