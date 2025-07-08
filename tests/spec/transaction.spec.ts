import { test, expect } from '@playwright/test';
import path from 'path';
import { RegisterService } from '../controller/register.service';
import { CartService } from '../controller/cart.service';
import { CheckoutService } from '../controller/checkout.service';
import { HomePage } from '../pages/home.page';
import { ProductPage } from '../pages/product.page';
import { CartPage } from '../pages/cart.page';
import { SharedController } from '../controller/shared/shared.controller';

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

    const sharedController = new SharedController(page);

    // 1. Register
    await homePage.goto();
    await sharedController.visualRegression('01-home.png');
    await register.registerNewUser(user);

    // 2. Add 3 products to cart
    await productPage.goto();
    await sharedController.visualRegression('02-products.png');
    await productPage.addMultipleProductsToCart([1, 2, 3]);

    // 3. Go to cart and validate
    await cartPage.goto();
    await sharedController.visualRegression('03-cart.png');
    const totalCost = await cartPage.calculateTotal();

    // 4. Proceed to checkout and verify
    await cart.proceedToCheckout();
    const finalTotal = await cart.verifyFinalTotal();

    expect(finalTotal).toBe(totalCost);
    await sharedController.visualRegression('04-checkout.png');

    // 5. Complete purchase
    await checkout.fillPaymentDetails();
    await sharedController.visualRegression('06-order-complete.png');

    // 6. Download invoice
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      checkout.downloadInvoice()
    ]);
    const fileName = download.suggestedFilename();
    await download.saveAs(path.join(process.cwd(), 'downloads', fileName));

    // 7. Back to home
    await homePage.goHome();
    await sharedController.visualRegression('07-home-after-checkout.png');
  });
});