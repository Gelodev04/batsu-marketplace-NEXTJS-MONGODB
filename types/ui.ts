export type ImageDropzoneProps = {
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  disabled?: boolean;
};

// Only move ButtonProps if used across multiple files.
// Otherwise keep it colocated in components/ui/button.tsx.
export interface ButtonProps {
  // mirror current props you want to share
}
