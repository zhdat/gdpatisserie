"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import ImageUpload from "@/components/image-upload";
import { Category, Product } from "@prisma/client";
import { Checkbox } from "@/components/ui/checkbox";

// On définit les props :
// - categories: Toujours requis
// - initialData: Optionnel (présent uniquement en mode Edit)
// - action: La fonction serveur à appeler (Create ou Update)
interface ProductFormProps {
  categories: Category[];
  initialData?: Product | null;
  action: (formData: FormData) => Promise<void>; // Signature de la server action
}

export default function ProductForm({
  categories,
  initialData,
  action,
}: Readonly<ProductFormProps>) {
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");

  return (
    <form action={action} className="space-y-6">
      {/* Nom */}
      <div className="grid w-full gap-1.5">
        <Label htmlFor="name">Nom du produit</Label>
        <Input
          type="text"
          name="name"
          id="name"
          required
          placeholder="Ex: Tarte aux Fraises"
          defaultValue={initialData?.name}
        />
      </div>

      {/* Description */}
      <div className="grid w-full gap-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea
          name="description"
          id="description"
          placeholder="Ingrédients..."
          defaultValue={initialData?.description || ""}
        />
      </div>

      {/* Prix */}
      <div className="grid w-full gap-1.5">
        <Label htmlFor="price">Prix (€)</Label>
        <Input
          type="number"
          step="0.01"
          name="price"
          id="price"
          required
          defaultValue={initialData?.price}
        />
      </div>

      {/* Catégorie */}
      <div className="grid w-full gap-1.5">
        <Label htmlFor="categoryId">Catégorie</Label>
        <select
          name="categoryId"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          defaultValue={initialData?.categoryId}
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* IMAGE UPLOAD (Le changement est ici) */}
      <div className="grid w-full gap-1.5">
        <Label>Image du produit</Label>
        <ImageUpload
          value={imageUrl ? [imageUrl] : []}
          onChange={(url) => setImageUrl(url)}
          onRemove={() => setImageUrl("")}
        />
        {/* Champ caché pour envoyer l'URL à la Server Action */}
        <input type="hidden" name="imageUrl" value={imageUrl} />
      </div>

      {/* CHECKBOX DISPONIBILITÉ */}
      <div className="flex items-center space-x-2 border p-4 rounded-md bg-slate-50">
        <Checkbox
          id="isAvailable"
          name="isAvailable"
          defaultChecked={initialData?.isAvailable ?? true} // Par défaut coché (true)
          value="true" // Important pour que le FormData le récupère si coché
        />
        <div className="grid gap-1.5 leading-none">
          <Label htmlFor="isAvailable" className="cursor-pointer">
            Produit disponible à la vente
          </Label>
          <p className="text-sm text-muted-foreground">
            Décochez cette case pour marquer le produit comme "Épuisé" sans le
            supprimer.
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="submit">
          {initialData ? "Modifier le produit" : "Créer le produit"}
        </Button>
      </div>
    </form>
  );
}
