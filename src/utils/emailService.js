const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

async function sendEmail(emailData) {
  try {
    const response = await fetch('https://rbikuvzeyarcmznvoxns.supabase.co/functions/v1/resend-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + supabaseAnonKey // Make sure this variable is defined
      },
      body: JSON.stringify(emailData)
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'Failed to send email');
    }
    return result;
  } catch (error) {
async function sendEmail(emailData) {
  try {
    const response = await fetch('https://rbikuvzeyarcmznvoxns.supabase.co/functions/v1/resend-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + supabaseAnonKey // Make sure this variable is defined
      },
      body: JSON.stringify(emailData)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to send email');
    }

    return result;
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
}