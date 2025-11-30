const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
require("chromedriver");

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

async function createBrowser() {
    const options = new chrome.Options();
    const headless = process.env.HEADLESS === "true";

    if (headless) {
        options.addArguments("--headless");
        options.addArguments("--disable-gpu");    // Recommended
    } 
    
    options.addArguments("--window-size=1920,1080");

    driver = await new Builder()
        .forBrowser("chrome")
        .setChromeOptions(options)
        .build();
    await driver.manage().window().maximize();

    return driver;
}

module.exports = { inputLoginInfo, createBrowser };