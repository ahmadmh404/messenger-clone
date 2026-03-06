"use client";

import ReactSelect from "react-select";
import { cn } from "@/lib/utils";

interface SelectProps {
  label: string;
  value?: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  options?: Record<string, any>[];
  disabled?: boolean;
}

export function Select({
  label,
  value,
  onChange,
  options,
  disabled,
}: SelectProps) {
  return (
    <div className="z-50">
      <label className="block text-sm font-medium leading-6 text-neutral-300">
        {label}
      </label>
      <div className="mt-2">
        <ReactSelect
          isDisabled={disabled}
          value={value}
          onChange={onChange}
          isMulti
          options={options}
          menuPortalTarget={
            typeof document !== "undefined" ? document.body : null
          }
          unstyled
          classNames={{
            control: ({ isFocused }) =>
              cn(
                "flex min-h-[38px] w-full rounded-md border-0 bg-[#303030] px-1 text-sm text-white ring-1 ring-inset ring-[#454545] transition-all",
                isFocused ? "ring-2 ring-sky-600" : "ring-1",
              ),
            menu: () =>
              "mt-2 overflow-hidden rounded-md bg-[#303030] border border-[#454545] shadow-xl",
            option: ({ isFocused, isSelected }) =>
              cn(
                "cursor-pointer px-3 py-2 text-sm transition-colors",
                isFocused && "bg-[#404040] text-white",
                isSelected && "bg-sky-600 text-white",
              ),
            multiValue: () =>
              "mr-1 flex items-center rounded bg-[#454545] px-2 py-0.5 text-xs text-white",
            multiValueLabel: () => "text-white",
            multiValueRemove: () =>
              "ml-1 hover:text-rose-400 transition-colors",
            placeholder: () => "text-neutral-500 ml-1",
            noOptionsMessage: () => "p-4 text-neutral-400 text-sm",
            dropdownIndicator: () =>
              "p-2 text-neutral-500 hover:text-neutral-300",
            indicatorsContainer: () => "gap-1",
            input: () => "text-white",
          }}
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          }}
        />
      </div>
    </div>
  );
}
