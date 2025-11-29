const { Builder, By, until } = require("selenium-webdriver");

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

module.exports = { inputLoginInfo };