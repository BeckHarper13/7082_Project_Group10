const { expect } = require("chai");
const { Builder, By, until } = require("selenium-webdriver");
const testUtils = require("./test-utils");

describe("Car Page E2E Tests", function () {
    this.timeout(30000);
    let driver;

    before(async () => {
        driver = await testUtils.createBrowser();
        await testUtils.inputLoginInfo("newnav@gmail.com", "1234", driver);
    });

    after(async () => {
        await driver.quit();
    });

    it("Should load car page when home page car card clicked", async () => {
        const allH5 = await driver.wait(until.elementsLocated(By.css("h5")), 10000);
        const carMakeModel = allH5[1];
        const carMakeModelText = await carMakeModel.getText();

        const firstCard = await driver.wait(
            until.elementLocated(By.css(".card")),
            10000
        );
        await firstCard.click();

        await driver.wait(until.urlContains('/car'), 10000);
        const url = await driver.getCurrentUrl();
        expect(url).to.include('/car');

        const carMakeModelH2 = await driver.wait(until.elementLocated(By.xpath("//h2[1]")), 10000);
        const carMakeModelH2Text = await carMakeModelH2.getText();

        const carMakeModelH1 = await driver.wait(until.elementLocated(By.xpath("//h1[1]")), 10000);
        const carMakeModelH1Test = await carMakeModelH1.getText();

        expect(carMakeModelH2Text).to.equal(carMakeModelText);
        expect(carMakeModelH1Test).to.equal(carMakeModelText);
    });

    it("Should load car page when account car card clicked", async () => {
        await driver.wait(until.elementLocated(By.id("menuBtn")), 10000).click();
        await driver.wait(until.elementLocated(By.css('a[href="/account"]')), 10000).click();

        await driver.wait(until.urlContains('/account'), 10000);
        const accountUrl = await driver.getCurrentUrl();
        expect(accountUrl).to.include('/account');

        const allH5 = await driver.wait(until.elementsLocated(By.css("h5")), 10000);
        const carMakeModel = allH5[1];
        const carMakeModelText = await carMakeModel.getText();

        const firstCard = await driver.wait(
            until.elementLocated(By.css(".card")),
            10000
        );
        await firstCard.click();

        await driver.wait(until.urlContains('/car'), 10000);
        const url = await driver.getCurrentUrl();
        expect(url).to.include('/car');

        const carMakeModelH2 = await driver.wait(until.elementLocated(By.xpath("//h2[1]")), 10000);
        const carMakeModelH2Text = await carMakeModelH2.getText();

        const carMakeModelH1 = await driver.wait(until.elementLocated(By.xpath("//h1[1]")), 10000);
        const carMakeModelH1Test = await carMakeModelH1.getText();

        expect(carMakeModelH2Text).to.equal(carMakeModelText);
        expect(carMakeModelH1Test).to.equal(carMakeModelText);
    });
});