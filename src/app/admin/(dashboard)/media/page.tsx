
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "./image-uploader";
import { getMedia, deleteMedia } from "@/lib/data";
import type { Media } from "@/types";
import NextImage from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function MediaPage() {
    const [mediaItems, setMediaItems] = useState<Media[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const fetchMedia = async () => {
        setIsLoading(true);
        const items = await getMedia();
        setMediaItems(items);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchMedia();
    }, []);

    const handleUploadSuccess = () => {
        toast({ title: "Success!", description: "Image uploaded successfully." });
        fetchMedia(); // Refresh the gallery
    };

    const handleDelete = async (item: Media) => {
        if (!confirm(`Are you sure you want to delete "${item.file_name}"? This action cannot be undone.`)) {
            return;
        }

        try {
            await deleteMedia(item.id, item.file_path!);
            toast({ title: "Success!", description: "Image deleted successfully." });
            fetchMedia(); // Refresh the gallery
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Failed to delete image." });
        }
    };

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Media Library</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Upload New Image</CardTitle>
                    <CardDescription>
                        Upload images here to use them across your site.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ImageUploader onUploadSuccess={handleUploadSuccess} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Your Images</CardTitle>
                    <CardDescription>
                       Manage your uploaded images.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {[...Array(6)].map((_, i) => <Skeleton key={i} className="aspect-square w-full" />)}
                        </div>
                    ) : mediaItems.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {mediaItems.map(item => (
                                <div key={item.id} className="relative group aspect-square">
                                    <NextImage
                                        src={item.url!}
                                        alt={item.alt_text || item.file_name || 'Uploaded image'}
                                        fill
                                        className="object-cover rounded-md border"
                                    />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => handleDelete(item)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            <span className="sr-only">Delete Image</span>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-muted-foreground border-2 border-dashed border-border rounded-lg">
                            <p>Your media library is empty. Upload your first image to see it here.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
