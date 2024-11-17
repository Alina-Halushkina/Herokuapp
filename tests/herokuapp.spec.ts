import { describe } from 'mocha';
import { Actions, Browser, Builder, By, Key, WebDriver } from 'selenium-webdriver';
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

    let actions = driver.actions();
    await actions.move({ origin: images[0] }).perform();
    expect(await driver.findElement(By.xpath('/html/body/div[2]/div/div/div[1]/div/h5')).getText()).to.equal(
      'name: user1',
    );
    await actions.click(driver.findElement(By.xpath("//a[@href='/users/1']"))).perform();
    expect(await driver.getCurrentUrl()).to.equal('https://the-internet.herokuapp.com/users/1');
    await driver.navigate().back();

    images = await driver.findElements(By.css('div.figure'));
    actions = driver.actions();
    await actions.move({ origin: images[1] }).perform();
    console.log(await driver.getCurrentUrl());
    expect(await driver.findElement(By.xpath('/html/body/div[2]/div/div/div[2]/div/h5')).getText()).to.equal(
      'name: user2',
    );
    await actions.click(driver.findElement(By.xpath("//a[@href='/users/2']"))).perform();
    expect(await driver.getCurrentUrl()).to.equal('https://the-internet.herokuapp.com/users/2');
    await driver.navigate().back();

    images = await driver.findElements(By.css('div.figure'));
    actions = driver.actions();
    await actions.move({ origin: images[2] }).perform();
    expect(await driver.findElement(By.xpath('/html/body/div[2]/div/div/div[3]/div/h5')).getText()).to.equal(
      'name: user3',
    );
    await actions.click(driver.findElement(By.xpath("//a[@href='/users/3']"))).perform();
    expect(await driver.getCurrentUrl()).to.equal('https://the-internet.herokuapp.com/users/3');
  });
});
