"use client";

import {CldUploadWidget} from "next-cloudinary";
import {Button} from "@/components/ui/button";
import {ImagePlus, Trash} from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[]; // On gère un tableau, même si on n'a qu'une image pour l'instant
}

export default function ImageUpload({
                                      disabled,
                                      onChange,
                                      onRemove,
                                      value,
                                    }: Readonly<ImageUploadProps>) {

  // Fonction appelée quand l'upload est fini
  const onUpload = (result: any) => {
    // result.info.secure_url contient le lien HTTPS de l'image
    onChange(result.info.secure_url);
  };

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {value.map((url) => (
          <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                onClick={() => onRemove(url)}
                variant="destructive"
                size="icon"
              >
                <Trash className="h-4 w-4"/>
              </Button>
            </div>
            <Image
              fill
              className="object-cover"
              alt="Image produit"
              src={url}
            />
          </div>
        ))}
      </div>

      <CldUploadWidget
        onSuccess={onUpload} // Utilise onSuccess au lieu de onUpload (changement récent v5/v6)
        uploadPreset="gdpatisserie_preset" // ⚠️ Mets bien le nom de ton preset ici
      >
        {({open}) => {
          const onClick = () => {
            open();
          };

          return (
            <Button
              type="button"
              disabled={disabled}
              variant="secondary"
              onClick={onClick}
            >
              <ImagePlus className="h-4 w-4 mr-2"/>
              Ajouter une image
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
}