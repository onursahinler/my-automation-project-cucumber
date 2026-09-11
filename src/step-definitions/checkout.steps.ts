import { When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { Constants } from '../../constants/Constants';

/**
 * Checkout adımları. Test verisi üretimi ve rapora ekleme World'de
 * (`fillCheckoutInformation`), URL doğrulamaları CheckoutPage aksiyonlarının içinde.
 */

When('müşteri bilgilerini doldururum', async function (this: CustomWorld) {
  await this.fillCheckoutInformation();
});

When('siparişi tamamlarım', async function (this: CustomWorld) {
  await this.checkoutPage.finishOrder();
});

Then('sipariş başarı mesajını görürüm', async function (this: CustomWorld) {
  await this.checkoutPage.verifySuccessMessage(Constants.MESSAGES.ORDER_SUCCESS);
});
