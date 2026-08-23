import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FileText, Upload, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ACCEPTED_FILE_TYPES } from "@/types/dashboard.types";

interface ResumeUploadProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  onRemove: () => void;
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export function ResumeUpload({
  file,
  onFileChange,
  onRemove,
}: ResumeUploadProps) {
  const reduced = useReducedMotion();
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openFilePicker = () => fileInputRef.current?.click();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);

      const dropped = e.dataTransfer.files?.[0];
      if (dropped) onFileChange(dropped);
    },
    [onFileChange],
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) onFileChange(selected);
    e.target.value = "";
  };

  return (
    <div>
      <p className="text-label text-text">Resume</p>
      <p className="mt-1 text-caption text-text-muted">
        Your resume helps InterviewAI personalize questions around your
        experience, skills, and projects.
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_FILE_TYPES.join(",")}
        onChange={handleFileSelect}
        className="sr-only"
        aria-label="Upload resume PDF"
      />

      <AnimatePresence mode="wait" initial={false}>
        {file ? (
          <motion.div
            key="selected"
            initial={reduced ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="mt-3 flex items-center gap-3 rounded-card border border-primary/30 bg-primary/5 p-4"
          >
            <div className="flex size-11 shrink-0 items-center justify-center rounded-input bg-primary/10 text-primary">
              <FileText className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-text">
                {file.name}
              </p>
              <p className="mt-0.5 text-caption text-text-muted">
                {formatFileSize(file.size)} · PDF
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                className="h-8 px-2 text-xs text-text-secondary"
                onClick={openFilePicker}
              >
                Change
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onRemove}
                aria-label="Remove resume"
                className="h-8 w-8 text-text-secondary hover:bg-error/10 hover:text-error"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="empty"
            type="button"
            initial={reduced ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "mt-3 w-full rounded-card border-2 border-dashed px-5 py-8 text-center transition-colors duration-base ease-premium",
              "border-border bg-surface-elevated hover:border-primary/45 hover:bg-primary/4",
              isDragActive && "border-primary bg-primary/5",
            )}
            onClick={openFilePicker}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload
              className={cn(
                "mx-auto mb-3 size-8 text-text-muted transition-colors duration-base",
                isDragActive && "text-primary",
              )}
              aria-hidden="true"
            />
            <p className="text-sm font-medium text-text">Upload your resume</p>
            <p className="mt-1 text-caption text-text-muted">
              Drag & drop or browse · PDF only · Max 6 MB
            </p>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
