import { useEffect, useState } from 'react';
import FormInputText from '../../components/forms/FormInputText';
import TooltipWindow from '../../components/TooltipWindow';
import TopBar from '../../components/TopBar';
import useTooltip from '../../hooks/useTooltip';
import { createRadioClass } from '../../storage/data/cfgRadio';
import RADIO_TOOLTIPS from '../../storage/extra/tooltips/radio';
import { getStorage } from '../../storage/storage';
import '../../styles/description.scss';
import ClassesListBox from './components/classesListBox';
import DescriptionSidebar from './components/sidebar';

export default function DescriptionRadioPage() {

  const [currentClassName, setCurrentClassName] = useState('')
  const [currentClassId, setCurrentClassId] = useState(getStorage().description.classesMemory.cfgRadio);

  useEffect(() => {getStorage().description.classesMemory.cfgRadio = currentClassId}, [currentClassId])

  const [tooltipState, assignTooltip] = useTooltip();

  let initialState = getStorage().description.cfgRadio[currentClassId];

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
        <h1>Radio configuration</h1>
        {initialState ? <h2>{initialState.className.slice(1)}</h2> : <></>}
        {
        !initialState ? <>Create class using panel on the right!</> : (
        <form className="desc-form-shared"
        key={currentClassId}
        autoComplete="off">
          <fieldset>
            <FormInputText
            tooltip={assignTooltip(RADIO_TOOLTIPS.className)}
            storagePath={`description/cfgRadio/${currentClassId}/className`}
            value={initialState.className}
            onValueChanged={(x) => setCurrentClassName(x)}
            type="class"
            name="className" />
            <FormInputText 
            tooltip={assignTooltip(RADIO_TOOLTIPS.name)}
            storagePath={`description/cfgRadio/${currentClassId}/name`}
            value={initialState.name}
            placeholder="Name of the sound inside mission editor"
            name="name" />
            {/* <FormInputSwitch
            tooltip={assignTooltip(RADIO_TOOLTIPS.keepName)}
            storagePath={`description/cfgRadio/${currentClassId}/keepName`}
            value={initialState.keepName}
            name="Keep name equal to file name" /> */}
          </fieldset>
          <fieldset>
            <h3>sound[] options</h3>
            <FormInputText
            tooltip={assignTooltip(RADIO_TOOLTIPS.filePath)}
            storagePath={`description/cfgRadio/${currentClassId}/filePath`}
            value={initialState.filePath}
            name="FilePath"/>
            <FormInputText
            tooltip={assignTooltip(RADIO_TOOLTIPS.volume)}
            storagePath={`description/cfgRadio/${currentClassId}/volume`}
            value={initialState.volume}
            type='number-math'
            name="Volume"/>
            <FormInputText
            tooltip={assignTooltip(RADIO_TOOLTIPS.pitch)}
            storagePath={`description/cfgRadio/${currentClassId}/pitch`}
            value={initialState.pitch}
            name="Pitch"/>
          </fieldset>
          <fieldset>
            <h3>title options</h3>
            <FormInputText
            tooltip={assignTooltip(RADIO_TOOLTIPS.title)}
            storagePath={`description/cfgRadio/${currentClassId}/title`}
            value={initialState.title}
            name="title"/>
          </fieldset>
        </form> )
        }
      </main>
      <aside className="classes-list-box">
        <ClassesListBox
        key={currentClassName}
        value={currentClassId}
        setValue={setCurrentClassId}
        storagePath='description/cfgRadio'
        storageCreator={createRadioClass}
        ></ClassesListBox>
      </aside>
    </div>
    </>
  )
}