import { CHAR_TYPES } from "../types";

export interface MusicClass {
  className: string,
  name: string,
  keepName: boolean,
  filePath: string,
  volume: string,
  pitch: string,
}

export function createMusicClass(): MusicClass {
  return {
    className: CHAR_TYPES.STRING+'newMusic',
    name: CHAR_TYPES.STRING+'',
    keepName: false,
    filePath: CHAR_TYPES.STRING+'',
    volume: CHAR_TYPES.NUMBER+'',
    pitch: CHAR_TYPES.NUMBER+'',
  };
}

export function generateMusicClass(example: MusicClass): MusicClass {
  return {
    className: CHAR_TYPES.STRING+example.className,
    name: CHAR_TYPES.STRING+example.name,
    keepName: false,
    filePath: CHAR_TYPES.STRING+example.filePath,
    volume: CHAR_TYPES.NUMBER+example.volume,
    pitch: CHAR_TYPES.NUMBER+example.pitch,
  };
}


const cfgMusic: MusicClass[] = [];

export default cfgMusic;