// https://nuxt.com/docs/api/configuration/nuxt-config

// Debug log for environment variables
console.log('=== Nuxt Config Environment Variables ===');
console.log(`CLERK_PUBLISHABLE_KEY exists: ${!!process.env.CLERK_PUBLISHABLE_KEY}`);
console.log(`CLERK_SECRET_KEY exists: ${!!process.env.CLERK_SECRET_KEY}`);
console.log(`NUXT_PUBLIC_CLERK_PUBLISHABLE_KEY exists: ${!!process.env.NUXT_PUBLIC_CLERK_PUBLISHABLE_KEY}`);
console.log(`NUXT_CLERK_SECRET_KEY exists: ${!!process.env.NUXT_CLERK_SECRET_KEY}`);

// Extract the keys using || fallbacks
const pubKey = process.env.CLERK_PUBLISHABLE_KEY || process.env.NUXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const secretKey = process.env.CLERK_SECRET_KEY || process.env.NUXT_CLERK_SECRET_KEY;

console.log(`Final publishable key exists: ${!!pubKey}`);
console.log(`Final secret key exists: ${!!secretKey}`);

// Decide whether to enable Clerk authentication
const isDevMode = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined;
console.log(`Development mode: ${isDevMode}`);

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: isDevMode 
    ? ['@pinia/nuxt'] // Development mode: no Clerk
    : [
        '@pinia/nuxt',
        ['@clerk/nuxt', {
          publishableKey: pubKey,
          secretKey: secretKey,
        }]
      ],
  runtimeConfig: {
    clerkSecretKey: secretKey,
    public: {
      clerkPublishableKey: pubKey,
      isDevelopment: isDevMode
    }
  },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: 'DBT Skills Learning App',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Learn Dialectical Behavior Therapy skills with an interactive, gamified approach.' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap' }
      ]
    }
  }
})
