import { When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { Constants } from '../../constants/Constants';

/**
 * Login akışı: giriş aksiyonları ve hata mesajı doğrulamaları.
 * Beklenen mesaj metinleri Gherkin'e yazılmaz; Constants tek kaynaktır.
 */

When('{string} kullanıcısı ile giriş yaparım', async function (this: CustomWorld, role: string) {
  await this.loginAs(this.resolveUser(role));
});

When('geçersiz kimlik bilgileri ile giriş yaparım', async function (this: CustomWorld) {
  await this.loginAs(this.resolveUser('geçersiz'));
});

Then('kilitli kullanıcı hata mesajını görürüm', async function (this: CustomWorld) {
  await this.loginPage.verifyErrorMessage(Constants.MESSAGES.LOCKED_OUT_USER);
});

Then('geçersiz kimlik bilgisi hata mesajını görürüm', async function (this: CustomWorld) {
  await this.loginPage.verifyErrorMessage(Constants.MESSAGES.INVALID_CREDENTIALS);
});
