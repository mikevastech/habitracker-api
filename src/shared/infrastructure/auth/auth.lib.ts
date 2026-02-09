/**
 * Better Auth: magic link, Google sign-in, 2FA, passkey.
 * Rate limiting enabled in production. Apple sign-in can be added to socialProviders.
 */
import { betterAuth, BetterAuthOptions } from 'better-auth';
import { bearer, magicLink, twoFactor } from 'better-auth/plugins';
import { passkey } from '@better-auth/passkey';
import { PrismaPg } from '@prisma/adapter-pg';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaClient } from '@prisma/client';
import * as sendgridMail from '@sendgrid/mail';

const sgMail =
  (sendgridMail as unknown as { default?: typeof sendgridMail }).default ?? sendgridMail;

const connectionString = process.env.DATABASE_URL ?? '';
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

// Configure SendGrid (no-op if module failed to load or no key)
if (sgMail?.setApiKey) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');
}

// EU Data Residency configuration
const sgResidency = process.env.SENDGRID_DATA_RESIDENCY;
if (sgResidency === 'eu' && sgMail && 'setDataResidency' in sgMail) {
  (sgMail as { setDataResidency: (region: string) => void }).setDataResidency('eu');
}

const isDev = process.env.NODE_ENV !== 'production';

// Better Auth baseURL must be exactly the URL where this API is reached (same as Nest listen URL).
// Used for OAuth callbacks (e.g. Google redirect URI = {baseURL}/auth/callback/google), CORS, links.
const apiPort = process.env.PORT ?? '3000';
const defaultBaseUrl = `http://localhost:${apiPort}`;
const baseURL = process.env.BETTER_AUTH_URL || process.env.API_URL || defaultBaseUrl;

if (isDev) {
  console.log('[Better Auth] baseURL:', baseURL);
}

const authOptions = {
  baseURL,
  // basePath must match Nest route prefix (AuthController is @Controller('auth')) so Better Auth routes match /auth/*
  basePath: '/auth',
  secret: process.env.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  // Prisma User.id is @db.Uuid; Better Auth default is nanoid. Use UUID so inserts succeed.
  advanced: {
    database: {
      generateId: 'uuid' as const,
    },
  },
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
      // Don't block sign-up: send in background so handler can return immediately.
      const from = process.env.SENDGRID_FROM_EMAIL || '';
      console.log('from', from);
      if (!from || !sgMail?.send) return;
      await sgMail
        .send({
          to: user.email,
          from,
          subject: 'Verify your email address',
          text: `Verify your email by clicking: ${url}`,
          html: `<p>Verify your email by clicking: <a href="${url}">Verify Email</a></p>`,
        })
        .catch((err) => console.error('[Better Auth] sendVerificationEmail failed:', err));
    },
    // nesto
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    },
  },
  plugins: [
    bearer(),
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
