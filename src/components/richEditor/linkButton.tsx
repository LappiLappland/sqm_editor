import Quill from "quill";
import { LinkModalStateObject } from "./linkModal";
import { findStartAndEnd } from "./RichEditorQuill";

interface LinkButtonProps {
  quill: Quill | undefined,
  shine: boolean,
  modal: LinkModalStateObject,
  setModal: React.Dispatch<React.SetStateAction<LinkModalStateObject>>,
}

export function LinkButton({quill, shine, modal, setModal}: LinkButtonProps) {
  function click(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if (quill) {
      if (!modal.display) {
        const selection = quill.getSelection();
        if (selection) {
          
          let initialName = '';
          const format = quill.getFormat(selection);
          let linkSelection = selection;
          
          if (format.pageLink) {
            console.log('WTF->', format.pageLink);
            initialName = format.pageLink.slice(1) as string;
            linkSelection = findStartAndEnd(selection!.index, 'pageLink', quill)
          } else {
            if (selection.length === 0) return;
          }
          console.log('->', initialName, linkSelection);
          quill.disable();
          setModal({
            id: 'linkM'+modal.id+1,
            x: e.currentTarget.offsetLeft,
            y: e.currentTarget.offsetTop+25,
            display: true,
            selection: linkSelection,
            pageName: initialName,
          });
        }
      } else {
        quill.enable();
        setModal({
          id: 'linkM'+modal.id,
          x: 0,
          y: 0,
          display: false,
          selection: null,
          pageName: '',
        });
      }
    }
    
    
  
  }

  return (
    <button id="linkButton"
    onClick={(e)=>{click(e)}}
    className={`${shine ? "ql-active" : ""}`}
    >
      Link
    </button>
  )
}

