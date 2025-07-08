import { Page, expect } from '@playwright/test';

export class CheckoutService {
  constructor(private page: Page) {}

  async fillPaymentDetails() {
    await this.page.fill('textarea[name="message"]', 'Automated order');
    await this.page.click('a[href="/payment"]');
    await expect(this.page).toHaveScreenshot('07-payment-page.png');

    await this.page.fill('input[name="name_on_card"]', 'QA Test');
    await this.page.fill('input[name="card_number"]', '4111111111111111');
    await this.page.fill('input[name="cvc"]', '123');
    await this.page.fill('input[name="expiry_month"]', '12');
    await this.page.fill('input[name="expiry_year"]', '2030');
    await this.page.click('#submit');
    await this.page.waitForSelector('h2[data-qa="order-placed"]');
  }

  async downloadInvoice() {
    return this.page.locator('a.check_out').filter({ hasText: 'Download Invoice' }).click();
  }

  async expectVisual(filename: string) {
    await expect(this.page).toHaveScreenshot(filename);
  }
}