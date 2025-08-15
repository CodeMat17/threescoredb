"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { ChevronDownIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { toast } from "sonner";

type Travelers = { adults: number; teens: number; kids: number };

export default function BookingForm({
  pkg,
  priceFromUsd,
}: {
  pkg: string;
  priceFromUsd?: number;
}) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nationality, setNationality] = useState("");
  const [passport, setPassport] = useState("");
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [rooms, setRooms] = useState(1);
  const [roomType, setRoomType] = useState<string | undefined>("double");
  const [mealPlan, setMealPlan] = useState<string | undefined>("full-board");
  const [travelers, setTravelers] = useState<Travelers>({
    adults: 2,
    teens: 0,
    kids: 0,
  });
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addBooking = useMutation(api.bookings.addBookings);
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const formatDate = (d?: Date) =>
    d
      ? d.toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "2-digit",
        })
      : "";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date?.from || !date?.to) {
      toast.error("Please select a start and end date.");
      return;
    }
    try {
      setIsSubmitting(true);
      const fromDate = date.from.getTime();
      const toDate = date.to.getTime();
      await addBooking({
        packageTitle: pkg,
        priceFromUsd,
        fullName,
        email,
        phone,
        nationality: nationality || undefined,
        passport: passport || undefined,
        fromDate,
        toDate,
        rooms,
        roomType: roomType || undefined,
        mealPlan: mealPlan || undefined,
        travelers,
        comments: comments || undefined,
      });
      toast.success("Booking submitted. We'll contact you shortly.");
      const nameForThanks = fullName.trim();
      // Reset form fields
      setFullName("");
      setEmail("");
      setPhone("");
      setNationality("");
      setPassport("");
      setDate(undefined);
      setRooms(1);
      setRoomType("double");
      setMealPlan("full-board");
      setTravelers({ adults: 2, teens: 0, kids: 0 });
      setComments("");
      setOpen(false);
      router.push(`/thank-you?name=${encodeURIComponent(nameForThanks)}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <form onSubmit={onSubmit}>
        <CardHeader>
          <CardTitle>Booking Details</CardTitle>
          <CardDescription>
            <Label>Description</Label>
            <p>{pkg}</p>
            {typeof priceFromUsd === "number" && (
              <p>From ${priceFromUsd.toLocaleString()}</p>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='grid gap-4 md:grid-cols-2'>
            <div className='space-y-1'>
              <Label htmlFor='fullName' requiredMark>
                Full Name
              </Label>
              <Input
                id='fullName'
                name='fullName'
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className='space-y-1'>
              <Label htmlFor='nationality'>Nationality</Label>
              <Input
                id='nationality'
                name='nationality'
                placeholder='Country of citizenship'
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
              />
            </div>
            <div className='space-y-1'>
              <Label htmlFor='passport'>Passport No. (if applicable)</Label>
              <Input
                id='passport'
                name='passport'
                placeholder='XXXXXXXX'
                value={passport}
                onChange={(e) => setPassport(e.target.value)}
              />
            </div>
          </div>

          <div className='grid gap-4 md:grid-cols-2'>
            <div className='flex flex-col gap-1'>
              <Label htmlFor='date' className='px-1' requiredMark>
                Date (from - to)
              </Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    id='date'
                    className='w-full justify-between font-normal'>
                    {date?.from
                      ? `${formatDate(date.from)}${
                          date?.to ? ` — ${formatDate(date.to)}` : ""
                        }`
                      : "Select dates"}
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto overflow-hidden p-0'>
                  <Calendar
                    mode='range'
                    defaultMonth={date?.from || new Date()}
                    numberOfMonths={2}
                    selected={date}
                    captionLayout='dropdown'
                    onSelect={(range) => setDate(range)}
                    className='rounded-lg border shadow-sm'
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className='grid gap-4 md:grid-cols-3'>
            {(["adults", "teens", "kids"] as const).map((k) => (
              <div key={k} className='space-y-1'>
                <Label htmlFor={`trav-${k}`} requiredMark={k === "adults"}>
                  {`Number of ${k}`}
                </Label>
                <Input
                  id={`trav-${k}`}
                  type='number'
                  min={k === "adults" ? 1 : 0}
                  value={travelers[k]}
                  onChange={(e) =>
                    setTravelers((t) => ({ ...t, [k]: Number(e.target.value) }))
                  }
                  required={k === "adults"}
                />
              </div>
            ))}
          </div>

          <div className='grid gap-4 md:grid-cols-3'>
            <div className='space-y-1'>
              <Label htmlFor='rooms' requiredMark>
                Rooms
              </Label>
              <Input
                id='rooms'
                type='number'
                min={1}
                value={rooms}
                onChange={(e) => setRooms(Number(e.target.value))}
                required
              />
            </div>
            <div className='space-y-1'>
              <Label>Room Type</Label>
              <Select value={roomType} onValueChange={(v) => setRoomType(v)}>
                <SelectTrigger>
                  <SelectValue placeholder='Select room type' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='single'>Single</SelectItem>
                  <SelectItem value='double'>Double</SelectItem>
                  <SelectItem value='twin'>Twin</SelectItem>
                  <SelectItem value='family'>Family</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='space-y-1'>
              <Label>Meal Plan</Label>
              <Select value={mealPlan} onValueChange={setMealPlan}>
                <SelectTrigger>
                  <SelectValue placeholder='Select meal plan' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='bb'>Bed & Breakfast</SelectItem>
                  <SelectItem value='half-board'>Half-board</SelectItem>
                  <SelectItem value='full-board'>Full-board</SelectItem>
                  <SelectItem value='all-inclusive'>All-inclusive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className='space-y-1'>
            <Label htmlFor='comments'>Special Requests / Notes</Label>
            <Textarea
              id='comments'
              name='comments'
              placeholder='Dietary needs, accessibility, celebrations, etc.'
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
          </div>

          <div className='flex justify-end gap-2'>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Confirm Booking"}
            </Button>
            <Button
              type='button'
              variant='secondary'
              onClick={() => history.back()}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
