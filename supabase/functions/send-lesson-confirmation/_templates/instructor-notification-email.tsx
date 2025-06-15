
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

interface InstructorNotificationEmailProps {
  instructorName: string;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  lessonType: string;
  preferredDate: string;
  preferredTime: string;
  message?: string;
}

export const InstructorNotificationEmail = ({
  instructorName,
  studentName,
  studentEmail,
  studentPhone,
  lessonType,
  preferredDate,
  preferredTime,
  message,
}: InstructorNotificationEmailProps) => (
  <Html>
    <Head />
    <Preview>New lesson request from {studentName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>🎵 New Lesson Request</Heading>
        
        <Text style={text}>Hi {instructorName},</Text>
        
        <Text style={text}>
          You have a new lesson request! Here are the details:
        </Text>

        <Section style={studentBox}>
          <Heading style={h2}>Student Information:</Heading>
          <Text style={detail}><strong>Name:</strong> {studentName}</Text>
          <Text style={detail}><strong>Email:</strong> {studentEmail}</Text>
          {studentPhone && <Text style={detail}><strong>Phone:</strong> {studentPhone}</Text>}
        </Section>

        <Section style={detailsBox}>
          <Heading style={h2}>Lesson Details:</Heading>
          <Text style={detail}><strong>Instrument:</strong> {lessonType}</Text>
          <Text style={detail}><strong>Preferred Date:</strong> {new Date(preferredDate).toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</Text>
          <Text style={detail}><strong>Preferred Time:</strong> {preferredTime}</Text>
          {message && (
            <>
              <Text style={detail}><strong>Student's Message:</strong></Text>
              <Text style={messageText}>{message}</Text>
            </>
          )}
        </Section>

        <Text style={text}>
          <strong>Next Steps:</strong>
        </Text>
        
        <Text style={text}>
          • Please reach out to {studentName} within 24 hours to confirm the lesson<br/>
          • Ask about their experience level and musical goals<br/>
          • Confirm the final lesson time, date, and location<br/>
          • Let them know what to bring or expect for their first lesson
        </Text>

        <Hr style={hr} />

        <Text style={text}>
          <strong>Contact Information:</strong><br/>
          Email: {studentEmail}<br/>
          {studentPhone && `Phone: ${studentPhone}`}
        </Text>

        <Text style={footer}>
          Thanks for being part of the 3rd Street Music family!<br/>
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
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 12px',
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

const messageText = {
  color: '#6b7280',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '8px 0',
  fontStyle: 'italic' as const,
  backgroundColor: '#f9fafb',
  padding: '12px',
  borderRadius: '4px',
  borderLeft: '4px solid #8b5cf6',
};

const studentBox = {
  backgroundColor: '#ecfdf5',
  borderRadius: '6px',
  padding: '24px',
  margin: '24px 40px',
  border: '1px solid #d1fae5',
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
