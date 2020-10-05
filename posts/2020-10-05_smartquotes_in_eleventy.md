---
type: serif
---
# Fun with RegExes (AKA: How to Get Smartquotes in Eleventy)

<aside style="background:#e5e5e5; border-radius: 1rem; padding: 1px 1rem;">

Per my note the other day about [Tutorials Over Libraries](/tutorials_over_libraries/), I've got a runthrough of how I added smartquotes to Eleventy. I know regular expressions can be daunting and opaque, and I'd love to clarify what I did here. If anything in this is confusing, I promise it's not you. Regexes are squirrelly. If you have thoughts, please let me know! Similarly, I'm eager to learn where I can improve with regexes. Let me know if you have feedback!

As a caveat, I use the Nunjucks templating library, and this all works with it. It might work in other templating libraries, but I haven't tested it. If you try it in another library, please let me know how it goes!

I've set this post in a serif font so you can see the smartquotes more easily.
</aside>



I'm working on turning this tumblelog into a more fully-fleshed-out tool that anyone can use to quickly spin up a tumblelog of their own. One of the things I wanted to nail down was smartquotes.

Since — so far — this is just my personal blog, I've gone to the trouble of hand-typing all of the smartquotes in my posts. I know that's a bit excessive. How nice would it be, though, if you could just write regular quotes in Markdown, and if Eleventy would just *know* which quote to put down, and do it for you?

Before I get into that, a quick bit of background for those of you who aren't typography nerds.

## Smart whatnow?

