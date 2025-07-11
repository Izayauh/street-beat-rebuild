import React from 'npm:react@18.3.1';
import { Html, Head, Body, Container, Text, Button, Preview, Section } from 'npm:@react-email/components@0.0.22';

const WelcomeEmail = ({ username, verificationLink }) => (
  <Html>
    <Head />
    <Preview>Welcome to 3rd Street Music!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
            <Text style={logoText}>🎵 3rd Street Music</Text>
        </Section>
        <Section style={content}>
          <Text style={h1}>Welcome to the Band, {username}!</Text>
          <Text style={paragraph}>
            We're thrilled to have you join our community of musicians and creators. To get started and secure your account, please verify your email address.
          </Text>
          <Section style={{ textAlign: 'center', margin: '32px 0' }}>
            <Button style={ctaButton} href={verificationLink}>
              Verify Your Email
            </Button>
          </Section>
          <Text style={paragraph}>
            Once verified, you'll be able to book studio time, schedule lessons, and get personalized quotes for your projects.
          </Text>
        </Section>
        <Section style={footer}>
            <Text style={footerText}>
              If you didn't create this account, you can safely ignore this email.
            </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default WelcomeEmail;

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
const ctaButton = {
  backgroundColor: '#8B5CF6',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center',
  display: 'inline-block',
  padding: '16px 32px',
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