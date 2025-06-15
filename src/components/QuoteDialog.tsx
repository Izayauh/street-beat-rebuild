
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import QuoteForm from "./QuoteForm";
import { X } from "lucide-react";

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
      <DialogContent className="bg-black/95 backdrop-blur-sm border border-gray-800 max-w-2xl mx-auto p-0 rounded-2xl shadow-2xl">
        <DialogHeader className="p-8 pb-4">
          <DialogTitle className="text-white text-3xl font-bold text-center bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Get Your Personalized Quote
          </DialogTitle>
          <p className="text-gray-400 text-center mt-2">
            Tell us about your project and we'll provide a custom quote within 24 hours
          </p>
        </DialogHeader>
        
        <div className="px-8 pb-8">
          <QuoteForm key={formKey} onSuccess={handleClose} />
        </div>
        
        <DialogClose asChild>
          <button
            aria-label="Close"
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-800"
            onClick={handleClose}
          >
            <X className="w-5 h-5" />
          </button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default QuoteDialog;
