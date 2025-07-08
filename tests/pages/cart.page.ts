import { Page, expect } from '@playwright/test';

export class CartPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.click('a[href="/view_cart"]');
  }

  async calculateTotal(): Promise<number> {
    const items = await this.page.$$('.cart_description');
    expect(items.length).toBe(3);

    let totalCost = 0;
    const prices = await this.page.$$('.cart_total > p');
    for (const priceElement of prices) {
      const priceText = await priceElement.textContent();
      const value = Number(priceText?.replace(/[^0-9]/g, ''));
      totalCost += value;
    }
    return totalCost;
  }
}