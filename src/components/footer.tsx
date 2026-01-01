import Link from "next/link"
import {Mail, MapPin, Phone} from "lucide-react"
import {FaFacebookF, FaInstagram} from "react-icons/fa";

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-900 text-slate-200 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* COLONNE 1 : MARQUE */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-amber-500 font-serif">GD Pâtisserie 🧁</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Pâtisserie artisanale à Marseille.
            Nous sélectionnons les meilleurs ingrédients pour des créations gourmandes et
            authentiques.
          </p>
          <div className="flex gap-4 pt-2">
            {/* Liens réseaux sociaux factices */}
            <Link href="#" className="hover:text-amber-500 transition-colors">
              <FaInstagram className="h-5 w-5"/>
            </Link>
            <Link href="#" className="hover:text-amber-500 transition-colors">
              <FaFacebookF className="h-5 w-5"/>
            </Link>
          </div>
        </div>

        {/* COLONNE 2 : LIENS RAPIDES */}
        <div className="space-y-4">
          <h4 className="font-bold text-white">Boutique</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-amber-500 transition-colors">Accueil</Link>
            </li>
            <li>
              <Link href="/catalog" className="hover:text-amber-500 transition-colors">Tout le
                catalogue</Link>
            </li>
            <li>
              <Link href="/catalog?category=gateaux"
                    className="hover:text-amber-500 transition-colors">Nos Gâteaux</Link>
            </li>
            <li>
              <Link href="/catalog?category=chocolats"
                    className="hover:text-amber-500 transition-colors">Nos Chocolats</Link>
            </li>
          </ul>
        </div>

        {/* COLONNE 3 : CONTACT */}
        <div className="space-y-4">
          <h4 className="font-bold text-white">Contactez-nous</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-amber-500 shrink-0"/>
              <span>
                123 Rue de la République<br/>
                13002 Marseille
              </span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-amber-500 shrink-0"/>
              <span>06 12 34 56 78</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-amber-500 shrink-0"/>
              <a href="mailto:contact@gdpatisserie.fr"
                 className="hover:text-white transition-colors">
                contact@gdpatisserie.fr
              </a>
            </li>
          </ul>
        </div>

        {/* COLONNE 4 : HORAIRES */}
        <div className="space-y-4">
          <h4 className="font-bold text-white">Horaires Labo</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li className="flex justify-between">
              <span>Lun - Ven</span>
              <span className="text-white">9h - 18h</span>
            </li>
            <li className="flex justify-between">
              <span>Samedi</span>
              <span className="text-white">9h - 12h</span>
            </li>
            <li className="flex justify-between">
              <span>Dimanche</span>
              <span className="text-amber-500">Fermé</span>
            </li>
          </ul>
        </div>

      </div>

      {/* COPYRIGHT */}
      <div
        className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
        <p>&copy; {currentYear} GD Pâtisserie. Tous droits réservés.</p>
        <div className="mt-2 space-x-4">
          {/* Liens légaux (à créer un jour) */}
          <Link href="#" className="hover:text-slate-300">Mentions Légales</Link>
          <Link href="#" className="hover:text-slate-300">CGV</Link>
          <Link href="/login" className="hover:text-slate-300">Accès Staff</Link>
        </div>
      </div>
    </footer>
  )
}