import '../../styles/forms.scss';
import '../../styles/description.scss';
import DescriptionSidebar from './components/sidebar';
import FormInputText from '../../components/forms/FormInputText';
import FormInputSwitch from '../../components/forms/FormInputSwitch';
import FormInputRadioBox from '../../components/forms/FormInputRadioBox';
import { DynamicTable } from '../../components/forms/DynamicTable';
import useTooltip, { assignTooltip } from '../../hooks/useTooltip';
import TooltipWindow from '../../components/TooltipWindow';
import { getStorage, storageChangeValue } from '../../storage/storage';
import { RESPAWN_OPTIONS } from '../../storage/extra/respawns';
import PARAMS_TOOLTIPS from '../../storage/extra/tooltips/params';
import TopBar from '../../components/TopBar';

export default function DescriptionPage() {

  const [tooltipState, assignTooltip] = useTooltip();

  const initialState = getStorage().description.params;

  return (
    <>
      <TopBar></TopBar>
      <div className="desc-shared desc-options">
        <DescriptionSidebar />
        <main>
          <TooltipWindow
            state={tooltipState}
            className="form-tooltip"
          />
          <form>
            <div className="fields-group">
              <fieldset>
                <h2>Mission information</h2>
                <FormInputText
                  tooltip={assignTooltip(PARAMS_TOOLTIPS.onLoadMission)}
                  storagePath={'description/params/onLoadMission'}
                  value={initialState.onLoadMission}
                  name="onLoadMission"/>
                <FormInputSwitch
                  tooltip={assignTooltip(PARAMS_TOOLTIPS.onLoadMissionTime)}
                  storagePath={'description/params/onLoadMissionTime'}
                  value={initialState.onLoadMissionTime}
                  name="onLoadMissionTime"/>
                <FormInputText
                  tooltip={assignTooltip(PARAMS_TOOLTIPS.onLoadIntro)}
                  storagePath={'description/params/onLoadIntro'}
                  value={initialState.onLoadIntro}
                  name="onLoadIntro"/>
                <FormInputSwitch
                  tooltip={assignTooltip(PARAMS_TOOLTIPS.onLoadIntroTime)}
                  storagePath={'description/params/onLoadIntroTime'}
                  value={initialState.onLoadIntroTime}
                  name="onLoadIntroTime"/>
              </fieldset>
              <fieldset>
                <h2>show\hide</h2>
                <FormInputSwitch
                  tooltip={assignTooltip(PARAMS_TOOLTIPS.briefing)}
                  storagePath={'description/params/briefing'}
                  value={initialState.briefing}
                  name="briefing"/>
                <FormInputSwitch
                  tooltip={assignTooltip(PARAMS_TOOLTIPS.debriefing)}
                  storagePath={'description/params/debriefing'}
                  value={initialState.debriefing}
                  name="debriefing"/>
              </fieldset>
              <fieldset>
                <h2>HUD options</h2>
                <FormInputSwitch
                  tooltip={assignTooltip(PARAMS_TOOLTIPS.showHud)}
                  storagePath={'description/params/showHud'}
                  value={initialState.showHud}
                  name="showHud"/>
                <FormInputSwitch
                  tooltip={assignTooltip(PARAMS_TOOLTIPS.showCompass)}
                  storagePath={'description/params/showCompass'}
                  value={initialState.showCompass}
                  name="showCompass"/>
                <FormInputSwitch
                  tooltip={assignTooltip(PARAMS_TOOLTIPS.showGPS)}
                  storagePath={'description/params/showGPS'}
                  value={initialState.showGPS}
                  name="showGPS"/>
                <FormInputSwitch
                  tooltip={assignTooltip(PARAMS_TOOLTIPS.showMap)}
                  storagePath={'description/params/showMap'}
                  value={initialState.showMap}
                  name="showMap"/>
                <FormInputSwitch
                  tooltip={assignTooltip(PARAMS_TOOLTIPS.showWatch)}
                  storagePath={'description/params/showWatch'}
                  value={initialState.showWatch}
                  name="showWatch"/>
              </fieldset>
              <fieldset>
                <h2>Rating options</h2>
                <FormInputText
                  tooltip={assignTooltip(PARAMS_TOOLTIPS.minScore)}
                  storagePath={'description/params/minScore'}
                  value={initialState.minScore}
                  type="number-math"
                  name="minScore"/>
                <FormInputText  
                  tooltip={assignTooltip(PARAMS_TOOLTIPS.avgScore)}
                  storagePath={'description/params/avgScore'}
                  value={initialState.avgScore}
                  type="number-math"
                  name="avgScore"/>
                <FormInputText  
                  tooltip={assignTooltip(PARAMS_TOOLTIPS.maxScore)}
                  storagePath={'description/params/maxScore'}
                  value={initialState.maxScore}
                  type="number-math"
                  name="maxScore"/>
              </fieldset>
              <fieldset>
                <h2>Respawn options</h2>
                <FormInputRadioBox
                  // Tooltip={assignTooltip(PARAMS_TOOLTIPS.respawn)}
                  storagePath={'description/params/respawn'}
                  value={(initialState.respawn.slice(1))}
                  name="respawn"
                  options={RESPAWN_OPTIONS} />
                <FormInputText
                  tooltip={assignTooltip(PARAMS_TOOLTIPS.respawnDelay)}
                  storagePath={'description/params/respawnDelay'}
                  value={initialState.respawnDelay}
                  type="number"
                  name="respawnDelay"/>
              </fieldset>
              <fieldset>
                <h2>AI options</h2>
                <FormInputSwitch
                  tooltip={assignTooltip(PARAMS_TOOLTIPS.disabledAI)}
                  storagePath={'description/params/disabledAI'}
                  value={initialState.disabledAI}
                  name="disabledAI"/>
                <FormInputSwitch
                  tooltip={assignTooltip(PARAMS_TOOLTIPS.aiKills)}
                  storagePath={'description/params/aiKills'}
                  value={initialState.aiKills}
                  name="aiKills"/>
              </fieldset>
            </div>
          
            <div className="fields-group">
              <FormTitleParam
                valueTitle={initialState.param1.titleParam}
                valueTable={initialState.param1.array}
                id='1'
                assignTooltip={assignTooltip} />
            </div>

            <div className="fields-group">
              <FormTitleParam
                valueTitle={initialState.param2.titleParam}
                valueTable={initialState.param2.array}
                id='2'
                assignTooltip={assignTooltip} />
            </div>
          </form>
        </main>
      </div>
    </>
  );
}

