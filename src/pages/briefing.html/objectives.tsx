import '../../styles/briefing.scss'
import { useReducer } from "react"
import FormListBox, { ListItemAddEvent, ListItemEvent } from "../../components/forms/FormListBox";
import RichEditorQuill from '../../components/richEditor/RichEditorQuill';
import { getStorage, storageChangeValue, storageCreateValue, storageGetValue, storageRemoveValue } from '../../storage/storage';
import { createBasicBriefingObjective } from '../../storage/data/briefing';
import BriefingSideBar from './components/briefingSideBar';
import TopBar from '../../components/TopBar';

export function BriefingObjectivesPage() {

  const [currentPagePath, setCurrentPagePath] = useReducer((state: string, action: string) => {
    storageChangeValue('briefing/memory/currentlySelectedObjective', action);
    return action;
  }, storageGetValue('briefing/memory/currentlySelectedObjective'));

  const objList = getStorage().briefing.objectives.map((obj, i) => {
    return {
      id: obj.id,
      name: obj.id,
      value: 'briefing/objectives/'+i,
    }
  })

  function sectionAddedHandler(item: ListItemAddEvent, isUnique: boolean) {
    if (isUnique && item.value) {
      storageCreateValue('briefing/objectives', item.index+'', createBasicBriefingObjective(item.value))
      setCurrentPagePath('briefing/objectives/'+item.index);
    }
  }
  function sectionRemovedHandler(item: ListItemEvent) {
    if (item.value) {
      storageRemoveValue(item.value);
      if (item.value === currentPagePath) {
        setCurrentPagePath('');
      }
    }
  }
  
  return (
    <>
    <TopBar></TopBar>
    <div className="Briefing two-columns">
        <div className="briefing-main-listBox">
          <FormListBox
          title="Objectives ID"
          list={objList}
          value={currentPagePath}
          onSectionAdded={sectionAddedHandler}
          onSectionRemoved={sectionRemovedHandler}
          regexCheck={/^[_a-zA-Z0-9]*$/}
          onChange={(x) => {if (x) setCurrentPagePath(x)}}
          />  
          <BriefingSideBar />
      </div>
      <RichEditorQuill
      currentPagePath={currentPagePath}
      ></RichEditorQuill>
    </div>
    </>
  )
}