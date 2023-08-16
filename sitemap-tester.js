const axios = require('axios');
const xml2js = require('xml2js');
const commander = require('commander');

const {formatDateTime, addBasicAuthToUrl, getSitemapUrl, getLinksFromSitemap} = require("./utils");
const {progressBar} = require("./progress-bar");
const {fileLogger} = require("./logger");

commander
  .version('1.0.0', '-v, --version')
  .usage('-t https://example.com [OPTIONS]...')
  .option('-t, --target <value>', 'target url https://example.com')
  .option('-u, --user <value>', 'basic auth user', '')
  .option('-p, --password <value>', 'basic auth password', '')
  .option('-s, --skip <value>', 'skip first n links', '0')
  .option('-l, --limit <value>', 'limit to n links', '0')
  .option('-d, --no_domain_check', 'exclude same domain check', 'false')
  .option('-c, --no_link_check', 'exclude link check', 'false')
  .parse(process.argv);

let {
  target: url,
  skip,
  limit,
  user,
  password,
  no_domain_check: disableDomainTest,
  no_link_check: disableLinkTest
} = commander.opts();

console.log('-= Sitemap Tester =-');

skip = Number(skip);
limit = Number(limit);
disableLinkTest = disableLinkTest && disableLinkTest !== 'false';
const filename = formatDateTime();
const basicAuth = user || password;
let countErr = 0;
let countDomainErr = 0;
let links = [];
let writeLog = (...args) => console.log(...args);

async function checkSitemapLinks(links) {
  const start = skip || 0;
  const total = links.length ? limit ? limit : links.length : 0;
  console.log(`Start checking links from ${skip + 1} to ${total}`);
  progressBar.start(total, 0, {
    countErr: 0,
  });

  for (let i = start; i < total; i++) {
    progressBar.increment();

    let link = links[i];
    try {
      let _link = basicAuth ? addBasicAuthToUrl(link, user, password) : link;
      const linkResponse = await axios.get(_link);
      if (linkResponse.status !== 200) {
        countErr += 1;
        progressBar.update({countErr})
        writeLog(`Link: ${link} - Status: ${linkResponse.status} ${linkResponse.statusText}`, true);
      }
    } catch (error) {
      countErr += 1;
      progressBar.update({countErr});
      if (error && error.response && error.response.status) {
        writeLog(`Link: ${link} - Error: ${error.response.status} ${error.response.statusText}`, true);
      } else {
        writeLog(`Link: ${link} - ${error}`, true);
      }
    }
  }
  progressBar.stop();
}

function checkSameDomain(links, domain) {
  for (let i = 0; i < links.length; i++) {
    let link = links[i];
    if (!link.startsWith(domain)) {
      countDomainErr += 1;
      writeLog(`Link: ${link} - Error: Different domain`, true);
    }
  }
  if (countDomainErr) {
    writeLog(`Sitemap has ${countDomainErr} link(s) with different domain`);
  }
}

async function checkSitemap(domain) {
  const sitemapUrl = getSitemapUrl(domain);
  const _sitemapUrl = basicAuth ? addBasicAuthToUrl(sitemapUrl, user, password) : sitemapUrl;
  let result;
  try {
    writeLog(`Retrieving sitemap: ${sitemapUrl}`);
    const response = await axios.get(_sitemapUrl);
    const xml = response.data;

    const parser = new xml2js.Parser({explicitArray: false});
    result = await parser.parseStringPromise(xml);

    // Update array of links
    links = getLinksFromSitemap(result);
    writeLog(`URLs Found: ${links.length}`);
  } catch (error) {
    writeLog(`Error fetching sitemap - ${error}`);
    return;
  }

  if (!links.length) {
    writeLog(`The sitemap is empty`);
    return;
  }

  // Check same domain
  if (!disableDomainTest) {
    checkSameDomain(links, domain);
  }

  // Check sitemap links
  if (!disableLinkTest) {
    await checkSitemapLinks(links);
  }
  writeLog(`Check completed.`);
  if (!disableDomainTest) {
    writeLog(`${countDomainErr} Link(s) with different domain.`);
  }
  if (!disableLinkTest) {
    writeLog(`${countErr} Link(s) with errors`);
  }
  writeLog(`See log file for more details.`);
}

async function main() {
  if (!url) {
    return commander.help();
  }
  writeLog = fileLogger(filename);
  await checkSitemap(url);
}

try {
  main();
} catch (e) {
  writeLog(e);
}
