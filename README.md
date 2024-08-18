# rotating text bookmarklet

writing a bookmarklet to beat [Navattic's challenge](https://www.navattic.com/careers/tasks/rotating-text) on **hard mode**

## write-up

### bookmarklets

not super familiar with how bookmarklets run, but turns out it is just some javascript you can store as a bookmark and you click on it to load the script in.

found a github gist with a sample bookmarklet that changes the body background to pink and tried it out on google.com. This one is saved in pinker.js.

### Hard Mode

used `MutationObservers` a few times and know they are good candidates for executing a callback when something changes. also not being able to use `setInterval` felt like a hint and made me think this was the right direction.

started off just trying to observe the values as they came in by printing the values of the children of the div that contained the text. wasn't super familiar with `MutationRecords`, but did some digging to learn more about them

for note-taking:

- attribute mutation
- characterdata mutation (essentially just change to text content)
- childlist if mutation was for change to tree of nodes

we obviously want to monitor changes in characterdata, and we care about element nodes (`div` and `span` are elements)

i was able to print most of them, but then i found that **hard mode** uses a `ShadowRoot`, which I knew nothing about. it essentially seems like a way to encapusalte code and make it "private"

this makes things difficult because i cant see when the text is "spicy". turns out we can see the shadow root of an element, and can mount an observer on that [instead](https://medium.com/israeli-tech-radar/inspecting-the-shadows-the-secrets-of-shadow-doms-00d0fd2366d2).

so in my original mutation observer, if the mutated node has a shadow root, i mount a new `MutationObserver` with a separate callback. this callback is the one that does the actual swapping

i got a bit stuck writing this callback, because just setting the `nodeValue` of the basically caused an infinite loop. my hypothesis is that setting the value triggers a mutation itself and we are stuck in an endless loop. my fix was to first disconnect the observer, set the content, and then reconnect the observer. (btw, i see that expert mode does this in the source code. is it intentional for it to enter this infinite loop when it sees "demo"? is that the challenge of expert mode?)

finally, we need to decrypt the word "demo" as it appears. i've been a bit lazy and basically assume any 5 letter word that starts with s is just going to be "spicy". if it is, i check to see how many letters are showing, and map through the word "demo" and see if i should show the original character, or one of the characters in "demo". i also had issues here, because my logic was essentially:

```
if the character at the same index in the matched word is in the alphabet, swap it with the right one in "demo"
```

but for some reason, the "i" would fail this check, and i was left with "deio". i just inversed the logic so i check to see if its not in the alphabet and keep it

### normal mode

going back to normal mode, the difference is that "spicy" is not attached using the shadow dom

i just added the `MutationObserver` on anyways, instead of if its just a shadow root, and did some refactoring to make certain callbacks do something on `characterData` records only.

i also noticed that the bookmarklet breaks if you ever switch from easy to **hard mode**. i likely have the first mutation wrong, and it needs to be higher up in the DOM tree because maybe the original element i am observing goes away. sorry!

### expert mode

i couldn't figure it out. i left a note above, but every time the page sees demo, it freezes. i think its due to the reason i had to disconnect the `MutationObserver` and reconnect. if thats part of the challenge, would love to know how to solve it
