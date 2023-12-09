import { fileSound_explanation, pitch_explanation, soundKeepName_explanation, soundName_explanation, sound_explanation } from "./shared";

const MUSIC_TOOLTIPS = {
  className: <>Name to be used with &quot;playMusic&quot; command.</>,
  name: soundName_explanation,
  keepName: soundKeepName_explanation,
  filePath: fileSound_explanation,
  volume: sound_explanation,
  pitch: pitch_explanation,
};

export default MUSIC_TOOLTIPS;