import '../../styles/briefing.scss';
import RichEditorQuill from '../../components/richEditor/RichEditorQuill';
import FormListBox, { ListItemAddEvent, ListItemEvent } from '../../components/forms/FormListBox';
import { getStorage, storageChangeValue, storageCreateValue, storageGetValue, storageRemoveValue } from '../../storage/storage';
import FormInputSwitch from '../../components/forms/FormInputSwitch';
import { useReducer } from 'react';
import { createBasicBriefingValue } from '../../storage/data/briefing';
import BriefingSideBar from './components/briefingSideBar';
import TopBar from '../../components/TopBar';


export default function BriefingPage() {

  const [currentPagePath, setCurrentPagePath] = useReducer((state: string, action: string) => {
    storageChangeValue('briefing/memory/currentlySelected', action);
    return action;
  }, storageGetValue('briefing/memory/currentlySelected'));
  const [showSideSpecific, setShowSideSpecific] = useReducer((state: boolean, action: boolean) => {
    storageChangeValue('briefing/memory/showSideSpecific', action);
    return action;
  }, storageGetValue('briefing/memory/showSideSpecific'));

  const mainList = Object.entries(getStorage().briefing.main).map(entry => {
    return {
      id: entry[0],
      name: entry[0],
      value: 'briefing/main/'+entry[0],
    };
  });

  const extraList = Object.entries(getStorage().briefing.extra).map(entry => {
    return {
      id: entry[0],
      name: entry[0],
      value: 'briefing/extra/'+entry[0],
    };
  });

  const sideSpecifigList = Object.entries(getStorage().briefing.side).map(entry => {
    return {
      id: entry[0],
      name: entry[0],
      value: 'briefing/side/'+entry[0],
    };
  });

  function sectionAddedHandler(item: ListItemAddEvent, isUnique: boolean) {
    if (isUnique && item.value) {
      storageCreateValue('briefing/extra', item.value, createBasicBriefingValue());
      setCurrentPagePath('briefing/extra/' + item.value);
    }
  }
  function sectionRemovedHandler(item: ListItemEvent) {
    if (item && item.value) {
      storageRemoveValue(item.value);
      if (item.value === currentPagePath) {
        setCurrentPagePath('briefing/main/main');
      }
    }
  }

  return (
    <>
      <TopBar></TopBar>
      <div className="Briefing three-columns"
      >
        <div className="briefing-main-listBox">
          <FormListBox
            title="Main"
            list={showSideSpecific ? [...mainList, ...sideSpecifigList] : mainList}
            value={currentPagePath}
            onChange={(x) => {if (x) setCurrentPagePath(x);}}
          />  
          <div>
            <FormInputSwitch className="sideSpecificSwitch"
              id="showSideSpecific"
              name="Side-specific briefing"
              onChange={(x) => setShowSideSpecific(x)}
            ></FormInputSwitch>
            <BriefingSideBar />
          </div>
        
        </div>

        <div className="briefing-secondary-listBox">
          <FormListBox
            title="Sections"
            list={extraList}
            value={currentPagePath}
            onSectionAdded={sectionAddedHandler}
            onSectionRemoved={sectionRemovedHandler}
            regexCheck={/^([_a-zA-Z][_a-zA-Z0-9]*)?$/}
            onChange={(x) => {if (x) setCurrentPagePath(x);}}
          />  
        </div>
      
        <RichEditorQuill
          currentPagePath={currentPagePath}
        ></RichEditorQuill>
      </div>
    </>
  );
}