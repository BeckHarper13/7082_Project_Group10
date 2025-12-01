const { expect } = require("chai");
const { Builder, By, until } = require("selenium-webdriver");
const testUtils = require("./test-utils");

describe("Register Car E2E Test", function () {
    this.timeout(30000);
    let driver;

    before(async () => {
        driver = await testUtils.createBrowser();
        await testUtils.inputLoginInfo("newnav@gmail.com", "1234", driver);
    });

    after(async () => {
        await driver.quit();
    });

    it("Should open the car registration page", async () => {
        await driver.wait(until.elementLocated(By.id("menuBtn")), 10000).click();
        await driver.sleep(500);
        await driver.wait(until.elementLocated(By.css('a[href="/search"]')), 10000).click();
        await driver.sleep(500);
        await driver.wait(until.urlContains('/search'), 10000);
        const url = await driver.getCurrentUrl();
        expect(url).to.include('/search');
    });

    it("Should register the car", async () => {
        await chooseCarAndEnterSerialNum(
            "lamborghini",
            "Aventador",
            "81362",
            "Aventador LP 700-4 2dr Coupe AWD (6.5L 12cyl 7AM) (2021)",
            driver
        );

        const successH2 = await driver.wait(
            until.elementLocated(By.xpath("//h2[contains(text(), 'Car Registered!')]")),
            10000
        );

        await driver.wait(until.elementIsVisible(successH2), 10000);

        const message = await successH2.getText();
        expect(message).to.equal("Car Registered!");

        const registerCarDetails = "2021 Aventador LP 700-4 2dr Coupe AWD (6.5L 12cyl 7AM)";
        const allH5 = await driver.wait(until.elementsLocated(By.css("h5")));
        let foundCarDetails = false;
        for (let i = 0; i < allH5.length; i++) {
            const txt = await allH5[i].getText();
            if (registerCarDetails === txt) {
                expect(registerCarDetails).to.equal(txt);
                foundCarDetails = true;
                break;
            }
        }
        if (!foundCarDetails) {
            expect(registerCarDetails).to.equal("");
        }
        await driver.sleep(500);
        await driver.wait(until.elementLocated(By.id("wizardHomeBtn")), 10000).click();
        await driver.sleep(500);
    });

    it("Should check if the car is stored in the users account", async () => {
        const carInfo = "2021 • LP 700-4 2dr Coupe AWD (6.5L 12cyl 7AM)";
        const elem = await driver.wait(until.elementLocated(By.xpath("//a[contains(@href, '/car?trimId=81362')]")), 10000);
        const parent = await elem.findElement(By.xpath(".."));
        await driver.sleep(500);
        await parent.click();
        await driver.sleep(500);

        const pTags = await driver.wait(until.elementsLocated(By.css("p")), 10000);
        let foundCarInfo = false;
        for (let i = 0; i < pTags.length; i++) {
            const txt = await pTags[i].getText();
            if (carInfo === txt) {
                expect(carInfo).to.equal(txt);
                foundCarInfo = true;
                break;
            }
        }
        if (!foundCarInfo) {
            const txt = await pTags[0].getText();
            expect(carInfo).to.equal(txt);
        }
    });

    it("Should delete the car", async () => {
        const deleteCarBtn = await driver.wait(until.elementLocated(By.id("deleteCarModalBtn")), 10000);
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", deleteCarBtn);
        await driver.sleep(500);
        await deleteCarBtn.click();

        const realDeleteCarBtn = await driver.wait(until.elementLocated(By.id("deleteCarBtn")), 10000);
        await driver.sleep(500);
        await driver.wait(until.elementIsEnabled(realDeleteCarBtn), 5000);
        await driver.wait(until.elementIsVisible(realDeleteCarBtn), 5000);
        await realDeleteCarBtn.click();

        const goToAccountBtn = await driver.wait(until.elementLocated(By.id("backToAccountBtn")), 10000);
        await driver.sleep(500);
        await driver.wait(until.elementIsEnabled(goToAccountBtn), 5000);
        await driver.wait(until.elementIsVisible(goToAccountBtn), 5000);
        await goToAccountBtn.click();
        
        const carCards = await driver.wait(until.elementsLocated(By.className("card")), 10000);
        expect(carCards.length).to.equal(2);
    });
});

async function chooseCarAndEnterSerialNum(make, model, trim, carRegisterDetails, driver) {
    await driver.sleep(500);
    const makeDropdown = await driver.wait(until.elementLocated(By.id("make")));
    await driver.wait(until.elementIsVisible(makeDropdown), 10000);
    await driver.wait(until.elementIsEnabled(makeDropdown), 10000);
    await driver.wait(until.elementLocated(By.css(`option[value="${make}"]`))).click();

    await driver.sleep(500);
    const modelDropdown = await driver.wait(until.elementLocated(By.id("model")));
    await driver.wait(until.elementIsVisible(modelDropdown), 10000);
    await driver.wait(until.elementIsEnabled(modelDropdown), 10000);
    await driver.wait(until.elementLocated(By.css(`option[value="${model}"]`))).click();

    await driver.sleep(500);
    const trimDropdown = await driver.wait(until.elementLocated(By.id("trim")));
    await driver.wait(until.elementIsVisible(trimDropdown), 10000);
    await driver.wait(until.elementIsEnabled(trimDropdown), 10000);
    await driver.wait(until.elementLocated(By.css(`option[value="${trim}"]`))).click();

    await driver.sleep(500);
    const getInfoBtn = await driver.wait(until.elementLocated(By.id("getInfo")));
    await driver.wait(until.elementIsVisible(getInfoBtn), 10000);
    await driver.wait(until.elementIsEnabled(getInfoBtn), 10000);
    await getInfoBtn.click()

    await driver.sleep(500);
    const H2CarInfo = await driver.wait(until.elementLocated(By.css("h2")), 10000);
    const H2CarInfoText = await H2CarInfo.getText();
    expect(H2CarInfoText).to.equal(carRegisterDetails);

    await driver.sleep(500);
    const saveCarBtn = await driver.wait(until.elementLocated(By.id("saveCarBtn")));
    await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", saveCarBtn);

    // Give layout/animations time to settle
    await driver.sleep(500);

    // Wait until Selenium says it's really clickable
    await driver.wait(until.elementIsEnabled(saveCarBtn), 5000);
    await driver.wait(until.elementIsVisible(saveCarBtn), 5000);

    await saveCarBtn.click();

    await driver.sleep(500);
    const serialNumInput = await driver.wait(until.elementLocated(By.id("serialNumberInput")));
    await driver.sleep(500); // Give layout/animations time to settle
    await driver.wait(until.elementIsVisible(serialNumInput), 10000);
    await driver.wait(until.elementIsEnabled(serialNumInput), 10000);
    await serialNumInput.clear();
    await serialNumInput.sendKeys("abc123");
    await driver.wait(until.elementLocated(By.id("wizardStep1Next"))).click();
    await driver.sleep(500);
    await driver.wait(until.elementLocated(By.id("wizardStep2Next"))).click();
}