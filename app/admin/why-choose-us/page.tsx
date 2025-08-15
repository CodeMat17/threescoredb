"use client";
export const dynamic = "force-dynamic";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type WhyDoc = Doc<"whyChooseUs">;

export default function WhyChooseUsAdminPage() {
  const data = useQuery(api.whyChooseUs.getWhyChooseUs) as
    | WhyDoc
    | null
    | undefined;
  const setWhy = useMutation(api.whyChooseUs.setWhyChooseUs);

  const [items, setItems] = useState<
    Array<{ title: string; description: string }>
  >([]);

  useEffect(() => {
    if (data && data !== undefined) {
      setItems(
        (data.items ?? []).map((i) => ({
          title: String(i.title ?? ""),
          description: String(i.description ?? ""),
        }))
      );
    }
  }, [data]);

  const addItem = () =>
    setItems((prev) => [...prev, { title: "", description: "" }]);
  const removeItem = (idx: number) =>
    setItems((prev) => prev.filter((_, i) => i !== idx));

  const save = async () => {
    try {
      const payload = items
        .map((i) => ({
          title: i.title.trim(),
          description: i.description.trim(),
        }))
        .filter((i) => i.title && i.description);
      if (payload.length < 1)
        return toast.error("Please add at least one item");
      await setWhy({ items: payload });
      toast.success("Why Choose Us saved");
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  return (
    <div className='container mx-auto space-y-8 py-6'>
      <h1 className='text-2xl font-semibold sm:text-3xl'>Why Choose Us</h1>
      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-3'>
            {items.map((item, idx) => (
              <div key={idx} className='grid gap-2 sm:grid-cols-[1fr_1fr_auto]'>
                <div className='space-y-1'>
                  <Label>Title</Label>
                  <Input
                    value={item.title}
                    onChange={(e) =>
                      setItems((prev) =>
                        prev.map((it, i) =>
                          i === idx ? { ...it, title: e.target.value } : it
                        )
                      )
                    }
                  />
                </div>
                <div className='space-y-1'>
                  <Label>Description</Label>
                  <Textarea
                    rows={3}
                    value={item.description}
                    onChange={(e) =>
                      setItems((prev) =>
                        prev.map((it, i) =>
                          i === idx
                            ? { ...it, description: e.target.value }
                            : it
                        )
                      )
                    }
                  />
                </div>
                <div className='flex items-end'>
                  <Button variant='outline' onClick={() => removeItem(idx)}>
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className='flex gap-2'>
            <Button variant='outline' onClick={addItem}>
              Add Item
            </Button>
            <Button onClick={save}>Save</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
