import test, { expect } from "@playwright/test"

test.beforeEach(async({page})=>{
    await page.goto(process.env.URL);
    await page.getByText('Button Triggering AJAX Request').click()
})

test('Auto waiting', async({page})=>{
    const succesButton = page.locator('.bg-success')
    // await succesButton.click()

    // const text = await succesButton.textContent()
    // await succesButton.waitFor({state: "attached"})
    // const text = await succesButton.allTextContents()

    // expect(text).toContain('Data loaded with AJAX get request.')
    await expect(succesButton).toHaveText('Data loaded with AJAX get request.', {timeout:20000})
})

test.skip('alternative waits', async({page})=>{
    const succesButton = page.locator('.bg-success')

    // wait for element
    await page.waitForSelector('.bg-success')
    
    // __ wait for particular response
    await page.waitForResponse('http://uitestingplayground.com/ajaxdata')

    // __wait for network calls to be completed ('NOT RECOMMENDED')
    await page.waitForLoadState('networkidle')

    // wait for 
    await page.waitForTimeout(5000) // a pause

    const text = await succesButton.allTextContents()
    await expect(succesButton).toHaveText('Data loaded with AJAX get request.')
})

test.skip('timeouts', async({page}) =>{
    const succesButton = page.locator('.bg-success')
    await succesButton.click()

})