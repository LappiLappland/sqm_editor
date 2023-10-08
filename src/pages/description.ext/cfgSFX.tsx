import { useEffect, useState } from 'react';
import { DynamicTable } from '../../components/forms/DynamicTable';
import FormInputText from '../../components/forms/FormInputText';
import TooltipWindow from '../../components/TooltipWindow';
import TopBar from '../../components/TopBar';
import useTooltip from '../../hooks/useTooltip';
import { createSFXClass } from '../../storage/data/cfgSFX';
import SFX_TOOLTIPS from '../../storage/extra/tooltips/SFX';
import { getStorage } from '../../storage/storage';
import '../../styles/description.scss';
import ClassesListBox from './components/classesListBox';
import DescriptionSidebar from './components/sidebar';

export default function DescriptionSFXPage() {

  const [currentClassName, setCurrentClassName] = useState('')
  const [currentClassId, setCurrentClassId] = useState(getStorage().description.classesMemory.cfgSFX);

  useEffect(() => {getStorage().description.classesMemory.cfgSFX = currentClassId}, [currentClassId])

  const [tooltipState, assignTooltip] = useTooltip();

  let initialState = getStorage().description.cfgSFX[currentClassId];

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
        <h1>SFX configuration</h1>
        {initialState ? <h2>{initialState.className.slice(1)}</h2> : <></>}
        {
        !initialState ? <>Create class using panel on the right!</> : (
        <form className="desc-form-shared"
        key={currentClassId}
        autoComplete="off">
          <fieldset>
            <FormInputText
            tooltip={assignTooltip(SFX_TOOLTIPS.className)}
            storagePath={`description/cfgSFX/${currentClassId}/className`}
            value={initialState.className}
            onValueChanged={(x) => setCurrentClassName(x)}
            type="class"
            name="className"/>
            <FormInputText
            tooltip={assignTooltip(SFX_TOOLTIPS.name)}
            storagePath={`description/cfgSFX/${currentClassId}/name`}
            value={initialState.name}
            name="name"/>
            {/* <FormInputSwitch
            tooltip={assignTooltip(SFX_TOOLTIPS.keepName)}
            storagePath={`description/cfgSFX/${currentClassId}/keepName`}
            value={initialState.keepName}
            name="Keep name equal to file name" /> */}
          </fieldset>
          <fieldset>
            <h3>sounds[]</h3>
            <DynamicTable
            tooltip={assignTooltip(SFX_TOOLTIPS.sounds)}
            storagePath={`description/cfgSFX/${currentClassId}/sounds`}
            id="titles"
            className="form-shared form-cfgSFX"
            value={initialState.sounds}
            content={[
              {
              name: 'filePath',
              type: 'string',
              placeholder: 'filePath'
              },
              {
              name: 'volume',
              type: 'number-math',
              placeholder: 'Volume'
              },
              {
              name: 'pitch',
              type: 'number-math',
              placeholder: 'Pitch'
              },
              {
              name: '%',
              type: 'number-math',
              placeholder: '%'
              },
              {
              name: 'min',
              type: 'number-math',
              placeholder: 'min'
              },
              {
              name: 'mid',
              type: 'number-math',
              placeholder: 'mid'
              },
              {
              name: 'max',
              type: 'number-math',
              placeholder: 'max'
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
        storagePath='description/cfgSFX'
        storageCreator={createSFXClass}
        ></ClassesListBox>
      </aside>
    </div>
    </>
  )
}