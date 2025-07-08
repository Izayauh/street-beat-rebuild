
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Hr,
  Button,
  Row,
  Column,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface ConfirmationEmailProps {
  name: string
  service?: string
  message?: string
  packageName?: string
  amount?: number // Amount in the smallest currency unit (e.g., cents)
}

export const ConfirmationEmail = ({
  name,
  service,
  message,
}: ConfirmationEmailProps) => (

  <Html>
    <Head />
    <Preview>🎵 Let's Make Music Together - Your Message Has Been Received!</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header with Logo */}
        <Section style={header}>
          <Row>
            <Column>
              <div style={logo}>
                <Text style={logoText}>🎵 3rd Street Music</Text>
                <Text style={tagline}>Where Hamilton's Music Lives</Text>
              </div>
            </Column>
          </Row>
        </Section>

        {/* Main Content */}
        <Section style={content}>
          <Heading style={h1}>Hey {name}! 👋</Heading>

          {packageName && amount !== undefined && (
            <>
              <Text style={greeting}>
                Thank you for your recent purchase from 3rd Street Music! We're thrilled you chose us for your musical needs.
              </Text>
              <Section style={serviceSection}>
                <Text style={serviceTitle}>Purchase Summary:</Text>
                <Text style={serviceText}>
                  Package: {packageName}
                  <br />
                  Amount: ${ (amount / 100).toFixed(2) } {/* Convert cents to dollars */}
                </Text>
              </Section>
            </>
          )}
          
          <Text style={greeting}>
            We're absolutely stoked that you reached out to us! Your message just landed in our inbox, 
            and we're already excited to help bring your musical vision to life.
          </Text>

          {service && (
            <Section style={serviceSection}>
              <Text style={serviceTitle}>What You're Looking For:</Text>
              <Text style={serviceText}>{service.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</Text>
            </Section>
          )}

          <Text style={paragraph}>
            Here's what happens next: Our team will review your project details and get back to you 
            within 24 hours with next steps. We believe every artist deserves a space where their 
            creativity can flourish, and we can't wait to be part of your journey.
          </Text>

          <Section style={ctaSection}>
            <Button
              style={ctaButton}
              href="https://calendly.com/3rdstreetmusic/consultation"
            >
              🎤 Book Your Free Consultation
            </Button>
            <Text style={ctaSubtext}>
              Or call us directly at (513) 737-1900
            </Text>
          </Section>

          <Section style={socialProof}>
            <Text style={socialProofTitle}>"More Than Just A Studio"</Text>
            <Text style={socialProofText}>
              "3rd Street Music isn't just about recording – they're about building the Hamilton music community. 
              Miles and his team genuinely care about every artist who walks through their doors."
            </Text>
            <Text style={testimonialAuthor}>- Local Hamilton Artist</Text>
          </Section>
        </Section>

        <Hr style={divider} />

        {/* Footer */}
        <Section style={footer}>
          <Row>
            <Column style={footerColumn}>
              <Text style={footerTitle}>📍 Visit Our Studio</Text>
              <Text style={footerText}>
                230 N 3rd Street<br />
                Hamilton, OH 45011
              </Text>
            </Column>
            <Column style={footerColumn}>
              <Text style={footerTitle}>📞 Get In Touch</Text>
              <Text style={footerText}>
                (513) 737-1900<br />
                miles@3rdstreetmusic.com
              </Text>
            </Column>
          </Row>
          
          <Row style={socialRow}>
            <Column>
              <Text style={socialTitle}>Connect With Us:</Text>
              <div style={socialLinks}>
                <Link href="https://www.facebook.com/3rdStreetMusic" style={socialLink}>Facebook</Link>
                <Text style={socialSeparator}> • </Text>
                <Link href="https://www.instagram.com/3rdstreetmusic" style={socialLink}>Instagram</Link>
                <Text style={socialSeparator}> • </Text>
                <Link href="https://3rdStreetMusic.com" style={socialLink}>Website</Link>
              </div>
            </Column>
          </Row>

          <Text style={footerNote}>
            🎶 <em>"Connecting Hamilton and beyond to music since day one."</em>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

// Styles
const main = {
  backgroundColor: '#0a0a0a',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '600px',
}

const header = {
  backgroundColor: '#1a1a1a',
  borderRadius: '12px 12px 0 0',
  padding: '24px',
  textAlign: 'center' as const,
  borderBottom: '3px solid #8B5CF6',
}

const logo = {
  textAlign: 'center' as const,
}

const logoText = {
  fontSize: '28px',
  fontWeight: 'bold',
  color: '#8B5CF6',
  margin: '0 0 8px 0',
}

const tagline = {
  fontSize: '14px',
  color: '#9CA3AF',
  margin: '0',
  fontStyle: 'italic',
}

const content = {
  backgroundColor: '#111111',
  padding: '32px 24px',
  color: '#ffffff',
}

const h1 = {
  color: '#ffffff',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0 0 24px 0',
  textAlign: 'center' as const,
}

const greeting = {
  fontSize: '18px',
  lineHeight: '1.6',
  color: '#E5E7EB',
  margin: '0 0 24px 0',
}

const paragraph = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#D1D5DB',
  margin: '0 0 24px 0',
}

const serviceSection = {
  backgroundColor: '#1F2937',
  padding: '20px',
  borderRadius: '8px',
  margin: '24px 0',
  borderLeft: '4px solid #8B5CF6',
}

const serviceTitle = {
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#8B5CF6',
  margin: '0 0 8px 0',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
}

const serviceText = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#ffffff',
  margin: '0',
}

const ctaSection = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const ctaButton = {
  backgroundColor: '#8B5CF6',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '16px 32px',
  margin: '0 0 12px 0',
}

const ctaSubtext = {
  fontSize: '14px',
  color: '#9CA3AF',
  margin: '0',
}

const socialProof = {
  backgroundColor: '#0F172A',
  padding: '24px',
  borderRadius: '8px',
  margin: '32px 0',
  textAlign: 'center' as const,
}

const socialProofTitle = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#8B5CF6',
  margin: '0 0 16px 0',
}

const socialProofText = {
  fontSize: '16px',
  lineHeight: '1.5',
  color: '#D1D5DB',
  fontStyle: 'italic',
  margin: '0 0 12px 0',
}

const testimonialAuthor = {
  fontSize: '14px',
  color: '#9CA3AF',
  margin: '0',
}

const divider = {
  borderColor: '#374151',
  margin: '32px 0',
}

const footer = {
  backgroundColor: '#1a1a1a',
  padding: '24px',
  borderRadius: '0 0 12px 12px',
}

const footerColumn = {
  width: '50%',
  verticalAlign: 'top' as const,
}

const footerTitle = {
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#8B5CF6',
  margin: '0 0 8px 0',
}

const footerText = {
  fontSize: '14px',
  color: '#D1D5DB',
  margin: '0 0 16px 0',
  lineHeight: '1.4',
}

const socialRow = {
  margin: '24px 0 0 0',
}

const socialTitle = {
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#8B5CF6',
  margin: '0 0 8px 0',
  textAlign: 'center' as const,
}

const socialLinks = {
  textAlign: 'center' as const,
}

const socialLink = {
  color: '#60A5FA',
  textDecoration: 'none',
  fontSize: '14px',
}

const socialSeparator = {
  color: '#6B7280',
  fontSize: '14px',
}

const footerNote = {
  fontSize: '12px',
  color: '#6B7280',
  textAlign: 'center' as const,
  margin: '24px 0 0 0',
  fontStyle: 'italic',
}

export default ConfirmationEmail
