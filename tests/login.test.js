const { expect } = require("chai");
const { Builder, By, until } = require("selenium-webdriver");
const testUtils = require("./test-utils");

describe("Login Page E2E Test", function () {
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
            5000
        );

        const text = await heading.getText();
        if (text !== "Login") throw new Error("Login page heading incorrect");
    });

    it("Should fill the login form and attempt submit", async () => {
        await driver.get("http://localhost:3000/login");

        // Fill email
        const emailInput = await driver.findElement(By.id("email"));
        await emailInput.clear();
        await emailInput.sendKeys("newnav@gmail.com");

        // Fill password
        const passInput = await driver.findElement(By.id("password"));
        await passInput.clear();
        await passInput.sendKeys("1234");

        // Submit button
        const submitBtn = await driver.findElement(By.css("button[type='submit']"));
        await submitBtn.click();
    });

    it("Should load the correct users page", async () => {
        await driver.wait(until.urlContains('/home'), 10000);
        const url = await driver.getCurrentUrl();
        expect(url).to.include('/home');
        
        const nameH3 = await driver.wait(until.elementLocated(By.xpath("//h3[1]")), 10000);
        const nameText = await nameH3.getText();
        expect(nameText).to.equal("Welcome back unco");

        await driver.sleep(2000);

    })
});
