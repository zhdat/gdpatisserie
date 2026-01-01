"use client";

import { Switch } from "@/components/ui/switch";
import { useState, useTransition } from "react";
import { toggleAvailability } from "@/app/admin/products/action"; // Optionnel : pour les notifications, sinon console.log

interface AvailabilitySwitchProps {
  productId: string;
  initialValue: boolean;
}

export default function AvailabilitySwitch({
  productId,
  initialValue,
}: Readonly<AvailabilitySwitchProps>) {
  const [isPending, startTransition] = useTransition();
  const [isAvailable, setIsAvailable] = useState(initialValue);

  const onToggle = (checked: boolean) => {
    // 1. Mise à jour optimiste (visuel immédiat)
    setIsAvailable(checked);

    // 2. Appel serveur en arrière-plan
    startTransition(async () => {
      await toggleAvailability(productId, checked);
      // On pourrait ajouter un toast de succès ici
    });
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch
        checked={isAvailable}
        onCheckedChange={onToggle}
        disabled={isPending} // On désactive le temps que le serveur réponde pour éviter le spam
        className={
          isAvailable
            ? "bg-green-600! cursor-pointer"
            : "bg-slate-200!" + " cursor-pointer"
        }
      />
      <span className="text-xs text-muted-foreground w-16">
        {isAvailable ? "En stock" : "Épuisé"}
      </span>
    </div>
  );
}
