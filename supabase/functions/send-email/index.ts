import { render } from 'npm:@react-email/render@0.0.7';
import { Resend } from 'npm:resend@1.0.0';

// Initialize Resend with your API key
const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

// Email templates will be imported dynamically
const EMAIL_TEMPLATES = {
  'welcome': () => import('./emails/welcome-email.jsx'),
  'verification': () => import('./emails/verification-email.jsx'),
  'password-reset': () => import('./emails/password-reset-email.jsx'),
  'password-changed': () => import('./emails/password-changed-email.jsx')
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
      }
    });
  }

  try {
    const { templateName, email, data } = await req.json();

    // Validate required fields
    if (!templateName || !email || !data) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Missing required fields: templateName, email, or data"
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }

    // Check if template exists
    if (!EMAIL_TEMPLATES[templateName]) {
      return new Response(
        JSON.stringify({
          success: false,
          message: `Template "${templateName}" not found`
        }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }

    // Load the template dynamically
    const templateModule = await EMAIL_TEMPLATES[templateName]();
    const EmailTemplate = templateModule.default;

    // Render the React email to HTML
    const html = render(React.createElement(EmailTemplate, data));

    // Configure email based on template type
    let subject = '';
    switch (templateName) {
      case 'welcome':
        subject = 'Welcome to Our Platform!';
        break;
      case 'verification':
        subject = 'Verify Your Email Address';
        break;
      case 'password-reset':
        subject = 'Reset Your Password';
        break;
      case 'password-changed':
        subject = 'Your Password Has Been Changed';
        break;
      default:
        subject = 'Notification from Our Platform';
    }

    // Send the email using Resend
    const { data: resendData, error } = await resend.emails.send({
      from: 'Your App <notifications@yourdomain.com>',
      to: email,
      subject: subject,
      html: html,
    });

    if (error) {
      console.error('Resend API error:', error);
      return new Response(
        JSON.stringify({
          success: false,
          message: error.message || 'Failed to send email'
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Email sent successfully',
        id: resendData.id
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );

  } catch (error) {
    console.error('Error processing request:', error);

    return new Response(
      JSON.stringify({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  }
});