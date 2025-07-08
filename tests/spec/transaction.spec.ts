import { test, expect } from '@playwright/test';
import path from 'path';
import { RegisterService } from '../services/register.service';
import { CartService } from '../services/cart.service';
import { CheckoutService } from '../services/checkout.service';
import { HomePage } from '../pages/home.page';
import { ProductPage } from '../pages/product.page';
import { CartPage } from '../pages/cart.page';

const random = Math.floor(Math.random() * 100000);
const user = {
  name: `TestUser${random}`,
  email: `testuser${random}@example.com`,
  password: 'Test@123',
};

test.describe('AutomationExercise E2E Flow', () => {
  test('Register, Purchase, and Download Invoice with Visual Checks', async ({ page, context }) => {
    const register = new RegisterService(page);
    const cart = new CartService(page);
    const checkout = new CheckoutService(page);

    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    // 1. Register
    await homePage.goto();
    await homePage.expectVisual('01-home.png');
    await register.registerNewUser(user);

    // 2. Add 3 products to cart
    await productPage.goto();
    await productPage.expectVisual('02-products.png');
    await productPage.addMultipleProductsToCart([1, 2, 3]);

    // 3. Go to cart and validate
    await cartPage.goto();
    await cartPage.expectVisual('03-cart.png');
    const totalCost = await cartPage.calculateTotal();

    // 4. Proceed to checkout and verify
    await cart.proceedToCheckout();
    const finalTotal = await cart.verifyFinalTotal();
    console.log(`🧾 Cart Total: ${totalCost}, Final Page Total: ${finalTotal}`);
    expect(finalTotal).toBe(totalCost);
    await cart.expectVisual('04-checkout.png');

    // 5. Complete purchase
    await checkout.fillPaymentDetails();
    await checkout.expectVisual('05-order-complete.png');

    // 6. Download invoice
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      checkout.downloadInvoice()
    ]);
    const fileName = download.suggestedFilename();
    await download.saveAs(path.join(__dirname, '../../downloads/', fileName));
    console.log(`✅ Invoice saved to: downloads/${fileName}`);

    // 7. Back to home
    await homePage.goHome();
    await homePage.expectVisual('06-home-after-checkout.png');
  });
});