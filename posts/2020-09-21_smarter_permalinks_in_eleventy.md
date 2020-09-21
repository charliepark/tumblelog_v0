# Smarter Permalinks in Eleventy

I’m continuing to enjoy Eleventy. The other day I noted that I was having trouble getting the dates to work correctly, and was hoping for some smarter autoslugging.

I figured out both, and wanted to share what I did.

I *had* been naming the date and permalink in the file’s header …

```js
---
date: "2020-09-21"
permalink: "smarter_permalinks_in_eleventy/"
---
```

… but that’s duplicating the data in the filename (which was `2020-09-21_smarter_permalinks_in_eleventy.md`. This would be easier if eleventy *just knew* what the date and slug should be, right?

The date part was pretty easy. I removed the `date` line from the frontmatter data, and, as long as the filename had that YYYY-MM-DD formatting, it worked properly. (Thank you, eleventy, for being smart about that!) I’m still a little unsure that the UTC / PST timezones will play nicely, but it hasn’t shown to be a problem yet. (For some reason the “eleventy will automatically handle filenames with YYYY-MM-DD in them” wasn’t working for me a few days ago. Now it’s fine. ¯\\\_(ツ)_/¯ )

For the permalink, I created a new line in my `eleventy.js` file …

```js
eleventyConfig.addFilter("getPermalink", (page) => page.fileSlug.slice(11));
```

… and then added a line to my `posts/posts.json` file:

```js
{%- raw %}
"permalink": "{{ page | getPermalink }}/index.html",
{%- endraw %}
```

Now the data and autoslug are generated off of the file name, and my post frontmatter only needs to exist if I’m specifying the post “type” (image, quote, poem, etc.). No more duplicated data.