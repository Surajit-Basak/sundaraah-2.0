"use client";

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { uploadMedia } from '@/lib/data';
import { Loader2, Upload } from 'lucide-react';
import Image from 'next/image';

interface ImageUploaderProps {
  onUploadSuccess: () => void;
}

export function ImageUploader({ onUploadSuccess }: ImageUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({ variant: 'destructive', title: 'No file selected', description: 'Please choose a file to upload.' });
      return;
    }
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      await uploadMedia(formData);
      
      // Reset state after successful upload
      setFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onUploadSuccess();

    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const isVideo = file?.type.startsWith('video/');

  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      <div className="space-y-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="picture">Choose Image or Video</Label>
          <Input id="picture" type="file" accept="image/*,video/*" onChange={handleFileChange} ref={fileInputRef} disabled={isUploading} />
        </div>
        <Button onClick={handleUpload} disabled={!file || isUploading}>
          {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
          {isUploading ? 'Uploading...' : 'Upload Media'}
        </Button>
      </div>
      
      {previewUrl && (
        <div className="space-y-2">
            <Label>Preview</Label>
            <div className="relative aspect-video w-full max-w-sm rounded-md border p-2">
                {isVideo ? (
                    <video src={previewUrl} controls className="w-full h-full object-contain" />
                ) : (
                    <Image src={previewUrl} alt="Image preview" fill className="object-contain" />
                )}
            </div>
        </div>
      )}
    </div>
  );
}
