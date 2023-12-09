import { useEffect, useState } from "react";
import FormInputRadioBox, { FormInputRadioBoxItem } from "../../components/forms/FormInputRadioBox";
import FormInputText from "../../components/forms/FormInputText";
import TooltipWindow from "../../components/TooltipWindow";
import useTooltip from "../../hooks/useTooltip";
import ClassesListBox from "./components/classesListBox";
import DescriptionSidebar from "./components/sidebar";
import { getStorage, storageChangeValue } from "../../storage/storage";
import { createIdentityClass } from "../../storage/data/cfgIdentities";
import IDENTITIES_TOOLTIPS from "../../storage/extra/tooltips/identities";
import OFP_FACES from "../../storage/extra/faces";
import OFP_SPEAKERS from "../../storage/extra/speakers";
import OFP_GLASSES from "../../storage/extra/glasses";
import TopBar from "../../components/TopBar";

function generateFacesArray() {
  const array: FormInputRadioBoxItem[] = [];
  let i = 0;
  for (const [key, value] of Object.entries(OFP_FACES)) {
    array.push({
      name: value.name,
      id: i,
      value: key,
      image: value.image,
    });
    i++;
  }
  return array;
}
const OFP_FACES_ARRAY: FormInputRadioBoxItem[] = generateFacesArray();

export default function DescriptionIdentitiesPage() {

  const [currentFace, setCurrentFace] = useState('');
  const [currentClassName, setCurrentClassName] = useState('');
  const [currentClassId, setCurrentClassId] = useState(getStorage().description.classesMemory.cfgIdentities);

  useEffect(() => {getStorage().description.classesMemory.cfgIdentities = currentClassId;}, [currentClassId]);

  const [tooltipState, assignTooltip] = useTooltip();

  const initialState = getStorage().description.cfgIdentities[currentClassId];

  const speakersAutoComplete = OFP_SPEAKERS.map(item => {return {id: item, option: item};});
  const glassesAutoComplete = OFP_GLASSES.map(item => {return {id: item, option: item};});

  function onFaceSelected(value: string) {
    storageChangeValue(`description/cfgIdentities/${currentClassId}/face`, value);
    setCurrentFace(value);
  }

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
          <h1>Identities configuration</h1>
          {initialState ? <h2>{initialState.className.slice(1)}</h2> : <></>}
          {
            !initialState ? <>Create class using panel on the right!</> : (
              <form
                className="desc-form-shared desc-form-identities"
                key={currentClassId}
                autoComplete="off">
                <fieldset>
                  <h3>Properties</h3>
                  <FormInputText
                    tooltip={assignTooltip(IDENTITIES_TOOLTIPS.className)}
                    storagePath={`description/cfgIdentities/${currentClassId}/className`}
                    value={initialState.className}
                    onValueChanged={(x) => setCurrentClassName(x)}
                    type="class"
                    name="className" />
                  <FormInputText
                    tooltip={assignTooltip(IDENTITIES_TOOLTIPS.name)}
                    storagePath={`description/cfgIdentities/${currentClassId}/name`}
                    value={initialState.name}
                    name="name"/>
                  <FormInputText 
                    tooltip={assignTooltip(IDENTITIES_TOOLTIPS.speaker)}
                    storagePath={`description/cfgIdentities/${currentClassId}/speaker`}
                    value={initialState.speaker}
                    autoComplete={speakersAutoComplete}
                    name="speaker"/>
                  <FormInputText 
                    tooltip={assignTooltip(IDENTITIES_TOOLTIPS.pitch)}
                    storagePath={`description/cfgIdentities/${currentClassId}/pitch`}
                    value={initialState.pitch}
                    type="number-math"
                    name="pitch" />
                  <FormInputText
                    tooltip={assignTooltip(IDENTITIES_TOOLTIPS.glasses)}
                    storagePath={`description/cfgIdentities/${currentClassId}/glasses`}
                    value={initialState.glasses}
                    autoComplete={glassesAutoComplete}
                    name="glasses" />
                  <FormInputText key={currentFace}
                    tooltip={assignTooltip(IDENTITIES_TOOLTIPS.face)}
                    storagePath={`description/cfgIdentities/${currentClassId}/face`}
                    value={initialState.face}
                    name="face" />
                </fieldset>
                <fieldset>
                  <h3>Faces</h3>
                  <FormInputRadioBox //Key={currentFace}
                    className="faces-listbox"
                    value={currentFace}
                    options={OFP_FACES_ARRAY}
                    onSelectionChanged={(_, x) => onFaceSelected(x)}
                    name="faceList" />
                </fieldset>
              </form> )
          }
        </main>
        <aside className="classes-list-box">
          <ClassesListBox
            key={currentClassName}
            value={currentClassId}
            setValue={setCurrentClassId}
            storagePath='description/cfgIdentities'
            storageCreator={createIdentityClass}
          ></ClassesListBox>
        </aside>
      </div>
    </>
  );
}
