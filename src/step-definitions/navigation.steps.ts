import { When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';

/**
 * Yan menü (sidebar) ve header navigasyon adımları.
 * Menü etiketi -> aksiyon eşlemesi CommonPage'tedir; burada dallanma yoktur.
 */

When('yan menüden {string} seçeneğine tıklarım', async function (this: CustomWorld, item: string) {
  await this.commonPage.navigateToSidebarItem(item);
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
  await this.commonPage.verifyMenuOpen();
});

Then('yan menü görünmez', async function (this: CustomWorld) {
  await this.commonPage.verifyMenuClosed();
});
