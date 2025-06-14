
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Step {
  label: string;
  required: boolean;
  inputType: "radio" | "text" | "textarea" | "number";
  name: string;
  options?: string[];
  placeholder?: string;
  validate?: (value: string) => string | null;
}

const steps: Step[] = [
  {
    label: "What service do you need?",
    required: true,
    inputType: "radio",
    name: "service",
    options: [
      "Recording",
      "Mixing",
      "Mastering",
      "Beat Production",
      "Vocal Production",
      "Artist Development",
    ],
  },
  {
    label: "What's your preferred date (optional)?",
    required: false,
    inputType: "text",
    name: "date",
    placeholder: "MM/DD/YYYY",
  },
  {
    label: "Do you have any specific requirements or notes?",
    required: false,
    inputType: "textarea",
    name: "notes",
    placeholder: "Let us know anything important about your project...",
  },
  {
    label: "What is your estimated budget? (Optional)",
    required: false,
    inputType: "text",
    name: "budget",
    placeholder: "ex: $400",
  },
];

type Answers = { [key: string]: string };

interface QuoteFormProps {
  onSuccess: () => void;
}

const QuoteForm: React.FC<QuoteFormProps> = ({ onSuccess }) => {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const current = steps[step];

  // Validation for the current step
  function validate(value: string, step: Step): string | null {
    if (step.required && !value.trim()) {
      return "This field is required.";
    }
    if (step.name === "service" && step.required && !value) {
      return "Please select a service.";
    }
    return null;
  }

  // Email validation
  const validateEmail = (value: string) => {
    if (!value.trim()) return "Email is required.";
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(value)) return "Please enter a valid email address.";
    return null;
  };

  const handleNext = () => {
    const value = answers[current.name] || "";
    const error = validate(value, current);
    if (error) {
      toast.error(error);
      return;
    }
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    if (step === 0) return;
    setStep((s) => s - 1);
  };

  const handleInput = (name: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email for guests
    if (!user) {
      const emailErr = validateEmail(email);
      setEmailError(emailErr);
      if (emailErr) return;
    }
    
    setSubmitting(true);

    try {
      // Compose data
      let record: {
        user_id?: string | null;
        email?: string;
        answers: Answers;
      } = {
        answers,
      };

      if (user) {
        record.user_id = user.id;
        record.email = user.email ?? undefined;
      } else {
        record.user_id = null;
        record.email = email.trim();
      }

      console.log('Submitting quote with data:', record);

      // Save quote to database
      const { data, error } = await supabase.from("quotes").insert([record]).select();

      if (error) {
        console.error('Database error:', error);
        throw new Error("Failed to save quote to database");
      }

      console.log('Quote saved successfully:', data[0]);

      // Try to send quote email, but don't fail if it doesn't work
      try {
        console.log('Attempting to send quote email...');
        const { error: emailError } = await supabase.functions.invoke('send-quote-email', {
          body: { quoteId: data[0].id }
        });
        
        if (emailError) {
          console.warn('Failed to send quote email:', emailError);
          // Don't throw - just log the warning
        } else {
          console.log('Quote email sent successfully');
        }
      } catch (emailError) {
        console.warn('Error invoking quote email function:', emailError);
        // Don't throw - just log the warning
      }

      // Show success regardless of email status
      setSubmitting(false);
      setShowSuccess(true);
      toast.success("Quote request submitted successfully! We'll get back to you soon.");
      
      setTimeout(() => {
        setShowSuccess(false);
        onSuccess();
      }, 2000);

    } catch (error: any) {
      console.error('Quote submission error:', error);
      setSubmitting(false);
      toast.error(error.message || "Failed to submit quote. Please try again.");
    }
  };

  if (showSuccess) {
    return (
      <div className="p-8 flex flex-col items-center text-center">
        <span role="img" aria-label="check" className="text-4xl mb-3">
          ✅
        </span>
        <div className="text-xl text-white mb-1">Quote request submitted!</div>
        <div className="text-gray-400 mb-2">
          Thank you! Our team will reach out soon.
        </div>
      </div>
    );
  }

  // Final step is email capture if user not logged in
  const isFinalStep = step === steps.length;
  return (
    <form
      className="p-2 flex flex-col items-center w-full max-w-sm"
      onSubmit={handleSubmit}
      autoComplete="off"
    >
      {!isFinalStep && (
        <>
          <div className="mb-6 w-full text-left">
            <label className="text-lg font-bold text-white mb-4 block">{current.label}</label>
            {current.inputType === "radio" && current.options ? (
              <div className="flex flex-col space-y-2">
                {current.options.map((opt) => (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer text-gray-200 hover:text-white">
                    <input
                      type="radio"
                      className="accent-purple-500"
                      value={opt}
                      checked={answers[current.name] === opt}
                      onChange={() => handleInput(current.name, opt)}
                      required={current.required}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            ) : current.inputType === "textarea" ? (
              <Textarea
                value={answers[current.name] || ""}
                onChange={(e) => handleInput(current.name, e.target.value)}
                placeholder={current.placeholder}
                required={current.required}
              />
            ) : (
              <Input
                type={current.inputType}
                value={answers[current.name] || ""}
                onChange={(e) => handleInput(current.name, e.target.value)}
                placeholder={current.placeholder}
                required={current.required}
              />
            )}
          </div>
          <div className="flex justify-between w-full">
            <Button
              type="button"
              variant="secondary"
              onClick={handleBack}
              disabled={step === 0}
              className="mr-2"
            >
              Back
            </Button>
            <Button
              type="button"
              onClick={handleNext}
              className="ml-2"
            >
              Next
            </Button>
          </div>
        </>
      )}

      {/* Email step for guest users */}
      {isFinalStep && !user && (
        <>
          <div className="mb-6 w-full text-left">
            <label className="text-lg font-bold text-white mb-3 block">Enter your email so we can send your quote</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError(null);
              }}
              placeholder="your@email.com"
              disabled={submitting}
              required
            />
            {emailError && <div className="text-red-400 text-sm mt-2">{emailError}</div>}
          </div>
          <Button className="w-full" type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Request"}
          </Button>
        </>
      )}

      {isFinalStep && user && (
        <Button className="w-full" type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Request"}
        </Button>
      )}
    </form>
  );
};

export default QuoteForm;
