"use client";

import { api } from "@/convex/_generated/api";
import { company } from "@/lib/data";
import { useQuery } from "convex/react";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import Logo from "../Logo";

export function Footer() {
  const info = useQuery(api.companyInfo.getCompanyInfo);
  const socials = useQuery(api.socials.getSocials);
  const address = info?.address ?? company.address;
  const phones = (info?.phones as string[] | undefined) ?? company.phones;
  const email = info?.email ?? company.email;
  const instagramUrl = socials?.instagram || company.instagram;
  const facebookUrl = socials?.facebook || company.facebook;

  return (
    <footer className='border-t bg-background'>
      <div className='container mx-auto grid grid-cols-1 gap-8 px-4 py-10 md:grid-cols-4'>
        <div>
          <Logo className='w-20 h-20' />{" "}
          <p className='text-xl font-semibold'>Threescore Tours</p>
          <p className='mt-2 text-s text-muted-foreground'>
            Award‑winning travels and tours across Africa and beyond.
          </p>
        </div>
        <div>
          <div className='mb-2 font-semibold'>Quick Links</div>
          <ul className='space-y-2 text-muted-foreground'>
            <li>
              <Link href='/about'>About Us</Link>
            </li>
            <li>
              <Link href='/packages'>Packages</Link>
            </li>
            <li>
              <Link href='/services'>Services</Link>
            </li>
            <li>
              <Link href='/blog'>Blog</Link>
            </li>
            <li>
              <Link href='/contact'>Contact</Link>
            </li>
          </ul>
        </div>
        <div>
          <div className='mb-2 font-semibold'>Contact</div>
          <a
            href={`https://www.google.com/maps?q=${encodeURIComponent(address)}`}
            target='_blank'
            rel='noreferrer'
            className='flex items-center gap-2 text-sm text-muted-foreground hover:underline'>
            <MapPin className='h-4 w-4' />
            <span>{address}</span>
          </a>
          <ul className='mt-2 space-y-1 text-muted-foreground'>
            {phones.map((p) => (
              <li key={p}>
                <a
                  href={`tel:${p}`}
                  className='flex items-center gap-2 hover:underline'>
                  <Phone className='h-4 w-4' />
                  <span>{p}</span>
                </a>
              </li>
            ))}
          </ul>
          <a
            href={`mailto:${email}`}
            className='mt-1 flex items-center gap-2 text-sm text-muted-foreground hover:underline'>
            <Mail className='h-4 w-4' />
            <span>{email}</span>
          </a>
        </div>
        <div>
          <div className='mb-2 font-semibold'>Social</div>
          <ul className='space-y-2 text-muted-foreground'>
            <li>
              <a
                href={instagramUrl}
                target='_blank'
                rel='noreferrer'
                className='flex items-center gap-2 hover:underline'>
                <Instagram className='h-4 w-4' />
                <span>Instagram</span>
              </a>
            </li>
            <li>
              <a
                href={facebookUrl}
                target='_blank'
                rel='noreferrer'
                className='flex items-center gap-2 hover:underline'>
                <Facebook className='h-4 w-4' />
                <span>Facebook</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className='border-t py-4 text-center text-xs text-muted-foreground'>
        © {new Date().getFullYear()} Threescore Exquisite Ltd Tours. All rights
        reserved.
      </div>
    </footer>
  );
}
