const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

const setDateToMidnight = (date) => { let d = (new Date(date)).toUTCString();return d; }

const getISOString = (date) => {
  const midnight = setDateToMidnight(date);
  return new Date(midnight).toISOString();
};
const getHumanDate = (date) => {
  const midnight = setDateToMidnight(date);
  return new Date(midnight).toLocaleString('en-us', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
};

const setClasses = (post) => {
  const { type } = post.data;
  if (type != 'quote') { return type; }
  const length = post.templateContent.length;
  if (length < 250) { return `${type} short`; }
  if (length > 750) { return `${type} long`; }
  return type;
};

module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter("getHumanDate", (date) => getHumanDate(date));
  eleventyConfig.addFilter("setClasses", (post) => setClasses(post));
  eleventyConfig.addFilter("getISOString", (date) => getISOString(date));
  eleventyConfig.addPassthroughCopy('images');
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.setDataDeepMerge(true);
  eleventyConfig.setTemplateFormats(["svg", "liquid", "md", "njk"]);
};
