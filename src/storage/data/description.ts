import cfgSounds from "./cfgSounds";
import cfgIdentities from "./cfgIdentities";
import cfgMusic from "./cfgMusic";
import cfgRadio from "./cfgRadio";
import cfgSFX from "./cfgSFX";
import classesMemory from "./classesMemory";
import { weapons, magazines } from "./gear";
import { CHAR_TYPES } from "../types";

const params = {
  onLoadMission: CHAR_TYPES.STRING+'',
  onLoadMissionTime: true,
  onLoadIntro: CHAR_TYPES.STRING+'',
  onLoadIntroTime: true,
  briefing: true,
  debriefing: true,
  showHud: true,
  showCompass: true,
  showGPS: false,
  showMap: true,
  showWatch: true,
  minScore: CHAR_TYPES.NUMBER+'',
  avgScore: CHAR_TYPES.NUMBER+'',
  maxScore: CHAR_TYPES.NUMBER+'',
  respawn: CHAR_TYPES.STRING+'BIRD',
  respawnDelay: CHAR_TYPES.NUMBER+'0',
  disabledAI: false,
  aiKills: true,
  param1: {
    titleParam: CHAR_TYPES.STRING,
    defaultParam: CHAR_TYPES.NUMBER,
    array: [] as string[][]
  },
  param2: {
    titleParam: CHAR_TYPES.STRING,
    defaultParam: CHAR_TYPES.NUMBER,
    array: [] as string[][]
  },
}

const description = {
  params,
  cfgSounds,
  cfgMusic,
  cfgRadio,
  cfgSFX,
  cfgIdentities,
  weapons,
  magazines,
  classesMemory,
}

export default description;