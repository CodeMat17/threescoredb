"use client";
export const dynamic = "force-dynamic";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type ContactDoc = Doc<"contact">;

export default function AdminContact() {
  const contactsRes = useQuery(api.contact.getContact) as unknown;
  const deleteContact = useMutation(api.contact.deleteContact);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const contacts: ContactDoc[] = useMemo(() => {
    if (contactsRes === undefined || contactsRes === null) return [];
    return Array.isArray(contactsRes)
      ? (contactsRes as ContactDoc[])
      : [contactsRes as ContactDoc];
  }, [contactsRes]);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    const list: ContactDoc[] = contacts ?? [];
    if (!s) return list;
    return list.filter((c) =>
      [c.fullName, c.email, c.phone, c.comment]
        .map((v) => String(v ?? "").toLowerCase())
        .some((v) => v.includes(s))
    );
  }, [contacts, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filtered.length / pageSize)),
    [filtered.length]
  );

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const paged = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage]);

  const pageItems = useMemo<(number | "ellipsis")[]>(() => {
    if (totalPages <= 7)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 4) return [1, 2, 3, 4, 5, "ellipsis", totalPages];
    if (currentPage >= totalPages - 3)
      return [
        1,
        "ellipsis",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    return [
      1,
      "ellipsis",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "ellipsis",
      totalPages,
    ];
  }, [currentPage, totalPages]);

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <h1 className='text-2xl font-semibold'>Contact Submissions</h1>
        <div className='w-full sm:w-64'>
          <Input
            placeholder='Search submissions'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {contactsRes === undefined ? (
        <div className='space-y-2'>
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className='h-12 w-full animate-pulse rounded bg-muted'
            />
          ))}
        </div>
      ) : filtered.length < 1 ? (
        <div className='rounded-md border p-6 text-sm text-muted-foreground'>
          No submissions yet.
        </div>
      ) : (
        <div className='space-y-4'>
          {paged.map((c) => (
            <div key={c._id} className='rounded-md border p-4'>
              <div className='flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between'>
                <div className='font-medium'>{c.fullName}</div>
                <div className='text-xs text-muted-foreground'>
                  {new Date(c._creationTime).toLocaleString()}
                </div>
              </div>
              <div className='mt-1 text-sm'>
                <a className='underline' href={`mailto:${c.email}`}>
                  {c.email}
                </a>
                <span className='mx-2 opacity-60'>•</span>
                <a className='underline' href={`tel:${c.phone}`}>
                  {c.phone}
                </a>
              </div>
              <div className='mt-3 whitespace-pre-wrap text-sm text-foreground'>
                {c.comment}
              </div>
              <div className='mt-3 flex justify-end'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() =>
                    deleteContact({ id: c._id })
                      .then(() => toast.success("Deleted"))
                      .catch((e) => toast.error((e as Error).message))
                  }>
                  Delete
                </Button>
              </div>
            </div>
          ))}

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href='#'
                  aria-disabled={currentPage === 1}
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage((p) => p - 1);
                  }}
                />
              </PaginationItem>
              {pageItems.map((item, idx) => (
                <PaginationItem key={`${item}-${idx}`}>
                  {item === "ellipsis" ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      href='#'
                      isActive={item === currentPage}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(item as number);
                      }}>
                      {item}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href='#'
                  aria-disabled={currentPage === totalPages}
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
