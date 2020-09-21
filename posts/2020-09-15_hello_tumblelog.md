---
date: "2020-09-15"
permalink: "hello_tumblelog/"
---

# Hello, tumblelog

This is just a quick afternoon project I threw together, to play a bit more with Eleventy ([11ty](https://www.11ty.dev/)) and [Netlify](http://netlify.com/).

The goal was to create a very basic tumblelog, which most of the world knew as “the kind of microblog that Tumblr made”. Which isn’t *wrong*. But there were tumblelogs before Tumblr, and, I guess, after Tumblr as well.

I think I’ve been hesitant to do much with my main website because … it feels like my homepage should be SeRiOuS. Which, yeah, maybe. But it’s also kind of dead right now.

So! I’m going to try this out and see if it works. If it does, I’ll look into moving my main blog over to this.

Development went pretty well. I’ve built a few things with Eleventy before. I have to say, every time I start fresh with it I have to wrestle with the docs a fair amount. A lot of it’s really straightforward and clear. But something as basic as “how do I post a copy of each post’s content on the main page?” is somehow hard to search for. (The answer, by the way, is something like this:

```html
{%- raw %}
{%- for post in collections.all | reverse -%}
<article class="{{ post | setClasses }}">
{%- if post.data.date %}
  <time class="postdate" datetime="{{ post.data.date | getISOString }}">
    <a href="{{ post.url }}">{{ post.data.date | getHumanDate }}</a>
  </time>
{%- endif %}
  <div class="postbody">
    {{ post.templateContent | safe }}
  </div>
</article>
{%- endfor -%}
{%- endraw %}
```

Oh! And that datetime format is handled like this, in your eleventy config file:

```js
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

module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter("getHumanDate", (date) => getHumanDate(date));
  eleventyConfig.addFilter("getISOString", (date) => getISOString(date));
}
```

Note the `timeZone: 'UTC'` bit in the `toLocaleString()` options! It’s pretty important!