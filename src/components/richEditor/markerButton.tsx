import Quill from "quill";
import { MarkerModalStateObject } from "./markerModal";
import { findStartAndEnd } from "./RichEditorQuill";

interface MarkerButtonProps {
  quill: Quill | undefined,
  shine: boolean,
  modal: MarkerModalStateObject,
  setModal: React.Dispatch<React.SetStateAction<MarkerModalStateObject>>,
}

export function MarkerButton({quill, shine, modal, setModal}: MarkerButtonProps) {
  function click(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if (quill) {
      if (!modal.display) {
        const selection = quill.getSelection();
        if (selection) {
          
          let initialName = '';
          const format = quill.getFormat(selection);
          let markerSelection = selection;
          
          if (format.markerLink) {
            initialName = format.markerLink.slice(7) as string;
            markerSelection = findStartAndEnd(selection.index, 'markerLink', quill);
          } else {
            if (selection.length === 0) return;
          }
          quill.disable();
          setModal({
            id: 'markerM'+modal.id+1,
            x: e.currentTarget.offsetLeft,
            y: e.currentTarget.offsetTop+25,
            display: true,
            selection: markerSelection,
            markerName: initialName,
          });
        }
      } else {
        quill.enable();
        setModal({
          id: 'markerM'+modal.id,
          x: 0,
          y: 0,
          display: false,
          selection: null,
          markerName: '',
        });
      }
    }
    
  
  }

  return (
    <button id="markerButton"
      onClick={(e)=>{click(e);}}
      className={`${shine ? "ql-active" : ""}`}
    >
      Marker
    </button>
  );
}

