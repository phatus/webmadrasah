'use server'

import { signIn } from "@/auth"
import { AuthError } from "next-auth"

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    console.log("Authenticate action called");
    try {
        console.log("Attempting signIn with credentials");
        await signIn('credentials', formData, { redirectTo: '/dashboard' })
        console.log("signIn call completed (should have redirected)");
    } catch (error) {
        console.log("signIn error caught:", error);
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.'
                default:
                    return 'Something went wrong.'
            }
        }
        throw error
    }
}
