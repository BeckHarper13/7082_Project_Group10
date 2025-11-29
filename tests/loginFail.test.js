const { expect } = require("chai");
const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
require("chromedriver");

describe("Login Page E2E Test Fail Cases", function () {
    this.timeout(30000);
    let driver;

    before(async () => {
        const options = new chrome.Options();
        // options.addArguments("--headless"); // enable this for CI or silent mode
        options.addArguments("--window-size=1920,1080");

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
        await inputLoginInfo("email", "1234", driver);
        const text = await waitForText(
            driver,
            By.id("errorMsgText"),
            "Invalid or missing email",
            5000
        );
        expect(text).to.equal("Invalid or missing email");
    });

    it("Should not allow unknown emails to login", async () => {
        await inputLoginInfo("email@email.ca", "1234", driver);
        const text = await waitForText(
            driver,
            By.id("errorMsgText"),
            "Invalid email or password",
            5000
        );
        expect(text).to.equal("Invalid email or password");
    });

    it("Should not allow login with correct email and incorrect password", async () => {
        await inputLoginInfo("newnav@gmail.com", "12345", driver);
        const text = await waitForText(
            driver,
            By.id("errorMsgText"),
            "Invalid email or password",
            5000
        );
        expect(text).to.equal("Invalid email or password");
    });
});

async function inputLoginInfo(email, password, driver) {
    await driver.get("http://localhost:3000/login");

    const emailInput = await driver.findElement(By.id("email"));
    await emailInput.clear();
    await emailInput.sendKeys(email);

    const passInput = await driver.findElement(By.id("password"));
    await passInput.clear();
    await passInput.sendKeys(password);

    const submitBtn = await driver.findElement(By.css("button[type='submit']"));
    await submitBtn.click();
}

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