
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import QuoteForm from "./QuoteForm";

interface QuoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const QuoteDialog: React.FC<QuoteDialogProps> = ({ open, onOpenChange }) => {
  const [formKey, setFormKey] = useState(0);

  // Reset form state when dialog closes
  const handleClose = () => {
    setFormKey((k) => k + 1);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-black max-w-md mx-auto p-0 sm:p-0 rounded-xl shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-white text-2xl text-center pt-4 pb-1">Get a Personalized Quote</DialogTitle>
        </DialogHeader>
        <QuoteForm key={formKey} onSuccess={handleClose} />
        <DialogClose asChild>
          <button
            aria-label="Close"
            className="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl"
            onClick={handleClose}
          >
            ×
          </button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default QuoteDialog;
