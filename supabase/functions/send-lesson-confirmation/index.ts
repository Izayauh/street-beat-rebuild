
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { renderAsync } from "npm:@react-email/components@0.0.22";
import React from "npm:react@18.3.1";
import { LessonConfirmationEmail } from "./_templates/lesson-confirmation-email.tsx";
import { InstructorNotificationEmail } from "./_templates/instructor-notification-email.tsx";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface LessonBookingEmailRequest {
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  lessonType: string;
  instructorName?: string;
  instructorEmail?: string;
  preferredDate: string;
  preferredTime: string;
  message?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log('=== LESSON CONFIRMATION EMAIL FUNCTION CALLED ===');
  console.log('Method:', req.method);
  
  if (req.method === "OPTIONS") {
    console.log('Handling OPTIONS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    console.log('Method not allowed:', req.method);
    return new Response("Method not allowed", { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  try {
    const requestBody = await req.text();
    console.log('Raw request body:', requestBody);
    
    if (!requestBody) {
      throw new Error('No request body provided');
    }

    const bookingData: LessonBookingEmailRequest = JSON.parse(requestBody);
    console.log('Parsed booking data:', bookingData);

    const apiKey = Deno.env.get("RESEND_API_KEY");
    console.log('Resend API Key available:', !!apiKey);
    
    if (!apiKey) {
      throw new Error('RESEND_API_KEY not configured');
    }

    // Send confirmation email to student
    console.log('Rendering student confirmation email...');
    const studentEmailHtml = await renderAsync(
      React.createElement(LessonConfirmationEmail, {
        studentName: bookingData.studentName,
        lessonType: bookingData.lessonType,
        instructorName: bookingData.instructorName,
        preferredDate: bookingData.preferredDate,
        preferredTime: bookingData.preferredTime,
      })
    );

    console.log('Sending confirmation email to student:', bookingData.studentEmail);
    const studentEmailResult = await resend.emails.send({
      from: "3rd Street Music <onboarding@resend.dev>",
      to: [bookingData.studentEmail],
      subject: "🎵 Your Lesson Request Has Been Received!",
      html: studentEmailHtml,
    });

    console.log("Student email sent successfully:", studentEmailResult);

    // Send notification email to instructor (if instructor email is available)
    if (bookingData.instructorEmail) {
      console.log('Rendering instructor notification email...');
      const instructorEmailHtml = await renderAsync(
        React.createElement(InstructorNotificationEmail, {
          instructorName: bookingData.instructorName || 'Instructor',
          studentName: bookingData.studentName,
          studentEmail: bookingData.studentEmail,
          studentPhone: bookingData.studentPhone,
          lessonType: bookingData.lessonType,
          preferredDate: bookingData.preferredDate,
          preferredTime: bookingData.preferredTime,
          message: bookingData.message,
        })
      );

      console.log('Sending notification email to instructor:', bookingData.instructorEmail);
      const instructorEmailResult = await resend.emails.send({
        from: "3rd Street Music <onboarding@resend.dev>",
        to: [bookingData.instructorEmail],
        subject: `🎵 New Lesson Request - ${bookingData.studentName}`,
        html: instructorEmailHtml,
      });

      console.log("Instructor email sent successfully:", instructorEmailResult);
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Confirmation emails sent successfully"
      }),
      {
        status: 200,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );

  } catch (error: any) {
    console.error("=== LESSON EMAIL ERROR ===");
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        details: error.stack
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);
