"use client";
export const dynamic = "force-dynamic";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import imageCompression from "browser-image-compression";
import { useAction, useMutation, useQuery } from "convex/react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

type AboutHeroDoc = Doc<"aboutHero">;

export default function AboutHeroAdminPage() {
  const existing = useQuery(api.aboutHero.getAboutHero) as
    | AboutHeroDoc
    | null
    | undefined;
  const setAboutHero = useMutation(api.aboutHero.setAboutHero);
  const generateUploadUrl = useAction(api.uploads.generateUploadUrl);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!existing) return;
    if (existing === undefined) return;
    setTitle(existing?.title ?? "");
    setDescription(existing?.description ?? "");
  }, [existing]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const currentImage = useMemo(() => existing?.image ?? null, [existing]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSave = async () => {
    try {
      setSubmitting(true);
      const errors: string[] = [];
      if (!title.trim()) errors.push("Title is required");
      if (!description.trim()) errors.push("Description is required");
      if (errors.length) {
        errors.forEach((m) => toast.error(m));
        return;
      }

      let imageId: Id<"_storage"> | undefined = existing?.imageId as
        | Id<"_storage">
        | undefined;
      const newFile = fileRef.current?.files?.[0] ?? null;
      if (!imageId && !newFile) {
        toast.error("Image is required");
        return;
      }
      if (newFile) {
        // compress image before upload
        let fileToUpload: File = newFile;
        try {
          const compressed = await imageCompression(newFile, {
            maxSizeMB: 2, // or 3 for safer quality
            maxWidthOrHeight: 3200,
            initialQuality: 0.9,
            useWebWorker: true,
          });
          fileToUpload = new File([compressed], newFile.name, {
            type: compressed.type || newFile.type,
            lastModified: Date.now(),
          });
        } catch {
          // fall back to original file
        }

        const uploadUrl = await generateUploadUrl({});
        const res = await fetch(uploadUrl, {
          method: "POST",
          headers: {
            "Content-Type": fileToUpload.type || "application/octet-stream",
          },
          body: fileToUpload,
        });
        if (!res.ok) throw new Error("Failed to upload image");
        const json = (await res.json()) as { storageId: Id<"_storage"> };
        imageId = json.storageId;
      }

      if (!imageId) throw new Error("Image is required");

      await setAboutHero({
        title: title.trim(),
        description: description.trim(),
        imageId,
      });
      toast.success("About hero saved");
      if (fileRef.current) fileRef.current.value = "";
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='container mx-auto space-y-8 py-6'>
      <h1 className='text-2xl font-semibold sm:text-3xl'>About — Hero</h1>

      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid gap-4 sm:grid-cols-2'>
            <div className='space-y-2'>
              <Label htmlFor='title'>Title</Label>
              <Input
                id='title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='image'>Image</Label>
              <Input
                id='image'
                type='file'
                accept='image/*'
                ref={fileRef}
                onChange={handleFileChange}
              />
            </div>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='description'>Description</Label>
            <Textarea
              id='description'
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          {(previewUrl || currentImage) && (
            <div className='relative h-48 w-full overflow-hidden rounded border'>
              <Image
                src={previewUrl || (currentImage as string)}
                alt={title || "About hero image"}
                fill
                className='object-cover'
              />
            </div>
          )}
          <div>
            <Button onClick={handleSave} disabled={submitting}>
              {submitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
