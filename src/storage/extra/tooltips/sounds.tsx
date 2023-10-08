import { fileSound_explanation, pitch_explanation, soundKeepName_explanation, soundName_explanation, sound_explanation } from "./shared";

const titles = (
  <>
    titles shown when sound starts playing.<br/>
    titles are not shown if player is 100m away from from sound source<br/>
    table columns:<br/>
    time &mdash;&gt; sound time at which the text is displayed (2 = 2s after sound start)<br/>
    text &mdash;&gt; text displayed on the screen<br/>
    Inside 'time' you can use 'x' variable. It refers to row id.<br/>
    <br/>SOUND WILL LOOP UNTIL ALL TITLES WERE SHOWN!
  </>
)

const SOUNDS_TOOLTIPS = {
  className: <>Name to be used with "playSound" and "say" commands.</>,
  name: soundName_explanation,
  keepName: soundKeepName_explanation,
  filePath: fileSound_explanation,
  volume: sound_explanation,
  pitch: pitch_explanation,
  titlesFont: <>Sets font for displayed titles.</>,
  titlesSize: <>Sets size of of font for displayed titles. Works only if titlesFont was specified.</>,
  forceTitles: <>Makes titles display even if player has "options/difficulty/subtitles" disabled.</>,
  titles,
}

export default SOUNDS_TOOLTIPS;