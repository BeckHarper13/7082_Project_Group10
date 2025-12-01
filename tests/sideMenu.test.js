const { expect } = require("chai");
const { Builder, By, until } = require("selenium-webdriver");
const testUtils = require("./test-utils");

describe("Side Menu E2E Tests", function () {
    this.timeout(30000);
    let driver;

    before(async () => {
        driver = await testUtils.createBrowser();
        await testUtils.inputLoginInfo("newnav@gmail.com", "1234", driver);
    });

    after(async () => {
        await driver.quit();
    });

    it("Should open the account page", async () => {
        await driver.wait(until.elementLocated(By.id("menuBtn")), 50000).click();
        await driver.sleep(500);
        await driver.wait(until.elementLocated(By.css('a[href="/account"]')), 50000).click();

        await driver.wait(until.urlContains('/account'), 50000);
        const url = await driver.getCurrentUrl();
        expect(url).to.include('/account');

        const username = await driver.wait(until.elementLocated(By.id("username")), 50000);
        const usernameText = await username.getText();
        expect(usernameText).to.equal("unco");

        const email = await driver.wait(until.elementLocated(By.id("email_address")), 50000);
        const emailText = await email.getText();
        expect(emailText).to.equal("newnav@gmail.com");
    });

    it("Should open the car registration page", async () => {
        await driver.wait(until.elementLocated(By.id("menuBtn")), 50000).click();
        await driver.sleep(500);
        await driver.wait(until.elementLocated(By.css('a[href="/search"]')), 50000).click();

        await driver.wait(until.urlContains('/search'), 50000);
        const url = await driver.getCurrentUrl();
        expect(url).to.include('/search');

        const header = await driver.wait(until.elementLocated(By.xpath("//h1[1]")), 50000);
        const headerText = await header.getText();
        expect(headerText).to.equal("Search Cars");
    });

    it ("Should open the home page", async () => {
        await driver.wait(until.elementLocated(By.id("menuBtn")), 50000).click();
        await driver.sleep(500);
        await driver.wait(until.elementLocated(By.css('a[href="/home"]')), 50000).click();

        await driver.wait(until.urlContains('/home'), 50000);
        const url = await driver.getCurrentUrl();
        expect(url).to.include('/home');

        const header = await driver.wait(until.elementLocated(By.xpath("//h1[1]")), 50000);
        const headerText = await header.getText();
        expect(headerText).to.equal("Home");

        const nameH3 = await driver.wait(until.elementLocated(By.xpath("//h3[1]")), 50000);
        const nameText = await nameH3.getText();
        expect(nameText).to.equal("Welcome back unco");
    });
})