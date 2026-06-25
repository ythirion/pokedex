import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Pokedex home', () => {
    test('should not have any automatically detectable accessibility issues', async ({ page }) => {
        await page.goto('/');

        const accessibilityScanResults = await new AxeBuilder({ page })
            .withTags(['RGAAv4', 'wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
            .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
    });
});