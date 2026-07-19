---
title: "Power"
weight: 11
url: /reference/modules/power/
description: "Supervise a live program with the watchdog and cold-boot after timed or GPIO-triggered deep sleep."
icon: battery-charging
tags: [power, watchdog, sleep]
---

Power words cover two distinct jobs: reset a program that stops making
progress, or put the chip into deep sleep and cold-boot it later.

## Arm And Feed The Watchdog

```frothy
watchdog.arm: 5000

forever [
  -- do one bounded unit of useful work
  watchdog.feed:
  ms: 1000
]
```

| Word | Result | Use |
| --- | --- | --- |
| [`watchdog.arm`](/reference/words/#watchdog-arm) | `nil` | Arm or re-arm with a 1000–60000 ms timeout |
| [`watchdog.feed`](/reference/words/#watchdog-feed) | `nil` | Restart the window of an armed watchdog |
| [`sleep.wake-on-gpio`](/reference/words/#sleep-wake-on-gpio) | `nil` | Configure an ext0 wake level for the next sleep |
| [`sleep.deep`](/reference/words/#sleep-deep) | `nil` | Enter timed deep sleep and cold-boot on wake |

Feeding before `watchdog.arm` is an error. Re-arming replaces the timeout and
starts a new window immediately. Put feeds after demonstrated progress, not in
a loop that could continue while the real work is stuck.

## Timed Deep Sleep

```frothy
sleep.deep: 60000
```

The duration is a nonnegative number of milliseconds. The call normally does
not return on hardware: wake restarts the chip, restores the saved image, and
runs `boot` as a cold boot. Save required durable state before sleeping.

## GPIO Wake

Configure wake for the next `sleep.deep` call:

```frothy
sleep.wake-on-gpio: $boot_button, 0
sleep.deep: 3600000
```

The level must be `0` or `1`, and the selected pin must support the target's
ext0 deep-sleep wake mechanism. The wake configuration is pending state for the
next sleep, not a persistent event handler. The same sleep can wake because the
timer expires or the configured pin reaches the requested level.

Deep sleep is not `ms`: it tears down live handles and runtime state. Reopen
peripherals in `boot`, and design the boot path so a permanently asserted wake
pin does not create a rapid sleep/wake loop.
