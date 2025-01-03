import test, { expect } from "@playwright/test";
import { PageManager } from "../page-objects/pageObjectManager";
import {faker} from '@faker-js/faker'

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test('Navigate to form page', async({page})=>{
  const pageManager = new PageManager(page)
  await pageManager.navigateTo().formLayoutsPage()
  await pageManager.navigateTo().datepickerPage()
  await pageManager.navigateTo().datepickerPage()
  await pageManager.navigateTo().toastrPage()
  await pageManager.navigateTo().tooltipPage()
})

test('paremeterized objects', async({page})=>{
  const pageManager = new PageManager(page)
  const randomFullName = faker.person.fullName()
  const randomEmail = `${randomFullName.replace(' ','')}${faker.number.int(1000)}@test.com`

  await pageManager.navigateTo().formLayoutsPage()
  await pageManager.onFormLayoutsPage().submitUsingTheGridFormWithCredentialsAndSelectOption(process.env.USERNAME, process.env.PASSWORD, 'Option 2')
  await page.screenshot({path: 'screenshots/formsLayoutsPage1.png'})
  await pageManager.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, false)
  await page.locator('nb-card', {hasText: "Inline form"}).screenshot({path: 'screenshots/formsLayoutsPage2.png'})
  // save screenshot as binary
  const buffer =  await page.screenshot()
  console.log(buffer.toString('base64'))
})

test('date picker object', async({page})=>{
  const pageManager = new PageManager(page)
  await pageManager.navigateTo().datepickerPage()
  await pageManager.onDatePickerPage().fillCommonDatePickerDateFromToday(10)
  await pageManager.onDatePickerPage().selectDatePickerWithRangeFromToday(8, 17)
})

test.only('Testing with Argos CI', async({page})=>{
  const pageManager = new PageManager(page)
  await pageManager.navigateTo().formLayoutsPage()
  await pageManager.navigateTo().datepickerPage()
})