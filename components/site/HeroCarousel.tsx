"use client";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

type HeroSlide = {
  title: string;
  subtitle: string;
  image: string;
};

export function HeroCarousel() {
  const data = useQuery(api.carousel.getCarousel);

  const slides = React.useMemo<HeroSlide[] | undefined>(() => {
    if (data === undefined) return undefined; // loading
    if (!data) return []; // empty
    return Array.isArray(data) ? (data as HeroSlide[]) : [data as HeroSlide];
  }, [data]);

  const [index, setIndex] = React.useState(0);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    if (!slides || slides.length <= 1) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      return;
    }
    const t = setTimeout(() => setIndex((i) => (i + 1) % slides.length), 5500);
    timeoutRef.current = t;
    return () => clearTimeout(t);
  }, [index, slides]);

  const showSkeleton =
    slides === undefined || (Array.isArray(slides) && slides.length < 1);

  return (
    <div className='relative h-[68vh] w-full overflow-hidden rounded-xl border shadow-sm md:h-[78vh]'>
      {showSkeleton ? (
        <div className='absolute inset-0'>
          <div className='absolute inset-0 bg-muted/30 animate-pulse' />
          <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent' />
          <div className='absolute inset-x-0 bottom-0 p-6 md:p-10'>
            <div className='max-w-2xl space-y-4'>
              <div className='h-8 md:h-12 w-3/4 bg-white/20 rounded animate-pulse' />
              <div className='h-4 md:h-5 w-full bg-white/20 rounded animate-pulse' />
              <div className='h-4 md:h-5 w-5/6 bg-white/20 rounded animate-pulse' />
              <div className='flex gap-3 pt-2'>
                <div className='h-10 w-32 bg-white/20 rounded animate-pulse' />
                <div className='h-10 w-28 bg-white/10 rounded animate-pulse' />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <AnimatePresence mode='wait'>
          {slides && slides.length > 0 && (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0.4 }}
              transition={{ duration: 0.6 }}
              className='absolute inset-0'>
              <Image
                src={slides[index]?.image || ""}
                alt={slides[index]?.title || "Hero image"}
                fill
                priority
                quality={90}
                sizes='100vw'
                className='object-cover'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent' />
              <div className='absolute inset-x-0 bottom-0 p-6 md:p-10'>
                <div className='max-w-2xl space-y-3 text-white'>
                  <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className='text-3xl font-bold md:text-5xl'>
                    {slides[index]?.title}
                  </motion.h1>
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className='text-sm md:text-base text-white/90'>
                    {slides[index]?.subtitle}
                  </motion.p>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className='flex flex-wrap gap-3 mb-4 sm:mb-0'>
                    <Button asChild>
                      <Link href='/packages'>Explore Packages</Link>
                    </Button>
                    <Button asChild variant='secondary'>
                      <Link href='/contact'>Book Now</Link>
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {slides && slides.length > 1 && (
        <div className='absolute bottom-4 right-4 flex gap-2'>
          {slides.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2.5 w-2.5 rounded-full ${i === index ? "bg-white" : "bg-white/50"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
