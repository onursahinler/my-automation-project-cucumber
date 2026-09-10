import { When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';

/**
 * Yan menü (sidebar) ve header navigasyon adımları.
 */

When('yan menüden {string} seçeneğine tıklarım', async function (this: CustomWorld, item: string) {
  switch (item) {
    case 'All Items':
      await this.commonPage.navigateToAllItems();
      break;
    default:
      throw new Error(`Tanımsız yan menü seçeneği: "${item}"`);
  }
});

When('yan menüyü açarım', async function (this: CustomWorld) {
  await this.commonPage.openMenu();
});

When('yan menüyü kapatırım', async function (this: CustomWorld) {
  await this.commonPage.closeMenu();
});

When('çıkış yaparım', async function (this: CustomWorld) {
  await this.commonPage.logout();
});

Then('yan menü görünür', async function (this: CustomWorld) {
  await this.commonPage.expectVisible(this.commonPage.allItemsLink);
});

Then('yan menü görünmez', async function (this: CustomWorld) {
  await this.commonPage.expectHidden(this.commonPage.allItemsLink);
});
