import { Locator, Page, expect as baseExpect } from '@playwright/test';
import { ENV } from '../config/env';

/**
 * Playwright'ın `expect`'i varsayılan olarak 5 sn bekler ve bu değer
 * `context.setDefaultTimeout()` ile DEĞİŞMEZ (o yalnızca aksiyonları etkiler).
 * Bu yüzden assertion'lar için ayrı bir varsayılanı burada tanımlıyoruz.
 */
const expect = baseExpect.configure({ timeout: ENV.EXPECT_TIMEOUT });

/**
 * BasePage
 * ---------
 * Tüm Page Object sınıflarının atası. Her sayfada tekrar eden üç şeyi barındırır:
 *   1) `page` nesnesinin saklanması (state yönetimi)
 *   2) Navigasyon yardımcıları
 *   3) Ortak etkileşim ve doğrulama (assertion) sarmalayıcıları
 *
 * Böylece alt sınıflar sadece KENDİ locator'larını ve KENDİ iş kurallarını tanımlar.
 * `abstract`: doğrudan `new BasePage(page)` yapılamaz, yalnızca miras alınır.
 *
 * Assertion timeout'u üç kademeli yönetilir:
 *   1) Global varsayılan  -> ENV.EXPECT_TIMEOUT (.env)
 *   2) Senaryo bazlı      -> setExpectTimeout() (örn. @slow tag'i, bkz. hooks.ts)
 *   3) Assertion bazlı    -> her metodun son parametresi (örn. Constants.TIMEOUTS.LONG)
 */
export abstract class BasePage {
  protected readonly page: Page;

  /** Bu sayfa nesnesinin assertion'ları için geçerli süre limiti (ms) */
  protected expectTimeout: number = ENV.EXPECT_TIMEOUT;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Bu sayfanın tüm assertion'larının varsayılan süresini değiştirir.
   * Senaryo bazlı ayar için kullanılır (bkz. CustomWorld.setExpectTimeout).
   */
  setExpectTimeout(ms: number): this {
    this.expectTimeout = ms;
    return this;
  }

  /* ---------------- Navigasyon ---------------- */

  /** Config'teki baseURL'e göre göreli yolla gezinir. Örn: goto('/') */
  async goto(path: string = '/') {
    await this.page.goto(path);
  }

  async reload() {
    await this.page.reload();
  }

  /** Aktif sayfanın URL'ini doğrular */
  async expectUrl(url: string | RegExp, timeout: number = this.expectTimeout) {
    await expect(this.page).toHaveURL(url, { timeout });
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  /* ---------------- Etkileşim ---------------- */

  protected async click(locator: Locator) {
    await locator.click();
  }

  protected async fill(locator: Locator, value: string) {
    await locator.fill(value);
  }

  protected async selectOption(locator: Locator, value: string) {
    await locator.selectOption(value);
  }

  protected async getText(locator: Locator): Promise<string> {
    return (await locator.innerText()).trim();
  }

  /* ---------------- Doğrulama (Assertion) ----------------
   *
   * Her metodun son parametresi opsiyonel `timeout`'tur. Verilmezse
   * `this.expectTimeout` (senaryo/global varsayılan) kullanılır; verilirse
   * yalnızca o assertion için geçerli olur:
   *     await this.expectVisible(this.inventoryList, Constants.TIMEOUTS.LONG);
   */

  async expectVisible(locator: Locator, timeout: number = this.expectTimeout) {
    await expect(locator).toBeVisible({ timeout });
  }

  async expectHidden(locator: Locator, timeout: number = this.expectTimeout) {
    await expect(locator).toBeHidden({ timeout });
  }

  /** Elementin görünür olduğunu VE metninin birebir eşleştiğini doğrular */
  async expectText(locator: Locator, expected: string, timeout: number = this.expectTimeout) {
    await expect(locator).toBeVisible({ timeout });
    await expect(locator).toHaveText(expected, { timeout });
  }

  /** Elementin görünür olduğunu VE metni İÇERDİĞİNİ doğrular */
  async expectContainsText(
    locator: Locator,
    expected: string,
    timeout: number = this.expectTimeout,
  ) {
    await expect(locator).toBeVisible({ timeout });
    await expect(locator).toContainText(expected, { timeout });
  }

  async expectCount(locator: Locator, expected: number, timeout: number = this.expectTimeout) {
    await expect(locator).toHaveCount(expected, { timeout });
  }
}
