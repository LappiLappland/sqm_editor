import Quill, { RangeStatic } from "quill";
import { useEffect, useState } from "react";
import { getStorage } from "../../storage/storage";
import FormInputText, { autoCompleteType } from "../forms/FormInputText";

export interface LinkModalStateObject {
  id: number | string,
  x: number,
  y: number,
  display: boolean,
  selection: RangeStatic | null,
  pageName: string,
}

interface LinkModalProps {
  quill: Quill | undefined,
  divRef?: React.MutableRefObject<null>,
  linkObject: LinkModalStateObject,
  setLinkObject: React.Dispatch<React.SetStateAction<LinkModalStateObject>>,
}

export function LinkModal({quill, divRef, linkObject, setLinkObject}: LinkModalProps) {

  const [linkName, setLinkName] = useState(linkObject.pageName);
  const show = linkObject.display ? 'flex' : 'none';
  
  function keyboardHandler(e: React.KeyboardEvent<HTMLElement>) {
    if (e.key === 'Enter') {
      acceptLinkName();
    }
  }
  function acceptLinkName() {
    const selection = linkObject.selection;
    if (quill) {
      if (selection) {
        if (linkName) {
          quill.formatText(selection, 'pageLink', '#'+linkName);
        } else {
          quill.formatText(selection, 'pageLink', '');
        }
        quill.formatText(selection, 'markerLink', '');
      }

      quill.enable();
      setLinkObject({
        id: 'linkM'+linkObject.id,
        x: 0,
        y: 0,
        display: false,
        selection: null,
        pageName: '',
      });
    }
    setLinkName('')
  }

  useEffect(() => {
    if (linkObject.display && quill) {
      quill?.disable();
    }
  }, [linkObject, quill])

  const autoCompleteMain: autoCompleteType = [
    {
      id: 'main',
      option: 'main',
    },
    {
      id: 'notes',
      option: 'notes',
    }
  ];
  const autoCompleteExtra: autoCompleteType = Object.keys(getStorage().briefing.extra).map(key => {
    return {
      id: key,
      option: key,
    }
  })
  const autoComplete = [...autoCompleteMain, ...autoCompleteExtra];

  return (
    <div
    style={{
      display: show,
      top: linkObject.y,
      left: linkObject.x,
    }}
    ref={divRef}
    onKeyDown={(e) => keyboardHandler(e)}
    id="linkModal">
      <FormInputText className="briefing-input"
      type='string'
      name=''
      placeholder='Enter page name...'
      value={linkName}
      onValueChanged={(x) => setLinkName(x)}
      autoComplete={autoComplete}
      />
      <button
      onClick={() => acceptLinkName()}
      
      >
        +
      </button>
    </div>
  )
}