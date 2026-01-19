import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

import prisma from "@/lib/db"

import { authConfig } from "./auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            credentials: {
                username: {},
                password: {},
            },
            authorize: async (credentials) => {
                if (!credentials?.username || !credentials?.password) {
                    return null
                }

                console.log("Attempting login for:", credentials.username);

                const user = await prisma.user.findUnique({
                    where: {
                        username: credentials.username as string,
                    },
                })

                if (!user) {
                    console.log("User not found in DB");
                    return null
                }

                console.log("User found. Comparing password...");
                const passwordsMatch = await bcrypt.compare(
                    credentials.password as string,
                    user.password
                )

                if (passwordsMatch) {
                    console.log("Password match! Login successful.");
                    return {
                        ...user,
                        id: String(user.id),
                        role: user.role,
                    }
                }

                console.log("Password mismatch")
                return null
            },
        }),
    ],
    callbacks: {
        ...authConfig.callbacks,
        jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.role = user.role
            }
            return token
        },
        session({ session, token }) {
            session.user.id = token.id as string
            session.user.role = token.role as string
            return session
        },
    },
})
