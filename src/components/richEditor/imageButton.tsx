import Quill from "quill";
import { ImageModalStateObject, imageOFPValueModal } from "./imageModal";

interface ImageButtonProps {
  divRef?: React.MutableRefObject<null>,
  quill: Quill | undefined,
  shine: imageOFPValueModal | null,
  modal: ImageModalStateObject,
  setModal: React.Dispatch<React.SetStateAction<ImageModalStateObject>>,
}

export function ImageButton({quill, shine, modal, setModal}: ImageButtonProps) {
  function click(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if (quill) {
      if (!modal.display) {
        const selection = quill.getSelection();
        if (selection) {
          
          let imageSelection = selection;
          
          quill.disable();
          setModal({
            id: 'imageM'+modal.id+1,
            x: e.currentTarget.offsetLeft,
            y: e.currentTarget.offsetTop+25,
            display: true,
            selection: imageSelection,
            imageValue: shine,
          });
        }
      } else {
        quill.enable();
        setModal({
          id: 'imageM'+modal.id,
          x: 0,
          y: 0,
          display: false,
          selection: null,
          imageValue: null,
        });
      }
    }
    
    
  
  }

  return (
    <button id="markerButton"
    onClick={(e)=>{click(e)}}
    className={`${shine ? "ql-active" : ""}`}
    >
      Image
    </button>
  )
}

