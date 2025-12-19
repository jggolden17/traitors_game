# Traitors 

A one-day project to make a simple app for the traitors game, for personal use only.

## Overview

A friend hosts "traitors" parties, inspried by the [bbc show](https://www.bbc.co.uk/iplayer/episodes/p0db9b2t/the-traitors), where we play a simple game. This repo is intended as a quick project for my day off, to create an app to better facilitate this game.

### Guide to the traitors game

* Starting with the names of $N$ players, the app randomly & silently selects 1 to be the traitor
* The app also silently chooses a _secret thing_ (e.g., _prison_, _Taylor Swift_, _gardening_)
* The app cycles through the $N$ players' names, and the phone is passed around. Privately each player sees _either_ the secret thing _or_ that they are the traitor
* Starting with the last player to have their status revealed, each player must publicly ask one other player a question about the secret thing:
    - questions/answers should signal to other players that you know the secret thing
    - but as questions/answers are public you can't be too obvious or the secret thing will be guessed by the traitor
* After 1 cycle of public Q&A there is a period of public discussion about who the traitor is, then a vote for who the group thinks the traitor is
* If the traitor is identified, they lose; otherwise a new round begins, optionally with a new secret


There are of course dozens of little adjustments that can be made, e.g. with >1 traitors, "shields" that let a traitor survive the first round of getting voted out, tracking across multiple rounds, etc. As this is all basically [Mafia](https://en.wikipedia.org/wiki/Mafia_(party_game)) with a twist, the optional roles from that game are relevant.

### Intial plan

I'd like to get a working version of this done in an hour or so. 
* for a simple v1 version, no need for a backend if I make some simplifications:
    - no user accounts / auth
    - a "session" is on a single phone that gets passed around, when you close the tab there is no memory
* I'll vibe-code the front-end, with react, vite, & Tailwind CSS
* Deploy in AWS for free, with a static react app artifact in S3 + CloudFront
    * will just use default url, no need for custom domain for use with friends, at least for v1
    * progressive web app to easily use on phone w/o going via app store


Specific implementation plan for V1 is [here](./docs/planning/v1_implementation_plan)

### Longer term extensions to project

I have several ideas for how to make this game more useable, that I might not implement immediately. Tracking these in [docs/planning/extension_ideas](./docs/planning/extension_ideas)

### Quick start

```bash
docker compose -f containerisation/docker-compose.yml up --build -d
```
