
import React, { useState } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const PasswordReset = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [step, setStep] = useState(1);

    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            // No redirectTo here to ensure OTP is sent
        });

        setLoading(false);
        if (error) {
            setError(error.message);
        } else {
            setMessage('A password reset code has been sent to your email.');
            setStep(2);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        // 1. Verify the OTP
        const { error: verifyError } = await supabase.auth.verifyOtp({
            email,
            token: otp,
            type: 'recovery',
        });

        if (verifyError) {
            setLoading(false);
            setError(verifyError.message);
            return;
        }

        // 2. Update the password
        const { error: updateError } = await supabase.auth.updateUser({
            password: newPassword,
        });

        setLoading(false);
        if (updateError) {
            setError(updateError.message);
        } else {
            setMessage('Your password has been updated successfully. You can now log in with your new password.');
            setStep(3); // A final success step
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <Card className="w-full max-w-md mx-4">
                <CardHeader>
                    <CardTitle>Reset Your Password</CardTitle>
                </CardHeader>
                <CardContent>
                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    {message && (
                         <Alert variant="default" className="mb-4 bg-green-100 border-green-400 text-green-700">
                            <AlertTitle>Success</AlertTitle>
                            <AlertDescription>{message}</AlertDescription>
                        </Alert>
                    )}

                    {step === 1 && (
                        <form onSubmit={handleSendCode}>
                            <div className="space-y-4">
                                <p className="text-sm text-gray-600">Enter your email address and we'll send you a code to reset your password.</p>
                                <div>
                                    <label htmlFor="email" className="sr-only">Email</label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? 'Sending...' : 'Send Reset Code'}
                                </Button>
                            </div>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleResetPassword}>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="email-confirm" className="sr-only">Email</label>
                                    <Input
                                        id="email-confirm"
                                        type="email"
                                        value={email}
                                        readOnly
                                        disabled
                                        className="bg-gray-100"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="otp" className="sr-only">OTP Code</label>
                                    <Input
                                        id="otp"
                                        type="text"
                                        placeholder="Enter the 6-digit code"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="new-password">New Password</label>
                                    <Input
                                        id="new-password"
                                        type="password"
                                        placeholder="Enter your new password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? 'Resetting...' : 'Reset Password'}
                                </Button>
                            </div>
                        </form>
                    )}
                     {step === 3 && (
                        <div className="text-center">
                            <p>You can now close this window and log in.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default PasswordReset;
