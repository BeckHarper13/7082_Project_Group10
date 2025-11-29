const { expect } = require("chai");
const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
require("chromedriver");
const testUtils = require("./test-utils");

const invalidLoginStrings = {
    invalidMissingEmail: "Invalid or missing email",
    invalidEmailPassword: "Invalid email or password"
}

describe("Login Page E2E Test Fail Cases", function () {
    this.timeout(30000);
    let driver;

    before(async () => {
        const options = new chrome.Options();
        const headless = process.env.HEADLESS === "true";

        if (headless) {
            options.addArguments("--headless");
            options.addArguments("--disable-gpu");
            options.addArguments("--no-sandbox");
        } else {
            options.addArguments("--window-size=1920,1080");
        }

        driver = await new Builder()
            .forBrowser("chrome")
            .setChromeOptions(options)
            .build();
    });

    after(async () => {
        await driver.quit();
    });

    it("Should load the login page", async () => {
        await driver.get("http://localhost:3000/login");

        const heading = await driver.wait(
            until.elementLocated(By.css("h3")),
            5000
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
            5000
        );
        expect(text).to.equal(invalidLoginStrings.invalidMissingEmail);
    });

    it("Should not allow unknown emails to login", async () => {
        await testUtils.inputLoginInfo("email@email.ca", "1234", driver);
        const text = await waitForText(
            driver,
            By.id("errorMsgText"),
            invalidLoginStrings.invalidEmailPassword,
            5000
        );
        expect(text).to.equal(invalidLoginStrings.invalidEmailPassword);
    });

    it("Should not allow login with correct email and incorrect password", async () => {
        await testUtils.inputLoginInfo("newnav@gmail.com", "12345", driver);
        const text = await waitForText(
            driver,
            By.id("errorMsgText"),
            invalidLoginStrings.invalidEmailPassword,
            5000
        );
        expect(text).to.equal(invalidLoginStrings.invalidEmailPassword);
    });
});

async function waitForText(driver, locator, expectedText, timeout = 5000) {
    // Wait until element exists
    const el = await driver.wait(until.elementLocated(locator), timeout);

    // Wait until text appears AND matches expected
    await driver.wait(async () => {
        const txt = await el.getText();
        return txt && txt.includes(expectedText);
    }, timeout);

    return el.getText(); // Return final text if needed
}