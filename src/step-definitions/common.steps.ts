import { Given, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';

/**
 * Sayfalar arası ortak adımlar: senaryo başlangıç noktaları ve sayfa doğrulamaları.
 *
 * Her adım tek bir çağrıya delege eder (thin step); veri üretimi, raporlama ve
 * URL doğrulaması alt katmanlarda (World / Page Object) durur.
 */

Given('login sayfasındayım', async function (this: CustomWorld) {
  await this.startOnLoginPage();
});

Given('standart kullanıcı olarak giriş yaptım', async function (this: CustomWorld) {
  await this.startAsStandardUser();
});

Then('envanter sayfasına yönlendirilirim', async function (this: CustomWorld) {
  await this.inventoryPage.verifyPageLoaded();
});

Then('login sayfasına yönlendirilirim', async function (this: CustomWorld) {
  await this.loginPage.verifyPageLoaded();
});
