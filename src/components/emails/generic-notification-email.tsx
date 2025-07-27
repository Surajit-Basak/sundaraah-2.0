
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface GenericNotificationEmailProps {
  siteName: string;
  subject: string;
  bodyContent: string;
}

export default function GenericNotificationEmail({ siteName, subject, bodyContent }: GenericNotificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{subject}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>{siteName}</Heading>
          </Section>
          <Section style={content}>
            <div dangerouslySetInnerHTML={{ __html: bodyContent }} />
          </Section>
          <Section style={footer}>
            <Text style={footerText}>
              &copy; {new Date().getFullYear()} {siteName}. All Rights Reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
};

const header = {
    padding: "20px",
    borderBottom: "1px solid #eaeaea",
    textAlign: "center" as const,
};

const h1 = {
  color: "#5d1d39",
  fontSize: "28px",
  fontWeight: "bold",
  margin: "0",
};

const content = {
  padding: "32px",
  fontSize: "16px",
  lineHeight: "24px",
  color: "#555",
};

const footer = {
  padding: "20px",
  borderTop: "1px solid #eaeaea",
  textAlign: "center" as const,
};

const footerText = {
  fontSize: "12px",
  color: "#666",
};
