"use client";
export const dynamic = "force-dynamic";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { extractErrorMessage } from "@/lib/utils";
import imageCompression from "browser-image-compression";
import { useAction, useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminHome() {
  const hero = (useQuery(api.carousel.getCarousel) ??
    []) as Doc<"heroCarousel">[];
  const addCarousel = useMutation(api.carousel.addCarousel);
  const updateCarousel = useMutation(api.carousel.updateCarousel);
  const deleteCarousel = useMutation(api.carousel.deleteCarousel);
  const generateUploadUrl = useAction(api.uploads.generateUploadUrl);

  const [heroDraft, setHeroDraft] = useState({
    id: undefined as Id<"heroCarousel"> | undefined,
    title: "",
    subtitle: "",
    file: null as File | null,
  });

  async function saveHero() {
    try {
      let imageId: Id<"_storage"> | undefined;
      if (heroDraft.file) {
        const compressed = await imageCompression(heroDraft.file, {
          maxSizeMB: 1.5,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        });
        const uploadUrl = await generateUploadUrl({});
        const res = await fetch(uploadUrl, {
          method: "POST",
          headers: {
            "Content-Type": compressed.type || "application/octet-stream",
          },
          body: compressed,
        });
        if (!res.ok) throw new Error("Upload failed");
        const json = (await res.json()) as { storageId: Id<"_storage"> };
        imageId = json.storageId;
      }
      if (!imageId && !heroDraft.id) throw new Error("Please select an image");
      if (heroDraft.id && imageId) {
        await updateCarousel({
          id: heroDraft.id,
          title: heroDraft.title,
          subtitle: heroDraft.subtitle,
          imageId,
        });
      } else if (!heroDraft.id && imageId) {
        await addCarousel({
          title: heroDraft.title,
          subtitle: heroDraft.subtitle,
          imageId,
        });
      }
      setHeroDraft({ id: undefined, title: "", subtitle: "", file: null });
      toast.success("Saved");
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  }

  // Testimonials management temporarily removed until backend endpoints exist

  return (
    <div className='space-y-10'>
      <section>
        <h1 className='text-2xl font-semibold'>Home: Hero Carousel</h1>
        <div className='grid gap-4 md:grid-cols-2'>
          <div className='space-y-2 rounded-md border p-4'>
            <Input
              placeholder='Title'
              value={heroDraft.title}
              onChange={(e) =>
                setHeroDraft({ ...heroDraft, title: e.target.value })
              }
            />
            <Input
              placeholder='Subtitle'
              value={heroDraft.subtitle}
              onChange={(e) =>
                setHeroDraft({ ...heroDraft, subtitle: e.target.value })
              }
            />
            {/* Simplified fields for carousel */}
            <input
              type='file'
              accept='image/*'
              onChange={(e) =>
                setHeroDraft({
                  ...heroDraft,
                  file: e.target.files?.[0] ?? null,
                })
              }
            />
            <Button onClick={saveHero}>Save</Button>
          </div>

          <div className='divide-y rounded-md border'>
            {hero.map((h: Doc<"heroCarousel">) => (
              <div
                key={h._id}
                className='flex items-center justify-between p-3'>
                <div>
                  <div className='font-medium'>{h.title}</div>
                  <div className='text-xs text-muted-foreground'>
                    {h.subtitle}
                  </div>
                </div>
                <div className='flex gap-2'>
                  <Button
                    variant='secondary'
                    onClick={() =>
                      setHeroDraft({
                        id: h._id,
                        title: h.title,
                        subtitle: h.subtitle ?? "",
                        file: null,
                      })
                    }>
                    Edit
                  </Button>
                  <Button
                    variant='destructive'
                    onClick={() => deleteCarousel({ id: h._id })}>
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials management temporarily removed */}
    </div>
  );
}
