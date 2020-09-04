const express = require('express');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

const app = express();
const port = process.env.PORT || 4000;

app.get('/vjudge?', (req, res) => {
   console.log('here');
   res.send('hi');
   try {
      (async () => {
         const browser = await puppeteer.launch({ args: puppeteer.defaultArgs(), executablePath: puppeteer.executablePath(), });
         const page = await browser.newPage();
         await page.setDefaultTimeout(2000000);
         await page.setDefaultNavigationTimeout(0);
         await page.goto(`${req.query.url}#rank`);

         const html = await page.$eval('#contest-rank-table', el => el.outerHTML);

         const $ = cheerio.load(html);

         let list = [];

         let cur = 0;
         $(".solved").each((index, el) => {
            list.push({
               count: $(el).text(),
               handle: ''
            });
         });


         $(".team a").each((index, el) => {
            const string = $(el).attr('href');
            let handle = string.split("/");
            list[cur]["handle"] = handle[2];
            cur++;
         });

         console.log(list);
         await browser.close();
         console.log('done');
      })();
   } catch (e) {
      res.send('error occurred');
   }
});

app.listen(port, () => {
   console.log(`server is running up on port ${port}`);
});
