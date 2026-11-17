const data = [{hanzi:'汉', meanings:['học','nghĩa 2']}] as const;
const unsafe = [{value: process.exit(88)}];
const mapped = [['你好','nǐhǎo']].map(() => { throw new Error('NEVER EXECUTE'); });
