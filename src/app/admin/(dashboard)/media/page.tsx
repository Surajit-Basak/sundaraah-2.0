
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function MediaPage() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Media Library</h2>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Your Images</CardTitle>
                    <CardDescription>
                        Manage all your site's images here. Upload new images and view your existing ones.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="p-8 text-center text-muted-foreground border-2 border-dashed border-border rounded-lg">
                        <p>Image gallery and upload functionality will be implemented here soon.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
