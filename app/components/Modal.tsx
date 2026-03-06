"use client";

import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { IoClose } from "react-icons/io5";
import * as DialogPrimitive from "@radix-ui/react-dialog";

interface ModalProps {
  isOpen?: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export function Modal({
  isOpen,
  onClose,
  children,
  title,
  description,
}: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          "fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%]",
          "border-none bg-[#303030] p-6 shadow-xl duration-200",
          "sm:rounded-lg overflow-hidden",
        )}
      >
        {/* Screen reader accessibility requirements */}
        <DialogTitle className="sr-only">{title || "Modal Window"}</DialogTitle>
        <DialogDescription className="sr-only">
          {description || "Modal content"}
        </DialogDescription>

        {/* Custom Close Button - matching your original style */}
        <DialogPrimitive.Close
          className="absolute right-4 top-4 rounded-md bg-[#404040] text-gray-400 
                     hover:text-gray-300 focus:outline-none focus:ring-2 
                     focus:ring-sky-500 transition-opacity opacity-70 hover:opacity-100"
        >
          <IoClose className="h-6 w-6" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>

        <div className="relative">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
