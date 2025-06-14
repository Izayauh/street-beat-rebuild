
export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  const smtpHost = Deno.env.get('SMTP_HOST');
  const smtpPort = parseInt(Deno.env.get('SMTP_PORT') || '587');
  const smtpUser = Deno.env.get('SMTP_USER');
  const smtpPass = Deno.env.get('SMTP_PASS');
  const smtpSecure = Deno.env.get('SMTP_SECURE') === 'true';

  console.log('SMTP Configuration:', {
    host: smtpHost,
    port: smtpPort,
    user: smtpUser ? 'SET' : 'NOT SET',
    pass: smtpPass ? 'SET' : 'NOT SET',
    secure: smtpSecure
  });

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.error('Missing SMTP configuration');
    return false;
  }

  try {
    console.log('Attempting to send email to:', options.to);
    console.log('Email subject:', options.subject);

    // Use Gmail SMTP API approach
    const authString = btoa(`${smtpUser}:${smtpPass}`);
    
    // Create MIME message
    const boundary = `----=_Part_${Date.now()}_${Math.random().toString(36)}`;
    const mimeMessage = [
      `From: ${options.from || smtpUser}`,
      `To: ${options.to}`,
      `Subject: ${options.subject}`,
      `MIME-Version: 1.0`,
      `Content-Type: multipart/alternative; boundary="${boundary}"`,
      ``,
      `--${boundary}`,
      `Content-Type: text/html; charset=UTF-8`,
      `Content-Transfer-Encoding: quoted-printable`,
      ``,
      options.html,
      ``,
      `--${boundary}--`
    ].join('\r\n');

    // Try to connect via SMTP using fetch to Gmail's API
    if (smtpHost.includes('gmail') || smtpHost.includes('google')) {
      // Use Gmail API approach
      const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${smtpPass}`, // For Gmail, this should be an OAuth token
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          raw: btoa(mimeMessage).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
        })
      });

      if (response.ok) {
        console.log('Email sent successfully via Gmail API');
        return true;
      }
    }

    // Fallback to basic SMTP connection
    console.log(`Connecting to SMTP server: ${smtpHost}:${smtpPort}`);
    
    const conn = await Deno.connect({
      hostname: smtpHost,
      port: smtpPort,
    });

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    // SMTP conversation
    const commands = [
      `EHLO ${smtpHost}`,
      'AUTH LOGIN',
      btoa(smtpUser),
      btoa(smtpPass),
      `MAIL FROM:<${smtpUser}>`,
      `RCPT TO:<${options.to}>`,
      'DATA',
      mimeMessage + '\r\n.',
      'QUIT'
    ];

    for (const command of commands) {
      await conn.write(encoder.encode(command + '\r\n'));
      const buffer = new Uint8Array(1024);
      const bytesRead = await conn.read(buffer);
      if (bytesRead) {
        const response = decoder.decode(buffer.subarray(0, bytesRead));
        console.log('SMTP Response:', response);
        
        // Check for error responses
        if (response.startsWith('5')) {
          throw new Error(`SMTP Error: ${response}`);
        }
      }
    }

    conn.close();
    console.log('Email sent successfully via SMTP');
    return true;

  } catch (error) {
    console.error('Email sending error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    // Log specific SMTP configuration for debugging
    console.error('Debug SMTP config:', {
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      userConfigured: !!smtpUser,
      passConfigured: !!smtpPass
    });
    
    return false;
  }
}
