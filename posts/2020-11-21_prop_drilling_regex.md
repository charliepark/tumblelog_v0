---
---
# A RegEx To Help You Move From Prop-Drilling In React To Using The useContext Hook

I added hooks to my app a while ago, but hadn't gone through to refactor a number of places where I was drilling props from one component down through to a component many layers deep.

I wanted to see which properties I was passing along a lot, to see what some of the more common offenders were, so I could move them into useContext hooks.

In VSCode there's a really handy global regex search. Just select the last two options from the search bar ("case senseitive" and "regex") and paste this in:

```js
(.*)=\{\1\}
```

The results will look something like this:

<img src="/images/props.png" alt="A screenshot of VSCode with a search term and its results showing React code." style="border-radius: 0.3em">

The regex is doing this:

```js
(.*) → "Capture some string of text …"
=\{  → "… followed by an equals sign and an open bracket …"
\1   → "… followed by the same exact string of text …"
\}   → "… with a closing bracket following it."
```

So. Go refactor. Have fun.

(Side note: 485 results in 58 files. Merp. Good news, though: it's getting better.)