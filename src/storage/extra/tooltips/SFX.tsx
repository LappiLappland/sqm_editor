import { fileSound_explanation, pitch_explanation, soundKeepName_explanation, soundName_explanation, sound_explanation } from "./shared";

const sounds = (
  <>
    CfgSFX class is used to configure repeating and random sound effects with range of parameters.<br/>
    table columns:<br/>
    filePath &mdash;&gt; path to the file<br/>
    volume &mdash;&gt; volume of the sound<br/>
    pitch &mdash;&gt; pitch of the sound<br/>
    % &mdash;&gt; how often the sound is chosen randomly. Range (0-1)<br/>
    min, mid, max &mdash;&gt; time to wait before playing next sound (or the same sound in the loop).<br/>
  </>
)

const SFX_TOOLTIPS = {
  className: <>Unique name.</>,
  name: soundName_explanation,
  keepName: soundKeepName_explanation,
  sounds,
}

export default SFX_TOOLTIPS;