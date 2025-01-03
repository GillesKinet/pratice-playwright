import {Page, expect} from "@playwright/test"
import { HelperBase } from "./helperBase"

export class DatePickerPage extends HelperBase{

    constructor(page: Page){
        super(page)
    }

    async fillCommonDatePickerDateFromToday(numberOfDaysFromToday: number){
        const calendarInputField = this.page.getByPlaceholder('Form Picker')
        await calendarInputField.click()
        const dateToAssert =  await this.selectDateInTheCalendar(numberOfDaysFromToday)
        await expect(calendarInputField).toHaveValue(dateToAssert)
    }

    async selectDatePickerWithRangeFromToday(startDateFromToday: number, endDateFromToday: number){
        const calendarInputField = this.page.getByPlaceholder('Range Picker')
        await calendarInputField.click()
        const dateToAssertStart = await this.selectDateInTheCalendar(startDateFromToday)
        const dateToAssertEnd = await this.selectDateInTheCalendar(endDateFromToday)
        const dateToAssert = `${dateToAssertStart} - ${dateToAssertEnd}`
        await expect(calendarInputField).toHaveValue(dateToAssert)
    }

    private async selectDateInTheCalendar(numberOfDaysFromToday: number){
        let date = new Date()
        date.setDate(date.getDate() + numberOfDaysFromToday)
        const dateToPick = date.getDate().toString()
        const expectedMonthShort = date.toLocaleString('En-US', {month: 'short'})
        const expectedMonthlong = date.toLocaleString('En-US', {month: 'long'})
        const expectedDay = date.getDate()
        const expectedYear = date.getFullYear()
        const dateToAssert = `${expectedMonthShort} ${expectedDay}, ${expectedYear}`
    
        let calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent()
        const expectedMonthAndYear = `${expectedMonthlong} ${expectedYear}`
        while(!calendarMonthAndYear.includes(expectedMonthAndYear)){
            await this.page.locator('[class="next-month appearance-ghost size-medium shape-rectangle icon-start icon-end status-basic nb-transition"]').click()
            calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent()
        }
        await await this.page.locator('.day-cell.ng-star-inserted:not(.bounding-month)').getByText(dateToPick, { exact: true }).click();
        return dateToAssert             
    }
}