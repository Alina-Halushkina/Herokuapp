import { describe } from 'mocha';
import { Browser, Builder, By, Key, until, WebDriver } from 'selenium-webdriver';
import { expect } from 'chai';

describe('Testing herokuapp', async () => {
  let driver: WebDriver;

  beforeEach(async function () {
    driver = await new Builder().forBrowser(Browser.CHROME).build();
  });

  afterEach(async function () {
    await driver.quit();
  });

  it('Add/Remove Elements', async () => {
    const getDeleteButtons = async () => {
      return await driver.findElements(By.css("button[onclick='deleteElement()']"));
    };
    await driver.get('http://the-internet.herokuapp.com/add_remove_elements/');
    const addButton = await driver.findElement(By.css("button[onclick='addElement()']"));
    await addButton.click();

    let deleteButtons = await getDeleteButtons();
    expect(deleteButtons.length).to.equal(1);

    await addButton.click();
    deleteButtons = await getDeleteButtons();
    expect(deleteButtons.length).to.equal(2);

    await deleteButtons[1].click();
    deleteButtons = await getDeleteButtons();
    expect(deleteButtons.length).to.equal(1);
  });

  it('Checkboxes', async () => {
    await driver.get('http://the-internet.herokuapp.com/checkboxes');
    const checkboxes = await driver.findElements(By.css("input[type='checkbox']"));
    expect(await checkboxes[0].isSelected()).to.be.false;

    await checkboxes[0].click();
    expect(await checkboxes[0].isSelected()).to.be.true;

    expect(await checkboxes[1].isSelected()).to.be.true;

    await checkboxes[1].click();
    expect(await checkboxes[1].isSelected()).to.be.false;
  });

  it('Dropdown', async () => {
    await driver.get('http://the-internet.herokuapp.com/dropdown');
    const dropdown = await driver.findElement(By.id('dropdown'));
    const dropdownOptions = await dropdown.findElements(By.css('option'));
    expect(await dropdownOptions[0].getText()).to.equal('Please select an option');
    expect(await dropdownOptions[1].getText()).to.equal('Option 1');
    expect(await dropdownOptions[2].getText()).to.equal('Option 2');
    await dropdownOptions[1].click();
    expect(await dropdownOptions[1].isSelected()).to.be.true;
    await dropdownOptions[2].click();
    expect(await dropdownOptions[2].isSelected()).to.be.true;
  });

  it('Inputs', async () => {
    await driver.get('http://the-internet.herokuapp.com/inputs');
    const input = await driver.findElement(By.css("input[type='number']"));
    await driver.actions().click(input).keyDown(Key.ARROW_UP).perform();
    expect(await input.getAttribute('value')).to.equal('1');

    await driver.actions().click(input).keyDown(Key.ARROW_DOWN).perform();
    expect(await input.getAttribute('value')).to.equal('0');
  });

  it('Sortable Data Tables', async () => {
    await driver.get('http://the-internet.herokuapp.com/tables');
    expect(await driver.findElement(By.xpath("//*[@id='table1']/thead/tr/th[1]")).getText()).to.equal('Last Name');
    expect(await driver.findElement(By.xpath("//*[@id='table1']/tbody/tr/td[1]")).getText()).to.equal('Smith');
    expect(await driver.findElement(By.xpath("//*[@id='table1']/tbody/tr[2]/td[2]")).getText()).to.equal('Frank');
    expect(await driver.findElement(By.xpath("//*[@id='table1']/tbody/tr[4]/td[4]")).getText()).to.equal('$50.00');
  });

  it('Hovers', async () => {
    await driver.get('http://the-internet.herokuapp.com/hovers');
    let images = await driver.findElements(By.css('div.figure'));
    let actions;

    for (let i = 1; i <= images.length; i++) {
      images = await driver.findElements(By.css('div.figure'));
      actions = driver.actions();
      await actions.move({ origin: images[i - 1] }).perform();

      const expectedText = `name: user${i}`;
      const heading = await driver.findElement(By.xpath(`/html/body/div[2]/div/div/div[${i}]/div/h5`));
      expect(await heading.getText()).to.equal(expectedText);

      await actions.click(driver.findElement(By.xpath(`//a[@href='/users/${i}']`))).perform();
      expect(await driver.getCurrentUrl()).to.equal(`https://the-internet.herokuapp.com/users/${i}`);
      await driver.navigate().back();
    }
  });

  it('Context Menu', async () => {
    await driver.get('http://the-internet.herokuapp.com/context_menu');
    const contextMenu = await driver.findElement(By.id('hot-spot'));
    await driver.actions().contextClick(contextMenu).perform();
    await driver.switchTo().alert();
    expect(await driver.switchTo().alert().getText()).to.equal('You selected a context menu');
    await driver.switchTo().alert().accept();
  });

  it('Dynamic Controls part 1', async () => {
    await driver.get('http://the-internet.herokuapp.com/dynamic_controls');
    expect(await driver.findElement(By.css("input[type='checkbox']"))).to.exist;
    await driver.findElement(By.css("button[onclick='swapCheckbox()']")).click();
    const loading = await driver.findElement(By.id('loading'));
    await driver.wait(until.elementIsNotVisible(loading), 10000);
    const message = await driver.findElement(By.id('message'));
    expect(await message.getText()).to.equal("It's gone!");
    const checkboxes = await driver.findElements(By.css("input[type='checkbox']"));
    expect(checkboxes.length).to.equal(0);
  });

  it('Dynamic Controls part 2', async () => {
    await driver.get('http://the-internet.herokuapp.com/dynamic_controls');
    const input = await driver.findElement(By.css("input[type='text']"));
    expect(await input.isEnabled()).to.be.false;

    await driver.findElement(By.css("button[onclick='swapInput()']")).click();
    const loading = await driver.findElement(By.id('loading'));
    await driver.wait(until.elementIsNotVisible(loading), 10000);
    const message = await driver.findElement(By.id('message'));
    expect(await message.getText()).to.equal("It's enabled!");
    expect(await input.isEnabled()).to.be.true;
  });

  it('iFrame', async () => {
    await driver.get('http://the-internet.herokuapp.com/iframe');
    const iframe = await driver.findElement(By.id('mce_0_ifr'));
    await driver.wait(iframe.isDisplayed(), 10000);
    await driver.switchTo().frame(iframe);
    const text = await driver.findElement(By.css('body')).getText();
    expect(text).to.include('Your content goes here.');
    await driver.switchTo().defaultContent();
  });
});
