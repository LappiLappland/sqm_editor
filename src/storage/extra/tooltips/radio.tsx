import { soundName_explanation, soundKeepName_explanation, fileSound_explanation, sound_explanation, pitch_explanation } from "./shared";

const RADIO_TOOLTIPS = {
  className: <>Name to be used with &quot;vehicleRadio&quot;, &quot;groupRadio&quot;, &quot;sideRadio&quot;, &quot;globalRadio&quot; command.</>,
  name: soundName_explanation,
  keepName: soundKeepName_explanation,
  filePath: fileSound_explanation,
  volume: sound_explanation,
  pitch: pitch_explanation,
  title: <>Message displayed on the left bottom</>,
};

export default RADIO_TOOLTIPS;