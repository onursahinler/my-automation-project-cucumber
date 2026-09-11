import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { Constants } from '../constants/Constants';

export class InventoryPage extends BasePage {
  private readonly productSortSelect: Locator;
  private readonly inventoryItems: Locator;
  private readonly inventoryList: Locator;
  private readonly shoppingCartBadge: Locator;

  constructor(page: Page) {
    super(page);
    this.productSortSelect = page.locator('[data-test="product-sort-container"]');
    this.inventoryItems = page.locator('[data-test="inventory-item"]');
    this.inventoryList = page.locator('.inventory_list');
    this.shoppingCartBadge = page.locator('[data-test="shopping-cart-badge"]');
  }

  /**
   * Envanter sayfasında olunduğunu VE ürün listesinin render edildiğini doğrular.
   * URL kontrolü de burada olduğu için adım tanımlarında ayrıca gerekmez.
   * (Yavaş kullanıcılar için kritik — bkz. @slow etiketi.)
   */
  async verifyPageLoaded() {
    await this.expectUrl(Constants.URLS.INVENTORY);
    await this.expectVisible(this.inventoryList);
    await this.expectVisible(this.inventoryItems.first());
  }

  // Ürünleri fiyata göre (yüksekten düşüğe) sırala
  async sortProductsByPriceHighToLow() {
    await this.selectOption(this.productSortSelect, Constants.SORT_OPTIONS.PRICE_HIGH_TO_LOW);
  }

  // Ürünleri fiyata göre (düşükten yükseğe) sırala
  async sortProductsByPriceLowToHigh() {
    await this.selectOption(this.productSortSelect, Constants.SORT_OPTIONS.PRICE_LOW_TO_HIGH);
  }

  // Belirli sıradaki ürünün adını döndürür (0-tabanlı, sınıf içi kullanım)
  private async getProductNameByIndex(index: number): Promise<string> {
    return this.getText(this.inventoryItems.nth(index).locator('[data-test="inventory-item-name"]'));
  }

  // Belirli sıradaki ürünü sepete ekler (0-tabanlı, sınıf içi kullanım)
  private async addProductToCartByIndex(index: number) {
    await this.click(this.inventoryItems.nth(index).locator('button:has-text("Add to cart")'));
  }

  /**
   * Listedeki N. sıradaki ürünü sepete ekler (1-tabanlı — senaryodaki
   * "1. sıradaki ürün" ifadesiyle birebir örtüşür).
   * 0-tabanlı index dönüşümü burada yapılır, adım tanımında değil.
   */
  async addProductToCartByPosition(position: number) {
    await this.addProductToCartByIndex(position - 1);
  }

  /**
   * Pahalıdan ucuza sıralı listede, ilk `count` ürünün EN UCUZUNUN adını döndürür.
   * "İlk N'in en ucuzu = (N-1). index" bilgisi bu sayfanın domain bilgisidir.
   */
  async getCheapestProductNameAmongTop(count: number): Promise<string> {
    return this.getProductNameByIndex(count - 1);
  }

  // Ürün adına göre sepete ekler
  async addProductToCartByName(productName: string) {
    const item = this.inventoryItems.filter({
      has: this.page.locator('[data-test="inventory-item-name"]', { hasText: productName }),
    });
    await this.click(item.locator('button:has-text("Add to cart")'));
  }

  // Sıralama sonrası ilk X ürünü (en pahalılar) sepete ekler
  async addTopExpensiveProductsToCart(count: number) {
    for (let i = 0; i < count; i++) {
      await this.addProductToCartByIndex(i);
    }
  }

  // Sepet rozetindeki sayıyı doğrular
  async verifyCartBadgeCount(expectedCount: string) {
    await this.expectText(this.shoppingCartBadge, expectedCount);
  }

  // Ürünün sepetten kaldırıldığını doğrula — "Add to cart" butonu tekrar görünür olmalı
  async verifyProductHasAddToCartButton(index: number) {
    await this.expectVisible(this.inventoryItems.nth(index).locator('button:has-text("Add to cart")'));
  }
}
