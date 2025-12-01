const { expect } = require("chai");
const { Builder, By, until } = require("selenium-webdriver");
const testUtils = require("./test-utils");

describe("Signup Page E2E Test", function () {
    this.timeout(30000);
    let driver;
    const randInt = Math.floor(10000 + Math.random() * 90000);
    const username = "selenium tester " + randInt;
    const email = `seleniumtester${randInt}@test.ca`;
    const password = "1234";

    before(async () => {
        driver = await testUtils.createBrowser();
    });

    after(async () => {
        await driver.quit();
    });

    it("Should load the signup page", async () => {
        await driver.get("http://localhost:3000/signup");

        const heading = await driver.wait(
            until.elementLocated(By.css("h3")),
            20000
        );

        const text = await heading.getText();
        expect(text).to.equal("Signup");
    });

    it("Should fill the signup form and attempt submit", async () => {
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
    });

    it("Should load the correct users page", async () => {
        await driver.wait(until.urlContains('/home'), 20000);
        const url = await driver.getCurrentUrl();
        expect(url).to.include('/home');

        const nameH3 = await driver.wait(until.elementLocated(By.xpath("//h3[1]")), 20000);
        const nameText = await nameH3.getText();
        expect(nameText).to.equal(`Welcome back ${username}`);

        const noCarsText = "You have no cars to display. Add one now!";
        const pTags = await driver.wait(until.elementsLocated(By.css("p")), 20000);
        let noCars = false;
        for (let i = 0; i < pTags.length; i++) {
            const txt = await pTags[i].getText();
            if (noCarsText === txt) {
                expect(noCarsText).to.equal(txt);
                noCars = true;
                break;
            }
        }
        if (!noCars) {
            const txt = await pTags[0].getText();
            expect(noCarsText).to.equal(txt);
        }
    });

    it("Should logout the user", async () => {
        await driver.wait(until.elementLocated(By.id("menuBtn")), 20000).click();
        await driver.sleep(500);
        const logoutForm = await driver.wait(until.elementLocated(By.css('form[action="/logout"]')), 20000);
        const logoutBtn = await logoutForm.findElement(By.css("button"));
        await logoutBtn.click();

        await driver.wait(until.urlContains('http://localhost:3000'), 20000);
        const url = await driver.getCurrentUrl();
        expect(url).to.contain('http://localhost:3000');

        const loginLink = await driver.wait(until.elementLocated(By.xpath("//a[contains(text(), 'Login')]")), 20000);
        const loginTxt = await loginLink.getText();
        expect(loginTxt).to.equal("Login");

        const signup = await driver.wait(until.elementLocated(By.xpath("//a[contains(text(), 'Sign Up')]")), 20000);
        const signupTxt = await signup.getText();
        expect(signupTxt).to.equal("Sign Up");
    });
});
