"use client";
export const dynamic = "force-dynamic";

import { TiptapEditor } from "@/components/site/TiptapEditor";
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
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { useAction, useMutation, useQuery } from "convex/react";
import NextImage from "next/image";
import { useCallback, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

type BlogDoc = Doc<"blog">;

type EditingBlog = {
  id?: Id<"blog">;
  title: string;
  // description: string;
  content: string;
  imageId?: Id<"_storage">;
  image?: string;
};

export default function BlogPage() {
  const blog = useQuery(api.blog.getBlog) as BlogDoc[] | undefined;
  const addBlog = useMutation(api.blog.addBlog);
  const updateBlog = useMutation(api.blog.updateBlog);
  const deleteBlog = useMutation(api.blog.deleteBlog);
  const generateUploadUrl = useAction(api.uploads.generateUploadUrl);

  const [editing, setEditing] = useState<EditingBlog | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 9;
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Id<"blog"> | null>(null);
  const [deleteTargetTitle, setDeleteTargetTitle] = useState<string | null>(
    null
  );

  const resetForm = useCallback(() => {
    setEditing({ title: "", content: "" });
    if (fileRef.current) fileRef.current.value = "";
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  }, [previewUrl]);

  const startEdit = useCallback(
    (b: BlogDoc) => {
      setEditing({
        id: b._id,
        title: b.title,
        // description: b.description,
        content: b.content,
        imageId: b.imageId as Id<"_storage">,
        image: b.image,
      });
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
    const maxSize = 1600;
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
      const errors: string[] = [];
      if (!editing.title.trim()) errors.push("Title is required");
      // if (!editing.description.trim()) errors.push("Description is required");
      const contentString = editing.content.trim();
      if (!contentString) errors.push("Content is required");
      const selectedFile = fileRef.current?.files?.[0] ?? null;
      if (!editing.id && !editing.imageId && !selectedFile) {
        errors.push("Image is required");
      }
      if (errors.length) {
        errors.forEach((m) => toast.error(m));
        return;
      }

      // Upload if new image chosen
      let imageId: Id<"_storage"> | undefined = editing.imageId;
      if (selectedFile) {
        const url = await generateUploadUrl();
        const compressed = await compressImage(selectedFile);
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": selectedFile.type || "image/jpeg" },
          body: compressed,
        });
        if (!res.ok) throw new Error("Upload failed");
        const json = (await res.json()) as { storageId: Id<"_storage"> };
        imageId = json.storageId;
      }

      if (!imageId) throw new Error("Image is required");

      const payload = {
        title: editing.title.trim(),
        // description: editing.description.trim(),
        content: contentString,
        imageId,
      } as const;

      if (editing.id) {
        await updateBlog({ id: editing.id, ...payload });
        toast.success("Blog updated");
      } else {
        await addBlog(payload);
        toast.success("Blog created");
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
  }, [editing, addBlog, updateBlog, generateUploadUrl, previewUrl]);

  const handleDelete = useCallback(
    async (id: Id<"blog">) => {
      try {
        await deleteBlog({ id });
        toast.success("Blog deleted");
      } catch (err) {
        console.error(err);
        toast.error((err as Error).message);
      }
    },
    [deleteBlog]
  );

  const form = useMemo(() => {
    if (!editing) return null;
    return (
      <div className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='title'>Title</Label>
          <Input
            id='title'
            value={editing.title}
            onChange={(e) => setEditing({ ...editing, title: e.target.value })}
          />
        </div>
        {/* <div className='space-y-2'>
            <Label htmlFor='description'>Description</Label>
            <Input
              id='description'
              value={editing.description}
              onChange={(e) =>
                setEditing({ ...editing, description: e.target.value })
              }
            />
          </div> */}
        <div className='space-y-2'>
          <Label htmlFor='content'>Content</Label>
          <div id='content'>
            <TiptapEditor
              value={editing.content}
              onChange={(v) => setEditing({ ...editing, content: v })}
            />
          </div>
        </div>
        <div className='space-y-2 w-full max-w-md'>
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
            <div className='relative mt-2 h-40 w-full overflow-hidden rounded'>
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
    const items: BlogDoc[] = blog ?? [];
    if (!s) return items;
    return items.filter((b) =>
      [b.title, b.content].some((v) =>
        String(v ?? "")
          .toLowerCase()
          .includes(s)
      )
    );
  }, [blog, search]);

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  return (
    <div className='container mx-auto space-y-8 py-6'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <h1 className='text-2xl font-semibold sm:text-3xl'>Blog</h1>
        <Button
          onClick={startCreate}
          className='bg-amber-600 text-white hover:bg-amber-100 hover:text-amber-600'>
          New Blog
        </Button>
      </div>

      <div className='flex items-center gap-3'>
        <Input
          placeholder='Search blog posts'
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
            <DialogTitle>{editing?.id ? "Edit Blog" : "New Blog"}</DialogTitle>
          </DialogHeader>
          {form}
        </DialogContent>
      </Dialog>

      {blog === undefined ? (
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className='overflow-hidden rounded border'>
              <div className='h-40 w-full animate-pulse bg-muted' />
              <div className='space-y-2 p-4'>
                <div className='h-4 w-1/2 animate-pulse rounded bg-muted' />
                <div className='h-3 w-2/3 animate-pulse rounded bg-muted' />
              </div>
            </div>
          ))}
        </div>
      ) : blog.length < 1 ? (
        <div className='py-10 text-center text-sm text-muted-foreground'>
          No blog posts found
        </div>
      ) : (
        <>
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {paged.map((b) => (
              <Card key={b._id} className='overflow-hidden'>
                {b.image && (
                  <div className='relative h-40 w-full'>
                    <NextImage
                      src={b.image}
                      alt={b.title}
                      fill
                      className='object-cover'
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className='text-lg'>{b.title}</CardTitle>
                </CardHeader>
                <CardContent className='space-y-2 text-sm text-muted-foreground'>
                  {/* <div className='line-clamp-2'>{b.description}</div> */}
                  <div className='flex items-center gap-2 pt-2'>
                    <Button size='sm' onClick={() => startEdit(b)}>
                      Edit
                    </Button>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => {
                        setDeleteTarget(b._id);
                        setDeleteTargetTitle(b.title);
                        setDeleteOpen(true);
                      }}>
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

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
                <DialogTitle>Delete this blog post?</DialogTitle>
                <DialogDescription>
                  {deleteTargetTitle ? (
                    <span>
                      You are about to permanently delete &quot;
                      {deleteTargetTitle}&quot;. This will also remove its
                      image. This action cannot be undone.
                    </span>
                  ) : (
                    <span>
                      This will also remove its image. This action cannot be
                      undone.
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
