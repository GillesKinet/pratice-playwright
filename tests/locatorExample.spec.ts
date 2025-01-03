import {expect, test} from "@playwright/test";
import { loginPageLocators } from "../src/locators/loginPageLocators";

test.beforeEach(async({page})=>{
    await page.goto('/');
    await page.getByText('Forms').click();
    await page.getByText('Form layouts').click();
})

test('Locator syntax rules', async ({page}) => {
    // by tagName
    await page.locator('input')

    // by id
    await page.locator('#iputEmail')

    // by class
    await page.locator('.shape-rectangle')

    // by attribute
    await page.locator('[placeholder="Email"]')

    // by entire class vlaue
    await page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]')

    //combine different selectors
    await page.locator('input[placeholder="Email"][nbinput]')

    // by referencing to locator file
    await page.locator(loginPageLocators.email)

    // by xpath (NOT RECOMMENDED)
    await page.locator('//*[@id="inputEmail1"]')

    // by partial match text
    await page.locator(':text("Using")')

    // by exact text match
    await page.locator(':text-is("Using the Grid")')
})

test('User facing locators', async({page})=>{
    // by role
    await page.getByRole('textbox', {name: "Email"}).first().click();
    await page.getByRole('button',{name:"Sign in"}).first().click();

    // by label
    await page.getByLabel('Email').first().click();

    // by placeholder
    await page.getByPlaceholder('Jane Doe').first().click();

    // by text
    await page.getByText('Using the Grid').first().click();

    // by testid
    await page.getByTestId('SignIn').click()

    // by title
    await page.getByTitle('IoT Dashboard').first().click();
})

test('Find child element', async({page})=>{
    await page.locator('nb-card nb-radio :text-is("Option 1")').click()
    await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click()

    await page.locator('nb-card').getByRole('button', {name:"Sign in"}).first().click();

    // using index  -- SHOULD BE AVOIDED
    await page.locator('nb-card').nth(3).getByRole('button').click();
})

test('locating parent elementes', async({page})=>{
    await page.locator('nb-card', {hasText:"Using the Grid"}).getByRole('textbox', {name: "Email"}).first().click()
    await page.locator('nb-card', {has: page.locator('#inputEmail1')}).getByRole('textbox', {name: "Email"}).click()

    await page.locator('nb-card').filter({hasText: "Basic form"}).getByRole('textbox', {name: "Email"}).first().click()
    await page.locator('nb-card').filter({has: page.locator('.status-danger')}).getByRole('textbox', {name: "Password"}).first().click()

    await page.locator('nb-card').filter({has: page.locator('nb-checkbox')}).filter({hasText: "Sign in"}).getByRole('textbox', {name: "Email"}).first().click()

    // only use in Playwright for finding parents
    await page.locator(':text-is("Using the Grid")').locator('..').getByRole('textbox', {name: "Email"}).first().click()
})

test('Reusing locators', async({page}) =>{
    const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
    const emailField = basicForm.getByRole('textbox', {name: "Email"})

    await emailField.fill('test@test.com')
    await basicForm.getByRole('textbox', {name: "Password"}).fill('Welcome123')
    await basicForm.locator('nb-checkbox')
    await basicForm.getByRole('button').click()

    await expect(emailField).toHaveValue('test@test.com')
})

test('Extracting values', async({page}) =>{
    // single value
    const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
    const buttonText = await basicForm.locator('button').textContent()
    console.log(buttonText);
    expect(buttonText).toEqual('Submit')

    // all text values
    const allRadioButtonsLabels = await page.locator('nb-radio').allTextContents()
    expect(allRadioButtonsLabels).toContain("Option 1")

    // input value
    const emailField = await basicForm.getByRole('textbox', {name: "Email"})
    await emailField.fill('test@test.com')
    const emailValue = await emailField.inputValue()
    expect(emailValue).toEqual('test@test.com')

    // get attribute value
    const placeholderValue = await emailField.getAttribute('placeholder')
    await expect(placeholderValue).toEqual('Email')
})

test('assertions', async({page}) =>{
    const basicFormButton = page.locator('nb-card').filter({hasText: "Basic form"}).locator('button')
    // general assertions
    const value = 5
    expect(value).toEqual(5)

    const text = await basicFormButton.textContent();
    expect(text).toEqual("Submit")
    
    // locator assertion - will wait 5 seconds for element
    await expect(basicFormButton).toHaveText("Submit") 

    // soft assertion - test continues even if assertion fails
    await expect.soft(basicFormButton).toHaveText("Submit")
    await basicFormButton.click();
})
