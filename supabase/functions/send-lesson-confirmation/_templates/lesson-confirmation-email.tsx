
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Hr,
  Section,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

interface LessonConfirmationEmailProps {
  studentName: string;
  lessonType: string;
  instructorName?: string;
  preferredDate: string;
  preferredTime: string;
}

export const LessonConfirmationEmail = ({
  studentName,
  lessonType,
  instructorName,
  preferredDate,
  preferredTime,
}: LessonConfirmationEmailProps) => (
  <Html>
    <Head />
    <Preview>Your lesson request has been received - we'll be in touch soon!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>🎵 Thank You for Your Lesson Request!</Heading>
        
        <Text style={text}>Hi {studentName},</Text>
        
        <Text style={text}>
          We've received your request for {lessonType} lessons and we're excited to help you on your musical journey!
        </Text>

        <Section style={detailsBox}>
          <Heading style={h2}>Lesson Details:</Heading>
          <Text style={detail}><strong>Instrument:</strong> {lessonType}</Text>
          {instructorName && <Text style={detail}><strong>Preferred Instructor:</strong> {instructorName}</Text>}
          <Text style={detail}><strong>Preferred Date:</strong> {new Date(preferredDate).toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</Text>
          <Text style={detail}><strong>Preferred Time:</strong> {preferredTime}</Text>
        </Section>

        <Text style={text}>
          <strong>What's next?</strong>
        </Text>
        
        <Text style={text}>
          • We'll review your request and match you with the perfect instructor<br/>
          • {instructorName ? `${instructorName}` : 'Your instructor'} will reach out within 24 hours to confirm your lesson details<br/>
          • They'll ask about your experience level and musical goals to tailor the lesson to you<br/>
          • You'll receive final confirmation with the exact lesson time and location
        </Text>

        <Hr style={hr} />

        <Text style={text}>
          <strong>Questions?</strong> Feel free to call us at (555) 123-MUSIC or reply to this email.
        </Text>

        <Text style={footer}>
          Keep practicing,<br/>
          The 3rd Street Music Team 🎼
        </Text>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: '#000000',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  maxWidth: '600px',
};

const h1 = {
  color: '#8b5cf6',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '40px 0 20px',
  padding: '0 40px',
  textAlign: 'center' as const,
};

const h2 = {
  color: '#374151',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 16px',
};

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 40px',
};

const detail = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '8px 0',
};

const detailsBox = {
  backgroundColor: '#f3f4f6',
  borderRadius: '6px',
  padding: '24px',
  margin: '24px 40px',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '32px 40px',
};

const footer = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '32px 40px 0',
  fontStyle: 'italic' as const,
};
