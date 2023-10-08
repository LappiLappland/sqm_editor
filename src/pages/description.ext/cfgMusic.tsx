import { useEffect, useState } from 'react';
import FormInputText from '../../components/forms/FormInputText';
import TooltipWindow from '../../components/TooltipWindow';
import TopBar from '../../components/TopBar';
import useTooltip from '../../hooks/useTooltip';
import { createMusicClass } from '../../storage/data/cfgMusic';
import MUSIC_TOOLTIPS from '../../storage/extra/tooltips/music';
import { getStorage } from '../../storage/storage';
import '../../styles/description.scss'
import ClassesListBox from './components/classesListBox';
import DescriptionSidebar from './components/sidebar'

export default function DescriptionMusicPage() {

  const [currentClassName, setCurrentClassName] = useState('')
  const [currentClassId, setCurrentClassId] = useState(getStorage().description.classesMemory.cfgMusic);

  useEffect(() => {getStorage().description.classesMemory.cfgMusic = currentClassId}, [currentClassId])

  const [tooltipState, assignTooltip] = useTooltip();

  let initialState = getStorage().description.cfgMusic[currentClassId];

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
        <h1>Music configuration</h1>
        {initialState ? <h2>{initialState.className.slice(1)}</h2> : <></>}
        {
        !initialState ? <>Create class using panel on the right!</> : (
        <form className="desc-form-shared"
        key={currentClassId}
        autoComplete="off">
          <fieldset>
          <FormInputText
            tooltip={assignTooltip(MUSIC_TOOLTIPS.className)}
            storagePath={`description/cfgMusic/${currentClassId}/className`}
            value={initialState.className}
            onValueChanged={(x) => setCurrentClassName(x)}
            type="class"
            name="className" />
            <FormInputText 
            tooltip={assignTooltip(MUSIC_TOOLTIPS.name)}
            storagePath={`description/cfgMusic/${currentClassId}/name`}
            value={initialState.name}
            placeholder="Name of the sound inside mission editor"
            name="name" />
            {/* <FormInputSwitch
            tooltip={assignTooltip(MUSIC_TOOLTIPS.keepName)}
            storagePath={`description/cfgMusic/${currentClassId}/keepName`}
            value={initialState.keepName}
            name="Keep name equal to file name"/> */}
          </fieldset>
          <fieldset>
            <h3>sound[] options</h3>
            <FormInputText
            tooltip={assignTooltip(MUSIC_TOOLTIPS.filePath)}
            storagePath={`description/cfgMusic/${currentClassId}/filePath`}
            value={initialState.filePath}
            name="FilePath"/>
            <FormInputText
            tooltip={assignTooltip(MUSIC_TOOLTIPS.volume)}
            storagePath={`description/cfgMusic/${currentClassId}/volume`}
            value={initialState.volume}
            type='number-math'
            name="Volume"/>
            <FormInputText
            tooltip={assignTooltip(MUSIC_TOOLTIPS.pitch)}
            storagePath={`description/cfgMusic/${currentClassId}/pitch`}
            value={initialState.pitch}
            name="Pitch"/>
          </fieldset>
        </form>) 
        }
      </main>
      <aside  className="classes-list-box">
        <ClassesListBox
        key={currentClassName}
        value={currentClassId}
        setValue={setCurrentClassId}
        storagePath='description/cfgMusic'
        storageCreator={createMusicClass}
        ></ClassesListBox>
      </aside>
    </div>
    </>
  )
}