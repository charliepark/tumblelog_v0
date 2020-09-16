const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter("toISOString", (date) => ( new Date(`${date} 00:00:00`).toISOString()));  
  eleventyConfig.addFilter("formatDateForBlog", (date) => (new Date(`${date} 00:00:00`).toLocaleString('en-us', { month: 'long', day: 'numeric', year: 'numeric' })));
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPassthroughCopy('images');
  eleventyConfig.addPassthroughCopy('sitemap.xsl');
  eleventyConfig.setDataDeepMerge(true);
  eleventyConfig.setTemplateFormats(["svg", "liquid", "md", "njk"]);  
};
