"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { company } from "@/lib/data";
import { useMutation, useQuery } from "convex/react";
import { Clock, Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

export default function ContactClient() {
  type SocialsDoc = Doc<"socials">;

  const socials = useQuery(api.socials.getSocials) as
    | SocialsDoc
    | null
    | undefined;

  const [fullName, setFullName] = React.useState("");
  const [emailInput, setEmailInput] = React.useState("");
  const [phoneInput, setPhoneInput] = React.useState("");
  const [comment, setComment] = React.useState("");

  const address: string = company.address;
  const email: string = company.email;
  const phones: string[] = [...company.phones];
  const businessHours: Array<{ label: string; hours: string }> = [
    ...company.businessHours,
  ];
  const instagram: string = socials?.instagram ?? company.instagram;
  const facebook: string = socials?.facebook ?? company.facebook;

  const addContact = useMutation(api.contact.addContact);
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (
        !fullName.trim() ||
        !emailInput.trim() ||
        !phoneInput.trim() ||
        !comment.trim()
      ) {
        toast.error("Please fill in required fields");
        return;
      }
      await addContact({
        fullName: fullName.trim(),
        email: emailInput.trim(),
        phone: phoneInput.trim(),
        comment: comment.trim(),
      });
      router.push("/contact/success");
    } catch (err) {
      console.error(err);
      toast.error("Submission failed");
    }
  };

  return (
    <div className='container mx-auto space-y-8 px-4 py-10'>
      <div className='max-w-2xl'>
        <h1 className='text-3xl font-bold md:text-4xl'>Contact Us</h1>
        <p className='mt-2 text-muted-foreground'>
          We’ll get back to you shortly.
        </p>
      </div>

      <div className='grid gap-8 lg:grid-cols-3'>
        <Card className='lg:col-span-2'>
          <CardHeader>
            <CardTitle>Contact Form</CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
            <form onSubmit={handleSubmit} className='space-y-6'>
              <div className='grid gap-4 md:grid-cols-2'>
                <div className='space-y-1'>
                  <Label htmlFor='name' requiredMark>
                    Full Name
                  </Label>
                  <Input
                    id='name'
                    name='name'
                    placeholder='Jane Doe'
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div className='space-y-1'>
                  <Label htmlFor='email' requiredMark>
                    Email
                  </Label>
                  <Input
                    id='email'
                    name='email'
                    type='email'
                    placeholder='you@example.com'
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    required
                  />
                </div>
                <div className='space-y-1'>
                  <Label htmlFor='phone' requiredMark>
                    Phone Number
                  </Label>
                  <Input
                    id='phone'
                    name='phone'
                    type='tel'
                    placeholder='+254...'
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className='space-y-1'>
                <Label htmlFor='comments' requiredMark>
                  Comment
                </Label>
                <Textarea
                  id='comments'
                  name='comments'
                  placeholder='Tell us your request or message'
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                />
              </div>

              <div className='flex justify-end gap-2'>
                <Button type='submit'>Submit</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Contact Details</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4 text-sm text-muted-foreground'>
              <div className='flex items-start gap-2'>
                <MapPin className='mt-0.5 h-4 w-4 text-amber-600' />
                <div>
                  <span className='font-medium text-foreground'>Address:</span>{" "}
                  <a
                    className='underline'
                    href={`https://www.google.com/maps?q=${encodeURIComponent(address)}`}
                    target='_blank'
                    rel='noreferrer'>
                    {address}
                  </a>
                </div>
              </div>
              <div className='flex items-start gap-2'>
                <Phone className='mt-0.5 h-4 w-4 text-amber-600' />
                <div>
                  <span className='font-medium text-foreground'>
                    Phone/WhatsApp:
                  </span>{" "}
                  <div className='space-x-2'>
                    {phones.map((p) => (
                      <a key={p} className='underline' href={`tel:${p}`}>
                        {p}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div className='flex items-start gap-2'>
                <Mail className='mt-0.5 h-4 w-4 text-amber-600' />
                <div>
                  <span className='font-medium text-foreground'>Email:</span>{" "}
                  <a className='underline' href={`mailto:${email}`}>
                    {email}
                  </a>
                </div>
              </div>
              <div className='flex items-center gap-3 pt-1'>
                <a
                  className='inline-flex items-center gap-1 underline'
                  href={instagram}
                  target='_blank'
                  rel='noreferrer'>
                  <Instagram className='h-4 w-4' /> Instagram
                </a>
                <span className='opacity-60'>•</span>
                <a
                  className='inline-flex items-center gap-1 underline'
                  href={facebook}
                  target='_blank'
                  rel='noreferrer'>
                  <Facebook className='h-4 w-4' /> Facebook
                </a>
              </div>
              <div className='pt-1'>
                <div className='mb-1 flex items-center gap-2 font-medium text-foreground'>
                  <Clock className='h-4 w-4 text-amber-600' />
                  Business Hours
                </div>
                <ul className='space-y-0.5'>
                  {businessHours.map((h) => (
                    <li key={h.label}>
                      {h.label}: {h.hours}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Our Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='aspect-video w-full overflow-hidden rounded-md border'>
                <iframe
                  title='Threescore Tours Location'
                  className='h-full w-full'
                  src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
                  loading='lazy'
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
