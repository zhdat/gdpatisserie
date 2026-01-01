"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

// Pour faire simple sans librairie externe, voici la version native :

export function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);

    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }

    // On remplace l'URL sans recharger la page
    router.replace(`/catalog?${params.toString()}`);
  };

  return (
    <div className="relative w-full md:w-[300px]">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
      <Input
        placeholder="Rechercher une gourmandise..."
        className="pl-8"
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get("q")?.toString()}
      />
    </div>
  );
}
