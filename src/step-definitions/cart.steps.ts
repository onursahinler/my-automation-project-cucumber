import { When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';

/**
 * Sepet (cart) adımları: sepete gitme, ürün çıkarma, adet doğrulaması,
 * checkout'a geçiş. URL doğrulamaları ilgili Page Object aksiyonlarının içindedir.
 */

When('sepete giderim', async function (this: CustomWorld) {
  await this.commonPage.goToCart();
});

When('alışverişe devam ederim', async function (this: CustomWorld) {
  await this.cartPage.continueShopping();
});

When('ödeme sürecini başlatırım', async function (this: CustomWorld) {
  await this.cartPage.proceedToCheckout();
});

When('hatırladığım ürünü sepetten çıkarırım', async function (this: CustomWorld) {
  await this.cartPage.removeProductByName(this.requireRememberedProduct());
});

Then('sepette {int} ürün bulunur', async function (this: CustomWorld, count: number) {
  await this.cartPage.verifyCartItemCount(count);
});
