import { When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';

/**
 * Envanter (inventory) adımları: sıralama, sepete ekleme, rozet doğrulaması.
 * Index aritmetiği ve "en ucuz hangisi" bilgisi InventoryPage'te durur.
 */

When('ürünleri fiyata göre pahalıdan ucuza sıralarım', async function (this: CustomWorld) {
  await this.inventoryPage.sortProductsByPriceHighToLow();
});

When('ürünleri fiyata göre ucuzdan pahalıya sıralarım', async function (this: CustomWorld) {
  await this.inventoryPage.sortProductsByPriceLowToHigh();
});

When('en pahalı {int} ürünü sepete eklerim', async function (this: CustomWorld, count: number) {
  await this.inventoryPage.addTopExpensiveProductsToCart(count);
});

When(
  'en pahalı {int} üründen en ucuzunun adını hatırlarım',
  async function (this: CustomWorld, count: number) {
    this.rememberedProduct = await this.inventoryPage.getCheapestProductNameAmongTop(count);
  },
);

When('{int}. sıradaki ürünü sepete eklerim', async function (this: CustomWorld, position: number) {
  await this.inventoryPage.addProductToCartByPosition(position);
});

When('hatırladığım ürünü tekrar sepete eklerim', async function (this: CustomWorld) {
  await this.inventoryPage.addProductToCartByName(this.requireRememberedProduct());
});

Then('sepet rozetinde {string} yazar', async function (this: CustomWorld, count: string) {
  await this.inventoryPage.verifyCartBadgeCount(count);
});
