"use client";
export const dynamic = "force-dynamic";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import type { DestinationKey } from "@/lib/data";
import { useAction, useMutation, useQuery } from "convex/react";
import NextImage from "next/image";
import { useCallback, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

type EditingPackage = {
  id?: Id<"packages">;
  title: string;
  destination: DestinationKey | "";
  price: string; // keep empty string until user types
  days: string; // keep empty string until user types
  highlightText: string; // newline separated
  itineraryText: string; // newline separated
  imageId?: Id<"_storage">;
  image?: string;
};

type PackageDoc = Doc<"packages">;

function toEditing(p: PackageDoc | null | undefined): EditingPackage {
  return {
    id: p?._id,
    title: p?.title ?? "",
    destination: (p?.destination as DestinationKey) ?? "",
    price: p?.price != null ? String(p.price) : "",
    days: p?.days != null ? String(p.days) : "",
    highlightText: Array.isArray(p?.highlight) ? p.highlight.join("\n") : "",
    itineraryText: Array.isArray(p?.itinerary) ? p.itinerary.join("\n") : "",
    imageId: p?.imageId,
    image: p?.image,
  };
}

export default function PackagesPage() {
  const packages = useQuery(api.packages.getPackages) as
    | PackageDoc[]
    | undefined;
  const addPackages = useMutation(api.packages.addPackages);
  const updatePackages = useMutation(api.packages.updatePackages);
  const deletePackages = useMutation(api.packages.deletePackages);
  const generateUploadUrl = useAction(api.uploads.generateUploadUrl);

  const [editing, setEditing] = useState<EditingPackage | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 9;
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Id<"packages"> | null>(null);
  const [deleteTargetTitle, setDeleteTargetTitle] = useState<string | null>(
    null
  );

  const resetForm = useCallback(() => {
    setEditing({
      title: "",
      destination: "",
      price: "",
      days: "",
      highlightText: "",
      itineraryText: "",
    });
    if (fileRef.current) fileRef.current.value = "";
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
  }, [previewUrl]);

  const startEdit = useCallback(
    (p: PackageDoc) => {
      setEditing(toEditing(p));
      if (fileRef.current) fileRef.current.value = "";
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      setEditOpen(true);
    },
    [previewUrl]
  );

  const startCreate = useCallback(() => {
    resetForm();
    setEditOpen(true);
  }, [resetForm]);

  const parseLines = (text: string) =>
    text
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

  const compressImage = async (file: File): Promise<Blob> => {
    const dataUrl: string = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new window.Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = dataUrl;
    });
    const maxSize = 1600; // px longest edge
    const { width, height } = img;
    const scale = Math.min(1, maxSize / Math.max(width, height));
    const targetW = Math.round(width * scale);
    const targetH = Math.round(height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx2d = canvas.getContext("2d");
    if (!ctx2d) return file;
    ctx2d.drawImage(img, 0, 0, targetW, targetH);
    const mime =
      file.type && file.type.startsWith("image/") ? file.type : "image/jpeg";
    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b), mime, 0.85)
    );
    return blob ?? file;
  };

  const handleSubmit = useCallback(async () => {
    if (!editing) return;
    try {
      setSubmitting(true);
      // Validate
      const errors: string[] = [];
      if (!editing.title.trim()) errors.push("Title is required");
      if (!editing.destination) errors.push("Destination is required");
      if (!editing.price.trim()) errors.push("Price is required");
      if (!editing.days.trim()) errors.push("Days is required");
      const priceNum = Number(editing.price);
      const daysNum = Number(editing.days);
      if (!Number.isFinite(priceNum) || priceNum <= 0)
        errors.push("Price must be a number > 0");
      if (!Number.isInteger(daysNum) || daysNum <= 0)
        errors.push("Days must be an integer > 0");
      const highlightsParsed = parseLines(editing.highlightText);
      const itineraryParsed = parseLines(editing.itineraryText);
      if (highlightsParsed.length === 0)
        errors.push("Highlights are required (enter at least one line)");
      if (itineraryParsed.length === 0)
        errors.push("Itinerary is required (enter at least one line)");
      const selectedFile = fileRef.current?.files?.[0] ?? null;
      if (!editing.id && !editing.imageId && !selectedFile) {
        errors.push("Image is required");
      }
      if (errors.length) {
        errors.forEach((m) => toast.error(m));
        return;
      }
      // 1) Upload image if provided
      let imageId: Id<"_storage"> | undefined = editing.imageId;
      const file = selectedFile;
      if (file) {
        const url = await generateUploadUrl();
        const compressed = await compressImage(file);
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": file.type || "image/jpeg" },
          body: compressed,
        });
        if (!res.ok) throw new Error("Upload failed");
        const json = (await res.json()) as { storageId: Id<"_storage"> };
        imageId = json.storageId;
      }

      if (!imageId) throw new Error("Image is required");

      const payload = {
        title: editing.title.trim(),
        destination: editing.destination,
        price: priceNum,
        days: daysNum,
        highlight: highlightsParsed,
        itinerary: itineraryParsed,
        imageId,
      } as const;

      if (editing.id) {
        await updatePackages({ id: editing.id, ...payload });
        toast.success("Package updated");
      } else {
        await addPackages(payload);
        toast.success("Package created");
      }
      setEditing(null);
      setEditOpen(false);
      if (fileRef.current) fileRef.current.value = "";
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    } catch (err) {
      console.error(err);
      toast.error((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }, [editing, addPackages, updatePackages, generateUploadUrl, previewUrl]);

  const handleDelete = useCallback(
    async (id: Id<"packages">) => {
      try {
        await deletePackages({ id });
        toast.success("Package deleted");
      } catch (err) {
        console.error(err);
        toast.error((err as Error).message);
      }
    },
    [deletePackages]
  );

  const form = useMemo(() => {
    if (!editing) return null;
    return (
      <div className='space-y-4'>
        <div className='grid gap-4 sm:grid-cols-2'>
          <div className='space-y-2'>
            <Label htmlFor='title'>Title</Label>
            <Input
              id='title'
              value={editing.title}
              onChange={(e) =>
                setEditing({ ...editing, title: e.target.value })
              }
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='destination'>Destination</Label>
            <Select
              value={editing.destination || undefined}
              onValueChange={(v) =>
                setEditing({
                  ...editing,
                  destination: (v as DestinationKey) ?? "",
                })
              }>
              <SelectTrigger>
                <SelectValue placeholder='Select destination' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='Kenya'>Kenya</SelectItem>
                <SelectItem value='Uganda'>Uganda</SelectItem>
                <SelectItem value='Tanzania'>Tanzania</SelectItem>
                <SelectItem value='Dubai'>Dubai</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='price'>Price (USD)</Label>
            <Input
              id='price'
              type='number'
              min={0}
              value={editing.price}
              onChange={(e) =>
                setEditing({ ...editing, price: e.target.value })
              }
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='days'>Days</Label>
            <Input
              id='days'
              type='number'
              min={1}
              value={editing.days}
              onChange={(e) => setEditing({ ...editing, days: e.target.value })}
            />
          </div>
        </div>
        <div className='grid gap-4 sm:grid-cols-2'>
          <div className='space-y-2'>
            <Label htmlFor='highlight'>Highlights (one per line)</Label>
            <Textarea
              id='highlight'
              rows={6}
              value={editing.highlightText}
              onChange={(e) =>
                setEditing({ ...editing, highlightText: e.target.value })
              }
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='itinerary'>Itinerary (one per line)</Label>
            <Textarea
              id='itinerary'
              rows={6}
              value={editing.itineraryText}
              onChange={(e) =>
                setEditing({ ...editing, itineraryText: e.target.value })
              }
            />
          </div>
        </div>
        <div className='space-y-2'>
          <Label htmlFor='image'>Image</Label>
          <Input
            id='image'
            type='file'
            accept='image/*'
            ref={fileRef}
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              if (previewUrl) URL.revokeObjectURL(previewUrl);
              if (file) {
                const url = URL.createObjectURL(file);
                setPreviewUrl(url);
              } else {
                setPreviewUrl(null);
              }
            }}
          />
          {(previewUrl || editing.image) && (
            <div className='relative mt-2 h-32 w-full overflow-hidden rounded'>
              <NextImage
                src={previewUrl || (editing.image as string)}
                alt={editing.title}
                fill
                className='object-cover'
              />
            </div>
          )}
        </div>
        <div className='flex items-center gap-3'>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Saving..." : "Save"}
          </Button>
          <Button
            variant='outline'
            onClick={() => setEditOpen(false)}
            disabled={submitting}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }, [editing, handleSubmit, submitting, previewUrl]);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    const items: PackageDoc[] = packages ?? [];
    if (!s) return items;
    return items.filter((p) =>
      [p.title, p.destination].some((v) =>
        String(v ?? "")
          .toLowerCase()
          .includes(s)
      )
    );
  }, [packages, search]);

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  return (
    <div className='container mx-auto space-y-8 py-6'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <h1 className='text-2xl font-semibold sm:text-3xl'>Packages</h1>
        <Button
          onClick={startCreate}
          className='bg-amber-600 text-white hover:bg-amber-100 hover:text-amber-600'>
          New Package
        </Button>
      </div>

      <div className='flex items-center gap-3'>
        <Input
          placeholder='Search by title or destination'
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <Dialog
        open={editOpen}
        onOpenChange={(o) => {
          setEditOpen(o);
          if (!o) {
            setEditing(null);
            if (fileRef.current) fileRef.current.value = "";
            if (previewUrl) {
              URL.revokeObjectURL(previewUrl);
            }
            setPreviewUrl(null);
          }
        }}>
        <DialogContent className='max-h-[85vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>
              {editing?.id ? "Edit Package" : "New Package"}
            </DialogTitle>
          </DialogHeader>
          {form}
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteOpen}
        onOpenChange={(o) => {
          setDeleteOpen(o);
          if (!o) {
            setDeleteTarget(null);
            setDeleteTargetTitle(null);
          }
        }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this package?</DialogTitle>
            <DialogDescription>
              {deleteTargetTitle ? (
                <span>
                  You are about to permanently delete &quot;{deleteTargetTitle}
                  &quot;. This will also remove its image. This action cannot be
                  undone.
                </span>
              ) : (
                <span>
                  This will also remove its image. This action cannot be undone.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className='flex items-center justify-end gap-2'>
            <Button variant='outline' onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant='destructive'
              onClick={async () => {
                if (!deleteTarget) return;
                await handleDelete(deleteTarget);
                setDeleteOpen(false);
                setDeleteTarget(null);
                setDeleteTargetTitle(null);
              }}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {packages === undefined ? (
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className='overflow-hidden rounded border'>
              <div className='h-40 w-full animate-pulse bg-muted' />
              <div className='space-y-2 p-4'>
                <div className='h-4 w-1/2 animate-pulse rounded bg-muted' />
                <div className='h-3 w-1/3 animate-pulse rounded bg-muted' />
                <div className='h-3 w-1/4 animate-pulse rounded bg-muted' />
              </div>
            </div>
          ))}
        </div>
      ) : packages.length < 1 ? (
        <div className='py-10 text-center text-sm text-muted-foreground'>
          No package found
        </div>
      ) : (
        <>
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {paged.map((p) => (
              <Card key={p._id} className='overflow-hidden'>
                {p.image && (
                  <div className='relative h-40 w-full'>
                    <NextImage
                      src={p.image}
                      alt={p.title}
                      fill
                      className='object-cover'
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className='text-lg'>{p.title}</CardTitle>
                </CardHeader>
                <CardContent className='space-y-2 text-sm text-muted-foreground'>
                  <div>
                    <span className='font-medium text-foreground'>
                      Destination:
                    </span>{" "}
                    {p.destination}
                  </div>
                  <div>
                    <span className='font-medium text-foreground'>Price:</span>{" "}
                    ${p.price}
                  </div>
                  <div>
                    <span className='font-medium text-foreground'>Days:</span>{" "}
                    {p.days}
                  </div>
                  <div className='flex items-center gap-2 pt-2'>
                    <Button size='sm' onClick={() => startEdit(p)}>
                      Edit
                    </Button>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => {
                        setDeleteTarget(p._id);
                        setDeleteTargetTitle(p.title);
                        setDeleteOpen(true);
                      }}>
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className='flex items-center justify-center gap-2'>
            <Button
              variant='outline'
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}>
              Prev
            </Button>
            <span className='text-sm text-muted-foreground'>
              Page {page} of {totalPages}
            </span>
            <Button
              variant='outline'
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}>
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
