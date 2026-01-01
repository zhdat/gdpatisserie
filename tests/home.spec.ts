import { expect, test } from "@playwright/test";

test("La page d'accueil charge correctement", async ({ page }) => {
  // 1. Aller sur la page d'accueil (en local pour le test)
  await page.goto("http://localhost:3000");

  // 2. Vérifier que le titre est bon
  await expect(page).toHaveTitle(/GD Pâtisserie/);

  // 3. Vérifier qu'on voit le bouton "Commander" (ou ton CTA principal)
  // Remplace 'Commander' par le texte exact de ton bouton
  const ctaButton = page.getByRole("link", { name: /Commander/i });
  await expect(ctaButton).toBeVisible();
});
