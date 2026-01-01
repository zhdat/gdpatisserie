import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 text-center p-8">
      <div className="bg-white p-8 rounded-xl shadow-xl max-w-md space-y-6">
        <div className="text-6xl">🎉</div>
        <h1 className="text-3xl font-bold text-green-800">
          Merci pour votre commande !
        </h1>
        <p className="text-slate-600">
          Votre commande a bien été enregistrée.
          <br />
          Le pâtissier va prendre contact avec vous très prochainement par
          téléphone pour confirmer l&apos;heure de livraison.
        </p>
        <Link href="/">
          <Button className="w-full bg-green-600 hover:bg-green-700">
            Retourner à l&apos;accueil
          </Button>
        </Link>
      </div>
    </div>
  );
}
