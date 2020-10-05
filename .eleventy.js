const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

const setDateToMidnight = (date) => (new Date(date)).toUTCString();

const getISOString = (date) => {
  const midnight = setDateToMidnight(date);
  return new Date(midnight).toISOString();
};
const getHumanDate = (date) => {
  const midnight = setDateToMidnight(date);
  return new Date(midnight).toLocaleString('en-us', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC'
  });
};

const setClasses = (post) => {
  const { type } = post.data;
  if (type != 'quote') { return type; }
  const { length } = post.templateContent;
  if (length > 850) { return `${type} verylong`; }
  if (length > 450) { return `${type} long`; }
  if (length < 250) { return `${type} short`; }
  return type;
};

module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter("getHumanDate", (date) => getHumanDate(date));
  eleventyConfig.addFilter("setClasses", (post) => setClasses(post));
  eleventyConfig.addFilter("getISOString", (date) => getISOString(date));
  eleventyConfig.addFilter("getPermalink", (page) => page.fileSlug.slice(11));
  eleventyConfig.addFilter("smartquotes", (post) => {
    const hawaii = new RegExp(/Hawai'i/g);
    const slang = new RegExp(/'(cause|em|til|twas)/g);
    const apostrophes = new RegExp(/(\b)'(\b)/g);
    const years = new RegExp(/(\s)'(\d)/g);
    const openDoubles = new RegExp(/(\s|>|^)&quot;/g);
    const closeDoubles = new RegExp(/&quot;(\s|\p{P}|$)?/gu);
    const openSingles = new RegExp(/(\s|>|^)'/g);
    const closeSingles = new RegExp(/'(\s|\p{P}|$)?/gu);
    const stetSingles = new RegExp(/stet’stet/g);
    return post
      .replace(hawaii, "Hawaiʻi").replace(slang, "’$1")
      .replace(apostrophes, "$1’$2").replace(years, "$1’$2")
      .replace(openDoubles, "$1“").replace(closeDoubles, "”$1")
      .replace(openSingles, "$1‘").replace(closeSingles, "’$1")
      .replace(stetSingles, "'");
  });
  eleventyConfig.addPassthroughCopy('images');
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.setDataDeepMerge(true);
  eleventyConfig.setTemplateFormats(["svg", "liquid", "md", "njk"]);
};
