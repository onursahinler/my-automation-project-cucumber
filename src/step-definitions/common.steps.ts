import { Given, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { Constants } from '../../constants/Constants';
import { AllureHelper } from '../../utils/AllureHelper';

/**
 * Sayfalar arası ortak adımlar: başlangıç noktası ve URL doğrulamaları.
 *
 * Not: Allure "epic" etiketi bir adım içinden verilmelidir (Before hook'undan
 * verilirse teste değil fixture'a bağlanır). Her senaryo bu iki Given'dan
 * biriyle başladığı için epic burada işaretlenir.
 */
const EPIC = 'Sauce Demo E-Ticaret';

Given('login sayfasındayım', async function (this: CustomWorld) {
  await AllureHelper.meta({ epic: EPIC });
  /* Before hook zaten openApp() çağırır; burada ekranın yüklendiği doğrulanır */
  await this.loginPage.verifyPageLoaded();
});

Given('standart kullanıcı olarak giriş yaptım', async function (this: CustomWorld) {
  await AllureHelper.meta({ epic: EPIC });
  await this.loginAndLandOnInventory(this.resolveUser('standart'));
});

Then('envanter sayfasına yönlendirilirim', async function (this: CustomWorld) {
  await this.inventoryPage.expectUrl(Constants.URLS.INVENTORY);
  await this.inventoryPage.verifyPageLoaded();
});

Then('login sayfasına yönlendirilirim', async function (this: CustomWorld) {
  await this.loginPage.expectUrl(Constants.URLS.LOGIN);
  await this.loginPage.verifyPageLoaded();
});
