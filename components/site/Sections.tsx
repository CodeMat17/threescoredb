"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { testimonials } from "@/lib/data";
import { useQuery } from "convex/react";
import {
  ArrowRight,
  BedDouble,
  Binoculars,
  Car,
  DollarSign,
  Home,
  MapPin,
  Plane,
  UsersRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function ValueProps() {
  const items: Array<{ title: string; description: string }> = [
    {
      title: "Local Expertise",
      description: "We know every hidden gem from Maasai Mara to Diani Beach.",
    },
    {
      title: "Personalized Itineraries",
      description: "Every trip tailored to your style, pace, and budget.",
    },
    {
      title: "Reliable Support",
      description: "From inquiry to return—our team is always a message away.",
    },
  ];

  return (
    <section className='container mx-auto px-4 py-12'>
      <div className='grid gap-6 md:grid-cols-3'>
        {items.map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}

export function PopularDestinations() {
  const packages = useQuery(api.packages.getPackages);
  const featured = (packages ?? []).slice(0, 4);
  return (
    <section className='container mx-auto px-4 py-12'>
      <div className='mb-6 flex items-end justify-between'>
        <div>
          <h2 className='text-2xl font-semibold tracking-tight md:text-3xl'>
            Popular Destinations
          </h2>
          <p className='text-sm text-muted-foreground'>
            Hand-picked journeys our travelers love.
          </p>
        </div>
        <Button
          asChild
          className='bg-amber-600 text-white hover:bg-amber-100 hover:text-amber-600'>
          <Link href='/packages'>View all</Link>
        </Button>
      </div>
      <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {packages === undefined
          ? Array.from({ length: 4 }).map((_, idx) => (
              <Card
                key={idx}
                className='relative overflow-hidden rounded-2xl border shadow-sm'>
                <div className='relative h-36 w-full sm:h-40 lg:h-44 bg-muted animate-pulse' />
                <CardHeader className='space-y-2'>
                  <div className='h-4 w-3/4 rounded bg-muted animate-pulse' />
                  <div className='h-3 w-1/3 rounded bg-muted animate-pulse' />
                </CardHeader>
                <CardContent className='pt-0 space-y-2'>
                  <div className='h-3 w-5/6 rounded bg-muted animate-pulse' />
                  <div className='h-3 w-2/3 rounded bg-muted animate-pulse' />
                  <div className='h-3 w-1/2 rounded bg-muted animate-pulse' />
                  <div className='mt-2 flex items-center gap-3'>
                    <div className='h-8 w-24 rounded bg-muted animate-pulse' />
                    <div className='h-8 w-24 rounded bg-muted animate-pulse' />
                  </div>
                </CardContent>
              </Card>
            ))
          : featured.map((pkg) => (
              <Card
                key={pkg._id}
                className='group relative overflow-hidden rounded-2xl border shadow-sm transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-lg'>
                <div className='relative h-36 w-full sm:h-40 lg:h-44'>
                  <Image
                    src={pkg.image}
                    alt={pkg.title}
                    fill
                    className='object-cover transition-transform duration-500 group-hover:scale-105'
                    sizes='(min-width: 1280px) 33vw, (min-width: 1024px) 40vw, (min-width: 640px) 60vw, 85vw'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent' />
                  <span className='absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-xs font-medium text-black shadow-sm backdrop-blur'>
                    <MapPin className='h-3.5 w-3.5' /> {pkg.destination}
                  </span>
                </div>
                <CardHeader className='space-y-1'>
                  <CardTitle className='text-base leading-5'>
                    {pkg.title}
                  </CardTitle>
                  <CardDescription className='flex items-center gap-1'>
                    <DollarSign className='h-4 w-4' /> From $
                    {pkg.price.toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className='pt-0'>
                  <ul className='mb-4 list-disc space-y-1 pl-5 text-sm text-muted-foreground'>
                    {pkg.highlight.slice(0, 3).map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                  <div className='flex items-center gap-3'>
                    <Button asChild size='sm' className='shadow'>
                      <Link href={`/packages`}> Learn More</Link>
                    </Button>
                    <Button
                      asChild
                      size='sm'
                      variant='outline'
                      className='group/button'>
                      <Link
                        href={`/packages/booking/${encodeURIComponent(pkg.title)}?price=${pkg.price}`}>
                        Book{" "}
                        <ArrowRight className='ml-1 inline h-4 w-4 transition-transform group-hover/button:translate-x-0.5' />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>
    </section>
  );
}

export function Testimonials() {
  return (
    <section className='container mx-auto px-4 py-12'>
      <h2 className='mb-6 text-2xl font-semibold tracking-tight md:text-3xl'>
        What Clients Say
      </h2>
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {testimonials.map((t) => (
          <Card key={t.id}>
            <CardHeader>
              <CardTitle className='text-lg'>{t.name}</CardTitle>
              <CardDescription>
                {t.location} •{" "}
                <span className='text-amber-500'>{"★".repeat(t.rating)}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className='text-muted-foreground'>{t.text}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

export function ServicesOverview() {
  const services = useQuery(api.services.getServices);

  const iconBySlug: Record<
    string,
    React.ComponentType<{ className?: string }>
  > = {
    "air-ticketing": Plane,
    "car-rentals": Car,
    "safari-tours": Binoculars,
    "team-building": UsersRound,
    "hotel-reservations": BedDouble,
    "airbnb-arrangements": Home,
  };

  const colorBySlug: Record<string, string> = {
    "air-ticketing": "from-sky-500 to-cyan-500",
    "car-rentals": "from-amber-500 to-orange-500",
    "safari-tours": "from-emerald-500 to-lime-500",
    "team-building": "from-violet-500 to-fuchsia-500",
    "hotel-reservations": "from-blue-500 to-indigo-500",
    "airbnb-arrangements": "from-rose-500 to-pink-500",
  };

  return (
    <section className='container mx-auto px-4 py-12'>
      <div className='mb-6 flex items-end justify-between'>
        <div>
          <h2 className='text-2xl font-semibold tracking-tight md:text-3xl'>
            Our Services
          </h2>
          <p className='text-sm text-muted-foreground'>
            From air tickets to team building, we handle it end-to-end.
          </p>
        </div>
        <Button
          asChild
          className='bg-amber-600 text-white hover:text-amber-600 hover:bg-amber-100'>
          <Link href='/services'>Explore</Link>
        </Button>
      </div>
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {services === undefined ? (
          Array.from({ length: 6 }).map((_, idx) => (
            <Card key={idx} className='h-full overflow-hidden'>
              <CardHeader>
                <div className='mb-3 flex items-center gap-3'>
                  <span className='inline-flex h-11 w-11 shrink-0 rounded-xl bg-muted animate-pulse' />
                  <div className='h-5 w-1/2 rounded bg-muted animate-pulse' />
                </div>
                <div className='h-3 w-2/3 rounded bg-muted animate-pulse' />
              </CardHeader>
            </Card>
          ))
        ) : services.length < 1 ? (
          <Card className='col-span-full'>
            <CardHeader>
              <CardTitle>No services available</CardTitle>
              <CardDescription className='text-sm'>
                Please check back later.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          services.map((s) => (
            <Card
              key={s._id}
              className='group h-full overflow-hidden transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg'>
              <CardHeader>
                <div className='mb-3 flex items-center gap-3'>
                  {(() => {
                    const Icon = iconBySlug[s.slug] ?? Home;
                    const gradient =
                      colorBySlug[s.slug] ?? "from-slate-400 to-slate-600";
                    return (
                      <span
                        className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-sm transition-transform duration-200 group-hover:scale-105`}>
                        <Icon className='h-5 w-5' />
                      </span>
                    );
                  })()}
                  <CardTitle className='leading-tight'>{s.title}</CardTitle>
                </div>
                <CardDescription className='text-sm'>
                  {s.subtitle}
                </CardDescription>
              </CardHeader>
            </Card>
          ))
        )}
      </div>
    </section>
  );
}
