import { checkout, polar, portal } from "@polar-sh/better-auth";

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/db";
import { polarClient } from "./polar";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    
  },
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use:[
        checkout({
          products: [
                        {
                            productId: "1100f797-65d0-452a-be97-28f0ba82cf0a",
                            slug: "pro" // Custom slug for easy reference in Checkout URL, e.g. /checkout/Nodebase-Pro
                        }
                    ],
                     successUrl: process.env.POLAR_SUCCESS_URL,
                    authenticatedUsersOnly: true,
        }),
        portal(),
      ],
    })
  ]
});