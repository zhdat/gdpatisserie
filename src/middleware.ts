import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  // 1. Est-ce que l'utilisateur est connecté ?
  const isLoggedIn = !!req.auth

  // 2. Est-ce qu'il est sur une route qui commence par /admin ?
  const isOnAdmin = req.nextUrl.pathname.startsWith("/admin")

  // 3. Logique de protection
  if (isOnAdmin) {
    if (isLoggedIn) return NextResponse.next() // C'est bon, il passe
    return NextResponse.redirect(new URL("/login", req.nextUrl)) // Stop ! Direction Login
  }

  return NextResponse.next()
})

// Configuration : Le middleware s'active partout SAUF sur les fichiers statiques (images, css...)
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}