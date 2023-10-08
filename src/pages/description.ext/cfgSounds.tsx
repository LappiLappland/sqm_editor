import { useEffect, useState } from 'react';
import { DynamicTable } from '../../components/forms/DynamicTable';
import FormInputSwitch from '../../components/forms/FormInputSwitch';
import FormInputText from '../../components/forms/FormInputText';
import TooltipWindow from '../../components/TooltipWindow';
import TopBar from '../../components/TopBar';
import useTooltip from '../../hooks/useTooltip';
import { createSoundClass } from '../../storage/data/cfgSounds';
import TITLE_FONTS from '../../storage/extra/fonts';
import SOUNDS_TOOLTIPS from '../../storage/extra/tooltips/sounds';
import { getStorage } from '../../storage/storage';
import '../../styles/description.scss'
import ClassesListBox from './components/classesListBox';
import DescriptionSidebar from './components/sidebar'

export default function DescriptionSoundsPage() {

  const [currentClassName, setCurrentClassName] = useState('')
  const [currentClassId, setCurrentClassId] = useState(getStorage().description.classesMemory.cfgSounds);

  useEffect(() => {getStorage().description.classesMemory.cfgSounds = currentClassId}, [currentClassId])

  const [tooltipState, assignTooltip] = useTooltip();

  let initialState = getStorage().description.cfgSounds[currentClassId];

  return (
    <>
    <TopBar></TopBar>
    <div className="desc-shared desc-cfgs">
      <DescriptionSidebar />
      <main>
        <TooltipWindow
        state={tooltipState}
        className="form-tooltip"
        />
        <h1>Sound configuration</h1>
        {initialState ? <h2>{initialState.className.slice(1)}</h2> : <></>}
        {
        !initialState ? <>Create class using panel on the right!</> : (
        <form className="desc-form-shared desc-form-sounds"
        key={currentClassId}
        autoComplete="off">
          <fieldset>
          <FormInputText
            tooltip={assignTooltip(SOUNDS_TOOLTIPS.className)}
            storagePath={`description/cfgSounds/${currentClassId}/className`}
            value={initialState.className}
            onValueChanged={(x) => setCurrentClassName(x)}
            type="class"
            name="className" />
            <FormInputText
            tooltip={assignTooltip(SOUNDS_TOOLTIPS.name)}
            storagePath={`description/cfgSounds/${currentClassId}/name`}
            value={initialState.name}
            placeholder="Name of the sound inside mission editor"
            name="name" />
          </fieldset>
          <fieldset>
            <h3>sound[] options</h3>
            <FormInputText
            tooltip={assignTooltip(SOUNDS_TOOLTIPS.filePath)}
            storagePath={`description/cfgSounds/${currentClassId}/filePath`}
            value={initialState.filePath}
            name="FilePath"/>
            <FormInputText
            tooltip={assignTooltip(SOUNDS_TOOLTIPS.volume)}
            storagePath={`description/cfgSounds/${currentClassId}/volume`}
            value={initialState.volume}
            type='number-math'
            name="Volume"/>
            <FormInputText
            tooltip={assignTooltip(SOUNDS_TOOLTIPS.pitch)}
            storagePath={`description/cfgSounds/${currentClassId}/pitch`}
            value={initialState.pitch}
            name="Pitch"/>
          </fieldset>
          <fieldset>
          <h3>titles[] options</h3>
            <FormInputText
            tooltip={assignTooltip(SOUNDS_TOOLTIPS.titlesFont)}
            storagePath={`description/cfgSounds/${currentClassId}/titlesFont`}
            value={initialState.titlesFont}
            autoComplete={TITLE_FONTS.map(font => {return {id: font, option: font}})}
            name="titlesFont"/>
            <FormInputText
            tooltip={assignTooltip(SOUNDS_TOOLTIPS.titlesSize)}
            storagePath={`description/cfgSounds/${currentClassId}/titlesSize`}
            value={initialState.titlesSize}
            name="titlesSize"/>
            <FormInputSwitch
            tooltip={assignTooltip(SOUNDS_TOOLTIPS.forceTitles)}
            storagePath={`description/cfgSounds/${currentClassId}/forceTitles`}
            value={initialState.forceTitles}
            name="forceTitles"/>
          </fieldset>
          <fieldset>
            <h3>titles[]</h3>
            <DynamicTable
            className="form-shared form-cfgSounds"
            tooltip={assignTooltip(SOUNDS_TOOLTIPS.titles)}
            storagePath={`description/cfgSounds/${currentClassId}/titles`}
            value={initialState.titles}
            id="titles"
            content={[
              {
              name: 'time',
              type: 'number',
              placeholder: 'Seconds'
              },
              {
              name: 'text',
              type: 'string',
              placeholder: 'Text to display on the screen'
              },
            ]}
            showBottomButtons={true}
            ></DynamicTable>
          </fieldset>
        </form>)
        }
      </main>
      <aside className="classes-list-box">
        <ClassesListBox
        key={currentClassName}
        value={currentClassId}
        setValue={setCurrentClassId}
        storagePath='description/cfgSounds'
        storageCreator={createSoundClass}
        ></ClassesListBox>
      </aside>
    </div>
    </>
  )
}