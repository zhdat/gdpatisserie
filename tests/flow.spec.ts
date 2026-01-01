import {test, expect} from '@playwright/test';

test('Un client peut rechercher un produit', async ({page}) => {
  await page.goto('http://localhost:3000/catalog');

  // 1. Chercher un produit
  // On suppose que tu as mis un placeholder "Rechercher..." dans ton input
  await page.getByPlaceholder('Rechercher').fill('Citron');

  // 2. Attendre que l'URL change (si tu as mis la recherche dans l'URL)
  await expect(page).toHaveURL(/q=Citron/);

  // 3. Vérifier qu'on voit bien une tarte au citron
  // Assure-toi d'avoir un élément qui contient ce texte dans tes données de test
  await expect(page.getByText('Tarte au Citron')).toBeVisible();
});