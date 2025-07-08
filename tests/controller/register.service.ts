import { Page, expect } from '@playwright/test';

interface User {
  name: string;
  email: string;
  password: string;
}

export class RegisterService {
  constructor(private page: Page) {}

  async registerNewUser(user: User) {
    await this.page.click('a[href="/login"]');
    await this.page.fill('[data-qa="signup-name"]', user.name);
    await this.page.fill('[data-qa="signup-email"]', user.email);
    await this.page.click('[data-qa="signup-button"]');

    await this.page.waitForSelector('#id_gender1');
    await this.page.check('#id_gender1');
    await this.page.fill('#password', user.password);
    await this.page.selectOption('#days', '10');
    await this.page.selectOption('#months', '5');
    await this.page.selectOption('#years', '1990');
    await this.page.click('#newsletter');
    await this.page.click('#optin');

    await this.page.fill('#first_name', user.name);
    await this.page.fill('#last_name', 'QA');
    await this.page.fill('#address1', '123 QA Street');
    await this.page.selectOption('#country', 'United States');
    await this.page.fill('#state', 'NY');
    await this.page.fill('#city', 'New York');
    await this.page.fill('#zipcode', '10001');
    await this.page.fill('#mobile_number', '1234567890');
    await this.page.click('[data-qa="create-account"]');

    await this.page.waitForSelector('h2[data-qa="account-created"]');
    await this.page.click('[data-qa="continue-button"]');
  }
}