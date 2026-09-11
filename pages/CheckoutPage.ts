import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { Constants } from '../constants/Constants';
import { CustomerInfo } from '../utils/DataFactory';

export class CheckoutPage extends BasePage {
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly postalCodeInput: Locator;
  private readonly continueButton: Locator;
  private readonly finishButton: Locator;
  private readonly completeHeader: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.completeHeader = page.locator('[data-test="complete-header"]');
  }

  // Müşteri bilgilerini doldur ve devam et (sipariş özetine ulaşıldığı doğrulanır)
  async fillInformation(customer: CustomerInfo) {
    await this.fill(this.firstNameInput, customer.firstName);
    await this.fill(this.lastNameInput, customer.lastName);
    await this.fill(this.postalCodeInput, customer.postalCode);
    await this.click(this.continueButton);
    await this.expectUrl(Constants.URLS.CHECKOUT_STEP_TWO);
  }

  // Siparişi tamamla (tamamlandı sayfasına ulaşıldığı doğrulanır)
  async finishOrder() {
    await this.click(this.finishButton);
    await this.expectUrl(Constants.URLS.CHECKOUT_COMPLETE);
  }

  // Başarı mesajını doğrula (final assertion)
  async verifySuccessMessage(expectedMessage: string) {
    await this.expectText(this.completeHeader, expectedMessage);
  }
}
