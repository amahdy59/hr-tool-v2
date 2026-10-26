async function openPreferences(page) {
  if (page.viewport().width < 1024) {
    await page.click('header button[aria-haspopup="dialog"]');
    await page.waitForSelector('[data-slot="sheet-content"][data-state="open"]');
    const button = await page.evaluateHandle(() => [...document.querySelectorAll('[data-slot="sheet-content"] button')].find(button => button.querySelector('.lucide-settings')));
    await button.asElement().click();
  } else await page.click('header [data-slot="dialog-trigger"]');
  await page.waitForSelector('[data-panel="accessibility"]');
}
async function navigate(page, tab) {
  if (page.viewport().width < 1024) {
    await page.click('header button[aria-haspopup="dialog"]');
    await page.waitForSelector('[data-slot="sheet-content"][data-state="open"]');
    await page.click('[data-slot="sheet-content"] [data-nav="' + tab + '"]');
    await page.waitForSelector('[data-slot="sheet-content"]', { hidden: true });
  } else await page.click('aside [data-nav="' + tab + '"]');
  await page.waitForSelector('[data-screen="' + tab + '"]:not([hidden])');
}
module.exports = { openPreferences, navigate };