So if you look on your keyboard, just to the left of your `return` key, you'll see the key you'd press to add a single quotation mark (') or, with the `shift` key modifying it, a double quotation mark (").

In programs like Google Docs, the software typically converts those into "smart" (or "curly") quotes for you. Smart quotes are the traditional way you'd see quotes when set in type, like in a book, magazine, etc.

There's a problem, though! By default, Eleventy doesn't change your quotes in Markdown files to smartquotes. So, unless you wrote each quotation mark in manually (`option` + `[` for left double quote, `shift` + `option` + `[` for right double quote, plus a similar process for apostrophes), you'd be left with straight quotes.

I haven't *minded* hand-writing them, but surely there's an easier way?

## Horrors. How do we fix it?

Thankfully, Eleventy lets us run custom filters, which can process the files we're saving. We just have to create one that does what we want.

In our `.eleventy.js` file, we'll add a new filter, called "smartquotes". Before we add anything in, it looks like this:

```js
eleventyConfig.addFilter("smartquotes", (post) => { return post; });
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

### Regular "double" quotes

Nunjucks converts normal double quotes (that aren't inside a `<code>` block) into `&quot;`, so we're going to want to add a find-and-replace regular expression looking for that string.

```js
const openDoubles = new RegExp(/(?<=<(h|l|p[^r]).*)(?<=\s|>)&quot;/g);
const closeDoubles = new RegExp(/(?<=<(h|l|p[^r]).*“.*)&quot;(?=(\s|\p{P}|<))/gu);
```

If you aren't familiar with regular expressions, that syntax can look kind of strange. Here's what it means:

`?<=(…)`: This is a "lookbehind" command. Basically: make sure that the sequence inside the parentheses occurs before the thing we're looking for.

`<(h|l|p[^r])`: This is the sequence inside the parentheses. We need to see an angle bracket with either an `h`, an `l`, or a `p` (but not `pr`, as we *don't* want to match `<pre>` blocks). (The `h` is for `h1`s, `h2`s, etc. The `l` is for `label` and `li` elements. The `p` is for `p` tags. We can add more if we like, but these were a good starting point.) (I tried a negative lookbehind, but the variations I tried kept breaking my test cases, so I've kept it like this for now.)

`.*`: There can be characters between the thing we've already said we're looking for and the next part of the regex.

`(?<=\s|>)`: Another lookbehind! This is what we need to see immediately before the thing we're looking for. Either a whitespace character or a closing angle bracket. (Remember, Eleventy is just going to be parsing the text of the file, so it'll treat it as a string, not as an HTML node.) By including this as a lookbehind, we simplify our `replace()` call, which we'll get to in a second. (Otherwise, we'd need to include a "capture group" in the `replace()`. Don't worry. We'll get to capture groups in a second.

`$quot;`: The thing we're looking for!

Okay. That was `openDoubles`. What about `closeDoubles`?

Some of this might look familiar. Try to parse it before I tell you what's what.

`(?<=“.*)&quot;(?=(\s|\p{P}|<))`

Okay. Here's what's what.

`(?<=“.*)`: Another lookbehind. This time, we need to see an open quote `“` followed by any number of characters. (We know we'll have open quotes available because we'll run the `openQuotes` replacement before running the `closeQuotes` replacement.

`&quot;`: Again, the thing we're looking for.

`(?=(…))`: This is a "lookahead" command. The string of text needs to include whatever's inside the parentheses, but only *after* the thing we're looking for.

`\s|\p{P}|<`: This is what's inside the lookahead section. Whitespace (`\s`), or a punctuation mark (`\p{P}`), or a left-hand angle bracket (`<`). Note that for that `\p{P}` part to work, we need to tell the regex that we're including some unicode instructions. We do that with the `u` flag at the end of it (look back up at the code block at the top of this section, and find the `/gu`.)


Okay, great. What do we do with those two `const`s?

We add them in to the return statement, calling `replace()` on the `post` string:

```js
eleventyConfig.addFilter("smartquotes", (post) => {
  const openDoubles = new RegExp(/(?<=<(h|l|p[^r]).*)(?<=\s|>)&quot;/g);
  const closeDoubles = new RegExp(/(?<=<(h|l|p[^r]).*“.*)&quot;(?=(\s|\p{P}|<))/gu);
  return post
    .replace(openDoubles, "“").replace(closeDoubles, "”");
});
```

Okay, so! We got our double quotes taken care of.

### Regular 'single' quotes

Like the double quotes, we'll need to put together some regular expressions to get the single quotes.

This should look kind of familiar:

```js
const openSingles = new RegExp(/(?<=<(h|l|p[^r]).*)(?<=\s|>)'/g);
const closeSingles = new RegExp(/(?<=<(h|l|p[^r]).*‘.*)'(?=(\s|\p{P}|<))/gu);
```

See if you can read through that line and figure out what each one does. If you need help, look up at the section before this.

It's actually exactly the same, except we're looking for the straight single quote `'` instead of the string `&quot;`.

The only difference on the `replace()` call is that we'll use smart single quotes:

```js
.replace(openSingles, "‘").replace(closeSingles, "’")
```

So now our full filter looks like this:

```js
eleventyConfig.addFilter("smartquotes", (post) => {
  const openDoubles = new RegExp(/(?<=<(h|l|p[^r]).*)(?<=\s|>)&quot;/g);
  const closeDoubles = new RegExp(/(?<=<(h|l|p[^r]).*“.*)&quot;(?=(\s|\p{P}|<))/gu);
  const openSingles = new RegExp(/((?<=<(h|l|p[^r]).*)(?<=\s|>)|\n)'/g);
  const closeSingles = new RegExp(/(?<=<(h|l|p[^r]).*‘.*)'(?=(\s|\p{P}|<))/gu);
  return post
    .replace(openDoubles, "“").replace(closeDoubles, "”")
    .replace(openSingles, "‘").replace(closeSingles, "’");
});
```

Okay, great. So that's single and double quotes. We haven't gotten apostrophes set, yet. Let's do that next.

### Apostrophes

Apostrophes are pretty straightforward. A "word boundary" (0-9, a-z, A-Z, or the underscore character, represented by `\b`), then an apostrophe, then another "word boundary". This will pick up things like can't, they're, it's, and so on.

```js
const apostrophes = new RegExp(/(?<=<(h|l|p[^r]).*)\b'\b/g);
```

We're going to want to run the apostrophes *before* replacing the double and single quote replacements. We could probably do it after, but this feels cleaner to me.

As before, we keep building up our string manipulation:

```js
eleventyConfig.addFilter("smartquotes", (post) => {
  const apostrophes = new RegExp(/(?<=<(h|l|p[^r]).*)\b'\b/g);
  const openDoubles = new RegExp(/(?<=<(h|l|p[^r]).*)(?<=\s|>)&quot;/g);
  const closeDoubles = new RegExp(/(?<=<(h|l|p[^r]).*“.*)&quot;(?=(\s|\p{P}|<))/gu);
  const openSingles = new RegExp(/((?<=<(h|l|p[^r]).*)(?<=\s|>)|\n)'/g);
  const closeSingles = new RegExp(/(?<=<(h|l|p[^r]).*‘.*)'(?=(\s|\p{P}|<))/gu);
  return post
    .replace(apostrophes, "’")
    .replace(openDoubles, "“").replace(closeDoubles, "”")
    .replace(openSingles, "‘").replace(closeSingles, "’");
});
```

Are we good, then?

Not yet!

### Abbreviated years

Believe it or not, the apostrophe in shortened years is supposed to point to the left. That is, the "pointy bit" of the quotation mark always points to the thing that got removed. So if you shorten "2020", you'd want it to look like '20, not &lsquo;20.

So how do we do that?

We want to capture a single quote sandwiched between a whitespace character and a digit. There are two ways we could do this. First, let's look at a "capture group":

```js
const years = new RegExp(/(\s)'(\d)/g);
```

Those parentheses indicate "capture groups". When we run the `replace()` function, we'll use the capture groups to insert the proper values back in. `$1` is the first capture group's contents. `$2` is the second.

```js
.replace(years, "$1’$2")
```

"But wait," you say. "We didn't pass in capture group variables for the "word boundaries" (`\b`) earlier. Why not?

It turns out that the `\b` marker doesn't actually match any characters. It just marks that liminal space between the word and the not-word.


An alternate method is just like the earlier "lookbehind" and "lookahead" approaches:

```js
const years = new RegExp(/(?<=\s)'(?=\d)/g);
```

And the `.replace()` call would be just the smart quote — no capture group variables.

```js
.replace(years, "’")
```

We will definitely want to run that one before the `openSingles` replacement, so those quotes get switched over and aren't caught by the later replacement.

At the risk of being repetitive, here's what our `smartquotes` filter looks like at this point:

```js
eleventyConfig.addFilter("smartquotes", (post) => {
  const apostrophes = new RegExp(/(?<=<(h|l|p[^r]).*)\b'\b/g);
  const years = new RegExp(/(?<=\s)'(?=\d)/g);
  const openDoubles = new RegExp(/(?<=<(h|l|p[^r]).*)(?<=\s|>)&quot;/g);
  const closeDoubles = new RegExp(/(?<=<(h|l|p[^r]).*“.*)&quot;(?=(\s|\p{P}|<))/gu);
  const openSingles = new RegExp(/((?<=<(h|l|p[^r]).*)(?<=\s|>)|\n)'/g);
  const closeSingles = new RegExp(/(?<=<(h|l|p[^r]).*‘.*)'(?=(\s|\p{P}|<))/gu);
  return post
    .replace(apostrophes, "’").replace(years, "’")
    .replace(openDoubles, "“").replace(closeDoubles, "”")
    .replace(openSingles, "‘").replace(closeSingles, "’");
});
```

Okay, great! Surely there aren't any edge cases?

Oh, but there are.

### Edge cases — slang and Hawai'i

As we just saw in `years`, the "pointy bit" of the quotation mark points at the elided content.

When "them" gets cut down to "em", or "it was" gets smushed into "twas", we want the quotation marks pointing at the beginning of the word: 'cause, 'em, 'til, 'twas.

Fortunately, there aren't *that* many special cases, so for now I've hardcoded them. Odds are good I've missed a few. Please feel free to ping me and let me know!

```js
const slang = new RegExp(/'(cause|em|til|twas)/g);
```

We also have an interesting case where — in the Hawaiian language — the official name of their land is Hawai'i. The character in between the two `i`s is called an 'okina, and it's a diacritic that indicates a glottal stop. When writing an 'okina, the "pointy bit" points up — instead of down — regardless of where it occurs in a word. ([You can read more on the 'okina over at Wikipedia.](https://en.wikipedia.org/wiki/Hawaii#Etymology))

The 'okina is technically present in many Hawaiian words, like Oʻahu or Kauaʻi, but it usually gets dropped when the words are being written in English. In fact, the actual name of the US state is "Hawaii" — no 'okina. This filter catches Hawai'i, but doesn't attempt to catch all Hawaiian words with 'okinas. (My assumption is that if you're paying attention to 'okinas, you're going to be hardcoding them in anyway.)

```js
const hawaii = new RegExp(/Hawai'i/g);
```

And with that, for now, we've got our filter.

## The final filter

Here's what goes in your .eleventy.js file:

```js
eleventyConfig.addFilter("smartquotes", (post) => {
  const hawaii = new RegExp(/Hawai'i/g);
  const slang = new RegExp(/'(cause|em|til|twas)/g);
  const apostrophes = new RegExp(/(?<=<(h|l|p[^r]).*)\b'\b/g);
  const years = new RegExp(/(?<=\s)'(?=\d)/g);
  const openDoubles = new RegExp(/(?<=<(h|l|p[^r]).*)(?<=\s|>)&quot;/g);
  const closeDoubles = new RegExp(/(?<=<(h|l|p[^r]).*“.*)&quot;(?=(\s|\p{P}|<))/gu);
  const openSingles = new RegExp(/(?<=<(h|l|p[^r]).*)(?<=\s|>)'/g);
  const closeSingles = new RegExp(/(?<=<(h|l|p[^r]).*‘.*)'(?=(\s|\p{P}|<))/gu);
  return post
    .replace(hawaii, "Hawaiʻi").replace(slang, "’$1")
    .replace(apostrophes, "’").replace(years, "’")
    .replace(openDoubles, "“").replace(closeDoubles, "”")
    .replace(openSingles, "‘").replace(closeSingles, "’");
});
```

And, then, like I said up top, the "content" part of your `index.njk` file should look something like this:

```js
{%- raw %}
<main>
  {{ content | smartquotes | safe }}
</main>
{%- endraw %}
```

## A few tests:

Abbreviated years work: '97, '01, '04, '07.

Apostrophes and contractions work: I can't wait to see if anyone actually uses this. If you've got suggestions or improvements, please shoot me a note.

Quotes work: "I just don't think I have it in me," said the dog that definitely didn't eat the bacon off the countertop, no siree.

"Quotes" should "work": even when there are multiple "quotes" per "line".

Internal quotes work, even with curious punctuation: "She didn't say '*You* did this'! She said '*Hugh* did this'!"

'single quotes' 'work', at the 'beginning', 'middle', and 'end'

"So do" "double" "quotes."

<pre>But not inside 'pre' blocks, or in multi-line code blocks:</pre>

```js
<code>
  These should *not* be "smart".
</code>
```

<p>Oh, and thanks to how Nunjucks and Eleventy process HTML, if we have some hardcoded HTML with a class or an inline style — <span class="highlight">like this one</span> — the quote marks inside the brackets won't get messed up, and your HTML will still work as expected.</p>