'use server'

import {signIn} from "@/auth"
import {AuthError} from "next-auth"

export async function authenticate(prevState: string | undefined, formData: FormData) {
  try {
    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirectTo: '/admin',
    })

  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Identifiants invalides.'
        default:
          return 'Une erreur est survenue.'
      }
    }
    // IMPORTANT : Il faut laisser passer l'erreur de redirection de Next.js
    // Si tu l'enlèves, la redirection ne se fera pas.
    throw error
  }
}