import {test as base} from '@playwright/test'
import { PageManager } from './page-objects/pageObjectManager'

export type TestOptions = {
    globalsQaURL: string,
    formsLayoutPage: string,
    pageManager: PageManager
}

export const test = base.extend<TestOptions>({
    globalsQaURL: ['', {option:true}],

    formsLayoutPage: async({page}, use) => {
        await page.goto('/');
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
        await use('')
    }, // here we say that it is automatically initialized

    pageManager: async({page, formsLayoutPage}, use) =>{
        const pm = new PageManager(page) 
        await use(pm)
    }
})

