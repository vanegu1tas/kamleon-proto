# Product Requirements Document

| | |
|---|---|
| **Product** | Recommendation Engine — Phase 0 (interactive prototype) |
| **Version** | v0.1 |
| **Author** | Daniel Vanegas |
| **Date** | September 18, 2026 |
| **Status** | Draft |

---

## 1. Overview

### Problem statement

Today a player uses a Kamleon unit, gets a hydration score, and the flow ends there. The score tells them how they are, but not **what to do about it**.

### Product vision

Turn the hydration score into an immediate, personalized action: how much to drink and what to drink, on the same screen, in the seconds the player is already standing there. To do that we will build an interactive prototype in the browser, shareable through a link, so the CEO can validate the pilot with the performance and nutrition staff of the Dallas Cowboys.

### Reference: the Gatorade engine

Gatorade already has one, built with Smart Design and two years of testing with athletes.

Link: https://smartdesignworldwide.com/projects/gatorade-hydration-system-2/

### Success metrics

Phase 0 is a validation prototype. **Proposal to discuss in the meeting:** this is what would have to happen for it to be considered validated.

- **Comprehension:**
  The player can say how much they have to drink within 5 seconds of the screen appearing, with no prior explanation.

- **Recall:**
  The player can name the recommended product after the screen is gone.

---

## 2. Users

### Primary users

**The player:** standing in front of the unit's screen. A few seconds of attention, hands busy, possibly someone waiting behind.

**Staff:** they are the ones validating in Phase 0 that the recommendation is clinically correct.

### User goals

- **Player:** know how much to drink and what to drink, without doing any math or reading a paragraph.
- Trust that the recommendation is meant for them specifically, not a generic message.

### Pain points

- The score leaves the player with a number and no action to take with it.
- Generic advice ignores body weight, hydration status and the weather of that day.

---

## 3. Features and requirements

### Must have

- **How much to drink** — personalized for each player: it depends on their hydration status, their body weight and the weather of the day. The screen communicates it so that it is understood without doing any math; how it is represented (number, container, proportion) is defined during design exploration. **(To be defined: which unit it is shown in — question 1)**

- **Product recommendation** — Gatorade ready-to-drink catalogue, based on hydration status.

- **A/B testing:** **(To be defined: whether both are tested — question 4)**
  Designs for a sequential structure: score first, then recommendation.
  Simultaneous design: both on one screen.

- **Prototype** — runs in the browser and is shared through a link so it can be tested easily.

  If it is to be tested on a physical screen, implementation time has to be taken into account.

---

## 4. User stories

- As a **player**, I want to see how much to drink right after my score, so that I know what to do without asking anyone.
- As a **player**, I want to see the amount compared to a bottle I recognize, so that I do not have to do any math.
- As a **player**, I want to be told which Gatorade product matches my status, so that I pick the right one.
- As a **staff member**, I want my players to always be well hydrated.
- As a **staff member**, I want the recommendation to use the player's body weight and the conditions of the day, so that I can trust it as my own advice.

---

## 5. Out of scope

The following will **not** be part of this version:

- **Timing recommendation** ("when should I drink?"): it is out because we would need training or pre-training information.
- **Engine configuration screens in the web app.**
- **Connected weather API:** weather is simulated using the real logic.
- **Products outside the Gatorade ready-to-drink catalogue.**
- **Backend logic and integrations:** Phase 0 validates the interface first, on purpose.
- **3D product bottles:** evaluated and deferred to a separate spike after the demo.

---

## 6. Timeline

Design and implementation work, on top of the screen flow that already exists.

| # | Task | Days |
|---|---|---|
| 1 | Update the score screen in the prototype (the base for everything else) | 1 – 2 |
| 2 | Explorations of the **sequential** proposal | 2 – 3 |
| 3 | Presentation to business (they take it to the client) and corrections | 1.5 |
| 4 | Explorations of the **simultaneous** proposal | 2 – 3 |
| 5 | Implement the designs in the prototype | 2 – 3 |
| 6 | Motion polish | 1 – 2 |
| 7 | Buffer to refine the prototype | 1 – 2 |
| | **Total** | **10.5 – 16.5 days** |

**Dependencies:**
- Task 1 blocks everything else: without the updated score there is no base to build on.

---

## 7. Open questions

**Blocking the build**

1. **Units:** ounces, millilitres or "bottles"? Proposal: ounces as the primary unit, since the users are based in the US, and millilitres in the web app for staff. Bottles are the most concrete option for a player, but they only work if there is a single container size.

2. **Weather API** — does it already exist, and at what precision (stadium or city)? Should we show the weather information, mention it, or is it internal data we only use for the recommendation?

**About the A/B test**

3. **Who takes part** — staff in a room or players at the facility? The second gives a much better answer and requires the physical screen, coordination and permissions.
4. **Proposals** — are we testing both? That is, do they want two prototype proposals?

**About the product, not the prototype**

5. **Stock** — will the recommended drink be available when the player walks out? If not, the recommendation creates frustration.
6. **Configuration** — who switches the recommendation engine on and off? Can staff edit the catalogue or the factors?
