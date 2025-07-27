
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import type { FullOrderForEmail } from "@/types";
import { formatPrice } from "@/lib/utils";

interface OrderConfirmationEmailProps {
  order: FullOrderForEmail;
  siteName: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export default function OrderConfirmationEmail({ order, siteName }: OrderConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your {siteName} Order Confirmation</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>{siteName}</Heading>
          </Section>
          <Section style={content}>
            <Heading as="h2" style={h2}>
              Thank you for your order, {order.customer_name}!
            </Heading>
            <Text style={paragraph}>
              We've received your order and are getting it ready for shipment. You can view your order details below.
            </Text>
            
            <Section style={orderInfo}>
              <Text>
                <strong>Order ID:</strong> {order.id.substring(0,8).toUpperCase()}
              </Text>
              <Text>
                <strong>Order Date:</strong> {new Date(order.created_at).toLocaleDateString()}
              </Text>
            </Section>

            <Hr style={hr} />

            {order.order_items.map((item) => (
              <Section key={item.id} style={itemSection}>
                <Img
                  src={item.imageUrl}
                  alt={item.name}
                  width="80"
                  height="80"
                  style={itemImage}
                />
                <div style={itemDetails}>
                    <Text style={itemName}>{item.name}</Text>
                    <Text style={itemMeta}>Qty: {item.quantity}</Text>
                    <Text style={itemMeta}>{formatPrice(item.price)} each</Text>
                </div>
                <Text style={itemPrice}>{formatPrice(item.price * item.quantity)}</Text>
              </Section>
            ))}

            <Hr style={hr} />

            <Section style={summarySection}>
              <Text style={summaryTotal}>
                <strong>Total:</strong> {formatPrice(order.total)}
              </Text>
            </Section>

            <Hr style={hr} />

            <Text style={paragraph}>
              If you have any questions, please don't hesitate to contact us.
            </Text>
            <Link href={`${baseUrl}/account/orders/${order.id}`} style={button}>
              View Your Order
            </Link>
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
};

const h2 = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#333",
  marginBottom: "16px",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "24px",
  color: "#555",
};

const orderInfo = {
    backgroundColor: "#f6f9fc",
    padding: "16px",
    borderRadius: "6px",
    marginTop: "20px"
};

const hr = {
  borderColor: "#eaeaea",
  margin: "26px 0",
};

const itemSection = {
  display: "flex",
  alignItems: "center",
  padding: "12px 0",
};

const itemImage = {
  borderRadius: "4px",
  marginRight: "20px",
};

const itemDetails = {
    flexGrow: 1,
};

const itemName = {
    fontSize: "16px",
    fontWeight: "bold",
    margin: 0,
};

const itemMeta = {
    fontSize: "14px",
    color: "#666",
    margin: "4px 0 0",
};

const itemPrice = {
    fontSize: "16px",
    fontWeight: "bold",
    textAlign: "right" as const,
};

const summarySection = {
    textAlign: "right" as const,
};

const summaryTotal = {
    fontSize: "18px",
    fontWeight: "bold",
};


const button = {
  backgroundColor: "#5d1d39",
  borderRadius: "6px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px",
  marginTop: "24px",
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
