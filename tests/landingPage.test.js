const { expect } = require("chai");
const { Builder, By, until } = require("selenium-webdriver");
const testUtils = require("./test-utils");

describe("Landing Page E2E Test", function () {
    this.timeout(30000);
    let driver;

    before(async () => {
        driver = await testUtils.createBrowser();
    });

    after(async () => {
        await driver.quit();
    });

    it("Should load the landing page", async () => {
        await loadLandingPage(driver);
    });

    it("Should load the login page", async () => {
        const loginBtn = await driver.wait(until.elementLocated(By.css('a[href="/login"]')), 50000);
        await loginBtn.click();

        await driver.wait(until.urlContains('/login'), 50000);
        const url = await driver.getCurrentUrl();
        expect(url).to.include('/login');

        const heading = await driver.wait(
            until.elementLocated(By.css("h3")),
            50000
        );

        const text = await heading.getText();
        expect(text).to.equal("Login");
    });

    it("Should load the signup page", async () => {
        loadLandingPage(driver);

        const loginBtn = await driver.wait(until.elementLocated(By.css('a[href="/signup"]')), 50000);
        await loginBtn.click();

        await driver.wait(until.urlContains('/signup'), 50000);
        const url = await driver.getCurrentUrl();
        expect(url).to.include('/signup');

        const heading = await driver.wait(
            until.elementLocated(By.css("h3")),
            50000
        );

        const text = await heading.getText();
        expect(text).to.equal("Signup");
        // loadLandingPage(driver);
    });
});

async function loadLandingPage(driver) {
    await driver.get("http://localhost:3000/");
    const heading = await driver.wait(until.elementLocated(By.css("h2")), 50000);
    const text = await heading.getText();
    expect(text).to.equal("Welcome!");
}