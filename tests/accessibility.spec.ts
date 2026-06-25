import {test, expect, type Page} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function validateAccessibilityFor(page: Page, url: string) {
    await page.goto(url);

    const accessibilityScanResults = await new AxeBuilder({page})
        .withTags(['RGAAv4', 'wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
}

test.describe('Pokedex home', () => {
    test('should not have any automatically detectable accessibility issues', async ({ page }) => {
        for (const url of ['/', '/pokemon/2']) {
            await validateAccessibilityFor(page, url);
        }
    });
});