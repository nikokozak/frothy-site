---
title: "Build a Small Game"
weight: 8
description: "Turn display, input, and live redefinition into a tiny catch-the-dot game."
---

This tutorial builds a small game loop for the Froth Machine. A player moves a
cursor. A target appears on the grid. Touch the target to score and move it.

## State

Start with the values the game needs:

```froth
game.x is 0
game.y is 0
game.tx is 8
game.ty is 4
game.score is 0
```

## Movement

Read the joystick and wrap at the display edges:

```froth
game.move is fn [
  when joy.left?: [ set game.x to wrap: game.x - 1, grid.width ];
  when joy.right?: [ set game.x to wrap: game.x + 1, grid.width ];
  when joy.up?: [ set game.y to wrap: game.y - 1, grid.height ];
  when joy.down?: [ set game.y to wrap: game.y + 1, grid.height ]
]
```

## Target

Move the target to a random position:

```froth
game.placeTarget is fn [
  set game.tx to random.below: grid.width;
  set game.ty to random.below: grid.height
]
```

Check for a hit:

```froth
game.hit? is fn [
  (game.x == game.tx) and (game.y == game.ty)
]
```

## Draw

Draw the target and the player:

```froth
game.draw is fn [
  grid.clear:;
  grid.set: game.tx, game.ty, true;
  grid.set: game.x, game.y, true;
  grid.show:
]
```

## Frame

One frame reads input, checks rules, and draws:

```froth
game.frame is fn [
  game.move:;
  when game.hit?: [
    set game.score to game.score + 1;
    game.placeTarget:
  ];
  game.draw:
]
```

## Run

Seed randomness, initialize the display, and run:

```froth
game.run is fn [
  matrix.init:;
  matrix.brightness!: 1;
  random.seedFromMillis!:;
  game.placeTarget:;
  repeat 400 [
    game.frame:;
    ms: (clamp: 160 - (game.score * 8), 35, 160)
  ]
]
```

Start the game:

```froth
game.run:
```

## Change It Live

The first version draws player and target the same way. Redefine only
`game.draw` to make the target flash:

```froth
game.draw is fn [
  grid.clear:;
  when ((millis:) % 300) < 180 [
    grid.set: game.tx, game.ty, true
  ];
  grid.set: game.x, game.y, true;
  grid.show:
]
```

Run `game.run:` again. The rest of the game still calls the same stable
`game.draw` slot, so it picks up the new drawing behavior immediately.
