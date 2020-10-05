# JSON Feeds in Eleventy

I’ve wanted to set up an RSS/JSON feed for this tumblelog for a little bit, but hadn’t made the time. I just took care of it, and it was really straightforward.

I started with [Andy Bell’s quick intro on making a JSON Feed in Eleventy](https://piccalil.li/quick-tip/create-a-json-feed-with-11ty/), but then made some modifications to help it conform more to [the JSON Feed spec](https://jsonfeed.org/).

Here’s what I ended up with, in a file called `feed.njk` in my root directory:

```js
{%- raw %}
---
permalink: "/feed.json"
---
{
  "version": "https://jsonfeed.org/version/1.1",
  "title": "Charlie Park!",
  "home_page_url": "https://charliepark.org/",
  "feed_url": "https://charliepark.org/feed.json",
  "icon": "https://charliepark.org/images/arrow_for_feed.jpg",
  "favicon": "https://charliepark.org/favicon.ico",
  "language": "en-US",
  "items": [
  {% for item in collections.post | reverse %}
    {
      "id": "https://charliepark.org{{ item.url }}",
      "url": "https://charliepark.org{{ item.url }}",
      "title": "{{ item.data.type }}: {{ item.url }}",
      "content_html": "{{ item.templateContent | replace(stet'stet"stet'stet, "\"") | replace("\n", "") | replace("\\", "\\\\") | safe }}"
    }{% if not loop.last %},{% endif %}
  {% endfor %}
  ]
}
{%- endraw %}
```

That string of `replace()`s in the last line of the for loop is to handle some string transformations so that the post content better functions with the JSON spec. Since I use smart quotes in my posts, it won’t mess up my quotation marks. Just be aware that you might need to keep an eye out on those.