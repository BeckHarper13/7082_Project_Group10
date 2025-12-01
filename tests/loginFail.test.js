const { expect } = require("chai");
const { Builder, By, until } = require("selenium-webdriver");
const testUtils = require("./test-utils");

const invalidLoginStrings = {
    invalidMissingEmail: "Invalid or missing email",
    invalidEmailPassword: "Invalid email or password"
}

describe("Login Page E2E Test Fail Cases", function () {
    this.timeout(30000);
    let driver;

    before(async () => {
        driver = await testUtils.createBrowser();
    });

    after(async () => {
        await driver.quit();
    });

    it("Should load the login page", async () => {
        await driver.get("http://localhost:3000/login");

        const heading = await driver.wait(
            until.elementLocated(By.css("h3")),
            50000
        );

        const text = await heading.getText();
        expect(text).to.equal("Login");
    });

    it("Should not allow invalid emails", async () => {
        await testUtils.inputLoginInfo("email", "1234", driver);
        const text = await waitForText(
            driver,
            By.id("errorMsgText"),
            invalidLoginStrings.invalidMissingEmail,
            50000
        );
        expect(text).to.equal(invalidLoginStrings.invalidMissingEmail);
    });

    it("Should not allow unknown emails to login", async () => {
        await testUtils.inputLoginInfo("email@email.ca", "1234", driver);
        const text = await waitForText(
            driver,
            By.id("errorMsgText"),
            invalidLoginStrings.invalidEmailPassword,
            50000
        );
        expect(text).to.equal(invalidLoginStrings.invalidEmailPassword);
    });

    it("Should not allow login with correct email and incorrect password", async () => {
        await testUtils.inputLoginInfo("newnav@gmail.com", "12345", driver);
        const text = await waitForText(
            driver,
            By.id("errorMsgText"),
            invalidLoginStrings.invalidEmailPassword,
            50000
        );
        expect(text).to.equal(invalidLoginStrings.invalidEmailPassword);
    });
});

async function waitForText(driver, locator, expectedText, timeout = 50000) {
    // Wait until element exists
    const el = await driver.wait(until.elementLocated(locator), timeout);

    // Wait until text appears AND matches expected
    await driver.wait(async () => {
        const txt = await el.getText();
        return txt && txt.includes(expectedText);
    }, timeout);

    return el.getText(); // Return final text if needed
}