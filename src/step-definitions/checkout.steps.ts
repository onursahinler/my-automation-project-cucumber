import { When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { Constants } from '../../constants/Constants';
import { DataFactory } from '../../utils/DataFactory';
import { AllureHelper } from '../../utils/AllureHelper';

/**
 * Checkout adımları. Müşteri bilgisi Faker ile üretilir ve rapora
 * JSON eki olarak iliştirilir (rastgele veriyle fail durumunda izlenebilirlik).
 */

When('müşteri bilgilerini doldururum', async function (this: CustomWorld) {
  this.customer = DataFactory.customerInfo();
  await AllureHelper.attachJson('Üretilen müşteri bilgisi', this.customer);

  await this.checkoutPage.expectUrl(Constants.URLS.CHECKOUT_STEP_ONE);
  await this.checkoutPage.fillInformation(this.customer);
});

When('siparişi tamamlarım', async function (this: CustomWorld) {
  await this.checkoutPage.expectUrl(Constants.URLS.CHECKOUT_STEP_TWO);
  await this.checkoutPage.finishOrder();
});

Then('sipariş başarı mesajını görürüm', async function (this: CustomWorld) {
  await this.checkoutPage.expectUrl(Constants.URLS.CHECKOUT_COMPLETE);
  await this.checkoutPage.verifySuccessMessage(Constants.MESSAGES.ORDER_SUCCESS);
});
