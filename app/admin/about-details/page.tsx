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
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type WhoWeAreDoc = Doc<"whoWeAre">;
type WhatWeOfferDoc = Doc<"whatWeOffer">;
type OurStrengthDoc = Doc<"ourStrength">;

export default function AboutDetailsAdminPage() {
  const whoWeAre = useQuery(api.whoWeAre.getWhoWeAre) as
    | WhoWeAreDoc
    | null
    | undefined;
  const setWhoWeAre = useMutation(api.whoWeAre.setWhoWeAre);

  const whatWeOffer = useQuery(api.whatWeOffer.getWhatWeOffer) as
    | WhatWeOfferDoc
    | null
    | undefined;
  const setWhatWeOffer = useMutation(api.whatWeOffer.setWhatWeOffer);

  const ourStrength = useQuery(api.ourStrength.getOurStrength) as
    | OurStrengthDoc
    | null
    | undefined;
  const setOurStrength = useMutation(api.ourStrength.setOurStrength);

  // Who We Are
  const [whoTitle, setWhoTitle] = useState("");
  const [whoBody, setWhoBody] = useState("");

  useEffect(() => {
    if (whoWeAre && whoWeAre !== undefined) {
      setWhoTitle(whoWeAre?.title ?? "");
      setWhoBody(whoWeAre?.body ?? "");
    }
  }, [whoWeAre]);

  const saveWhoWeAre = async () => {
    try {
      if (!whoTitle.trim()) return toast.error("Who We Are title is required");
      if (!whoBody.trim()) return toast.error("Who We Are body is required");
      await setWhoWeAre({ title: whoTitle.trim(), body: whoBody.trim() });
      toast.success("Who We Are saved");
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  // What We Offer
  const [offerTitle, setOfferTitle] = useState("");
  const [offerItems, setOfferItems] = useState<string[]>([]);
  const offerItemsText = useMemo(() => offerItems.join("\n"), [offerItems]);

  useEffect(() => {
    if (whatWeOffer && whatWeOffer !== undefined) {
      setOfferTitle(whatWeOffer?.title ?? "");
      setOfferItems((whatWeOffer?.items ?? []).map((i) => String(i)));
    }
  }, [whatWeOffer]);

  const saveWhatWeOffer = async () => {
    try {
      if (!offerTitle.trim())
        return toast.error("What We Offer title is required");
      const items = offerItems.map((i) => i.trim()).filter(Boolean);
      if (items.length < 1) return toast.error("At least one item is required");
      await setWhatWeOffer({ title: offerTitle.trim(), items });
      toast.success("What We Offer saved");
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  // Our Strength
  const [strengthItems, setStrengthItems] = useState<
    Array<{ title: string; description: string }>
  >([]);

  useEffect(() => {
    if (ourStrength && ourStrength !== undefined) {
      setStrengthItems(
        (ourStrength?.items ?? []).map((i) => ({
          title: String(i.title ?? ""),
          description: String(i.description ?? ""),
        }))
      );
    }
  }, [ourStrength]);

  const addStrengthItem = () =>
    setStrengthItems((prev) => [...prev, { title: "", description: "" }]);
  const removeStrengthItem = (idx: number) =>
    setStrengthItems((prev) => prev.filter((_, i) => i !== idx));

  const saveOurStrength = async () => {
    try {
      const items = strengthItems
        .map((i) => ({
          title: i.title.trim(),
          description: i.description.trim(),
        }))
        .filter((i) => i.title && i.description);
      if (items.length < 1)
        return toast.error("Please add at least one strength item");
      await setOurStrength({ items });
      toast.success("Our Strength saved");
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  return (
    <div className='container mx-auto space-y-8 py-6'>
      <h1 className='text-2xl font-semibold sm:text-3xl'>About — Details</h1>

      <Card>
        <CardHeader>
          <CardTitle>Who We Are</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='who-title'>Title</Label>
            <Input
              id='who-title'
              value={whoTitle}
              onChange={(e) => setWhoTitle(e.target.value)}
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='who-body'>Body</Label>
            <Textarea
              id='who-body'
              rows={6}
              value={whoBody}
              onChange={(e) => setWhoBody(e.target.value)}
            />
          </div>
          <Button onClick={saveWhoWeAre}>Save</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>What We Offer</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='offer-title'>Title</Label>
            <Input
              id='offer-title'
              value={offerTitle}
              onChange={(e) => setOfferTitle(e.target.value)}
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='offer-items'>Items (one per line)</Label>
            <Textarea
              id='offer-items'
              rows={6}
              value={offerItemsText}
              onChange={(e) => setOfferItems(e.target.value.split("\n"))}
            />
          </div>
          <Button onClick={saveWhatWeOffer}>Save</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Our Strength</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-3'>
            {strengthItems.map((item, idx) => (
              <div key={idx} className='grid gap-2 sm:grid-cols-[1fr_1fr_auto]'>
                <Input
                  placeholder='Title'
                  value={item.title}
                  onChange={(e) =>
                    setStrengthItems((prev) =>
                      prev.map((it, i) =>
                        i === idx ? { ...it, title: e.target.value } : it
                      )
                    )
                  }
                />
                <Input
                  placeholder='Description'
                  value={item.description}
                  onChange={(e) =>
                    setStrengthItems((prev) =>
                      prev.map((it, i) =>
                        i === idx ? { ...it, description: e.target.value } : it
                      )
                    )
                  }
                />
                <Button
                  variant='outline'
                  onClick={() => removeStrengthItem(idx)}>
                  Remove
                </Button>
              </div>
            ))}
          </div>
          <div className='flex gap-2'>
            <Button variant='outline' onClick={addStrengthItem}>
              Add Item
            </Button>
            <Button onClick={saveOurStrength}>Save</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
