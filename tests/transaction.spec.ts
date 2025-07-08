import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('AutomationExercise E2E Flow', () => {
  const random = Math.floor(Math.random() * 100000);
  const user = {
    name: `TestUser${random}`,
    email: `testuser${random}@example.com`,
    password: 'Test@123',
  };

  test('Register, Purchase, and Download Invoice with Visual Checks', async ({ page, context }) => {
    // 1. Register
    await page.goto('https://automationexercise.com');
    await expect(page).toHaveScreenshot('01-home.png');

    await page.click('a[href="/login"]');
    await expect(page).toHaveScreenshot('02-login-page.png');
    await page.fill('[data-qa="signup-name"]', user.name);
    await page.fill('[data-qa="signup-email"]', user.email);
    await page.click('[data-qa="signup-button"]');

    await page.waitForSelector('#id_gender1', { timeout: 10000 });
    await page.check('#id_gender1');
    await page.fill('#password', user.password);
    await page.selectOption('#days', '10');
    await page.selectOption('#months', '5');
    await page.selectOption('#years', '1990');
    await page.click('#newsletter');
    await page.click('#optin');

    await page.fill('#first_name', user.name);
    await page.fill('#last_name', 'QA');
    await page.fill('#address1', '123 QA Street');
    await page.selectOption('#country', 'United States');
    await page.fill('#state', 'NY');
    await page.fill('#city', 'New York');
    await page.fill('#zipcode', '10001');
    await page.fill('#mobile_number', '1234567890');
    await page.click('[data-qa="create-account"]');

    await page.waitForSelector('h2[data-qa="account-created"]');
    await page.click('[data-qa="continue-button"]');
    await expect(page).toHaveScreenshot('03-after-register.png');

    // 2. Add 3 products to cart
    await page.click('a[href="/products"]');
    await expect(page).toHaveScreenshot('04-products.png');
    for (let i = 1; i <= 3; i++) {
    const addButton = page.locator(`xpath=//div[contains(@class, 'productinfo') and contains(@class, 'text-center')]//a[@data-product-id='${i}']`);
    await addButton.click();
    await page.waitForSelector('#cartModal', { state: 'visible' }); // Ensure modal shows up
    await page.click('button.close-modal'); // Close modal
}

    // 3. Go to cart and validate
    await page.click('a[href="/view_cart"]');
    await expect(page).toHaveScreenshot('05-cart.png');

    const items = await page.$$('.cart_description');
    expect(items.length).toBe(3);

    let totalCost = 0;
    const prices = await page.$$('.cart_total > p');
    for (const priceElement of prices) {
      const priceText = await priceElement.textContent();
      const value = Number(priceText?.replace(/[^0-9]/g, ''));
      totalCost += value;
    }

    // 4. Proceed to checkout
    await page.click('a[class="btn btn-default check_out"]');
    const finalTotalText = await page.locator(`//tr[td//h4/b[text()='Total Amount']]//p[@class="cart_total_price"]`).textContent();
    const finalTotal = Number(finalTotalText?.replace(/[^0-9]/g, ''));

    console.log(`🧾 Cart Total: ${totalCost}, Final Page Total: ${finalTotal}`);

    expect(finalTotal).toBe(totalCost);

    await expect(page).toHaveScreenshot('06-checkout.png');

    // 5. Complete purchase
    await page.fill('textarea[name="message"]', 'Automated order');
    await page.click('a[href="/payment"]');
    await expect(page).toHaveScreenshot('07-payment-page.png');

    await page.fill('input[name="name_on_card"]', 'QA Test');
    await page.fill('input[name="card_number"]', '4111111111111111');
    await page.fill('input[name="cvc"]', '123');
    await page.fill('input[name="expiry_month"]', '12');
    await page.fill('input[name="expiry_year"]', '2030');
    await page.click('#submit');

    await page.waitForSelector('h2[data-qa="order-placed"]');
    await expect(page).toHaveScreenshot('08-order-complete.png');

    // 6. Download invoice
    const [ download ] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('a.check_out').filter({ hasText: 'Download Invoice' }).click(),
    ]);

    const downloadPath = await download.path();
    const fileName = download.suggestedFilename();
    const savePath = path.join(__dirname, '../downloads/', fileName);
    await download.saveAs(savePath);
    console.log(`✅ Invoice saved to: ${savePath}`);

    // 7. Back to home
    await page.click('a[href="/"]');
    await expect(page).toHaveScreenshot('09-home-after-checkout.png');
  });
});
