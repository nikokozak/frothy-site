---
title: "Missions"
weight: 2
description: "Creative follow-on projects for the Froth Machine workshop."
---

Open the [workshop repo](https://github.com/nikokozak/froth-workshop). It has
four starter files for the creative segment:

- `drawing.froth`
- `life.froth`
- `snake.froth`
- `pong.froth`

Each file is a working sketch. Send one file to your board, run its command,
then extend it. Pick the one you want to spend time with.

## Mission 1: Drawing Toy

Use the joystick as a cursor and leave pixels behind.

### Start

Send `drawing.froth` to the board. Then run:

```froth
draw.run:
```

### What It Does

The cursor starts near the center of the display. Each frame stores a pixel at
the cursor position, then blinks the cursor. Movement wraps at the edges, so
you can keep drawing without leaving the board.

### Try First

Make the right knob control drawing speed:

```froth
to draw.frame [
  draw.update:;
  draw.draw:;
  ms: (map: knob.right:, 0, 100, 180, 20)
]
```

Re-send the file and run `draw.run:`. Turn the right knob. The cursor should
move slower at one end and faster at the other.

### More Ideas

- Add erase mode. Use `joy.click?:`, a `draw.erase?` value, and `grid.set:`
  with `false`. Change `draw.run` if click should no longer stop the sketch.
- Mirror every pixel across the center. Use `grid.width`, `draw.x`, and
  `grid.set:`.
- Define a `draw.stamp:` word that draws a small shape at the cursor. Use
  `grid.set:` or `matrix.fillRect:`.
- Add spray brush. Use `random.below:` to place nearby pixels around
  `draw.x` and `draw.y`.
- Animate the whole drawing. Try `tm1629.shiftLeft:`, `tm1629.shiftRight:`,
  or `tm1629.invert:`.

## Mission 2: Life Garden

Paint cells with the joystick, then watch the pattern evolve.

### Start

Send `life.froth` to the board. Then run:

```froth
life.run:
```

### What It Does

The sketch has two modes. In paint mode, the joystick moves a blinking cursor
and click toggles a cell. In run mode, the board advances Conway's Life with
`tm1629.lifeStep:`.

### Try First

Seed a random garden during setup:

```froth
to life.scatter with count [
  repeat count [
    grid.set:
      (random.below: grid.width),
      (random.below: grid.height),
      true
  ];
  grid.show:
]

to life.setup [
  matrix.init:;
  matrix.brightness!: 1;
  random.seedFromMillis!:;
  grid.clear:;
  life.scatter: 20
]
```

Re-send the file and run `life.run:`. The board should start with random live
cells before you switch into run mode.

### More Ideas

- Add a glider stamp. Define `life.glider:` and place a known Life pattern
  with `grid.set:` near `life.x` and `life.y`.
- Change the rules. Inspect `show @tm1629._lifeRule`, then redefine it with a
  different neighbor rule.
- Tie speed to population. Count live cells with `tm1629.pixel@:`, then choose
  the delay with `map:` or `clamp:`.
- Save interesting states. Use `save` after painting, then `restore` to replay
  a state with different timing.
- Make a hybrid mode. Keep reading the joystick while calling
  `tm1629.lifeStep:` so you can paint into a running garden.

## Mission 3: Snake

Steer the snake, eat food, grow, and avoid your own body.

### Start

Send `snake.froth` to the board. Then run:

```froth
snake.run:
```

### What It Does

The joystick controls direction. The snake wraps around the edges, grows when
it eats food, and resets if it hits itself. The left knob controls frame speed
in the starter file.

### Try First

Make the snake speed up as it grows:

```froth
to snake.frame [
  snake.update:;
  snake.draw:;
  ms: (clamp: 300 - (snake.len * 12), 60, 300)
]
```

Re-send the file and run `snake.run:`. After several food pickups, movement
should be faster than it was at the start.

### More Ideas

- Add wall death. Replace `wrap:` in `snake.update` with a bounds check
  against `grid.width` and `grid.height`.
- Flash the score moment. When food is eaten, use `grid.fill:`, `grid.show:`,
  and a short `ms:` delay.
- Add obstacles. Store wall positions in `cells`, draw them with `grid.set:`,
  and check them during `snake.update`.
- Add a second food type that shrinks the snake. Use `random.below:` for its
  position and `max:` when reducing `snake.len`.
- Add AI mode. Define a word that compares `snake.food` to the head position
  with `snake.x:` and `snake.y:`, then chooses a direction.

## Mission 4: Pong Hack

Inspect the built-in Pong program, then change selected parts of it.

### Start

Send `pong.froth` to the board. Then run:

```froth
pong.run:
```

### What It Does

The board already has Pong in its base image. This file changes the paddle
height, ball speed, and drawing word. It also adds a dotted center line, then
uses the built-in setup and run loop.

### Orient Yourself

Use `show` before you change more:

```froth
show @demo.pong.advanceBall
show @demo.pong.draw
show @demo.pong.update
show @demo.pong.readPaddles
```

This mission is about reading a larger program and changing one part at a
time.

### Try First

Make the paddles shorter and the ball faster:

```froth
set demo.pong.paddleHeight to 3
set demo.pong.maxPaddleTop to grid.height - demo.pong.paddleHeight
set demo.pong.ballStepMs to 60
```

Run `pong.run:` again. The paddles should be shorter, and the ball should move
faster.

### More Ideas

- Change ball physics. Redefine `demo.pong.advanceBall` so the ball
  accelerates or bounces at different angles.
- Add a second ball. Track another pair of ball coordinates and update both
  in `demo.pong.advanceBall`.
- Flash on score. Inspect `show @demo.pong.update`, then add a brief
  `grid.fill:` and `grid.show:` when a point is scored.
- Add a center obstacle. Draw it in `demo.pong.draw`, then include it in the
  bounce logic.
- Add an AI paddle. Redefine `demo.pong.readPaddles` so one paddle tracks
  `demo.pong.ballY`.
