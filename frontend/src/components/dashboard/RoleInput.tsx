import { motion, useReducedMotion } from "framer-motion";
import { Briefcase, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { COMMON_ROLES } from "@/types/dashboard.types";

interface RoleInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function RoleInput({ value, onChange, error }: RoleInputProps) {
  const reduced = useReducedMotion();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Reset the highlighted suggestion when the query changes.
  const [lastValue, setLastValue] = useState(value);
  if (lastValue !== value) {
    setLastValue(value);
    setHighlightedIndex(-1);
  }

  const suggestions = useMemo(() => {
    const query = value.trim().toLowerCase();
    if (!query) return [...COMMON_ROLES];
    return COMMON_ROLES.filter((role) => role.toLowerCase().includes(query));
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        !inputRef.current?.contains(e.target as Node) &&
        !dropdownRef.current?.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSuggestionSelect = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1,
        );
        break;
      case "Enter":
        if (highlightedIndex >= 0) {
          e.preventDefault();
          handleSuggestionSelect(suggestions[highlightedIndex]);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        break;
      default:
        break;
    }
  };

  return (
    <div className="relative">
      <label htmlFor="role" className="text-label text-text">
        Target Role
      </label>
      <div className="relative mt-2">
        <Briefcase
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
          aria-hidden="true"
        />
        <Input
          ref={inputRef}
          id="role"
          type="text"
          placeholder="e.g. Full Stack Developer"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          invalid={Boolean(error)}
          className="h-11 pl-11 pr-12"
          aria-describedby={error ? "role-error" : "role-hint"}
          aria-autocomplete="list"
          aria-controls="role-suggestions"
          aria-expanded={showSuggestions && suggestions.length > 0}
        />
        {value ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1.5 top-1/2 h-8 w-8 -translate-y-1/2 text-text-muted hover:text-error"
            onClick={() => {
              onChange("");
              setShowSuggestions(true);
              inputRef.current?.focus();
            }}
            aria-label="Clear role"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </Button>
        ) : null}

        {showSuggestions && suggestions.length > 0 ? (
          <motion.div
            ref={dropdownRef}
            id="role-suggestions"
            initial={reduced ? false : { opacity: 0, y: -4 }}
            animate={reduced ? false : { opacity: 1, y: 0 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-card border border-border bg-surface shadow-modal"
            role="listbox"
            aria-label="Role suggestions"
          >
            <p className="px-3 py-2 text-caption text-text-muted">Common roles</p>
            {suggestions.map((suggestion, index) => (
              <button
                key={suggestion}
                type="button"
                role="option"
                aria-selected={index === highlightedIndex}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSuggestionSelect(suggestion)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={cn(
                  "flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-text transition-colors duration-fast",
                  index === highlightedIndex ? "bg-primary/10 text-primary" : "hover:bg-primary/5",
                )}
              >
                <Briefcase className="h-3.5 w-3.5 text-text-muted" aria-hidden="true" />
                <span>{suggestion}</span>
              </button>
            ))}
          </motion.div>
        ) : null}
      </div>
      {error ? (
        <p id="role-error" className="mt-1.5 text-sm text-error" role="alert">
          {error}
        </p>
      ) : (
        <p id="role-hint" className="mt-1.5 text-caption text-text-muted">
          Choose a common role or enter your own.
        </p>
      )}
    </div>
  );
}
