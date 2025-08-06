
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { getMedia } from '@/lib/data';
import type { Media } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle } from 'lucide-react';
import { ImageUploader } from '@/app/admin/(dashboard)/media/image-uploader';

interface MediaPickerProps {
  value?: string | string[];
  onChange: (value: any) => void;
  multiple?: boolean;
}

export function MediaPicker({ value, onChange, multiple = false }: MediaPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mediaItems, setMediaItems] = useState<Media[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Internal state for selections in multi-select mode
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
  
  // State for toggling between gallery and uploader
  const [showUploader, setShowUploader] = useState(false);

  useEffect(() => {
    if (multiple && Array.isArray(value)) {
      setSelectedUrls(value);
    }
  }, [value, multiple]);

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

  useEffect(() => {
    if (isOpen && !showUploader) {
      fetchMedia();
    }
  }, [isOpen, showUploader, toast]);

  const handleSelect = (url: string) => {
    if (multiple) {
      // For multi-select, toggle the URL in the temporary state
      setSelectedUrls(prev => 
        prev.includes(url) ? prev.filter(u => u !== url) : [...prev, url]
      );
    } else {
      // For single-select, update immediately and close
      onChange(url);
      setIsOpen(false);
    }
  };

  const handleMultiSelectConfirm = () => {
    onChange(selectedUrls);
    setIsOpen(false);
  };
  
  const handleUploadSuccess = () => {
    setShowUploader(false); // Switch back to the gallery view
    fetchMedia(); // Refresh the gallery to show the new upload
  }

  const renderSinglePreview = () => {
    if (typeof value !== 'string' || !value) return null;
    return <Image src={value} alt="Current selection" width={64} height={64} className="rounded-md object-cover" />;
  };

  const renderMultiPreview = () => {
    if (!Array.isArray(value) || value.length === 0) return null;
    return (
      <div className="flex flex-wrap gap-2">
        {value.map(url => (
          <Image key={url} src={url} alt="Selected item" width={64} height={64} className="rounded-md object-cover" />
        ))}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <div className="space-y-2">
            {multiple ? renderMultiPreview() : renderSinglePreview()}
            <DialogTrigger asChild>
                <Button variant="outline">
                {value && (Array.isArray(value) ? value.length > 0 : !!value) ? 'Change Selection' : (multiple ? 'Select Images' : 'Select Image')}
                </Button>
            </DialogTrigger>
        </div>

      <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{showUploader ? "Upload New Media" : "Select Media"}</DialogTitle>
        </DialogHeader>
        
        {showUploader ? (
            <div className="p-4 flex-grow flex flex-col justify-center items-center">
                <ImageUploader onUploadSuccess={handleUploadSuccess} />
                <Button variant="link" onClick={() => setShowUploader(false)} className="mt-4">
                    &larr; Back to Media Library
                </Button>
            </div>
        ) : (
             <>
                <div className="p-4 border-b">
                    <Button onClick={() => setShowUploader(true)}>Upload New</Button>
                </div>
                <ScrollArea className="flex-grow">
                <div className="p-4">
                    {isLoading ? (
                    <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-4">
                        {[...Array(12)].map((_, i) => <Skeleton key={i} className="aspect-square w-full" />)}
                    </div>
                    ) : mediaItems.length > 0 ? (
                    <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-4">
                        {mediaItems.map(item => {
                            const isSelected = multiple ? selectedUrls.includes(item.url!) : value === item.url;
                            return (
                                <button
                                key={item.id}
                                className={cn(
                                    "relative group aspect-square focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-md",
                                    isSelected ? "ring-primary" : "focus:ring-ring"
                                )}
                                onClick={() => handleSelect(item.url!)}
                                >
                                <Image
                                    src={item.url!}
                                    alt={item.alt_text || item.file_name || 'Uploaded media'}
                                    fill
                                    className="object-cover rounded-md border"
                                />
                                {isSelected && (
                                    <div className="absolute inset-0 bg-primary/70 flex items-center justify-center">
                                        <CheckCircle className="w-10 h-10 text-primary-foreground" />
                                    </div>
                                )}
                                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs text-center p-1 truncate">
                                    {item.file_name}
                                </div>
                                </button>
                            )
                        })}
                    </div>
                    ) : (
                    <p className="text-center text-muted-foreground">Your media library is empty.</p>
                    )}
                </div>
                </ScrollArea>
                {multiple && (
                    <DialogFooter className="p-4 border-t">
                        <DialogClose asChild>
                             <Button variant="ghost">Cancel</Button>
                        </DialogClose>
                        <Button onClick={handleMultiSelectConfirm}>Confirm Selection</Button>
                    </DialogFooter>
                )}
            </>
        )}
      </DialogContent>
    </Dialog>
  );
}
