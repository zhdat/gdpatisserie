import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;

        if (credentials.email === email && credentials.password === password) {
          return { id: "1", name: "Chef Pâtissier", email: email };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
});
