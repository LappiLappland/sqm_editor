import { fileSound_explanation, pitch_explanation, soundKeepName_explanation, soundName_explanation, sound_explanation } from "./shared";

const RADIO_TOOLTIPS = {
  className: <>Name to be used with "vehicleRadio", "groupRadio", "sideRadio", "globalRadio" command.</>,
  name: soundName_explanation,
  keepName: soundKeepName_explanation,
  filePath: fileSound_explanation,
  volume: sound_explanation,
  pitch: pitch_explanation,
  title: <>Message displayed on the left bottom</>,
}

export default RADIO_TOOLTIPS;