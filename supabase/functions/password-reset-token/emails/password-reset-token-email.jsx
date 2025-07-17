import React from "npm:react@18.3.1";
import { Html, Head, Body, Container, Text, Preview, Section } from "npm:@react-email/components@0.0.22";

const PasswordResetTokenEmail = ({ username = "User", token }) => (
  <Html>
    <Head />
    <Preview>Your Password Reset Code</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Text style={logoText}>🎵 3rd Street Music</Text>
        </Section>
        <Section style={content}>
          <Text style={h1}>Password Reset Code</Text>
          <Text style={paragraph}>
            Hi {username},
            <br />
            We received a request to reset your password. Use the code below to complete your password reset:
          </Text>
          <Section style={tokenContainer}>
            <Text style={tokenText}>{token}</Text>
          </Section>
          <Text style={paragraph}>
            This code will expire in 15 minutes. If you did not request a password reset, you can safely ignore this email.
          </Text>
          <Text style={warningText}>
            ⚠️ Never share this code with anyone. Our team will never ask for it.
          </Text>
        </Section>
        <Section style={footer}>
          <Text style={footerText}>
            For help, contact support@3rdstreetmusic.com
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default PasswordResetTokenEmail;

// --- Styles ---
const main = {
  backgroundColor: '#0a0a0a',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};
const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '600px',
  backgroundColor: '#111111',
  borderRadius: '12px',
  overflow: 'hidden'
};
const header = {
  padding: '24px',
  textAlign: 'center',
  borderBottom: '3px solid #8B5CF6',
  backgroundColor: '#1a1a1a',
};
const logoText = {
  fontSize: '28px',
  fontWeight: 'bold',
  color: '#8B5CF6',
  margin: '0',
};
const content = {
  padding: '32px 24px',
};
const h1 = {
  color: '#ffffff',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0 0 24px 0',
  textAlign: 'center',
};
const paragraph = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#D1D5DB',
  margin: '0 0 24px 0',
};
const tokenContainer = {
  textAlign: 'center',
  margin: '32px 0',
  padding: '24px',
  backgroundColor: '#1a1a1a',
  borderRadius: '12px',
  border: '2px solid #8B5CF6',
};
const tokenText = {
  fontSize: '48px',
  fontWeight: 'bold',
  color: '#8B5CF6',
  margin: '0',
  letterSpacing: '8px',
  fontFamily: 'monospace',
};
const warningText = {
  fontSize: '14px',
  color: '#F59E0B',
  textAlign: 'center',
  margin: '24px 0 0 0',
  fontStyle: 'italic',
};
const footer = {
  backgroundColor: '#1a1a1a',
  padding: '24px',
};
const footerText = {
  fontSize: '12px',
  color: '#6B7280',
  textAlign: 'center',
  margin: '0',
}; 