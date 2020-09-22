No browsers support it yet, but there’s a useful pseudo-class in the CSS spec that I just stumbled on: `:has()`

Say you have a style that applies to links, but you don’t want it to apply to links when they contain an image (like an image that links to a gallery). You could do something like this:

```css
a { border-bottom: 1px solid #000 }
a:has(img) { border: none }
```