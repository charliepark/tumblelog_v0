# Smartquotes in Eleventy

<aside style="background:#e5e5e5; border-radius: 1rem; padding: 1px 1rem;">
<p>This post will make a bit more sense if you read it in a serif font. You can do that by poking this button: <button id="serif_toggle">serif / sans</button></p>
</aside>

<script>
  const serifToggle = document.getElementById("serif_toggle");
  console.log(serifToggle);
  serifToggle.addEventListener("click", () => {
    console.log("clicked");
    document.body.classList.toggle("serif");
  });
</script>

I'm working on turning this tumblelog into a more fully-fleshed-out tool that anyone can use to quickly spin up a tumblelog of their own, and one of the things I wanted to nail down was smartquotes.

So far, I've gone to the trouble of hand-typing all of the smartquotes in my posts. How nice would it be, though, if Eleventy could just *know* which quote to put down, and do it for you?

Before I get into that, a quick bit of background for those of you who aren't typography nerds. As a caveat, I use the Nunjucks templating syntax, and this all works; if you try it in another templating framework, let me know how it goes.)

## Smart whatnow?

So if you look on your keyboard, just to the left of your "return" key, you'll see the key you'd press to add a single quotation mark (') or, with the `Shift` key modifying it, a double quotation mark (").

In programs like Google Docs, the software typically converts those into "smart" (or "curly") quotes for you. Smart quotes are the traditional way you'd see quotes when set in type, like in a book, magazine, etc.

There's a problem, though! By default, Eleventy doesn't change your quotes in Markdown files to smartquotes. So, unless you wrote each quotation mark in manually (`option` + `[` for left double quote, `shift` + `option` + `[` for right double quote, plus a similar process for apostrophes), you'd be left with straight quotes.

I haven't *minded* hand-writing them, but surely there's an easier way?

# Horrors. How do we fix it?

Thankfully, Eleventy lets us run custom filters, which can process the files we're saving. We just have to create one that does what we want.

In our `.eleventy.js` file, we'll add a new filter, called "smartquotes". Before we add anything in, it looks like this:

```js
eleventyConfig.addFilter("smartquotes", (post) => { return post; }
```

And we'll call it in our main template file (like `index.njk`) like this:

```js
{%- raw %}
<main>
  {{ content | smartquotes | safe }}
</main>
{%- endraw %}
```

(Normally, it'd just say `content | safe`, without the `smartquotes` bit in the middle.)

Okay. Now we basically need to add some regular expressions to swap out our various quotation marks.

### Regular double quotes

Nunjucks converts normal double quotes (that aren't inside a `<code>` block) into `&quot;`, so we're going to want to add a find-and-replace regular expression looking for that string.

```js
const openDoubles = new RegExp(/(\s|^|>)&quot;/g);
const closeDoubles = new RegExp(/&quot;(\s|\p{P}|$)?/gu);
```

If you aren't familiar with regular expressions, that syntax can look kind of strange. Here's what it means:

`(\s|>|^)&quot;` = Look for the string `&quot;` preceded by either a whitespace character or an angle bracket, or that's at the beginning of the line. We need the angle bracket one in there because even if the quote mark is at the beginning of the line as we read it, the code behind the scenes kicks the line off with a `<p>` or similar.

The second one — `&quot;(\s|\p{P}|$)?` — is kind of the opposite. Find situations where `$quot;` is followed by a whitespace character or by a punctuation mark of some sort, or is at the end of its line. That `\p{P}` is the "punctuation" wildcard. Note that you need to add the `u` flag at the end of the regular expression (to the right of the second slash, after the `g`).

Okay, great. What do we do with those two `const`s?

We add them in to the return statement, calling `replace()` on the `post` string:

```js
eleventyConfig.addFilter("smartquotes", (post) => {
  const openDoubles = new RegExp(/(\s|>|^)&quot;/g);
  const closeDoubles = new RegExp(/&quot;(\s|\p{P}|$)?/gu);
  return post
    .replace(openDoubles, "$1“").replace(closeDoubles, "”$1");
}
```

The `$1` in that `replace()` string is for *capture groups* in the regular expression. Note how the regular expressions looked like `(\s|>|^)&quot;`? The part inside the parentheses is what gets popped into the `$1` in the `replace()` parameter.

Okay, so! We got our double quotes taken care of.

### Regular single quotes

Like the double quotes, we'll need to put together some regular expressions to get the single quotes.

This should look familiar:

```js
const openSingles = new RegExp(/(\s|>|^)stet'stet/g);
const closeSingles = new RegExp(/stet'stet(\s|\p{P}|$)?/g)u;
```

See if you can read through that line and figure out what each one does. If you need help, look up at the section before this.

The only difference on the `replace()` call is that we'll use smart single quotes:

```js
.replace(openSingles, "$1‘").replace(closeSingles, "’$1")
```

So now our full filter looks like this:

```js
eleventyConfig.addFilter("smartquotes", (post) => {
  const openDoubles = new RegExp(/(\s|>|^)&quot;/g);
  const closeDoubles = new RegExp(/&quot;(\s|\p{P}|$)?/gu);
  const openSingles = new RegExp(/(\s|>|^)stet'stet/g);
  const closeSingles = new RegExp(/stet'stet(\s|\p{P}|$)?/gu);
  return post
    .replace(openDoubles, "$1“").replace(closeDoubles, "”$1")
    .replace(openSingles, "$1‘").replace(closeSingles, "’$1");
});
```

Okay, great. So that's single and double quotes. We haven't gotten apostrophes set, yet. Let's do that next.

### Apostrophes

Apostrophes are pretty straightforward. A "word boundary" (0-9, a-z, A-Z, or the underscore character), then an apostrophe, then another "word boundary". Things like can't, they're, it's, and so on.

```js
const apostrophes = new RegExp(/(\b)stet'stet(\b)/g);
```

Note the parentheses, which let us capture the values and drop them into our `replace()` function.

As before, we keep building up our string manipulation:

```js
eleventyConfig.addFilter("smartquotes", (post) => {
  const apostrophes = new RegExp(/(\b)stet'stet(\b)/g);
  const openDoubles = new RegExp(/(\s|>|^)&quot;/g);
  const closeDoubles = new RegExp(/&quot;(\s|\p{P}|$)?/gu);
  const openSingles = new RegExp(/(\s|>|^)stet'stet/g);
  const closeSingles = new RegExp(/stet'stet(\s|\p{P}|$)?/gu);
  return post
    .replace(apostrophes, "$1’$2")
    .replace(openDoubles, "$1“").replace(closeDoubles, "”$1")
    .replace(openSingles, "$1‘").replace(closeSingles, "’$1");
});
```

Are we good, then?

Haha, no, you sweet, summer child.

### Abbreviated years

Believe it or not, the apostrophe in shortened years is supposed to point to the left. That is, the "pointy bit" of the quotation mark always points to the thing that got removed. So if you shorten "2020", you'd want it to look like '20, not &lsquo;20.

So how do we do that?

Just like the apostrophes, we capture some values. This time we capture a single quote sandwiched between a whitespace character and a digit.

```js
const years = new RegExp(/(\s)stet'stet(\d)/g);
```

```js
.replace(years, "$1’$2")
```

And, at the risk of being repetitive, here's what our `smartquotes` filter looks like at this point:

```js
eleventyConfig.addFilter("smartquotes", (post) => {
  const apostrophes = new RegExp(/(\b)stet'stet(\b)/g);
  const years = new RegExp(/(\s)stet'stet(\d)/g);
  const openDoubles = new RegExp(/(\s|>|^)&quot;/g);
  const closeDoubles = new RegExp(/&quot;(\s|\p{P}|$)?/gu);
  const openSingles = new RegExp(/(\s|>|^)stet'stet/g);
  const closeSingles = new RegExp(/stet'stet(\s|\p{P}|$)?/gu);
  return post
    .replace(apostrophes, "$1’$2").replace(years, "$1’$2")
    .replace(openDoubles, "$1“").replace(closeDoubles, "”$1")
    .replace(openSingles, "$1‘").replace(closeSingles, "’$1");
});
```

Okay, great! Surely there aren't any edge cases?

Oh, but there are.

### Edge cases — slang and Hawai'i

As we just saw in `years`, the "pointy bit" of the quotation mark points at the elided content.

When "them" gets cut down to "em", or "it was" gets smushed into "twas", we want the quotation marks pointing at the beginning of the word: 'cause, 'em, 'til, 'twas.

Fortunately, there aren't *that* many special cases, so for now I've hardcoded them. Odds are good I've missed a few. Please feel free to ping me and let me know!

```js
const slang = new RegExp(/stet'stet(cause|em|til|twas)/g);
```

We also have an interesting case where — in the Hawaiian language — the official name of their land is Hawai'i. The character in between the two `i`s is called an 'okina, and it's a diacritic that indicates a glottal stop. When writing an 'okina, the "pointy bit" points up — instead of down — regardless of where it occurs in a word. ([You can read more on the 'okina over at Wikipedia.](https://en.wikipedia.org/wiki/Hawaii#Etymology))

The 'okina is technically present in many Hawaiian words, like Oʻahu or Kauaʻi. My assumption, though, is that if you are paying attention to 'okinas, you're going to be hardcoding them in anyway. This filter catches Hawai'i, but doesn't attempt to catch all Hawaiian words with 'okinas.

```js
const hawaii = new RegExp(/Hawaistet'steti/g);
```

Okay, so where are we now?

```js
eleventyConfig.addFilter("smartquotes", (post) => {
  const hawaii = new RegExp(/Hawaistet'steti/g);
  const slang = new RegExp(/stet'stet(cause|em|til|twas)/g);
  const apostrophes = new RegExp(/(\b)stet'stet(\b)/g);
  const years = new RegExp(/(\s)stet'stet(\d)/g);
  const openDoubles = new RegExp(/(\s|>|^)&quot;/g);
  const closeDoubles = new RegExp(/&quot;(\s|\p{P}|$)?/gu);
  const openSingles = new RegExp(/(\s|>|^)stet'stet/g);
  const closeSingles = new RegExp(/stet'stet(\s|\p{P}|$)?/gu);
  return post
    .replace(hawaii, "Hawaiʻi").replace(slang, "’$1")
    .replace(apostrophes, "$1’$2").replace(years, "$1’$2")
    .replace(openDoubles, "$1“").replace(closeDoubles, "”$1")
    .replace(openSingles, "$1‘").replace(closeSingles, "’$1");
});
```

That's basically it! Almost.

### A hack for stet quotes

The one last thing I ran into when working up this filter was kind of meta: When writing about it on this blog, how do we prevent straight quotes in code blocks (like the one right above this) from getting switched to smart quotes?

There were two ways I could think of to approach this situation. One was to create a more complicated regex that involved some sort of multi-line lookbehind, which would probably be pretty fragile. The other was to create some sort of rule to make sure that — at the end of the filtering — some quotes could stay as straight quotes. I went with that one. (If you have other suggestions, I'm all ears!)

In the journalism world, when editing on paper, `stet` is the markup an editor uses that means "um, I suggested a change, but you should ignore that, and keep your copy as it is." As in, I'm editing your newspaper article and I cross out a word, and then decide that the word was actually appropriate, I'd write "stet" next to my earlier edit.

We need a "stet" equivalent here.

Here it is.

```js
const stetSingles = new RegExp(/stetstet’stetstet/g);
```

And, in the filter, we'll call it with this:

```js
.replace(stetSingles, "stet'stet");
```

Note how there are no capture groups in the regex. So if I'm writing a block of code in Markdown (like I'm doing in this post), and I want to make sure it renders with a straight quote, I wrap it in the literal text `stet`. So if I write `stetstet'stetstetthisstetstet'stetstet`, what gets rendered is `stet'stetthisstet'stet` instead of `‘this’`.

That's probably a little hard to read. But what it's saying is that when the entire filter runs, the very last call will be to look for text in the post that has a `stet` followed by a `’` followed by a `stet`, and to change that whole string into a straightquote.

And with that, for now, we've got our filter.

## The final filter

Here's what goes in your .eleventy.js file:

```js
  eleventyConfig.addFilter("smartquotes", (post) => {
    const hawaii = new RegExp(/Hawaistet'steti/g);
    const slang = new RegExp(/stet'stet(cause|em|til|twas)/g);
    const apostrophes = new RegExp(/(\b)stet'stet(\b)/g);
    const years = new RegExp(/(\s)stet'stet(\d)/g);
    const openDoubles = new RegExp(/(\s|>|^)&quot;/g);
    const closeDoubles = new RegExp(/&quot;(\s|\p{P}|$)?/gu);
    const openSingles = new RegExp(/(\s|>|^)stet'stet/g);
    const closeSingles = new RegExp(/stet'stet(\s|\p{P}|$)?/gu);
    const stetSingles = new RegExp(/stetstet’stetstet/g);
    return post
      .replace(hawaii, "Hawaiʻi").replace(slang, "’$1")
      .replace(apostrophes, "$1’$2").replace(years, "$1’$2")
      .replace(openDoubles, "$1“").replace(closeDoubles, "”$1")
      .replace(openSingles, "$1‘").replace(closeSingles, "’$1")
      .replace(stetSingles, "stet'stet");
  });
```

And, then, like I said before, the "content" part of your `index.njk` file should look like this:

```js
{%- raw %}
<main>
  {{ content | smartquotes | safe }}
</main>
{%- endraw %}
```

## A few tests:

Abbreviated years work: '97, '01, '04, '07.

Apostrophes and contractions work: I can't wait to see if anyone uses this.

Quotes work: "I just don't think I have it in me," said the dog that definitely didn't eat the bacon off the countertop, no siree.

Internal quotes work, even with odd punctuation: "She didn't say 'You did this'! She said '*Hugh* did this'!"

<p>Oh, and thanks to how Nunjucks and Eleventy process HTML, if we have some hardcoded HTML with a class or an inline style — <span style="color: darkred; font-family: fantasy">like this one</span> — the quote marks inside the brackets won't get messed up, and your HTML will still work as expected.</p>

Quotes at the beginning of a line will work, too:<br>
"And your profession?" "Goodness."