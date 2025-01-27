﻿import {ConstantHelper, test} from '@umbraco/playwright-testhelpers';
import {expect} from '@playwright/test';

test.describe('Script tests', () => {
  const scriptName = 'TestScript.js';
  const scriptPath = '/' + scriptName;

  test.beforeEach(async ({umbracoUi, umbracoApi}) => {
    await umbracoUi.goToBackOffice();
    await umbracoUi.script.goToSection(ConstantHelper.sections.settings);
    await umbracoApi.script.ensureNameNotExists(scriptName);
  });

  test.afterEach(async ({umbracoApi}) => {
    await umbracoApi.script.ensureNameNotExists(scriptName);
  });

  test.skip('can create a empty script', async ({umbracoApi, umbracoUi}) => {
    // Act
    await umbracoUi.script.clickActionsMenuAtRoot();
    await umbracoUi.script.clickCreateButton();
    await umbracoUi.script.clickNewJavascriptFileButton();
    await umbracoUi.script.enterScriptName(scriptName);
    await umbracoUi.script.clickSaveButton();

    // Assert
    await umbracoUi.script.isSuccessNotificationVisible();
    expect(await umbracoApi.script.doesNameExist(scriptName)).toBeTruthy();
    await umbracoUi.script.clickRootFolderCaretButton();
    await umbracoUi.script.isScriptTreeItemVisible(scriptName);
  });

  test.skip('can create a script with content', async ({umbracoApi, umbracoUi}) => {
    // Arrange
    const scriptContent = 'TestContent';

    // Act
    await umbracoUi.script.clickActionsMenuAtRoot();
    await umbracoUi.script.clickCreateButton();
    await umbracoUi.script.clickNewJavascriptFileButton();
    await umbracoUi.script.enterScriptName(scriptName);
    await umbracoUi.script.enterScriptContent(scriptContent);
    await umbracoUi.script.clickSaveButton();

    // Assert
    await umbracoUi.script.isSuccessNotificationVisible();
    expect(await umbracoApi.script.doesNameExist(scriptName)).toBeTruthy();
    const scriptData = await umbracoApi.script.getByName(scriptName);
    expect(scriptData.content).toBe(scriptContent);
    await umbracoUi.script.clickRootFolderCaretButton();
    await umbracoUi.script.isScriptTreeItemVisible(scriptName);
  });

  test.skip('can update a script', async ({umbracoApi, umbracoUi}) => {
    // Arrange
    await umbracoApi.script.create(scriptName, 'test');
    const updatedScriptContent = 'const test = {\r\n    script = \u0022Test\u0022,\r\n    extension = \u0022.js\u0022,\r\n    scriptPath: function() {\r\n        return this.script \u002B this.extension;\r\n    }\r\n};\r\n';

    // Act
    await umbracoUi.script.openScriptAtRoot(scriptName);
    await umbracoUi.script.enterScriptContent(updatedScriptContent);
    await umbracoUi.script.clickSaveButton();

    // Assert
    await umbracoUi.script.isSuccessNotificationVisible();
    const updatedScript = await umbracoApi.script.get(scriptPath);
    expect(updatedScript.content).toBe(updatedScriptContent);
  });

  test.skip('can delete a script', async ({umbracoApi, umbracoUi}) => {
    // Arrange
    await umbracoApi.script.create(scriptName, '');

    // Act
    await umbracoUi.script.clickRootFolderCaretButton();
    await umbracoUi.script.clickActionsMenuForScript(scriptName);
    await umbracoUi.script.clickDeleteAndConfirmButton();

    // Assert
    await umbracoUi.script.isSuccessNotificationVisible();
    expect(await umbracoApi.script.doesNameExist(scriptName)).toBeFalsy();
    await umbracoUi.script.isScriptTreeItemVisible(scriptName, false);
  });

  test.skip('can rename a script', async ({umbracoApi, umbracoUi}) => {
    // Arrange
    const wrongScriptName = 'WrongTestScript.js';
    await umbracoApi.script.create(wrongScriptName, '');

    // Act
    await umbracoUi.script.clickRootFolderCaretButton();
    await umbracoUi.script.clickActionsMenuForScript(wrongScriptName);
    await umbracoUi.script.rename(scriptName);

    // Assert
    await umbracoUi.script.isSuccessNotificationVisible();
    expect(await umbracoApi.script.doesNameExist(scriptName)).toBeTruthy();
    expect(await umbracoApi.script.doesNameExist(wrongScriptName)).toBeFalsy();
  });
});
