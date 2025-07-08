import { Page, expect } from '@playwright/test';

export class CartService {
  constructor(private page: Page) {}

  async proceedToCheckout() {
    await this.page.click('a[class="btn btn-default check_out"]');
  }

  async verifyFinalTotal(): Promise<number> {
    const finalTotalText = await this.page.locator(`//tr[td//h4/b[text()='Total Amount']]//p[@class="cart_total_price"]`).textContent();
    return Number(finalTotalText?.replace(/[^0-9]/g, ''));
  }
}