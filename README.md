# replay-to-beatmap

A collection of scripts to convert replays into beatmaps.

## Requirements

These scripts have been tested to work on
- Node.js v12.18.3
- npm 6.10.1

## Setup

Run `npm install` in the project directory to install required dependencies.

Create a folder named `output` in the project directory. This is where generated replays and maps will be placed.

## Usage

### Convert a replay to a beatmap

You need the original .osu the replay was for, as well as the .osr file.

Run
```
node . <input .osu file> <input .osr file>
```
e.g.
```
node . "Colorful Sounds Port - ETERNAL DRAIN (Wh1teh) [Eternal].osu" "Player0 - Colorful Sounds Port - ETERNAL DRAIN [Eternal] (2021-02-25) OsuMania.osr"
```

This will generate a .osu file containing notes corresponding to a keypress in the output folder.

You can copy this into the original mapset folder and refresh to view the map.

### Compare a replay to the original beatmap

Follow the steps above.
Run
```
node mergeBeatmaps.js <generated .osu file> <input .osu file>
```
e.g.
```
node mergeBeatmaps.js "Colorful Sounds Port - ETERNAL DRAIN (Wh1teh) [Eternal by Player0].osu" "Colorful Sounds Port - ETERNAL DRAIN (Wh1teh) [Eternal].osu"
```

This will create a file in the output folder named `out.osu`. Copy this to the original map folder and refresh.

Then run 
```
node doubleReplay.js <input .osr file> output/out.osu 
```
e.g.
```
node doubleReplay.js "Player0 - Colorful Sounds Port - ETERNAL DRAIN [Eternal] (2021-02-25) OsuMania" output/out.osu
```
This will create a .osr file in the output folder with the same name as the original replay file.

You can now view the generated replay.

## Limitations

- This tool only supports 4K.
- This tool does not create any LNs.



