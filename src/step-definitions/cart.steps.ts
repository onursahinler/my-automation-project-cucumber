import { When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { Constants } from '../../constants/Constants';

/**
 * Sepet (cart) adımları: sepete gitme, ürün çıkarma, adet doğrulaması,
 * checkout'a geçiş.
 */

When('sepete giderim', async function (this: CustomWorld) {
  await this.commonPage.goToCart();
  await this.cartPage.expectUrl(Constants.URLS.CART);
});

When('alışverişe devam ederim', async function (this: CustomWorld) {
  await this.cartPage.continueShopping();
});

When('ödeme sürecini başlatırım', async function (this: CustomWorld) {
  await this.cartPage.expectUrl(Constants.URLS.CART);
  await this.cartPage.proceedToCheckout();
});

When('hatırladığım ürünü sepetten çıkarırım', async function (this: CustomWorld) {
  await this.cartPage.removeProductByName(this.requireRememberedProduct());
});

Then('sepette {int} ürün bulunur', async function (this: CustomWorld, count: number) {
  await this.cartPage.verifyCartItemCount(count);
});
