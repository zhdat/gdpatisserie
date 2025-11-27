'use client'

import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {useFormState} from "react-dom"
import {authenticate} from "@/app/login/action";

export default function LoginPage() {
  const [errorMessage, dispatch] = useFormState(authenticate, undefined)

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm border border-slate-200">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-amber-700">GD Pâtisserie</h1>
          <p className="text-slate-500">Accès réservé</p>
        </div>

        <form action={dispatch} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="admin@gdpatisserie.com"
              defaultValue="admin@gdpatisserie.com" // Pour te faciliter le test
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
            />
          </div>

          {errorMessage && (
            <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
              {errorMessage}
            </div>
          )}

          <Button className="w-full bg-amber-600 hover:bg-amber-700">
            Se connecter
          </Button>
        </form>
      </div>
    </div>
  )
}