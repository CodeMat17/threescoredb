import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";

type EditCarouselModalProps = {
  trigger: ReactNode;
  initialTitle: string;
  initialSubtitle?: string;
  initialPreviewUrl?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  description?: string;
  onConfirm: (data: {
    title: string;
    subtitle: string;
    file?: File;
  }) => Promise<void> | void;
};

const EditCarouselModal = ({
  trigger,
  initialTitle,
  initialSubtitle = "",
  initialPreviewUrl,
  confirmLabel = "Save",
  cancelLabel = "Cancel",
  description = "Update the carousel details.",
  onConfirm,
}: EditCarouselModalProps) => {
  const [title, setTitle] = useState<string>(initialTitle);
  const [subtitle, setSubtitle] = useState<string>(initialSubtitle);
  const [file, setFile] = useState<File | undefined>(undefined);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(
    initialPreviewUrl
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files;
    if (!list || list.length === 0) {
      setFile(undefined);
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(initialPreviewUrl);
      return;
    }
    const nextFile = list[0];
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setFile(nextFile);
    setPreviewUrl(URL.createObjectURL(nextFile));
  };

  const handleConfirm = async () => {
    if (!title.trim()) return;
    try {
      setIsSubmitting(true);
      await onConfirm({ title: title.trim(), subtitle: subtitle.trim(), file });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Carousel</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <div className='grid gap-3 sm:grid-cols-2'>
          <div className='space-y-3'>
            <Input
              type='text'
              placeholder='Title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Input
              type='text'
              placeholder='Subtitle'
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
            />
            <Input type='file' accept='image/*' onChange={handleFileChange} />
          </div>
          <div className='flex items-center justify-center'>
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt='Preview'
                width={768}
                height={160}
                unoptimized
                className='h-40 w-full max-w-md rounded-md object-cover'
              />
            ) : (
              <div className='h-40 w-full max-w-md rounded-md border bg-muted/30' />
            )}
          </div>
        </div>
        <div className='mt-4 flex justify-end gap-2'>
          <AlertDialogCancel asChild disabled={isSubmitting}>
            <Button>{cancelLabel}</Button>
          </AlertDialogCancel>
          <AlertDialogAction
            asChild
            onClick={handleConfirm}
            disabled={isSubmitting}>
            <Button variant={'outline'} className="bg-secondary">{isSubmitting ? "Saving..." : confirmLabel}</Button>
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EditCarouselModal;
