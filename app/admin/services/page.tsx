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
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

type ServiceDoc = Doc<"services">;

type EditingService = {
  id?: Id<"services">;
  title: string;
  subtitle: string;
  description: string;
};

export default function ServicesPage() {
  const services = useQuery(api.services.getServices) as
    | ServiceDoc[]
    | undefined;
  const addServices = useMutation(api.services.addServices);
  const updateServices = useMutation(api.services.updateServices);
  const deleteServices = useMutation(api.services.deleteServices);

  const [editing, setEditing] = useState<EditingService | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 9;
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Id<"services"> | null>(null);
  const [deleteTargetTitle, setDeleteTargetTitle] = useState<string | null>(
    null
  );

  const resetForm = useCallback(() => {
    setEditing({ title: "", subtitle: "", description: "" });
  }, []);

  const startEdit = useCallback((s: ServiceDoc) => {
    setEditing({
      id: s._id,
      title: s.title,
      subtitle: s.subtitle,
      description: s.description,
    });
    setEditOpen(true);
  }, []);

  const startCreate = useCallback(() => {
    resetForm();
    setEditOpen(true);
  }, [resetForm]);

  const handleSubmit = useCallback(async () => {
    if (!editing) return;
    try {
      setSubmitting(true);
      const errors: string[] = [];
      if (!editing.title.trim()) errors.push("Title is required");
      if (!editing.subtitle.trim()) errors.push("Subtitle is required");
      if (!editing.description.trim()) errors.push("Description is required");
      if (errors.length) {
        errors.forEach((m) => toast.error(m));
        return;
      }
      const payload = {
        title: editing.title.trim(),
        subtitle: editing.subtitle.trim(),
        description: editing.description.trim(),
      } as const;
      if (editing.id) {
        await updateServices({ id: editing.id, ...payload });
        toast.success("Service updated");
      } else {
        await addServices(payload);
        toast.success("Service created");
      }
      setEditing(null);
      setEditOpen(false);
    } catch (err) {
      console.error(err);
      toast.error((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }, [editing, addServices, updateServices]);

  const handleDelete = useCallback(
    async (id: Id<"services">) => {
      try {
        await deleteServices({ id });
        toast.success("Service deleted");
      } catch (err) {
        console.error(err);
        toast.error((err as Error).message);
      }
    },
    [deleteServices]
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
            <Label htmlFor='subtitle'>Subtitle</Label>
            <Input
              id='subtitle'
              value={editing.subtitle}
              onChange={(e) =>
                setEditing({ ...editing, subtitle: e.target.value })
              }
            />
          </div>
        </div>
        <div className='space-y-2'>
          <Label htmlFor='description'>Description</Label>
          <Textarea
            id='description'
            rows={6}
            value={editing.description}
            onChange={(e) =>
              setEditing({ ...editing, description: e.target.value })
            }
          />
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
  }, [editing, handleSubmit, submitting]);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    const items: ServiceDoc[] = services ?? [];
    if (!s) return items;
    return items.filter((x) =>
      [x.title, x.subtitle, x.description].some((v) =>
        String(v ?? "")
          .toLowerCase()
          .includes(s)
      )
    );
  }, [services, search]);

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  return (
    <div className='container mx-auto space-y-8 py-6'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <h1 className='text-2xl font-semibold sm:text-3xl'>Services</h1>
        <Button
          onClick={startCreate}
          className='bg-amber-600 text-white hover:bg-amber-100 hover:text-amber-600'>
          New Service
        </Button>
      </div>

      <div className='flex items-center gap-3'>
        <Input
          placeholder='Search services'
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
          }
        }}>
        <DialogContent className='max-h-[85vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>
              {editing?.id ? "Edit Service" : "New Service"}
            </DialogTitle>
          </DialogHeader>
          {form}
        </DialogContent>
      </Dialog>

      {services === undefined ? (
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className='overflow-hidden rounded border'>
              <div className='h-24 w-full animate-pulse bg-muted' />
              <div className='space-y-2 p-4'>
                <div className='h-4 w-1/2 animate-pulse rounded bg-muted' />
                <div className='h-3 w-2/3 animate-pulse rounded bg-muted' />
              </div>
            </div>
          ))}
        </div>
      ) : services.length < 1 ? (
        <div className='py-10 text-center text-sm text-muted-foreground'>
          No service found
        </div>
      ) : (
        <>
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {paged.map((s) => (
              <Card key={s._id} className='overflow-hidden'>
                <CardHeader>
                  <CardTitle className='text-lg'>{s.title}</CardTitle>
                </CardHeader>
                <CardContent className='space-y-2 text-sm text-muted-foreground'>
                  <div>
                    <span className='font-medium text-foreground'>
                      Subtitle:
                    </span>{" "}
                    {s.subtitle}
                  </div>
                  <div className='line-clamp-3'>{s.description}</div>
                  <div className='flex items-center gap-2 pt-2'>
                    <Button size='sm' onClick={() => startEdit(s)}>
                      Edit
                    </Button>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => {
                        setDeleteTarget(s._id);
                        setDeleteTargetTitle(s.title);
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
                <DialogTitle>Delete this service?</DialogTitle>
                <DialogDescription>
                  {deleteTargetTitle ? (
                    <span>
                      You are about to permanently delete &quot;
                      {deleteTargetTitle}&quot;. This action cannot be undone.
                    </span>
                  ) : (
                    <span>This action cannot be undone.</span>
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
