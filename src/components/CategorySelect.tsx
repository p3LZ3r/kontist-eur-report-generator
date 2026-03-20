import * as React from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "./ui/command";
import { Check, Plus, Minus, User } from "lucide-react";
import { cn } from "../lib/utils";

export interface CategorySelectProps {
  value: string | undefined;
  onChange: (value: string) => void;
  categories: Array<[string, { code: string; name: string; type: string; vat: number }]>;
  frequentCategories?: string[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const CATEGORY_TYPE_ICON: Record<string, React.ReactNode> = {
  income: <Plus className="h-3.5 w-3.5" />,
  expense: <Minus className="h-3.5 w-3.5" />,
  private: <User className="h-3.5 w-3.5" />,
};

const CATEGORY_TYPE_COLORS: Record<string, string> = {
  income: "text-income",
  expense: "text-expense",
  private: "text-private",
};

export function CategorySelect({
  value,
  onChange,
  categories,
  frequentCategories = [],
  placeholder = "Konto wählen...",
  disabled = false,
  className,
}: CategorySelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  const selectedCategory = React.useMemo(() => {
    if (!value) return null;
    return categories.find(([key]) => key === value);
  }, [categories, value]);

  const filteredCategories = React.useMemo(() => {
    if (!search) return categories;
    const searchLower = search.toLowerCase();
    return categories.filter(
      ([, cat]) =>
        cat.name.toLowerCase().includes(searchLower) ||
        cat.code.includes(searchLower),
    );
  }, [categories, search]);

  const { frequent, other } = React.useMemo(() => {
    if (frequentCategories.length === 0) {
      return { frequent: [], other: filteredCategories };
    }
    const frequentSet = new Set(frequentCategories);
    const frequent: typeof filteredCategories = [];
    const other: typeof filteredCategories = [];
    for (const cat of filteredCategories) {
      if (frequentSet.has(cat[0])) {
        frequent.push(cat);
      } else {
        other.push(cat);
      }
    }
    return { frequent, other };
  }, [filteredCategories, frequentCategories]);

  const handleSelect = React.useCallback(
    (selectedValue: string) => {
      onChange(selectedValue);
      setOpen(false);
      setSearch("");
    },
    [onChange],
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    },
    [],
  );

  React.useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const displayValue = selectedCategory
    ? `${selectedCategory[1].code} - ${selectedCategory[1].name}`
    : placeholder;

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen(!open)}
        onKeyDown={handleKeyDown}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "hover:bg-accent/50 cursor-pointer",
          selectedCategory?.[1].type === "private" && "border-private/30 bg-private/5",
        )}
      >
        <span className={cn("truncate", !selectedCategory && "text-muted-foreground")}>
          {displayValue}
        </span>
        <span className="ml-2 shrink-0 opacity-50">▼</span>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full min-w-[300px] rounded-md border bg-popover shadow-lg">
          <Command className="rounded-lg" loop={false} filter={(value, search) => {
            const category = categories.find(([k]) => k === value);
            if (!category) return 0;
            const searchLower = search.toLowerCase();
            if (category[1].code.includes(searchLower)) return 1;
            if (category[1].name.toLowerCase().includes(searchLower)) return 0.8;
            return 0;
          }}>
            <CommandInput
              placeholder="Suchen..."
              value={search}
              onValueChange={setSearch}
            />
            <CommandEmpty className="py-6 text-center text-sm">
              Keine Kategorien gefunden.
            </CommandEmpty>

            <div ref={listRef} className="max-h-60 overflow-y-auto">
              {frequent.length > 0 && (
                <CommandGroup heading="Häufig verwendet">
                  {frequent.slice(0, 15).map(([key, cat]) => (
                    <CategoryOption
                      key={key}
                      code={key}
                      category={cat}
                      isSelected={value === key}
                      onSelect={handleSelect}
                    />
                  ))}
                </CommandGroup>
              )}

              {other.length > 0 && (
                <CommandGroup heading={frequent.length > 0 ? "Alle Konten" : undefined}>
                  {other.map(([key, cat]) => (
                    <CategoryOption
                      key={key}
                      code={key}
                      category={cat}
                      isSelected={value === key}
                      onSelect={handleSelect}
                    />
                  ))}
                </CommandGroup>
              )}
            </div>
          </Command>
        </div>
      )}
    </div>
  );
}

interface CategoryOptionProps {
  code: string;
  category: { code: string; name: string; type: string; vat: number };
  isSelected: boolean;
  onSelect: (value: string) => void;
}

function CategoryOption({ code, category, isSelected, onSelect }: CategoryOptionProps) {
  return (
    <CommandItem
      value={code}
      onSelect={() => onSelect(code)}
      className={cn(
        "flex cursor-pointer items-center justify-between px-3 py-2",
        "aria-selected:bg-accent/50",
        isSelected && "bg-accent/30",
      )}
    >
      <div className="flex items-center gap-2 overflow-hidden">
        <span className={cn("shrink-0", CATEGORY_TYPE_COLORS[category.type])}>
          {CATEGORY_TYPE_ICON[category.type]}
        </span>
        <span className="shrink-0 font-mono text-xs">{category.code}</span>
        <span className="truncate text-sm">{category.name}</span>
      </div>
      {isSelected && <Check className="h-4 w-4 shrink-0 text-income" />}
    </CommandItem>
  );
}
