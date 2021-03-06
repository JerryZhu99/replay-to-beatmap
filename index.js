const { Beatmap, Vector2, HitType, HitSound } = require('osu-bpdpc');
const osuReplayParser = require('osureplayparser');
const { promises: fs } = require('fs');
const path = require('path');

(async () => {
  const beatmapPath = process.argv[2];
  const replayPath = process.argv[3];

  const beatmap = Beatmap.fromOsu(await fs.readFile(beatmapPath, { encoding: 'utf-8' }));
  const replay = osuReplayParser.parseReplay(replayPath);
  const { replay_data: replayData, playerName } = replay;

  const { Artist, Title, Creator, Version } = beatmap.Metadata
  const outputFilename = `${Artist} - ${Title} (${Creator}) [${Version} played by ${playerName}].osu`
  const outputPath = path.join('output', outputFilename)

  beatmap.Metadata.Version = `${Version} played by ${playerName}`;
  const keyCount = beatmap.Difficulty.CircleSize;
  const keys = new Array().fill(false);

  const newObjects = [];

  const createObject = (time, column) => ({
    pos: new Vector2(column * 512 / keyCount, 128),
    startTime: Math.round(time),
    hitType: HitType.Normal,
    hitSound: HitSound.Normal,
    extras: {
      sampleSet: 0,
      additionSet: 0,
      customIndex: 0,
      sampleVolume: 0,
      filename: 'none.wav',
    }
  })
  let currentTime = 0;
  for (let i = 0; i < replayData.length; i++) {
    let { keysPressed, timeSinceLastAction } = replayData[i];
    currentTime += timeSinceLastAction;
    for (let j = 0; j < keyCount; j++) {
      if (keysPressed[`Key${j + 1}`] && !keys[j]) {
        newObjects.push(createObject(currentTime, j));
      }
      keys[j] = keysPressed[`Key${j + 1}`];
    }
  }
  beatmap.HitObjects = newObjects;

  fs.writeFile(outputPath, beatmap.toOsu());
  console.log(`Created file ${outputPath}`);
})();

