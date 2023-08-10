const puppeteer = require("puppeteer");
const fs = require("fs");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto("https://internshala.com/jobs/work-from-home/");

  // Wait for the job listings to load
  await page.waitForSelector(".individual_internship.visibilityTrackerItem");

  const jobListingContainers = await page.$$(
    ".individual_internship.visibilityTrackerItem"
  );
  const jobListings = [];

  for (let i = 0; i < Math.min(jobListingContainers.length, 10); i++) {
    const jobListing = jobListingContainers[i];

    const jobTitles = await jobListing.$eval(
      "h3.heading_4_5.profile a",
      (element) => element.textContent.trim()
    );

    const companyName = await jobListing.$eval("h4.company_name a", (element) =>
      element.textContent.trim()
    );

    const location = await jobListing.$eval(".location_link", (element) =>
      element.textContent.trim()
    );

    const salaryRange = await jobListing.$eval(
      ".item_body.salary span.mobile",
      (element) => element.textContent.trim()
    );

    jobListings.push({
      jobTitles,
      companyName,
      location,
      salaryRange,
    });
  }
  await browser.close();
  fs.writeFileSync("jobs.json", JSON.stringify(jobListings, null, 2));
  console.log("data is available in json form in job.json ");
  process.exit(0);
})();
