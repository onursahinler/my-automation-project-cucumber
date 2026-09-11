import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { Constants } from '../constants/Constants';

/**
 * Header ve yan menü gibi TÜM sayfalarda ortak görünen bileşenler.
 * Not: BasePage "teknik" ortaklıkları (page, assertion, navigasyon) tutar;
 * CommonPage ise "görsel/işlevsel" ortak bileşeni (header + sidebar) temsil eder.
 *
 * Locator'lar `private`: adım tanımları locator'a değil, davranışa erişir.
 */
export class CommonPage extends BasePage {
  // Header Öğeleri
  private readonly menuButton: Locator;
  private readonly closeMenuButton: Locator;
  private readonly shoppingCartLink: Locator;

  // Yan Menü Linkleri
  private readonly allItemsLink: Locator;
  private readonly aboutLink: Locator;
  private readonly logoutLink: Locator;
  private readonly resetAppStateLink: Locator;

  constructor(page: Page) {
    super(page);
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.closeMenuButton = page.locator('#react-burger-cross-btn');
    this.shoppingCartLink = page.locator('.shopping_cart_link');

    this.allItemsLink = page.locator('#inventory_sidebar_link');
    this.aboutLink = page.locator('#about_sidebar_link');
    this.logoutLink = page.locator('#logout_sidebar_link');
    this.resetAppStateLink = page.locator('#reset_sidebar_link');
  }

  /* ---------------- Yan menü ---------------- */

  async openMenu() {
    await this.click(this.menuButton);
    await this.expectVisible(this.allItemsLink);
  }

  async closeMenu() {
    await this.click(this.closeMenuButton);
    await this.expectHidden(this.allItemsLink);
  }

  /** Yan menünün açık olduğunu doğrular */
  async verifyMenuOpen() {
    await this.expectVisible(this.allItemsLink);
  }

  /** Yan menünün kapalı olduğunu doğrular */
  async verifyMenuClosed() {
    await this.expectHidden(this.allItemsLink);
  }

  /**
   * Yan menüdeki seçenekleri ekrandaki etiketleriyle eşler.
   * Bu eşleme sayfanın bilgisidir — adım tanımında `switch` bulunmaz.
   */
  private get sidebarActions(): Record<string, () => Promise<void>> {
    return {
      'All Items': () => this.navigateToAllItems(),
      Logout: () => this.logout(),
      'Reset App State': () => this.resetAppState(),
    };
  }

  /** Yan menüden ekrandaki etiketine göre bir seçeneğe gider */
  async navigateToSidebarItem(label: string) {
    const action = this.sidebarActions[label];
    if (!action) {
      throw new Error(
        `Tanımsız yan menü seçeneği: "${label}". ` +
          `Geçerli seçenekler: ${Object.keys(this.sidebarActions).join(', ')}`,
      );
    }
    await action();
  }

  /* ---------------- Navigasyon aksiyonları ----------------
   * Her biri hedef sayfaya ulaşıldığını kendi içinde doğrular,
   * böylece adım tanımlarında ayrıca URL kontrolü gerekmez.
   */

  async navigateToAllItems() {
    await this.openMenu();
    await this.click(this.allItemsLink);
    await this.expectUrl(Constants.URLS.INVENTORY);
  }

  async logout() {
    await this.openMenu();
    await this.click(this.logoutLink);
    await this.expectUrl(Constants.URLS.LOGIN);
  }

  async resetAppState() {
    await this.openMenu();
    await this.click(this.resetAppStateLink);
  }

  async goToCart() {
    await this.click(this.shoppingCartLink);
    await this.expectUrl(Constants.URLS.CART);
  }
}
