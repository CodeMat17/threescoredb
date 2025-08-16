"use client";
export const dynamic = "force-dynamic";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { extractErrorMessage } from "@/lib/utils";
import imageCompression from "browser-image-compression";
import { useAction, useMutation, useQuery } from "convex/react";
import { Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import DeleteCarouselModal from "../components/modals/DeleteCarouselModal";
import EditCarouselModal from "../components/modals/EditCarouselModal";

export default function AdminPageContent() {
  const carousels = useQuery(api.carousel.getCarousel);
  const addCarousel = useMutation(api.carousel.addCarousel);
  const updateCarousel = useMutation(api.carousel.updateCarousel);
  const deleteCarousel = useMutation(api.carousel.deleteCarousel);
  const generateUploadUrl = useAction(api.uploads.generateUploadUrl);

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<Id<"heroCarousel"> | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) {
      setSelectedFile(null);
      setCompressedFile(null);
      setPreviewUrl(null);
      return;
    }
    const file = fileList[0];
    setSelectedFile(file);
    const nextPreviewUrl = URL.createObjectURL(file);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(nextPreviewUrl);

    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      });
      // imageCompression returns a Blob; ensure File instance
      const compressedAsFile = new File([compressed], file.name, {
        type: compressed.type || file.type,
        lastModified: Date.now(),
      });
      setCompressedFile(compressedAsFile);
    } catch (err) {
      console.log("Compression Error: ", err);
      setCompressedFile(file);
    }
  };

  const handleAddCarousel = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    const fileToUpload = compressedFile ?? selectedFile;
    if (!fileToUpload) {
      toast.error("Please select an image");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const uploadUrl = await generateUploadUrl({});
      const uploadResponse = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          "Content-Type": fileToUpload.type || "application/octet-stream",
        },
        body: fileToUpload,
      });
      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image");
      }
      const { storageId }: { storageId: Id<"_storage"> } =
        await uploadResponse.json();

      await addCarousel({
        title: title.trim(),
        subtitle: subtitle.trim(),
        imageId: storageId,
      });

      toast.success("Carousel added");
      setTitle("");
      setSubtitle("");
      setSelectedFile(null);
      setCompressedFile(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    } catch (err) {
      const message = extractErrorMessage(err);
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmEdit = async (
    id: Id<"heroCarousel">,
    currentImageId: Id<"_storage">,
    data: { title: string; subtitle: string; file?: File }
  ) => {
    if (!data.title.trim()) {
      toast.error("Title is required");
      return;
    }
    try {
      let imageIdToUse: Id<"_storage"> = currentImageId;
      if (data.file) {
        // compress
        let fileToUpload: File = data.file;
        try {
          const compressed = await imageCompression(data.file, {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
          });
          fileToUpload = new File([compressed], data.file.name, {
            type: compressed.type || data.file.type,
            lastModified: Date.now(),
          });
        } catch {
          // fall back to original file
        }
        const uploadUrl = await generateUploadUrl({});
        const uploadResponse = await fetch(uploadUrl, {
          method: "POST",
          headers: {
            "Content-Type": fileToUpload.type || "application/octet-stream",
          },
          body: fileToUpload,
        });
        if (!uploadResponse.ok) throw new Error("Failed to upload image");
        const { storageId }: { storageId: Id<"_storage"> } =
          await uploadResponse.json();
        imageIdToUse = storageId;
      }

      await updateCarousel({
        id,
        title: data.title.trim(),
        subtitle: data.subtitle.trim(),
        imageId: imageIdToUse,
      });
      toast.success("Carousel updated");
    } catch (err) {
      const message = extractErrorMessage(err);
      toast.error(message);
    }
  };

  const handleDelete = async (id: Id<"heroCarousel">) => {
    setDeletingId(id);
    try {
      await deleteCarousel({ id });
      toast.success("Carousel deleted");
    } catch (err) {
      const message = extractErrorMessage(err);
      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  };

  const isInitialLoading = carousels === undefined;

  return (
    <div className='container mx-auto space-y-8'>
   

      <h1 className='text-2xl font-semibold sm:text-3xl'>Hero Carousel</h1>

      {/* Add Carousel */}
      <section className='rounded-md border bg-card p-4 sm:p-6'>
        <h2 className='mb-4 text-lg font-medium'>Add Carousel</h2>
        {isInitialLoading ? (
          <div className='grid gap-4 sm:grid-cols-2'>
            <div className='space-y-3'>
              <div className='h-10 w-full animate-pulse rounded bg-muted/50' />
              <div className='h-10 w-full animate-pulse rounded bg-muted/50' />
              <div className='h-10 w-full animate-pulse rounded bg-muted/50' />
              <div className='h-9 w-36 animate-pulse rounded bg-muted/50' />
            </div>
            <div className='flex items-center justify-center'>
              <div className='h-40 w-full max-w-md animate-pulse rounded-md bg-muted/50' />
            </div>
          </div>
        ) : (
          <div className='grid gap-4 sm:grid-cols-2'>
            <div className='space-y-3'>
              <Input
                type='file'
                accept='image/*'
                onChange={handleImageChange}
              />
              <Input
                type='text'
                placeholder='Title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <Input
                type='text'
                placeholder='Subtitle'
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                required
              />
              <div className='flex gap-2'>
                <Button onClick={handleAddCarousel} disabled={isLoading}>
                  {isLoading ? "Uploading..." : "Add Carousel"}
                </Button>
                {error ? (
                  <span className='self-center text-sm text-destructive'>
                    {error}
                  </span>
                ) : null}
              </div>
            </div>
            <div className='flex items-center justify-center'>
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt='Preview'
                  width={768}
                  height={160}
                  unoptimized
                  className='h-40 w-full max-w-md rounded-md object-cover'
                />
              ) : (
                <div className='h-40 w-full max-w-md rounded-md border bg-muted/30' />
              )}
            </div>
          </div>
        )}
      </section>

      {/* List */}
      {isInitialLoading ? (
        <section className='space-y-4'>
          <div className='h-6 w-40 animate-pulse rounded bg-muted/50' />
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className='relative aspect-video w-full max-w-64'>
                <div className='absolute inset-0 animate-pulse rounded-md bg-muted/50' />
              </div>
            ))}
          </div>
        </section>
      ) : carousels && carousels.length > 0 ? (
        <section className='space-y-4'>
          <h2 className='text-lg font-medium'>Existing Items</h2>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {carousels.map((carousel) => (
              <div key={carousel._id} className='space-y-3'>
                <div className='relative aspect-video w-full overflow-hidden rounded-md'>
                  <Image
                    src={carousel.image}
                    alt={carousel.title}
                    fill
                    className='object-cover'
                  />
                  <div className='absolute right-2 top-2 z-10 flex gap-2'>
                    <EditCarouselModal
                      trigger={
                        <Button size='sm' variant='outline'>
                          <Edit className='h-4 w-4' />
                        </Button>
                      }
                      initialTitle={carousel.title}
                      initialSubtitle={carousel.subtitle ?? ""}
                      initialPreviewUrl={carousel.image}
                      onConfirm={(data) =>
                        handleConfirmEdit(
                          carousel._id,
                          carousel.imageId as Id<"_storage">,
                          data
                        )
                      }
                    />
                    <DeleteCarouselModal
                      trigger={
                        <Button
                          size='sm'
                          variant='destructive'
                          disabled={deletingId === carousel._id}>
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      }
                      title='Delete Carousel'
                      description='This will permanently delete this carousel item.'
                      confirmLabel='Delete'
                      cancelLabel='Cancel'
                      onConfirm={() => handleDelete(carousel._id)}
                    />
                  </div>
                  <div className='absolute inset-x-0 bottom-0 bg-black/40 p-3 text-white'>
                    <h3 className='text-sm font-semibold line-clamp-1'>
                      {carousel.title}
                    </h3>
                    <p className='text-xs opacity-90 line-clamp-1'>
                      {carousel.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <p className='text-center px-4 py-24 text-sm text-muted-foreground'>
          No carousel found
        </p>
      )}
    </div>
  );
}
