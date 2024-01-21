import { test, expect, chromium } from '@playwright/test';
import path from 'path';

function testForImageTracker (images, expectedResult) {
  return async () => {
    const browser = await chromium.launch({
      headless: false
    });
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://windbow27.github.io/Kornblume/tracker');
  
    // close tutorial
    await page.locator('#tutorial').getByRole('button', { name: '✕' }).click();
  
    // set-up filters
    await page.getByRole('button', { name: '' }).nth(0).click();
    await page.getByRole('button', { name: '' }).nth(1).click();
    await page.getByRole('button', { name: '' }).nth(2).click();
    await page.getByRole('button', { name: '' }).nth(3).click();
  
    // click upload button
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByRole('button', { name: 'Import Images' }).click();
  
    // upload image
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(images.map((img) => path.join(__dirname, `/images/${img}`)));

    // loading
    const processing = await page.getByText('Processing file')
    await expect(processing).toBeHidden({ timeout: 300 * 1000 });
  
    // result
    for (const result of expectedResult) {
      await expect(
        page.getByRole('row').filter({ has: page.getByText(result.pull, { exact: true })})
      ).toContainText(result.name);
    }
  
    // ---------------------
    await context.close();
    await browser.close();
  }
}

test('Should correctly read iPhone screenshots',
  testForImageTracker(
    ['test1/01.png'], 
    [
      { pull: '1', name: 'Horropedia'},
      { pull: '2', name: 'Erick'},
      { pull: '3', name: 'Jessica'},
      { pull: '4', name: 'Nick Bottom'},
      { pull: '5', name: 'Horropedia'},
      { pull: '6', name: 'The Fool'},
      { pull: '7', name: 'ONiON'},
      { pull: '8', name: 'Mesmer Jr.'},
      { pull: '9', name: 'The Fool'},
      { pull: '10', name: 'Door'},
    ]
  )
);

test('Should correctly read Windows screenshots',
  testForImageTracker(
    ['test2/01.png'], 
    [
      { pull: '1', name: 'John Titor'},
      { pull: '2', name: 'La Source'},
      { pull: '3', name: 'Sputnik'},
      { pull: '4', name: 'Tooth Fairy'},
      { pull: '5', name: 'Mesmer Jr.'},
      { pull: '6', name: 'Necrologist'},
      { pull: '7', name: 'Satsuki'},
      { pull: '8', name: 'Leilani'},
      { pull: '9', name: 'Nick Bottom'},
      { pull: '10', name: 'Oliver Fog'},
    ]
  )
);

test('Should correctly read multiple images uploaded at once',
  testForImageTracker(
    ['test3/01.png', 'test3/02.png'], 
    [
      { pull: '1', name: 'Erick'},
      { pull: '2', name: 'La Source'},
      { pull: '3', name: 'Satsuki'},
      { pull: '4', name: 'Sputnik'},
      { pull: '5', name: 'aliEn T'},
      { pull: '6', name: 'Cristallo'},
      { pull: '7', name: 'Twins Sleep'},
      { pull: '8', name: 'Sputnik'},
      { pull: '9', name: 'John Titor'},
      { pull: '10', name: 'Darley Clatter'},
      { pull: '11', name: 'ONiON'},
      { pull: '12', name: 'Ms. Radio'},
      { pull: '13', name: 'Ms. Moissan'},
      { pull: '14', name: 'Erick'},
      { pull: '15', name: 'Bunny Bunny'},
      { pull: '16', name: 'aliEn T'},
      { pull: '17', name: 'Bunny Bunny'},
      { pull: '19', name: 'Pavia'},
      { pull: '20', name: 'Tooth Fairy'},
    ]
  )
);

test('Should correctly read images that screenshoted and uploaded at different moments',
  testForImageTracker(
    ['test4/00.png', 'test3/01.png', 'test3/02.png'], 
    [
      { pull: '1', name: 'Erick'},
      { pull: '2', name: 'La Source'},
      { pull: '3', name: 'Satsuki'},
      { pull: '4', name: 'Sputnik'},
      { pull: '5', name: 'aliEn T'},
      { pull: '6', name: 'Cristallo'},
      { pull: '7', name: 'Twins Sleep'},
      { pull: '8', name: 'Sputnik'},
      { pull: '9', name: 'John Titor'},
      { pull: '10', name: 'Darley Clatter'},
      { pull: '11', name: 'ONiON'},
      { pull: '12', name: 'Ms. Radio'},
      { pull: '13', name: 'Ms. Moissan'},
      { pull: '14', name: 'Erick'},
      { pull: '15', name: 'Bunny Bunny'},
      { pull: '16', name: 'aliEn T'},
      { pull: '17', name: 'Bunny Bunny'},
      { pull: '19', name: 'Pavia'},
      { pull: '20', name: 'Tooth Fairy'},
      { pull: '21', name: 'Oliver Fog'},
    ]
  ));

  test('Should correctly read triple Poltergeist', testForImageTracker(
    ['test5/01.png'],
    [
      { pull: '1', name: 'APPLe'},
      { pull: '2', name: 'Sputnik'},
      { pull: '3', name: 'La Source'},
      { pull: '4', name: 'ONiON'},
      { pull: '5', name: 'Rabies'},
      { pull: '6', name: 'La Source'},
      { pull: '7', name: 'Poltergeist'},
      { pull: '8', name: 'Poltergeist'},
      { pull: '9', name: 'Poltergeist'},
      { pull: '10', name: 'John Titor'},
    ]
  )
);