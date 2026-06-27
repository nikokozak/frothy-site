---
title: "The Broken Beacon"
weight: 1
description: "Inspect, repair, save, and recover the workshop puzzle words baked into the Frothy Machine."
---

This activity assumes you have:

- the Frothy CLI installed (`frothy doctor` passes)
- the Frothy VS Code extension
- a preflashed Frothy Machine plugged in and connected

If you have not connected yet, start with [First steps](/machine/first-steps/).

The board has a set of words called `puzzle.*` baked into its base image. They
are supposed to work together to display a signal pattern on the LED matrix.

They do not work. Each one is broken in a different way.

Your job: figure out what each piece is supposed to do, fix it, and get the
full signal working. The tools you need are `words`, `show`, `info`, `set`,
and `to`.

## Stage 1: What Is Here?

Type `words` at the prompt. Scan the output for names you have not seen
before.

You should find eight names starting with `puzzle.`:

- `puzzle.x`
- `puzzle.y`
- `puzzle.dot`
- `puzzle.frame`
- `puzzle.top`
- `puzzle.bottom`
- `puzzle.scene`
- `puzzle.reveal`

<details>
<summary>Hint</summary>

Type `words` and press enter. The output is grouped by origin. Look past the
familiar `grid.*` and `matrix.*` families.

</details>

## Stage 2: What Does It Do?

Pick one of the puzzle words and inspect it before calling it.

```frothy
show @puzzle.dot
```

Read the definition. Predict what will happen. Then call it:

```frothy
puzzle.dot:
```

A pixel should appear at position (5, 3). That is because `puzzle.dot` reads
two values, `puzzle.x` and `puzzle.y`, and lights the pixel at that position.

You can also check metadata:

```frothy
info @puzzle.dot
```

<details>
<summary>Hint</summary>

`show @name` prints the reconstructed definition. `info @name` prints the
value class, arity, and origin of a binding. Try both.

</details>

## Stage 3: Can You Move The Dot?

The dot appeared at (5, 3) because that is where `puzzle.x` and `puzzle.y`
point. Change them:

```frothy
puzzle.x
set puzzle.x to 10
puzzle.dot:
```

The dot should move to (10, 3).

## Stage 4: Fix A Broken Function

Call `puzzle.frame:`. You should see a single pixel at (0, 0). That is not
what it is supposed to do.

Inspect it:

```frothy
show @puzzle.frame
```

The definition only sets one pixel and does not clear the screen first. It is
supposed to draw a border rectangle around the full display.

Fix it by redefining the word:

```frothy
to puzzle.frame [
  grid.clear:;
  grid.rect: 0, 0, grid.width, grid.height, true;
  grid.show:
]
```

Call `puzzle.frame:` again. You should see a 12x8 border rectangle.

<details>
<summary>Answer</summary>

```frothy
to puzzle.frame [ grid.clear:; grid.rect: 0, 0, grid.width, grid.height, true; grid.show: ]
```

</details>

## Stage 5: Fix A Chain Of Three Functions

Call `puzzle.scene:`. Nothing visible happens.

This is the core puzzle. Three things are broken at once, and you need to fix
all three before `puzzle.scene:` works.

Start by inspecting the chain:

```frothy
show @puzzle.scene
show @puzzle.top
show @puzzle.bottom
```

What you will find:

- `puzzle.scene` calls `puzzle.top:` and then `puzzle.bottom:`, but it does not
  clear the screen before drawing or show the result after
- `puzzle.top` fills the entire screen instead of just the top half
- `puzzle.bottom` does nothing at all

The fix is iterative. Start with `puzzle.scene` so you can see something on the
display, then fix the other two:

```frothy
to puzzle.scene [ grid.clear:; puzzle.top:; puzzle.bottom:; grid.show: ]
```

Call `puzzle.scene:`. You should see the full screen filled. That is the
broken `puzzle.top` overshooting. Fix it to fill only the top three rows:

```frothy
to puzzle.top [ matrix.fillRect: 0, 0, grid.width, 3, true ]
```

Call `puzzle.scene:` again. A filled band appears across the top. Now fix
`puzzle.bottom` to fill the bottom three rows:

```frothy
to puzzle.bottom [ matrix.fillRect: 0, 5, grid.width, 3, true ]
```

Call `puzzle.scene:`. You should see two filled bands with a dark gap in the
middle.

<details>
<summary>Answer</summary>

```frothy
to puzzle.scene [ grid.clear:; puzzle.top:; puzzle.bottom:; grid.show: ]
to puzzle.top [ matrix.fillRect: 0, 0, grid.width, 3, true ]
to puzzle.bottom [ matrix.fillRect: 0, 5, grid.width, 3, true ]
```

</details>

## Stage 6: Wire It To A Knob

Call `puzzle.reveal:`. You should see a filled bar 3 pixels wide on the left
side of the screen. Twist the left knob and call it again. Same bar.

Inspect it:

```frothy
show @puzzle.reveal
```

The width is hardcoded to 3. Make it respond to the left knob instead.

First, find out what the knob returns:

```frothy
knob.left:
```

Twist the knob and try again. It returns a value between 0 and 100.

Now redefine `puzzle.reveal` so the bar width tracks the knob:

```frothy
to puzzle.reveal [
  grid.clear:;
  grid.rect: 0, 0, (knob.left: * grid.width / 100), grid.height, true;
  grid.show:
]
```

Call `puzzle.reveal:`, twist the knob, call it again. The bar should change
width.

<details>
<summary>Answer</summary>

```frothy
to puzzle.reveal [ grid.clear:; grid.rect: 0, 0, (knob.left: * grid.width / 100), grid.height, true; grid.show: ]
```

</details>

## Stage 7: Save Your Work

Type `save`. Your fixes are now stored on the board.

Type `restore`. Everything should still work. The board reloaded your saved
overlay.

## Stage 8: Break Something And Recover

Intentionally break one of your fixes:

```frothy
to puzzle.scene [ grid.clear:; grid.show: ]
puzzle.scene:
```

The screen goes blank. Your pattern is gone. Now recover:

```frothy
restore
puzzle.scene:
```

The two bands are back. The board returned to your last saved state.

If you had never saved, or your save is also broken, there is a harder reset:

```frothy
dangerous.wipe
```

That clears your live overlay and saved snapshot. The board returns to its
base image. Your fixes are gone, but base-image words like `grid.*`,
`matrix.*`, and `puzzle.*` survive. The puzzle words return to their original
broken state, so you can start over.

Next: [Missions](/workshop/missions/).

