import { useReducer, useState } from 'react';
import { DynamicTable } from '../../components/forms/DynamicTable';
import FormInputText from '../../components/forms/FormInputText';
import TooltipWindow from '../../components/TooltipWindow';
import TopBar from '../../components/TopBar';
import useTooltip, { assignTooltip } from '../../hooks/useTooltip';
import GEAR_TOOLTIPS from '../../storage/extra/tooltips/gear';
import { getStorage, storageChangeValue, storageCreateValue } from '../../storage/storage';
import { CHAR_TYPES } from '../../storage/types';
import '../../styles/description.scss';
import DescriptionSidebar from './components/sidebar';

export default function DescriptionGearPage() {

  const [weaponsRender, reRenderWeapons] = useReducer((x) => x+1, 0)
  const [magazinesRender, reRendermagazines] = useReducer((x) => x+1, 0)

  const [tooltipState, assignTooltip] = useTooltip();

  let initialState = getStorage().description;

  return (
    <>
    <TopBar></TopBar>
    <div className="desc-shared desc-gear">
      <DescriptionSidebar />
      <main>
        <TooltipWindow
        state={tooltipState}
        className="form-tooltip"
        />
        <h1>Gear configuration</h1>
        <form className="desc-form-shared desc-form-gear"
        autoComplete="off">
          <AddGearButton type="weapons" forceRender={reRenderWeapons} assignTooltip={assignTooltip} />
          <AddGearButton type="magazines" forceRender={reRendermagazines} assignTooltip={assignTooltip} />
          <fieldset >
            <h3>Weapons</h3>
            <DynamicTable
            tooltip={assignTooltip(GEAR_TOOLTIPS.weapons)}
            storagePath={`description/weapons`}
            key={weaponsRender}
            canSelect
            id="weapons"
            className="form-shared form-gear"
            value={initialState.weapons}
            content={[
              {
              name: 'class',
              type: 'class',
              placeholder: 'class'
              },
              {
              name: 'amount',
              type: 'number-math',
              placeholder: 'amount'
              },
            ]}
            showBottomButtons={true}
            ></DynamicTable>
          </fieldset>
          <fieldset>
            <h3>Magazines</h3>
            <DynamicTable
            tooltip={assignTooltip(GEAR_TOOLTIPS.magazines)}
            storagePath={`description/magazines`}
            key={magazinesRender}
            id="magazines"
            className="form-shared form-gear"
            value={initialState.magazines}
            content={[
              {
              name: 'class',
              type: 'string',
              placeholder: 'class'
              },
              {
              name: 'amount',
              type: 'number-math',
              placeholder: 'amount'
              },
            ]}
            showBottomButtons={true}
            ></DynamicTable>
          </fieldset>
        </form>
      </main>
    </div>
    </>
  )
}

interface AddGearButtonProps {
  type: 'weapons' | 'magazines',
  forceRender: React.DispatchWithoutAction,
  assignTooltip: assignTooltip,
}

function AddGearButton({type, forceRender, assignTooltip}: AddGearButtonProps) {

  const [value, setValue] = useState('');
  const [valueNum, setValueNum] = useState('');

  const autocompleteList = type === 'magazines' ? getStorage().classes.cfgMagazines : getStorage().classes.cfgWeapons;
  const autoCompleteObjects = autocompleteList.map(item => {return {id: item, option: item}})

  function handleClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    const currentGear = type === 'magazines' ? getStorage().description.magazines : getStorage().description.weapons;
    const ind = currentGear.findIndex(item => item[0].slice(1) === value);
    if (ind >= 0) {
      storageChangeValue(`description/${type}/${ind}/1`, valueNum);
    } else {
      const len = currentGear.length;
      storageCreateValue(`description/${type}`, len+'', [value, valueNum], [CHAR_TYPES.STRING, CHAR_TYPES.NUMBER]);
    }
    forceRender();
  }

  return (
    <fieldset className="form-gear-select">
      <div>
        <FormInputText
        tooltip={assignTooltip(GEAR_TOOLTIPS.extraField)}
        id={type}
        onValueChanged={(x) => setValue(x)}
        placeholder='class'
        autoComplete={autoCompleteObjects}
        name='' ></FormInputText>
        <FormInputText
        tooltip={assignTooltip(GEAR_TOOLTIPS.extraField)}
        id={type+'Amount'}
        onValueChanged={(x) => setValueNum(x)}
        placeholder='amount'
        type='number-math'
        name='' ></FormInputText>
      </div>
      <button
      onClick={(e) => handleClick(e)}
      >Add to the table</button>
    </fieldset>
  )
}