"use client";

import React from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { FiAlertTriangle } from "react-icons/fi";
import useConversation from "@/app/hooks/useConversation";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";

interface ConfirmModalProps {
  isOpen?: boolean;
  onClose: () => void;
}

export function ConfirmModal({ isOpen, onClose }: ConfirmModalProps) {
  const router = useRouter();
  const { conversationId } = useConversation();
  const [isLoading, setIsLoading] = React.useState(false);

  const onDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.delete(`/api/conversations/${conversationId}`);
      router.push("/conversations");
      router.refresh();
      onClose();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-[#303030] border-none text-neutral-100">
        <AlertDialogHeader>
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-600/20 text-red-600">
              <FiAlertTriangle className="h-6 w-6" />
            </div>
            <AlertDialogTitle>Delete conversation</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-neutral-400 pt-2 text-left">
            Are you sure you want to delete this conversation? This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel
            disabled={isLoading}
            className="bg-neutral-700 text-white border-none hover:bg-neutral-600"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onDelete}
            disabled={isLoading}
            className={buttonVariants({ variant: "destructive" })}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
