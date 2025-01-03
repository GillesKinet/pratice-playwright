import {expect} from "@playwright/test"
import {test} from '../test-options'

test('drag and drop with iframes', async({page, globalsQaURL})=>{
    await page.goto(globalsQaURL)
    
    await page.locator('[class="fc-button-label"]', {hasText: 'Consent'}).click()
    // get the frame with framelocator
    const frame = page.frameLocator('[rel-title="Photo Manager"] iframe')
    await frame.locator('li', {hasText: "High Tatras 2"}).dragTo(frame.locator('#trash'))

    // more precise control
    await frame.locator('li', {hasText: "High Tatras 4"}).hover()
    await page.mouse.down()
    await frame.locator('#trash').hover()
    await page.mouse.up()

    // assert both elements in drop location
    await expect(frame.locator('#trash li h5')).toHaveText(["High Tatras 2", "High Tatras 4"])
})