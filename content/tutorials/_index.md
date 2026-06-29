---
title: "Tutorials"
weight: 2
description: "Small task-shaped paths for learning Frothy on an ESP32."
---

Tutorials are for doing one thing end to end. The guide explains the mental model. The reference gives exact behavior. These pages start with a visible goal and stay close to the board.

## First Sketches

- [Blink an LED](/tutorials/blink-an-led/) proves that the board, serial port, and live prompt are working.
- [Interactive Workflow](/tutorials/interactive-workflow/) shows the loop: change a small word, run it, inspect it, change it again.

## Input

- [Read a Button](/tutorials/read-a-button/) turns a digital input into a useful boolean.
- [Read a Sensor](/tutorials/read-a-sensor/) reads an analog pin and maps it into behavior.

## Motion

- [Fade an LED](/tutorials/fade-an-led/) uses PWM/LEDC for brightness.
- [Drive a Servo](/tutorials/drive-a-servo/) wraps servo pulse timing in readable Frothy words.

## Language Practice

- [Build a Calculator](/tutorials/build-a-calculator/) practices named state and operations without wiring more hardware.
- [Advent of Code: Safe Dial](/tutorials/advent-of-code-safe-dial/) and [Advent of Code: Grid Scan](/tutorials/advent-of-code-grid-scan/) are small algorithm exercises.

Frothy is early. If a tutorial says a hardware surface is advanced, take that seriously: start with the LED, button, and ADC paths first.
