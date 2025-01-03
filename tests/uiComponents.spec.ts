import test, { expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test.describe("Form Layouts page", () => {
  test.beforeEach(async ({ page }) => {
    await page.getByText("Forms").click();
    await page.getByText("Form layouts").click();
  });

  test("input fields", async ({ page }) => {
    const usingTheGridEmailInput = page
      .locator("nb-card", { hasText: "Using the Grid" })
      .getByRole("textbox", { name: "Email" });
    await usingTheGridEmailInput.fill("test@test.com");
    await usingTheGridEmailInput.clear();
    await usingTheGridEmailInput.pressSequentially("test2@test.com", {
      delay: 100,
    }); // if you want mimic keyboard input

    // generic assertion
    const inputValue = await usingTheGridEmailInput.inputValue();
    expect(inputValue).toEqual("test2@test.com");

    // locator assertion
    await expect(usingTheGridEmailInput).toHaveValue("test2@test.com");
  });

  test.only("radio buttons", async ({ page }) => {
    const usingTheGridForm = page.locator("nb-card", {
      hasText: "Using the Grid",
    });
    // force: true disables the various checks that are being done e.g. is visible
    // await usingTheGridForm.getByLabel('Option 1').check({force:true});
    await usingTheGridForm.getByRole("radio", { name: "Option 2 " }).click({ force: true });
    await expect(usingTheGridForm).toHaveScreenshot({maxDiffPixels:250})
    // await usingTheGridForm.getByRole("radio", { name: "Option 2" }).click({ force: true });

    // // check if true or false is set on radio button
    // const radioStatus = await usingTheGridForm.getByRole("radio", { name: "Option 2" }).isChecked();
    //   expect(radioStatus).toBeTruthy();

    // // check if true or false is set on radio button - different method
    // await expect(usingTheGridForm.getByRole("radio", { name: "Option 2" })).toBeChecked();

    // // different ways to check
    // expect(await usingTheGridForm.getByRole("radio", { name: "Option 1" }).isChecked()).toBeFalsy();
    // expect(await usingTheGridForm.getByRole("radio", { name: "Option 2" }).isChecked()).toBeTruthy();
  });

  test("checkboxes", async ({ page }) => {
    await page.getByText("Modal & Overlays").click();
    await page.getByText("Toastr").click();

    // select by checkbox - force = true since checkbox is hidden
    await page
      .getByRole("checkbox", { name: "Hide on click" })
      .uncheck({ force: true });
    await page
      .getByRole("checkbox", { name: "Prevent arising of duplicate toast" })
      .uncheck({ force: true });
    // check method will only check the checkbox if the it is not set as checked as set yet

    // to uncheck
    // await page.getByRole('checkbox', {name: "Hide on click"}).check({force:true});

    // looping example to set all checkboxes
    const allBoxes = await page.getByRole("checkbox");

    // .all() will create an array of all the checkbox elements
    for (const box of await allBoxes.all()) {
      await box.check({ force: true });
      expect(await box.isChecked()).toBeTruthy();
    }
  });
});

test("lists", async ({ page }) => {
  const dropdownMenu = page.locator("ngx-header nb-select");
  await dropdownMenu.click();

  page.getByRole("list"); // when list has UL test
  page.getByRole("listitem"); // when list has LI tag

  // const optionListItems = page.getByRole('list').locator('nb-option') not preferred approach
  const optionList = page.locator("nb-option-list nb-option");
  await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"]);
  // select specific value
  await optionList.filter({ hasText: "Cosmic" }).click();
  // asertion background color
  const pageHeader = page.locator("nb-layout-header");
  await expect(pageHeader).toHaveCSS("background-color", "rgb(50, 50, 89)");

  const colors = {
    Light: "rgb(255, 255, 255)",
    Dark: "rgb(34, 43, 69)",
    Cosmic: "rgb(50, 50, 89)",
    Corporate: "rgb(255, 255, 255)",
  };

  await dropdownMenu.click();
  for (const color in colors) {
    await optionList.filter({ hasText: color }).click();
    // asertion background color
    await expect(pageHeader).toHaveCSS("background-color", colors[color]);
    if (color != "Corporate") {
      await dropdownMenu.click();
    }
  }
});

test("tooltips", async ({ page }) => {
  // tip to identify tooltip Inspect -> go to sources -> Press Command + \ to freeze the screen
  await page.getByText("Modal & Overlays").click();
  await page.getByText("Tooltip").click();

  const toolTipCard = page.locator("nb-card", {
    hasText: "Tooltip Placements",
  });
  await toolTipCard.getByRole("button", { name: "Top" }).hover();

  const tooltip = await page.locator("nb-tooltip").textContent();
  expect(tooltip).toEqual("This is a tooltip");
});

test("dialog boxes", async ({ page }) => {
  await page.getByText("Tables & Data").click();
  await page.getByText("Smart Table").click();

  // accept the system dialog box
  page.on("dialog", (dialog) => {
    expect(dialog.message()).toEqual("Are you sure you want to delete?");
    dialog.accept();
  });
  await page
    .getByRole("table")
    .locator("tr", { hasText: "mdo@gmail.com" })
    .locator(".nb-trash")
    .click();
  await expect(page.locator("table tr ").first()).not.toHaveText(
    "mdo@gmail.com"
  );
});

test("web tables part 1", async ({ page }) => {
  await page.getByText("Tables & Data").click();
  await page.getByText("Smart Table").click();

  // get the row based on text
  const targetRow = page.getByRole("row", { name: "twitter@outlook.com" });
  await targetRow.locator(".nb-edit").click();

  // the row has changed properties so we need to use a new locator to identify it
  await page.locator("input-editor").getByPlaceholder("Age").clear();
  await page.locator("input-editor").getByPlaceholder("Age").fill("35");
  await page.locator(".nb-checkmark").click();

  // get the row specific to a value in a column
  await page.locator("ng2-smart-table-pager").getByText("2").click();
  const targetRowById = page
    .getByRole("row", { name: "11" })
    .filter({ has: page.locator("td").nth(1).getByText("11") });
  await targetRowById.locator(".nb-edit").click();
  await page.locator("input-editor").getByPlaceholder("E-mail").clear();
  await page
    .locator("input-editor")
    .getByPlaceholder("E-mail")
    .fill("test@test.com");
  await page.locator(".nb-checkmark").click();
  await expect(targetRowById.locator("td").nth(5)).toHaveText("test@test.com");

  // filter the table
  const ages = ["20", "30", "40", "200"];

  for (let age of ages) {
    await page.locator("input-filter").getByPlaceholder("Age").clear();
    await page.locator("input-filter").getByPlaceholder("Age").fill(age);
    await page.waitForTimeout(500)

    const rows = page.locator("tbody tr");
    for (let row of await rows.all()) {
      const cellValue = await row.locator("td").last().textContent();
     
        if(age == "200"){
            expect(await page.getByRole('table').textContent()).toContain('No data found')
        }
        else{expect(cellValue).toEqual(age)}
      
    }
  }
});

test('date picker', async({page})=>{
    await page.getByText('Forms').click()
    await page.getByText('Datepicker').click()

    const calendarInputField = page.getByPlaceholder('Form Picker')
    await calendarInputField.click()

    let date = new Date()
    date.setDate(date.getDate() + 25)
    const dateToPick = date.getDate().toString()
    const expectedMonth = date.getMonth()
    const expectedMonthShort = date.toLocaleString('En-US', {month: 'short'})
    const expectedMonthlong = date.toLocaleString('En-US', {month: 'long'})
    const expectedDay = date.getDate()
    const expectedYear = date.getFullYear()

    let calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    const expectedMonthAndYear = `${expectedMonthlong} ${expectedYear}`
    while(!calendarMonthAndYear.includes(expectedMonthAndYear)){
        await page.locator('[class="next-month appearance-ghost size-medium shape-rectangle icon-start icon-end status-basic nb-transition"]').click()
        calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    }
    await page.locator('[class="day-cell ng-star-inserted"]').getByText(dateToPick, {exact:true}).click()
    await expect(calendarInputField).toHaveValue(`${expectedMonthShort} ${expectedDay}, ${expectedYear}`)
})

test('sliders', async({page})=>{
    // update slider attribute - shortcut
    const tempDragger = page.locator('[tabTitle="Temperature"] ngx-temperature-dragger circle')
    await tempDragger.evaluate(node=>{
        node.setAttribute('cx', '232.630')
        node.setAttribute('cy', '232.630')
    })
    await tempDragger.click()

    // simulate actual mouse movement
    // first define area where we want to move the mouse
    const tempBox = page.locator('[tabTitle="Temperature"] ngx-temperature-dragger')
    await tempBox.scrollIntoViewIfNeeded()

    const box = await tempBox.boundingBox()
    // we create starting coordinates at the center of the box
    const x = box.x + box.width/2
    const y = box.y + box.height/2
    await page.mouse.move(x, y)
    await page.mouse.down() // down click
    await page.mouse.move(x + 100, y)
    await page.mouse.move(x+100, y+100)
    await page.mouse.up() // remove mouse
    await expect(tempBox).toContainText('30')
})
