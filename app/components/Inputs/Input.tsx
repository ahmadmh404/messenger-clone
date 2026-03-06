"use client";

import { Input as OriginalInput } from "@/components/ui/input";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import { cn } from "@/lib/utils";

interface InputProps {
  label: string;
  id: string;
  type?: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  disabled?: boolean;
  placeholder?: string;
}

export function Input({
  label,
  id,
  type = "text",
  required,
  register,
  errors,
  disabled,
  placeholder,
}: InputProps) {
  return (
    <div className="w-full space-y-2">
      <label
        htmlFor={id}
        className="block text-sm font-medium leading-6 text-gray-300"
      >
        {label}
      </label>
      <div className="relative">
        <OriginalInput
          id={id}
          type={type}
          autoComplete={id}
          disabled={disabled}
          placeholder={placeholder}
          {...register(id, { required })}
          className={cn(
            "block w-full rounded-md border-0 py-2 bg-[#202020] text-white shadow-sm ring-1 ring-inset ring-[#353535] placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 transition-all",
            errors[id] && "ring-rose-500 focus:ring-rose-500",
            disabled && "opacity-50 cursor-not-allowed",
          )}
        />
      </div>
      {/* Error Message Display */}
      {errors[id] && (
        <p className="text-xs text-rose-500 mt-1">
          {(errors[id]?.message as string) || `${label} is required`}
        </p>
      )}
    </div>
  );
}
