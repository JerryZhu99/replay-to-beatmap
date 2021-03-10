const crypto = require('crypto');
const { promises: fs } = require('fs');
const osr = require('node-osr');
const path = require('path');

(async () => {
  const replay = osr.readSync(process.argv[2])
  const beatmap = await fs.readFile(process.argv[3], { encoding: 'utf-8' })

  replay.replay_data = replay.replay_data
    .split(',')
    .map(e => e.split('|'))
    .filter(([time]) => time > 0)
    .map(([time, x, y, ...pressed]) => (time > 0 ? [time, x | x << 4, y, ...pressed] : [time, x, y, ...pressed]))
    .map(e => e.join('|'))
    .join(',');

  const hash = crypto.createHash('md5').update(beatmap).digest('hex');

  replay.mods |= 33554432; // Co-op
  replay.beatmapMD5 = hash;
  replay.replayMD5 = '';
  replay.unknown = 0

  replay.writeSync(path.join('output', path.basename(process.argv[2])));
})();