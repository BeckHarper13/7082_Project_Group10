const { expect } = require("chai");
const { Builder, By, until } = require("selenium-webdriver");
const testUtils = require("./test-utils");

describe("AI Agent E2E Tests", function () {
    this.timeout(30000);
    let driver;
    let carMakeModelText;

    before(async () => {
        driver = await testUtils.createBrowser();
        await testUtils.inputLoginInfo("newnav@gmail.com", "1234", driver);
    });

    after(async () => {
        await driver.quit();
    });

    it("Should load car page", async () => {
        const carLink = await driver.wait(until.elementLocated(By.xpath("//a[contains(@href, '/car?trimId=82678')]")), 10000);
        const carClickable = await carLink.findElement(By.xpath(".."));
        await carClickable.click();

        await driver.wait(until.urlContains('/car?trimId=82678'), 10000);
        const url = await driver.getCurrentUrl();
        expect(url).to.include('/car?trimId=82678');
    });

    it("Should open the AI modal", async () => {
        const allH1 = await driver.wait(until.elementsLocated(By.css("h1")), 10000);
        const carMakeModel = allH1[0];
        carMakeModelText = await carMakeModel.getText();
        const initialAiText = "I am a SpecCheck AI Agent.";

        const aiBtn = await driver.wait(until.elementLocated(By.id("askAiBtn")), 10000);
        await aiBtn.click();
        await driver.sleep(500);

        const initialAiBubble = await driver.wait(until.elementLocated(By.id("aiResText")), 10000);
        const initialAiBubbleText = await initialAiBubble.getText();

        expect(initialAiBubbleText).to.include(carMakeModelText);
        expect(initialAiBubbleText).to.include(initialAiText);
    });

    it("Should respond to the users question", async () => {
        const chatInput = await driver.wait(until.elementLocated(By.id("chatTextarea")), 10000);
        const myQuestion = "Make/model of this car";
        await chatInput.clear();
        await chatInput.sendKeys(myQuestion);
        await driver.wait(until.elementLocated(By.id("sendChatBtn")), 10000).click();

        await driver.sleep(500);

        let pTags = await driver.wait(until.elementsLocated(By.css("p")), 10000);

        //Checks if user question bubble pops up
        let foundUserQuestion = false;
        for (let i = 0; i < pTags.length; i++) {
            const txt = await pTags[i].getText();
            if (myQuestion === txt) {
                expect(myQuestion).to.equal(txt);
                foundUserQuestion = true;
                break;
            }
        }
        if (!foundUserQuestion) {
            const txt = await pTags[0].getText();
            expect(myQuestion).to.equal(txt);
        }

        const expectedPTagCount = pTags.length + 1;
        
        await driver.wait(async () => {
            pTags = await driver.wait(until.elementsLocated(By.css("p")), 10000);
            return pTags.length === expectedPTagCount;
        }, 15000, `# of p's: ${pTags.length}`);

        //Checks if AI responds
        let foundAiResponse = false;
        for (let i = 0; i < pTags.length; i++) {
            const txt = await pTags[i].getText();
            if (txt.includes(carMakeModelText)) {
                expect(txt).to.contain(carMakeModelText);
                foundAiResponse = true;
                break;
            }
        }
        if (!foundAiResponse) {
            const txt = await pTags[0].getText();
            expect(txt).to.contain(carMakeModelText);
        }
    });
});