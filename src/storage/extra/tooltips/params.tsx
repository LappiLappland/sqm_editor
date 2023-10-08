
const showHud = (
  <>Hides these elements of hud:
    <ul>
      <li>Unit info</li>
      <li>Tank directions</li>
      <li>Top right menu</li>
      <li>Group info bar</li>
      <li>Tactical display</li>
      <li>Cloak when spotting enemies</li>
    </ul>
  </>
)

const param = (
  <>
    param1 and param2 are multiplayer options that can be seen in the multiplayer lobby.<br/>
    table columns:<br/>
    id &mdash;&gt; row id<br/>
    text &mdash;&gt; text displayed inside lobby<br/>
    value &mdash;&gt; value stored inside variable<br/>
    <br/>Inside 'value' you can use 'x' variable. It refers to row id.
  </>
)

const scoreInfo = <><br/><br/>Formula:<br/>Less than avg: 3 * (score - avgScore) / (avgScore - minScore)<br/>More than avg: 4 * (score - avgScore) / (maxScore - avgScore)<br/>You can get max of 3 crosses (negative score) or 4 stars (positive score).</>

const PARAMS_TOOLTIPS = {
  onLoadMission: <>Displays a message while the mission is loading.<br/>It has NO EFFECT on displayed name in MP game. BIS wiki seems to be wrong about this!</>,
  onLoadMissionTime: <>Define whether you will see the time and date displayed while the mission loads.</>,
  onLoadIntro: <>Displays a message while the intro is loading.</>,
  onLoadIntroTime: <>Define whether you will see the time and date displayed while the intro loads.</>,
  briefing: <>Skip briefing screen for SP missions. No effect in MP</>,
  debriefing: <>Skip debriefing screen for SP missions. No effect in MP</>,
  showHud,
  showCompass: <>Defines if the compass is visible.</>,
  showGPS: <>Defines if the GPS is visible.</>,
  showMap: <>Defines if the showMap is visible.</>,
  showWatch: <>Defines if the showWatch is visible.</>,
  maxScore: <>Required score to get all 4 stars.{scoreInfo}</>,
  avgScore: <>Required score to get 0 stars.{scoreInfo}</>,
  minScore: <>Required score to get all 3 crosses.{scoreInfo}</>,
  respawn: <>Unused</>,
  respawnDelay: <>Set respawn delay in seconds.</>,
  disabledAI: <>In MP forbids bots on slots inside lobby. In SP has no effect.</>,
  aiKills: <>Enables AI units score to appear in score table.</>,
  titleParam: <>Title for param.<br/>It has to be filled for param to appear! (You can put space to make it appear blank)</>,
  param
}

export default PARAMS_TOOLTIPS;