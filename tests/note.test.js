const { expect } = require("chai");
const { Builder, By, until } = require("selenium-webdriver");
const testUtils = require("./test-utils");

describe("Edit Note E2E Tests", function () {
    this.timeout(30000);
    let driver;
    const note = "Hello World: " + Math.floor(100 + Math.random() * 900);;

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

    it("Should create a new note", async () => {
        await driver.executeScript("window.scrollTo(0, document.body.scrollHeight);");
        await driver.sleep(500);

        const notesAccordionToggle = await driver.wait(until.elementLocated(By.xpath("//button[contains(., 'Notes')]")), 10000);
        await notesAccordionToggle.click();
        await driver.sleep(500); // allow animation to finish

        const editNotesBtn = await driver.wait(until.elementLocated(By.xpath("//button[contains(., 'Edit Notes')]")), 10000);
        await editNotesBtn.click();
        await driver.sleep(500); // allow animation to finish

        const editNotesInput = await driver.wait(until.elementLocated(By.id("notesTextarea")), 10000);
        await editNotesInput.clear();
        await editNotesInput.sendKeys(note);
        await driver.wait(until.elementLocated(By.id("saveNoteBtn")), 10000).click();

        const noteDisplay = await driver.wait(until.elementLocated(By.id("notesDisplay")), 10000);

        // Wait until the text is not empty
        await driver.wait(async () => {
            const text = await noteDisplay.getText();
            return text === note;
        }, 10000);

        const noteDisplayText = await noteDisplay.getText();
        expect(noteDisplayText).to.include(note);
    });

    it("Should display the note on the home page", async () => {
        await driver.get("http://localhost:3000/home");

        const smallNote = await driver.wait(until.elementLocated(By.id("note")), 10000);
        const smallNoteText = await smallNote.getText();

        expect(smallNoteText).to.equal(note);
    });
});