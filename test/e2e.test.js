import puppeteer from "puppeteer";

describe("App.js", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      // slowMo: 50, // slow down by 250ms
    });
    page = await browser.newPage();
  });

  it("contains the Logo text", async () => {
    await page.goto("http://localhost:3000/");
    await page.waitForSelector("#logo-title");
    const text = await page.$eval("#logo-title", (e) => e.textContent);
    expect(text).toContain("DATAKEEN");
  });

  it.only("Log-in-success", async () => {
    await page.goto("http://localhost:3000/");
    await page.waitForSelector(".login-card");

    await page.click("#login-email");
    await page.type("#login-email", "anurag@datakeen.co");

    await page.click("#login-password");
    await page.type("#login-password", "Test@12345");
    await page.click("#login-submit-button");

    await page.waitForSelector("#notification-msg");

    const notificationText = await page.$eval(
      "#notification-msg",
      (e) => e.textContent
    );
    console.log(notificationText);
    // expect(notificationText).toContain("Connexion réussie");

    await page.goto("http://localhost:3000/user-dashboard");

    await page.waitForSelector("#add-analysis");
    await page.click("#add-analysis");

    await page.waitForSelector("#analyis-name");

    await page.click("#analyis-name");
    await page.type("#analyis-name", "Test Analysis 1");

    //  await page.waitForSelector("#analysis-file-container");
    //  await page.waitForSelector("#analysis-file-upload");

    let file1 = "/home/shubhamarya/Downloads/CNI_1_recto (1).jpg";
    let file2 = "/home/shubhamarya/Downloads/CNI_1_verso (1).jpg";
    // await page.waitForSelector("input[type=file]");
    // await new Promise(function (resolve) {
    //   setTimeout(resolve, 10000);
    // });
    // const fileInput = await page.waitForSelector("#analysis-file-upload");

    // await fileInput.uploadFile(file1);

    // await page.waitForSelector("#run-analysis");
    // await page.click("#run-analysis");
    // await page.goto("http://localhost:3000/user-dashboard");
    // await new Promise(function (resolve) {
    //   setTimeout(resolve, 2000);
    // });

  });


  afterAll(() => browser.close());
});
