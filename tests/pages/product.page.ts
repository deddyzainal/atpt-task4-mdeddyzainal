import { expect, Page } from '@playwright/test';

export class ProductPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.click('a[href="/products"]');
  }

  async addMultipleProductsToCart(ids: number[]) {
    for (const id of ids) {
      const addButton = this.page.locator(`//div[contains(@class, 'productinfo') and contains(@class, 'text-center')]//a[@data-product-id='${id}']`);
      await addButton.click();
      await this.page.waitForSelector('#cartModal', { state: 'visible' });
      await this.page.click('button.close-modal');
    }
  }
}