function setDefaultParam(id: '1' | '2', value: number) {
  storageChangeValue(`description/params/param${id}/defaultParam`, value+'');
}

interface FormTitleParamProps {
  id: '1' | '2',
  valueTitle: string,
  valueTable: string[][],
  assignTooltip: assignTooltip,
}

function FormTitleParam({id, valueTitle, valueTable, assignTooltip}: FormTitleParamProps) {
  
  return (
    <fieldset
      className="form-titleParam">
      <FormInputText
        tooltip={assignTooltip(PARAMS_TOOLTIPS.titleParam)}
        storagePath={`description/params/param${id}/titleParam`}
        value={valueTitle}
        placeholder={`Name for param${id}`}
        name={`titleParam${id}`}
      />

      <DynamicTable
        className="form-param form-shared"
        showBottomButtons
        canSelect
        forceSelect
        tooltip={assignTooltip(PARAMS_TOOLTIPS.param)}
        storagePath={`description/params/param${id}/array`}
        id={`param${id}`}
        value={valueTable}
        onSelected={(row) => setDefaultParam(id, row)}
        content={[
          {
            name: 'id',
            type: 'row-id',
          },
          {
            name: 'text',
            type: 'string',
            placeholder: 'Text displayed inside lobby'
          },
          {
            name: 'value',
            type: 'number-math',
            placeholder: 'Value...',
          }
        ]}
      ></DynamicTable>

    </fieldset>
  );
}
