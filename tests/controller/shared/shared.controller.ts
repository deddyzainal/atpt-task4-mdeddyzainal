import { Page } from "playwright";
import { expect } from "playwright/test";

export class SharedController {
    constructor(private page: Page) {}

    async visualRegression(fileName: string): Promise<void> {
        expect(await this.page.screenshot()).toMatchSnapshot(fileName, { maxDiffPixelRatio: 0.02 });
    }
}
