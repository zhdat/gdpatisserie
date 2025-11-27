import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        // C'est ici qu'on définit "qui a le droit d'entrer"
        // Pour l'instant, on hardcode le mot de passe (suffisant pour un MVP mono-utilisateur)

        const email = "admin@gdpatisserie.com"
        const password = "admin" // ⚠️ Change ce mot de passe pour la prod !

        if (credentials.email === email && credentials.password === password) {
          // Si c'est bon, on retourne l'utilisateur
          return { id: "1", name: "Chef Pâtissier", email: email }
        }

        // Si c'est faux, on retourne null (échec connexion)
        return null
      },
    }),
  ],
  pages: {
    signIn: '/login', // On dit à NextAuth où est notre page de login personnalisée
  }
})