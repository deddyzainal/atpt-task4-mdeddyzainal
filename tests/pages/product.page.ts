import { Page } from '@playwright/test';

export class ProductPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.click('a[href="/products"]');
  }

  async expectVisual(filename: string) {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
    await this.page.screenshot({ path: filename, fullPage: true });
  }

  async addMultipleProductsToCart(ids: number[]) {
    for (const id of ids) {
      const addButton = this.page.locator(`xpath=//div[contains(@class, 'productinfo') and contains(@class, 'text-center')]//a[@data-product-id='${id}']`);
      await addButton.click();
      await this.page.waitForSelector('#cartModal', { state: 'visible' });
      await this.page.click('button.close-modal');
    }
  }
}