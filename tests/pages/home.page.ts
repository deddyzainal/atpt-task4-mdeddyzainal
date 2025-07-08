import { Page, expect } from '@playwright/test';

export class HomePage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('https://automationexercise.com');
  }

  async goHome() {
    await this.page.click('a[href="/"]');
  }
}