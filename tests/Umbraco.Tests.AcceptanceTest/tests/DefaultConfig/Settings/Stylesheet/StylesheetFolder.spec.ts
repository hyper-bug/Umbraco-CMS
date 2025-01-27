﻿import {ConstantHelper, test} from '@umbraco/playwright-testhelpers';
import {expect} from '@playwright/test';

test.describe('Stylesheets tests', () => {
  const stylesheetName = 'TestStyleSheetFile.css';
  const stylesheetFolderName = 'TestStylesheetFolder';

  test.beforeEach(async ({umbracoUi, umbracoApi}) => {
    await umbracoUi.goToBackOffice();
    await umbracoUi.stylesheet.goToSection(ConstantHelper.sections.settings);
    await umbracoApi.stylesheet.ensureNameNotExists(stylesheetFolderName);
  });

  test.afterEach(async ({umbracoApi}) => {
    await umbracoApi.stylesheet.ensureNameNotExists(stylesheetFolderName);
  });

  test.skip('can create a folder', async ({umbracoApi, umbracoUi}) => {
    // Act
    await umbracoUi.stylesheet.clickActionsMenuAtRoot();
    await umbracoUi.stylesheet.createFolder(stylesheetFolderName);

    // Assert
    await umbracoUi.stylesheet.isSuccessNotificationVisible();
    expect(await umbracoApi.stylesheet.doesFolderExist(stylesheetFolderName)).toBeTruthy();
    await umbracoUi.stylesheet.clickRootFolderCaretButton();
    await umbracoUi.stylesheet.isStylesheetTreeItemVisibile(stylesheetFolderName);
  });

  test.skip('can delete a folder', async ({umbracoApi, umbracoUi}) => {
    // Arrange
    await umbracoApi.stylesheet.createFolder(stylesheetFolderName, '');

    // Act
    await umbracoUi.stylesheet.clickRootFolderCaretButton();
    await umbracoUi.stylesheet.clickActionsMenuForStylesheet(stylesheetFolderName);
    await umbracoUi.stylesheet.deleteFolder();

    // Assert
    await umbracoUi.stylesheet.isSuccessNotificationVisible();
    expect(await umbracoApi.stylesheet.doesFolderExist(stylesheetFolderName)).toBeFalsy();
    await umbracoUi.stylesheet.isStylesheetTreeItemVisibile(stylesheetFolderName, false);
  });

  test.skip('can create a folder in a folder', async ({umbracoApi, umbracoUi}) => {
    // Arrange
    await umbracoApi.stylesheet.createFolder(stylesheetFolderName);
    const childFolderName = 'ChildFolderName';

    // Act
    await umbracoUi.stylesheet.clickRootFolderCaretButton();
    await umbracoUi.stylesheet.clickActionsMenuForStylesheet(stylesheetFolderName);
    await umbracoUi.stylesheet.createFolder(childFolderName);

    //Assert
    await umbracoUi.stylesheet.isSuccessNotificationVisible();
    expect(await umbracoApi.stylesheet.doesNameExist(childFolderName)).toBeTruthy();
    const styleChildren = await umbracoApi.stylesheet.getChildren('/' + stylesheetFolderName);
    expect(styleChildren[0].path).toBe('/' + stylesheetFolderName + '/' + childFolderName);
    await umbracoUi.stylesheet.clickCaretButtonForName(stylesheetFolderName);
    await umbracoUi.stylesheet.isStylesheetTreeItemVisibile(childFolderName);
  });

  test.skip('can create a folder in a folder in a folder', async ({umbracoApi, umbracoUi}) => {
    // Arrange
    const childFolderName = 'ChildFolderName';
    const childOfChildFolderName = 'ChildOfChildFolderName';
    await umbracoApi.stylesheet.createFolder(stylesheetFolderName);
    await umbracoApi.stylesheet.createFolder(childFolderName, stylesheetFolderName);

    // Act
    await umbracoUi.stylesheet.clickRootFolderCaretButton();
    await umbracoUi.stylesheet.clickCaretButtonForName(stylesheetFolderName);
    await umbracoUi.stylesheet.clickActionsMenuForStylesheet(childFolderName);
    await umbracoUi.stylesheet.createFolder(childOfChildFolderName);

    //Assert
    await umbracoUi.stylesheet.isSuccessNotificationVisible();
    expect(await umbracoApi.stylesheet.doesNameExist(childOfChildFolderName)).toBeTruthy();
    const styleChildren = await umbracoApi.stylesheet.getChildren('/' + stylesheetFolderName + '/' + childFolderName);
    expect(styleChildren[0].path).toBe('/' + stylesheetFolderName + '/' + childFolderName + '/' + childOfChildFolderName);
    await umbracoUi.stylesheet.clickCaretButtonForName(childFolderName);
    await umbracoUi.stylesheet.isStylesheetTreeItemVisibile(childOfChildFolderName);
  });

  test.skip('can create a stylesheet in a folder', async ({umbracoApi, umbracoUi}) => {
    // Arrange
    await umbracoApi.stylesheet.createFolder(stylesheetFolderName);
    const stylesheetContent = 'TestContent';

    //Act
    await umbracoUi.stylesheet.clickRootFolderCaretButton();
    await umbracoUi.stylesheet.clickActionsMenuForStylesheet(stylesheetFolderName);
    await umbracoUi.stylesheet.clickCreateButton();
    await umbracoUi.stylesheet.clickNewStylesheetButton();
    await umbracoUi.stylesheet.enterStylesheetName(stylesheetName);
    await umbracoUi.stylesheet.enterStylesheetContent(stylesheetContent);
    await umbracoUi.stylesheet.clickSaveButton();

    // Assert
    await umbracoUi.stylesheet.isSuccessNotificationVisible();
    expect(await umbracoApi.stylesheet.doesNameExist(stylesheetName)).toBeTruthy();
    const stylesheetChildren = await umbracoApi.stylesheet.getChildren('/' + stylesheetFolderName);
    expect(stylesheetChildren[0].path).toBe('/' + stylesheetFolderName + '/' + stylesheetName);
    const stylesheetData = await umbracoApi.stylesheet.get(stylesheetChildren[0].path);
    expect(stylesheetData.content).toBe(stylesheetContent);
    await umbracoUi.stylesheet.clickCaretButtonForName(stylesheetFolderName);
    await umbracoUi.stylesheet.isStylesheetTreeItemVisibile(stylesheetName);
  });

  test.skip('can create a stylesheet in a folder in a folder', async ({umbracoApi, umbracoUi}) => {
    // Arrange
    const childFolderName = 'ChildFolderName';
    await umbracoApi.stylesheet.createFolder(stylesheetFolderName);
    await umbracoApi.stylesheet.createFolder(childFolderName, stylesheetFolderName);
    const stylesheetContent = 'TestContent';

    //Act
    await umbracoUi.stylesheet.clickRootFolderCaretButton();
    await umbracoUi.stylesheet.clickCaretButtonForName(stylesheetFolderName);
    await umbracoUi.stylesheet.clickActionsMenuForStylesheet(childFolderName);
    await umbracoUi.stylesheet.clickCreateButton();
    await umbracoUi.stylesheet.clickNewStylesheetButton();
    await umbracoUi.stylesheet.enterStylesheetName(stylesheetName);
    await umbracoUi.stylesheet.enterStylesheetContent(stylesheetContent);
    await umbracoUi.stylesheet.clickSaveButton();

    // Assert
    await umbracoUi.stylesheet.isSuccessNotificationVisible();
    expect(await umbracoApi.stylesheet.doesNameExist(stylesheetName)).toBeTruthy();
    const stylesheetChildren = await umbracoApi.stylesheet.getChildren('/' + stylesheetFolderName + '/' + childFolderName);
    expect(stylesheetChildren[0].path).toBe('/' + stylesheetFolderName + '/' + childFolderName + '/' + stylesheetName);
    const stylesheetData = await umbracoApi.stylesheet.get(stylesheetChildren[0].path);
    expect(stylesheetData.content).toBe(stylesheetContent);
    await umbracoUi.stylesheet.clickCaretButtonForName(childFolderName);
    await umbracoUi.stylesheet.isStylesheetTreeItemVisibile(stylesheetName);
  });
});
