
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "./image-uploader";
import { getMedia, deleteMedia } from "@/lib/data";
import type { Media } from "@/types";
import NextImage from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2, Link as LinkIcon, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function MediaPage() {
    const [mediaItems, setMediaItems] = useState<Media[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const { toast } = useToast();

    const fetchMedia = async () => {
        setIsLoading(true);
        try {
            const items = await getMedia();
            setMediaItems(items);
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Failed to fetch media." });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMedia();
    }, []);

    const handleUploadSuccess = () => {
        toast({ title: "Success!", description: "Media uploaded successfully." });
        fetchMedia(); // Refresh the gallery
    };
    
    const copyToClipboard = (url: string) => {
        navigator.clipboard.writeText(url);
        toast({ title: "Copied!", description: "Link copied to clipboard." });
    }

    const handleDelete = async (item: Media) => {
        if (!confirm(`Are you sure you want to delete "${item.file_name}"? This action cannot be undone.`)) {
            return;
        }

        setDeletingId(item.id);
        try {
            await deleteMedia(item.id, item.file_path!);
            toast({ title: "Success!", description: "Media deleted successfully." });
            fetchMedia(); // Refresh the gallery
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Failed to delete media." });
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Media Library</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Upload New Media</CardTitle>
                    <CardDescription>
                        Upload images and videos here to use them across your site.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ImageUploader onUploadSuccess={handleUploadSuccess} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Your Media</CardTitle>
                    <CardDescription>
                       Manage your uploaded images and videos.
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
                                    {item.content_type?.startsWith('video') ? (
                                        <video
                                            src={item.url!}
                                            className="object-cover rounded-md border w-full h-full bg-black"
                                            playsInline
                                            muted
                                            loop
                                            onMouseOver={e => e.currentTarget.play()}
                                            onMouseOut={e => e.currentTarget.pause()}
                                        />
                                    ) : (
                                        <NextImage
                                            src={item.url!}
                                            alt={item.alt_text || item.file_name || 'Uploaded media'}
                                            fill
                                            className="object-cover rounded-md border"
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <Button
                                            variant="secondary"
                                            size="icon"
                                            onClick={() => copyToClipboard(item.url!)}
                                        >
                                            <LinkIcon className="h-4 w-4" />
                                            <span className="sr-only">Copy Link</span>
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => handleDelete(item)}
                                            disabled={deletingId === item.id}
                                        >
                                            {deletingId === item.id ? <Loader2 className="h-4 w-4 animate-spin"/> : <Trash2 className="h-4 w-4" />}
                                            <span className="sr-only">Delete Media</span>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-muted-foreground border-2 border-dashed border-border rounded-lg">
                            <p>Your media library is empty. Upload your first file to see it here.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
