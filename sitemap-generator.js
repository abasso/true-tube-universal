const SitemapGenerator = require('sitemap-generator');
 
// create generator
const generator = SitemapGenerator('https://truetube.discovertheweb.co.uk/', {
   filepath: './sitemap.xml',
   maxEntriesPerFile: 50000,
  stripQuerystring: false,
  changeFreq: 'daily'
  // async:false
});
 
// register event listeners
generator.on('done', () => {
  // sitemaps created
});
generator.on('error', (error) => {
  console.log(error);
});
// start the crawler
generator.start();
