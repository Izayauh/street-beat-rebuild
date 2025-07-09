import React from 'npm:react@18.3.1';
import { Html, Head, Body, Container, Text, Button, Preview } from 'npm:@react-email/components@0.0.22'; // Use version 0.0.22 as noted in documentation

interface ResetPasswordEmailProps {
  resetLink: string;
}

const ResetPasswordEmail: React.FC<ResetPasswordEmailProps> = ({ resetLink }) => {
  return (
    <Html>
      <Head />
      <Preview>Reset your password</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={paragraph}>Hi,</Text>
          <Text style={paragraph}>
            We received a request to reset your password. Click the button below to reset it:
          </Text>
          <Button style={button} href={resetLink}>
            Reset Password
          </Button>
          <Text style={paragraph}>
            If you did not request a password reset, please ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default ResetPasswordEmail;

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'left' as 'left',
};

const button = {
  backgroundColor: '#4CAF50',
  borderRadius: '5px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as 'center',
  display: 'block',
  width: '100%',
  padding: '10px 0',
};