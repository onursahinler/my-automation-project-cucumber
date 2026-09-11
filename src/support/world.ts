import {
  setWorldConstructor,
  setDefaultTimeout,
  World,
  IWorldOptions,
} from '@cucumber/cucumber';
import { Browser, BrowserContext, Page } from '@playwright/test';

import { ENV } from '../../config/env';
import { Credentials } from '../../data/users';
import { userByRole } from '../../data/userByRole';
import { CustomerInfo, DataFactory } from '../../utils/DataFactory';
import { AllureHelper } from '../../utils/AllureHelper';

import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { CommonPage } from '../../pages/CommonPage';

/* Bir senaryonun toplam süre limiti (.env -> TEST_TIMEOUT) */
setDefaultTimeout(ENV.TEST_TIMEOUT);

/** Tüm senaryoların Allure'daki üst gruplaması */
const EPIC = 'Sauce Demo E-Ticaret';

/**
 * CustomWorld
 * -----------
 * Playwright versiyonundaki `Hooks` sınıfı + `app` / `loggedInApp` fixture'larının
 * Cucumber karşılığı. Her senaryo için Cucumber yeni bir World örneği üretir;
 * `init()` bir tarayıcı context'i + sayfa + tüm Page Object'leri kurar.
 *
 * Tarayıcının kendisi senaryolar arasında paylaşılır (BeforeAll'da açılır);
 * her senaryo yalıtım için ayrı bir `BrowserContext` alır.
 */
export class CustomWorld extends World {
  context!: BrowserContext;
  page!: Page;

  loginPage!: LoginPage;
  inventoryPage!: InventoryPage;
  cartPage!: CartPage;
  checkoutPage!: CheckoutPage;
  commonPage!: CommonPage;

  /* Adımlar arası taşınan senaryo durumu */
  customer?: CustomerInfo;
  rememberedProduct?: string;

  constructor(options: IWorldOptions) {
    super(options);
  }

  /** Before hook'unda çağrılır: context + page + Page Object'ler kurulur */
  async init(browser: Browser): Promise<void> {
    this.context = await browser.newContext({
      baseURL: ENV.BASE_URL,
      recordVideo: { dir: 'test-results/videos' },
    });
    this.context.setDefaultTimeout(ENV.ACTION_TIMEOUT);
    await this.context.tracing.start({ screenshots: true, snapshots: true, sources: true });

    this.page = await this.context.newPage();

    /* Sayfa nesneleri tek noktada oluşturulur (single source of truth) */
    this.loginPage = new LoginPage(this.page);
    this.inventoryPage = new InventoryPage(this.page);
    this.cartPage = new CartPage(this.page);
    this.checkoutPage = new CheckoutPage(this.page);
    this.commonPage = new CommonPage(this.page);
  }

  /**
   * Bu senaryodaki TÜM sayfa nesnelerinin assertion süre limitini değiştirir.
   * `@slow` gibi bir tag'e sahip senaryolar için hooks.ts'ten çağrılır —
   * böylece yavaş olduğu bilinen senaryolar, diğerlerini yavaşlatmadan
   * daha uzun bekleyebilir.
   */
  setExpectTimeout(ms: number): void {
    [this.loginPage, this.inventoryPage, this.cartPage, this.checkoutPage, this.commonPage].forEach(
      (page) => page.setExpectTimeout(ms),
    );
  }

  /* ---------------- Ortak akış yardımcıları ---------------- */

  /** Her senaryonun ortak ilk adımı: login ekranını aç */
  async openApp(): Promise<void> {
    await this.loginPage.navigateTo();
  }

  /** Verilen kullanıcı ile giriş yapar (doğrulama yapmaz) */
  async loginAs(user: Credentials): Promise<void> {
    await this.loginPage.login(user.username, user.password);
  }

  /** Giriş yapar ve inventory sayfasına ulaşıldığını doğrular (Playwright'taki `loginAs`) */
  async loginAndLandOnInventory(user: Credentials): Promise<void> {
    await this.loginAs(user);
    await this.inventoryPage.verifyPageLoaded();
  }

  /* ---------------- Senaryo başlangıçları ----------------
   * Allure "epic" etiketi bir ADIM içinden verilmelidir (Before hook'undan
   * verilirse teste değil fixture'a bağlanır). Bu yüzden raporlama endişesi
   * adım tanımına sızmasın diye buraya alındı.
   */

  /** Senaryo login ekranında başlar */
  async startOnLoginPage(): Promise<void> {
    await AllureHelper.meta({ epic: EPIC });
    await this.loginPage.verifyPageLoaded();
  }

  /** Senaryo, standart kullanıcı ile giriş yapılmış halde başlar */
  async startAsStandardUser(): Promise<void> {
    await AllureHelper.meta({ epic: EPIC });
    await this.loginAndLandOnInventory(this.resolveUser('standart'));
  }

  /**
   * Checkout formunu Faker ile üretilen rastgele müşteri bilgisiyle doldurur.
   * Üretilen veri, rastgele veriyle fail durumunda izlenebilirlik için
   * Allure raporuna JSON olarak eklenir.
   */
  async fillCheckoutInformation(): Promise<void> {
    this.customer = DataFactory.customerInfo();
    await AllureHelper.attachJson('Üretilen müşteri bilgisi', this.customer);
    await this.checkoutPage.fillInformation(this.customer);
  }

  /* ---------------- Küçük yardımcılar ---------------- */

  /** Gherkin'deki insan-okur rol adını kimlik bilgisine çevirir */
  resolveUser(role: string): Credentials {
    const user = userByRole[role];
    if (!user) {
      throw new Error(
        `Bilinmeyen kullanıcı rolü: "${role}". Geçerli roller: ${Object.keys(userByRole).join(', ')}`,
      );
    }
    return user;
  }

  /** "hatırladığım ürün" adımları için: önceki adımda kaydedilmiş ürün adını döndürür */
  requireRememberedProduct(): string {
    if (!this.rememberedProduct) {
      throw new Error(
        'Hatırlanan ürün yok. Önce "... en ucuzunun adını hatırlarım" adımı çalışmalı.',
      );
    }
    return this.rememberedProduct;
  }
}

setWorldConstructor(CustomWorld);
