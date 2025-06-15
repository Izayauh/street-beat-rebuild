
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Mail, CheckCircle } from "lucide-react";

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
    
    console.log('Starting quote submission...');
    console.log('User authenticated:', !!user);
    console.log('Supabase client available:', !!supabase);
    
    // Validate email for guests
    if (!user) {
      const emailErr = validateEmail(email);
      setEmailError(emailErr);
      if (emailErr) {
        console.log('Email validation failed:', emailErr);
        return;
      }
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
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Error details:', error.details);
        throw new Error(`Database error: ${error.message}`);
      }

      if (!data || data.length === 0) {
        console.error('No data returned from insert operation');
        throw new Error("No data returned from database");
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
      console.error('Error type:', typeof error);
      console.error('Error stack:', error.stack);
      setSubmitting(false);
      
      // Provide more specific error messages
      let errorMessage = "Failed to submit quote. Please try again.";
      if (error.message?.includes('JWT')) {
        errorMessage = "Authentication error. Please try logging in again.";
      } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
        errorMessage = "Network error. Please check your connection and try again.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    }
  };

  if (showSuccess) {
    return (
      <div className="p-8 flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-8 h-8 text-green-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Quote request submitted!</h3>
        <p className="text-gray-400 mb-4">
          Thank you! Our team will reach out soon with your personalized quote.
        </p>
        <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 animate-pulse"></div>
        </div>
      </div>
    );
  }

  // Final step is email capture if user not logged in
  const isFinalStep = step === steps.length;
  const progressPercentage = ((step + (isFinalStep && !user ? 1 : 0)) / (steps.length + (!user ? 1 : 0))) * 100;

  return (
    <div className="max-w-lg mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Step {step + (isFinalStep && !user ? 1 : 0)} of {steps.length + (!user ? 1 : 0)}</span>
          <span className="text-sm text-gray-400">{Math.round(progressPercentage)}% Complete</span>
        </div>
        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {!isFinalStep && (
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{current.label}</h2>
                  <p className="text-gray-400 text-sm">
                    {current.required ? "This field is required" : "This field is optional"}
                  </p>
                </div>

                {current.inputType === "radio" && current.options ? (
                  <div className="grid gap-3">
                    {current.options.map((opt) => (
                      <label 
                        key={opt} 
                        className="flex items-center p-4 bg-gray-800/50 border border-gray-700 rounded-lg cursor-pointer hover:border-purple-500/50 transition-all duration-200 group"
                      >
                        <input
                          type="radio"
                          className="w-4 h-4 text-purple-500 bg-gray-700 border-gray-600 focus:ring-purple-500 focus:ring-2"
                          value={opt}
                          checked={answers[current.name] === opt}
                          onChange={() => handleInput(current.name, opt)}
                          required={current.required}
                        />
                        <span className="ml-3 text-gray-200 group-hover:text-white transition-colors">
                          {opt}
                        </span>
                      </label>
                    ))}
                  </div>
                ) : current.inputType === "textarea" ? (
                  <Textarea
                    value={answers[current.name] || ""}
                    onChange={(e) => handleInput(current.name, e.target.value)}
                    placeholder={current.placeholder}
                    required={current.required}
                    className="min-h-[120px] bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 resize-none"
                  />
                ) : (
                  <Input
                    type={current.inputType}
                    value={answers[current.name] || ""}
                    onChange={(e) => handleInput(current.name, e.target.value)}
                    placeholder={current.placeholder}
                    required={current.required}
                    className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500"
                  />
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Email step for guest users */}
        {isFinalStep && !user && (
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-6 h-6 text-purple-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Almost done!</h2>
                  <p className="text-gray-400">Enter your email so we can send you the quote</p>
                </div>

                <div className="space-y-2">
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
                    className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500"
                  />
                  {emailError && (
                    <p className="text-red-400 text-sm">{emailError}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center pt-4">
          {!isFinalStep ? (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={step === 0}
                className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                type="button"
                onClick={handleNext}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </>
          ) : (
            <Button 
              type="submit" 
              disabled={submitting}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 text-lg font-semibold"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Submitting...
                </>
              ) : (
                "Submit Request"
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default QuoteForm;
