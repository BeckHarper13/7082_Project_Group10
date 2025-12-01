const { expect } = require("chai");
const { Builder, By, until } = require("selenium-webdriver");
const testUtils = require("./test-utils");

const invalidLoginStrings = {
    missingUsername : "Username is required",
    invalidMissingEmail: "Invalid or missing email",
    emailTaken : "Email already in use",
    invalidPassword: "Password must be at least 4 characters"
}

describe("Signup Page E2E Test Fail Cases", function () {
    this.timeout(30000);
    let driver;

    before(async () => {
        driver = await testUtils.createBrowser();
    });

    after(async () => {
        await driver.quit();
    });

    it("Should load the Signup page", async () => {
        await driver.get("http://localhost:3000/signup");

        const heading = await driver.wait(
            until.elementLocated(By.css("h3")),
            20000
        );

        const text = await heading.getText();
        expect(text).to.equal("Signup");
    });

    it("Should not allow invalid passwords", async () => {
        await inputSignupInfo("testerman", "email@email.email", "12", driver);
        const text = await waitForText(driver, By.id("errorMsgText"), invalidLoginStrings.invalidPassword,20000);
        expect(text).to.equal(invalidLoginStrings.invalidPassword);
    });

    it("Should not allow invalid emails", async () => {
        await inputSignupInfo("testerman", "email", "1234", driver);
        const text = await waitForText(driver, By.id("errorMsgText"), invalidLoginStrings.invalidMissingEmail,20000);
        expect(text).to.equal(invalidLoginStrings.invalidMissingEmail);
    });

    it("Should not allow emails already in use", async () => {
        await inputSignupInfo("testerman", "test@test.ca", "1234", driver);
        const text = await waitForText(driver, By.id("errorMsgText"), invalidLoginStrings.emailTaken,20000);
        expect(text).to.equal(invalidLoginStrings.emailTaken);
    });
    
    it("Should not allow empty usernames", async () => {
        await inputSignupInfo("", "email@email.email", "1234", driver);
        const text = await waitForText(driver, By.id("errorMsgText"), invalidLoginStrings.missingUsername,20000);
        expect(text).to.equal(invalidLoginStrings.missingUsername);
    });

});

async function waitForText(driver, locator, expectedText, timeout = 20000) {
    // Wait until element exists
    const el = await driver.wait(until.elementLocated(locator), timeout);

    // Wait until text appears AND matches expected
    await driver.wait(async () => {
        const txt = await el.getText();
        return txt && txt.includes(expectedText);
    }, timeout);

    return el.getText(); // Return final text if needed
}

async function inputSignupInfo(username, email, password, driver) {
    // Fill username
    const usernameInput = await driver.findElement(By.id("username"));
    await usernameInput.clear();
    await usernameInput.sendKeys(username);

    // Fill email
    const emailInput = await driver.findElement(By.id("email"));
    await emailInput.clear();
    await emailInput.sendKeys(email);
    
    // Fill password
    const passInput = await driver.findElement(By.id("password"));
    await passInput.clear();
    await passInput.sendKeys(password);
    
    // Submit button
    const submitBtn = await driver.findElement(By.css("button[type='submit']"));
    await submitBtn.click();
    await driver.sleep(200);
}