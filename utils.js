/**
 * Function to get the current date and time in the format 'yyyy-mm-dd_hh-mm-ss'
 * @returns {string} The formatted current date and time
 */
function formatDateTime(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
}

function removeTrailingSlash (url = '') {
  return url.replace(/\/+$/, '');
}
function getSitemapUrl (domain) {
  let url = removeTrailingSlash(domain);

  if (!url.endsWith('.xml')) {
    url = `${domain}/sitemap.xml`
  }
  return url;
}

function addBasicAuthToUrl(url, username, password) {
  const auth = `${username}:${password}`;

  // Rimuovo il protocollo (es. "https://") dall'URL
  let urlWithoutProtocol = url.replace(/.*?:\/\//, '');

  // Inserisco l'autenticazione di base all'inizio dell'URL
  urlWithoutProtocol = `${auth}@${urlWithoutProtocol}`;

  // Reimposto il protocollo precedente
  const protocol = url.match(/(.*?:\/\/)/)[1];
  return protocol + urlWithoutProtocol;
}
function getLinksFromSitemap(content) {
  if (!!content.sitemapindex) {
    return content.sitemapindex.sitemap.map(url => url.loc)
  }
  return content.urlset.url.map(url => url.loc);

}

module.exports = {
  addBasicAuthToUrl,
  formatDateTime,
  getSitemapUrl,
  getLinksFromSitemap,
}
