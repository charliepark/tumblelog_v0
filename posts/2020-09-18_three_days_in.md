# Three Days In

I’m three days into using [this tumblelogging tool](https://github.com/charliepark/tumblelog/), and am pretty happy with it. Obviously, the test is how I’ll use it over time, but things are going well so far.

## A few things I love

### It’s great how low-stress it is

>I don’t worry about whether things are “good enough” to post. I just post them. That’s a big improvement over what I had before, where I let the perfect be the enemy of the good, and, consequently, didn’t post.

### The different formatting types are fun

>I love being able to come up with new post types, and then to style them independently. For example, yesterday, when I added the “poem” type. I’ll come up with a few more, for sure. I still haven’t come up with the “link” format, but look forward to the occasion where I do.

### Posting and hosting are both easy

>It’s really easy to add a new post right now. Create a file with the right Markdown format and frontmatter, run `eleventy --serve` to see what it looks like, and then commit to git and push remote. (TBH, I actually just leave an iTerm window open with `eleventy --serve` going all the time.)

>The workflow is a little dependent on VS Code, where I’m writing these, and running eleventy on my local machine. And I have a few ideas around requiring less of the template in the Markdown file that I need to play with. But it’s working for now.

## Some things to work on

### Less metawork

<aside class="callout_box">
  <p><b>Update:</b> I’ve fixed this now! See here for more: <a href="/smarter_permalinks_in_eleventy">Smarter Permalinks in Eleventy</a></p>
</aside>

>Right now I have a bit of duplication of effort, in that I name the file something like `2020_09_18_three_days_in.md` and then add metadata like 

```text
---
date: "2020-09-18"
permalink: "three_days_in/"
---
```

>The eleventy docs say that it’ll use any YYYY-MM-DD in the file name as a date, but I haven’t found that to be the case (I know my date in the filename is using underscores; even when using dashes it doesn’t seem to quite work). It’d be nice to add something to the compiler / preferences that interpreted the filename correctly and then just used it for the date and permalink. Perhaps there’s a way to configure that, and I just haven’t found it yet.

### Mmmmmaybe a posting interface?

>I can imagine a Svelte app that gives an easy posting input. Name the permalink, adjust the date if needed (but default to now), and give an input field for posting the content. Write the .md file on submission, then run `eleventy` to process it. At that point, you could just add a button that pushes it to GitHub as well. That’d be pretty cool.

### RSS, or posting to Twitter, etc.

>Right now, hardly anybody knows about this tumblelog, and that’s fine. (Hi, folks who are here!) But I could see it being useful to have some sort of “push this content to Twitter”. I’m not sure how that works with eleventy, and it’s possible there isn’t a convenient hook to do that. But it’d be cool to have that as an option. Maybe it’d be another bit of metadata in the header — if `post_to_twitter: true`, push it.

### Social?

>I’ve realized that one of the things that Tumblr did well was to give you a place to both create and consume. Twitter, too. Right now, this is just a place where I publish stuff. If I ever decide to make this more of a thing, it’d be helpful to have a place where I can read other people’s stuff, too. (I’ve always wondered why RSS readers don’t also give you a way to publish your own stuff. [Or maybe they do! Dunno!])

### Separating *my* instance of this from the tool to let you do it yourself

>When I wrote my two-times-ago blog, in Jekyll, a lot of people cloned it on GitHub, I believe to help them with a tagging issue that I solved. The problem was that I began to get worried about changing my blog (because it might mess up other peoples’ stuff?). That’s kind of silly. But if I ever do make this a more general-purpose tool for folks, I’ll want to figure out the best way to split them up. Very do-able; I just haven’t had to think through that piece yet.

## So.

So that’s where things are right now. It’s still fun, and I’m enjoying it. And I have a few clear ”next thing to work on”s.

If you have any feedback, let me know! My DMs on Twitter (@charliepark) are open, though I’m on a bit of a Twitter break at the moment. Nevertheless, say hi!