/**
 * Better Auth: magic link, Google sign-in, 2FA, passkey.
 * Rate limiting enabled in production. Apple sign-in can be added to socialProviders.
 */
import { betterAuth, BetterAuthOptions } from 'better-auth';
import { magicLink, twoFactor } from 'better-auth/plugins';
import { passkey } from '@better-auth/passkey';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaClient } from '@prisma/client';
import sgMail from '@sendgrid/mail';

const prisma = new PrismaClient();

// Configure SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

// EU Data Residency configuration
const sgResidency = process.env.SENDGRID_DATA_RESIDENCY;
if (sgResidency === 'eu') {
  const sg = sgMail as { setDataResidency?: (region: string) => void };
  sg.setDataResidency?.('eu');
}

const isDev = process.env.NODE_ENV !== 'production';

const authOptions = {
  baseURL: process.env.BETTER_AUTH_URL || process.env.API_URL || 'http://localhost:3000',
  secret: process.env.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  user: {
    additionalFields: {
      originAppId: {
        type: 'string',
        defaultValue: 'habitracker',
      },
    },
  },
  // Email/password optional; magic link is primary email sign-in
  emailAndPassword: {
    enabled: true,
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sgMail.send({
        to: user.email,
        from: process.env.SENDGRID_FROM_EMAIL || '',
        subject: 'Verify your email address',
        text: `Verify your email by clicking: ${url}`,
        html: `<p>Verify your email by clicking: <a href="${url}">Verify Email</a></p>`,
      });
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    },
  },
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        await sgMail.send({
          to: email,
          from: process.env.SENDGRID_FROM_EMAIL || '',
          subject: 'Your Magic Link',
          text: `Click here to sign in: ${url}`,
          html: `<p>Click here to sign in: <a href="${url}">Sign In</a></p>`,
        });
      },
    }),
    twoFactor(),
    passkey(),
  ],
  // Rate limiting: auth routes (sign-in, 2FA verify, etc.) – client requests only
  rateLimit: {
    enabled: !isDev,
    window: 60,
    max: 100,
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          if (user.originAppId === 'habitracker') {
            await prisma.habitProfile.create({
              data: {
                userId: user.id,
                username: user.email.split('@')[0] + '_' + Math.floor(Math.random() * 1000),
                subscriptionTier: 'FREE',
              },
            });
          }
        },
      },
    },
  },
} satisfies BetterAuthOptions;

export const auth = betterAuth(authOptions);

export type Auth = typeof auth;
export type Session = typeof auth.$Infer.Session;
export type User = Session['user'];
