
const crypto = require('crypto');
const { promises: fs } = require('fs');

(async () => {
  const file1 = await fs.readFile(process.argv[2], { encoding: 'utf-8' })
  const file2 = await fs.readFile(process.argv[3], { encoding: 'utf-8' })

  const lines1 = file1.split('\n');
  const lines2 = file2.split('\n');

  const objectIndex1 = lines1.findIndex(e => e.includes('HitObjects'));
  const objectIndex2 = lines2.findIndex(e => e.includes('HitObjects'));

  let objects1 = lines1.slice(objectIndex1 + 1)
    .filter(e => e.trim())
    .map(e => e.split(','))
    .map(([x, y, t, ...rest]) => [Math.floor(x / 2), y, t, ...rest])
    .map(e => e.join(','));

  let objects2 = lines2.slice(objectIndex2 + 1)
    .filter(e => e.trim())
    .map(e => e.split(','))
    .map(([x, y, t, ...rest]) => [Math.floor(x / 2) + 256, y, t, ...rest])
    .map(e => e.join(','));

  objects = [...objects1, ...objects2]
    .map(e => e.split(','))
    .sort(([x1, y1, t1], [x2, y2, t2]) => t1 - t2)
    .map(e => e.join(','));

  let rest = lines1.slice(0, objectIndex1 + 1);

  rest[rest.findIndex(e => e.includes('CircleSize'))] = 'CircleSize: 8';

  const output = [...rest, ...objects].join('\n');

  await fs.writeFile(`output/out.osu`, output);

})();