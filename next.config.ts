
require('dotenv').config({ path: './.env' });
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'yuvglciamvkfwhlkphop.supabase.co',
        port: '',
        pathname: '/**',
      }
    ],
  },
   env: {
    CURRENCY: 'INR',
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
    SHIPROCKET_EMAIL: process.env.SHIPROCKET_EMAIL,
    SHIPROCKET_PASSWORD: process.env.SHIPROCKET_PASSWORD,
  }
};

export default nextConfig;
