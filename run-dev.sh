#!/bin/bash

# Export environment variables directly
export CLERK_PUBLISHABLE_KEY="pk_test_cHJvLWNyYXlmaXNoLTYuY2xlcmsuYWNjb3VudHMuZGV2JA"
export CLERK_SECRET_KEY="sk_test_BZ2HpyUFzOLAJT2ik62dMJB1srbqdzC7RYtmvrV5cA"
export NUXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_cHJvLWNyYXlmaXNoLTYuY2xlcmsuYWNjb3VudHMuZGV2JA"
export NUXT_CLERK_SECRET_KEY="sk_test_BZ2HpyUFzOLAJT2ik62dMJB1srbqdzC7RYtmvrV5cA"

# Stop any running dev server
pkill -f "node.*nuxt"

# Run Nuxt with explicitly set environment variables
npx nuxt dev
