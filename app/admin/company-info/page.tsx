"use client";
export const dynamic = "force-dynamic";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type CompanyInfoDoc = Doc<"companyInfo">;

export default function CompanyInfoPage() {
  const info = useQuery(api.companyInfo.getCompanyInfo) as
    | CompanyInfoDoc
    | null
    | undefined;
  const updateInfo = useMutation(api.companyInfo.updateCompanyInfo);

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phones, setPhones] = useState<string[]>([""]);
  const [email, setEmail] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [businessHours, setBusinessHours] = useState<
    { label: string; hours: string }[]
  >([{ label: "Mon–Fri", hours: "08:00 – 18:00" }]);

  useEffect(() => {
    if (!info) return;
    if (info === undefined) return;
    setName(info?.name ?? "");
    setAddress(info?.address ?? "");
    setPhones((info?.phones as string[]) ?? [""]);
    setEmail(info?.email ?? "");
    setInstagram(info?.instagram ?? "");
    setFacebook(info?.facebook ?? "");
    setBusinessHours(
      (info?.businessHours as { label: string; hours: string }[]) ?? [
        { label: "Mon–Fri", hours: "08:00 – 18:00" },
      ]
    );
  }, [info]);

  const save = async () => {
    try {
      await updateInfo({
        name: name.trim(),
        address: address.trim(),
        phones: phones.map((p) => p.trim()).filter(Boolean),
        email: email.trim(),
        instagram: instagram.trim(),
        facebook: facebook.trim(),
        businessHours: businessHours.map((b) => ({
          label: b.label.trim(),
          hours: b.hours.trim(),
        })),
      });
      toast.success("Company info saved");
      setEditing(false);
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>Company Info</h1>
        <Button onClick={() => setEditing((v) => !v)}>
          {editing ? "Cancel" : "Edit"}
        </Button>
      </div>

      {info === undefined ? (
        <div className='space-y-2'>
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className='h-10 w-full animate-pulse rounded bg-muted'
            />
          ))}
        </div>
      ) : !editing ? (
        <div className='space-y-3 rounded-md border p-4'>
          <div>
            <div className='text-xs text-muted-foreground'>Name</div>
            <div className='font-medium'>{info?.name ?? "—"}</div>
          </div>
          <div>
            <div className='text-xs text-muted-foreground'>Address</div>
            <div className='font-medium'>{info?.address ?? "—"}</div>
          </div>
          <div>
            <div className='text-xs text-muted-foreground'>Phones</div>
            <div className='font-medium'>
              {(info?.phones as string[] | undefined)?.join(", ") ?? "—"}
            </div>
          </div>
          <div className='grid gap-3 sm:grid-cols-2'>
            <div>
              <div className='text-xs text-muted-foreground'>Email</div>
              <div className='font-medium'>{info?.email ?? "—"}</div>
            </div>
            <div>
              <div className='text-xs text-muted-foreground'>Instagram</div>
              <div className='font-medium break-all'>
                {info?.instagram ?? "—"}
              </div>
            </div>
            <div>
              <div className='text-xs text-muted-foreground'>Facebook</div>
              <div className='font-medium break-all'>
                {info?.facebook ?? "—"}
              </div>
            </div>
          </div>
          <div>
            <div className='text-xs text-muted-foreground'>Business Hours</div>
            <div className='font-medium'>
              {(
                info?.businessHours as
                  | { label: string; hours: string }[]
                  | undefined
              )
                ?.map((b) => `${b.label}: ${b.hours}`)
                .join(" \u2022 ") ?? "—"}
            </div>
          </div>
        </div>
      ) : (
        <div className='space-y-4 rounded-md border p-4'>
          <div>
            <label className='text-sm'>Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className='text-sm'>Address</label>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className='space-y-2'>
            <label className='text-sm'>Phones</label>
            <div className='space-y-2'>
              {phones.map((p, i) => (
                <div key={i} className='flex gap-2'>
                  <Input
                    value={p}
                    onChange={(e) =>
                      setPhones((prev) =>
                        prev.map((x, idx) => (idx === i ? e.target.value : x))
                      )
                    }
                  />
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() =>
                      setPhones((prev) => prev.filter((_, idx) => idx !== i))
                    }>
                    Remove
                  </Button>
                </div>
              ))}
              {phones.length < 2 && (
                <Button
                  type='button'
                  variant='outline'
                  onClick={() =>
                    setPhones((prev) =>
                      prev.length < 2 ? [...prev, ""] : prev
                    )
                  }>
                  Add phone
                </Button>
              )}
            </div>
          </div>
          <div className='grid gap-3 sm:grid-cols-2'>
            <div>
              <label className='text-sm'>Email</label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label className='text-sm'>Instagram</label>
              <Input
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
              />
            </div>
            <div>
              <label className='text-sm'>Facebook</label>
              <Input
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
              />
            </div>
          </div>
          <div className='space-y-2'>
            <label className='text-sm'>Business Hours</label>
            <div className='space-y-2'>
              {businessHours.map((b, i) => (
                <div key={i} className='grid gap-2 sm:grid-cols-2'>
                  <Input
                    value={b.label}
                    onChange={(e) =>
                      setBusinessHours((prev) =>
                        prev.map((x, idx) =>
                          idx === i ? { ...x, label: e.target.value } : x
                        )
                      )
                    }
                    placeholder='Label (e.g., Mon–Fri)'
                  />
                  <Input
                    value={b.hours}
                    onChange={(e) =>
                      setBusinessHours((prev) =>
                        prev.map((x, idx) =>
                          idx === i ? { ...x, hours: e.target.value } : x
                        )
                      )
                    }
                    placeholder='Hours (e.g., 08:00 – 18:00)'
                  />
                </div>
              ))}
              <Button
                type='button'
                variant='outline'
                onClick={() =>
                  setBusinessHours((prev) => [
                    ...prev,
                    { label: "", hours: "" },
                  ])
                }>
                Add row
              </Button>
            </div>
          </div>
          <div>
            <Button onClick={save}>Save</Button>
          </div>
        </div>
      )}
    </div>
  );
}
