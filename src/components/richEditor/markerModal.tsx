import Quill, { RangeStatic } from "quill";
import { useEffect, useState } from "react";
import FormInputText from "../forms/FormInputText";

export interface MarkerModalStateObject {
  id: number | string,
  x: number,
  y: number,
  display: boolean,
  selection: RangeStatic | null,
  markerName: string,
}

interface MarkerModalProps {
  quill: Quill | undefined,
  divRef?: React.MutableRefObject<null>,
  markerObject: MarkerModalStateObject,
  setMarkerObject: React.Dispatch<React.SetStateAction<MarkerModalStateObject>>,
}

export function MarkerModal({quill, divRef, markerObject, setMarkerObject}: MarkerModalProps) {

  const [markerName, setMarkerName] = useState(markerObject.markerName);
  const show = markerObject.display ? 'flex' : 'none';
  
  function keyboardHandler(e: React.KeyboardEvent<HTMLElement>) {
    if (e.key === 'Enter') {
      acceptMarkerName();
    }
  }
  function acceptMarkerName() {
    const selection = markerObject.selection;
    if (quill) {
      if (selection) {
        if (markerName) {
          quill.formatText(selection, 'markerLink', 'marker:'+markerName);
        } else {
          quill.formatText(selection, 'markerLink', '');
        }
        quill.formatText(selection, 'pageLink', '');
      }
      quill.enable();
      setMarkerObject({
        id: 'markerM'+markerObject.id,
        x: 0,
        y: 0,
        display: false,
        selection: null,
        markerName: '',
      });
    }
    setMarkerName('')
  }

  useEffect(() => {
    if (markerObject.display && quill) {
      quill?.disable();
    }
  }, [markerObject, quill])

  return (
    <div
    style={{
      display: show,
      top: markerObject.y,
      left: markerObject.x,
    }}
    ref={divRef}
    onKeyDown={(e) => keyboardHandler(e)}
    id="markerModal">
      <FormInputText className="briefing-input"
      type='string'
      name=''
      placeholder='Enter marker name...'
      value={markerName}
      onValueChanged={(x) => setMarkerName(x)}
      />
      <button
      onClick={() => acceptMarkerName()}
      
      >
        +
      </button>
    </div>
  )
}