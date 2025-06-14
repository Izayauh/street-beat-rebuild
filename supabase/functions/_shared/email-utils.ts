
export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  const smtpHost = Deno.env.get('SMTP_HOST');
  const smtpPort = parseInt(Deno.env.get('SMTP_PORT') || '465');
  const smtpUser = Deno.env.get('SMTP_USER');
  const smtpPass = Deno.env.get('SMTP_PASS');
  const smtpSecure = Deno.env.get('SMTP_SECURE') === 'true';

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.error('Missing SMTP configuration');
    return false;
  }

  try {
    // Create SMTP connection using raw TCP
    const conn = await Deno.connect({
      hostname: smtpHost,
      port: smtpPort,
    });

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    // Helper function to send command and get response
    const sendCommand = async (command: string): Promise<string> => {
      await conn.write(encoder.encode(command + '\r\n'));
      const buffer = new Uint8Array(1024);
      const n = await conn.read(buffer);
      return decoder.decode(buffer.subarray(0, n || 0));
    };

    // SMTP conversation
    await sendCommand(`EHLO localhost`);
    
    if (smtpSecure) {
      await sendCommand('STARTTLS');
    }
    
    await sendCommand('AUTH LOGIN');
    await sendCommand(btoa(smtpUser));
    await sendCommand(btoa(smtpPass));
    
    await sendCommand(`MAIL FROM:<${options.from || smtpUser}>`);
    await sendCommand(`RCPT TO:<${options.to}>`);
    await sendCommand('DATA');
    
    const emailContent = [
      `From: ${options.from || smtpUser}`,
      `To: ${options.to}`,
      `Subject: ${options.subject}`,
      'Content-Type: text/html; charset=UTF-8',
      '',
      options.html,
      '.'
    ].join('\r\n');
    
    await sendCommand(emailContent);
    await sendCommand('QUIT');
    
    conn.close();
    return true;
  } catch (error) {
    console.error('SMTP Error:', error);
    return false;
  }
}
