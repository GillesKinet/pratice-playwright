import {Page} from "@playwright/test"
import { HelperBase } from "./helperBase";

export class NavigationPage extends HelperBase {

    constructor (page: Page){
        super(page)
    }

    async formLayoutsPage(){
        await this.selectGroupMenuItem('Forms')
        await this.page.getByText("Form layouts").click();
        await this.waitForNumberOfSeconds(1)
    }
    async datepickerPage(){
        await this.selectGroupMenuItem('Forms')
        await this.page.waitForTimeout(1000)
        // the following locator needs to be improved:
        await this.page.getByText('Datepicker').nth(0).click()
    }
    async smartTablePage(){
        await this.selectGroupMenuItem('Tables & Data')
        await this.page.getByText('Smart Table').click();
    }
    async toastrPage(){
        await this.selectGroupMenuItem('Modal & Overlays')
        await this.page.getByText('Toastr').click();
    }
    async tooltipPage(){
        await this.selectGroupMenuItem('Modal & Overlays')
        await this.page.getByText('Tooltip').click();
    }
    private async selectGroupMenuItem(groupItemTitle: string){
        const groupMenuItem = this.page.getByTitle(groupItemTitle)
        const expandedState = await groupMenuItem.getAttribute('aria-expanded')
        if (expandedState == 'false'){
            await groupMenuItem.click()
        }
    }
}