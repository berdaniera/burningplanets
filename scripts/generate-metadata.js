const puppeteer = require('puppeteer');
const fs = require('fs');

// CREATE TABLE nft (id INTEGER PRIMARY KEY, name JSON);

async function generate(seed){
  let tokenId = parseInt(3);
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({
    width: 500,
    height: 500
  });
  await page.goto(`http://localhost:8080/planet.html?seed=${seed}`);
  await page.waitForTimeout(3000);
  await page.screenshot({ path: `../img/planet${seed}.png` });
  let metadata = await page.evaluate(() => {
    return metadata;
  });
  await browser.close();
  metadata.water = (100*metadata.water/metadata.total | 0).toString();
  metadata.forest = (100*metadata.forest/metadata.total | 0).toString();
  metadata.aridity = (100*metadata.aridity/metadata.total | 0).toString();
  delete metadata.total;
  var json = JSON.stringify(metadata) + ',';
  // console.log(json);
  await fs.promises.appendFile('../tokenMetadata.json', json, err => err ? console.log(err): null);
  console.log(seed, "success");
};

(async () => {
    let n = 0;
    for(s = 0; s < 100*422; s += 100){ //759600
        let sd = 1650585600 + s;
        const res = await generate(sd.toString());
        n ++
    }
    console.log("Done",n);
})();
