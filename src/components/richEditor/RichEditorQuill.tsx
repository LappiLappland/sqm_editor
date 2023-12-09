import { useQuill } from 'react-quilljs';

import Quill, { DeltaOperation, EditorChangeHandler, RangeStatic, TextChangeHandler } from 'quill';
import 'quill/dist/quill.snow.css';
import { memo, useEffect, useRef, useState } from 'react';
import { storageChangeValue, storageGetValue } from '../../storage/storage';
import '../../styles/quill-editor.scss';
import { ImageButton } from './imageButton';
import { ImageModal, ImageModalStateObject } from './imageModal';
import imageOFPBlot, { imageOFPValue } from './imageOFPclass';
import { LinkButton } from './linkButton';
import { LinkModal, LinkModalStateObject } from './linkModal';
import { MarkerButton } from './markerButton';
import { MarkerModal, MarkerModalStateObject } from './markerModal';

export type Delta = ReturnType<typeof Quill.prototype.getContents>;

interface RichEditorQuillProps {
  currentPagePath: string,
}

export default memo(function RichEditorQuill({ currentPagePath }: RichEditorQuillProps) {

  const { Quill, quill, quillRef } = useQuill({
    modules: {
      toolbar: '#toolbar'
    },
    formats: ["header", "align", "markerLink", "pageLink", "imageOFP"],
  });

  const [shineMarker, setShineMarker] = useState(false);
  const [shineLink, setShineLink] = useState(false);
  const [shineImage, setShineImage] = useState<(imageOFPValue & {ref: HTMLElement}) | null>(null);

  const [markerModalState, setMarkerModalState] = useState<MarkerModalStateObject>({
    id: 'markerM'+0,
    x: 0,
    y: 0,
    display: false,
    selection: null,
    markerName: '',
  });
  const [linkModalState, setLinkModalState] = useState<LinkModalStateObject>({
    id: 'linkM'+0,
    x: 0,
    y: 0,
    display: false,
    selection: null,
    pageName: '',
  });
  const [imageModalState, setImageModalState] = useState<ImageModalStateObject>({
    id: 'imageM'+0,
    x: 0,
    y: 0,
    display: false,
    selection: null,
    imageValue: null,
  });

  const textChangeStorageHandler = useRef<TextChangeHandler>();
  const textChangeLinksHandler = useRef<TextChangeHandler>();
  const editorChangeShineHandler = useRef<EditorChangeHandler>();
  const editorChangePasteHandler = useRef<EditorChangeHandler>();
  const editorBlurHandler = useRef<(e: FocusEvent) => void>();

  const wantedCaretPosition = useRef<number | null>(null);

  const markerModalRef = useRef(null);
  const linkModalRef = useRef(null);
  const imageModalRef = useRef(null);
  const imageButtonRef = useRef(null);

  //Add new formats
  //Attach quill event handlers
  useEffect(() => {
    if (quill) {

      const parchment = Quill.import("parchment");

      const markerClass = new parchment.Attributor.Class('markerLink', 'ql-markerLink', {
        scope: parchment.Scope.INLINE
      });
      Quill.register(markerClass, true);

      const pageClass = new parchment.Attributor.Class('pageLink', 'ql-pageLink', {
        scope: parchment.Scope.INLINE
      });
      Quill.register(pageClass, true);

      Quill.register(imageOFPBlot, true);

      editorChangeShineHandler.current = function() {
        //Highlight marker and page link buttons on toolbar whenever you select them
        //shineImage is handled inside 'onClick' event due to diffferent nature
        const selection = quill.getSelection();
        const format = selection ? quill.getFormat(selection) : null; // Throws error if using simple quill.getFormat()
        if (format) {
          if(format.markerLink) {
            setShineMarker(true);
          } else {
            setShineMarker(false);
          }
          if(format.pageLink) {
            setShineLink(true);
          } else {
            setShineLink(false);
          }
        }
      };
      quill.on('editor-change', editorChangeShineHandler.current);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      editorChangePasteHandler.current = function(name: string, ...args: any[]) {
        //I don't understand why 'silent' source moves caret from new position
        //to old position whenever you paste text
        //Only 'editor-change' event is emitted when 'silent' source is used too
        //This code (hopefuly) prevents that weird behaviour
        //console.log(name, args, args[2]);
        if (name === 'selection-change' && args[2] === 'silent' && args[0] && args[1]) {
          if (!wantedCaretPosition.current) {
            wantedCaretPosition.current = args[1].index;
          } else {
            if (args[1].index === wantedCaretPosition.current) {
              quill.setSelection(wantedCaretPosition.current, 0);
              wantedCaretPosition.current = null;
            }
          }
        }
      };
      quill.on('editor-change', editorChangePasteHandler.current);

      textChangeLinksHandler.current = function(newD) {
        //When you type after marker or page links,
        //Format is preserved, which is definetly unwanted behaviour.
        //This code prevents that from happening.
        const ops = newD.ops;
        const isOne = ops.length === 1 && ops[0].insert;
        const isTwo = ops.length === 2 && ops[0].retain && ops[1].insert;
        if (isOne || isTwo) {
          const pos = isOne ? 0 : ops[0].retain as number;
          const insertOperation = isOne ? ops[0] : ops[1];
          const next = quill.getContents(pos+1, 1);
          const prev = quill.getContents(pos-1, 1);
          const atrbtsNext = next.ops[0].attributes;
          const atrbtsPrev = prev.ops.length > 0 ? prev.ops[0].attributes : null;
          const atrbtsCurrent = insertOperation.attributes;
          type Attribute = typeof atrbtsNext | null | undefined;
          const cmpAtrbts = (o1: Attribute, o2: Attribute) => {if (!o1 && !o2) return true; if (!o1 || !o2) return false;return o1.pageLink === o2.pageLink || o1.markerLink === o2.markerLink;};
          if (!cmpAtrbts(atrbtsNext, atrbtsCurrent) || !cmpAtrbts(atrbtsPrev, atrbtsCurrent)) {
            const insert = insertOperation.insert as string;
            if (typeof insert === 'string') {
              const insertedLength = insert.length;
              const deltaToApply: {ops: DeltaOperation[]} = {
                ops: [
                  { retain: insertedLength, attributes: {markerLink: '', pageLink: ''} }
                ]
              };
              if (isTwo) deltaToApply.ops.unshift({ retain: pos});
              quill.updateContents(deltaToApply as Delta);
            }
          }
        }
      };
      quill.on('text-change', textChangeLinksHandler.current);

    }

    return () => {
      if (quill) {
        if (editorChangeShineHandler.current) quill.off('editor-change', editorChangeShineHandler.current);
        if (editorChangePasteHandler.current) quill.off('editor-change', editorChangePasteHandler.current);
        if (textChangeLinksHandler.current) quill.off('text-change', textChangeLinksHandler.current);
        editorChangeShineHandler.current = undefined;
        editorChangePasteHandler.current = undefined;
        textChangeLinksHandler.current = undefined;
      }
    };
  }, [Quill, quill]);

  //Attach event handler that prevents focus stealing
  useEffect(() => {
    if (quill && quillRef.current) {
      const nodeEditor = quillRef.current.children.item(0) as HTMLElement;
      const nodeClipboard = quillRef.current.children.item(1) as HTMLElement;
      if (!editorBlurHandler.current) {
        editorBlurHandler.current = (e: FocusEvent) => {if (e.relatedTarget !== nodeClipboard) quill.disable();};
        nodeEditor.addEventListener('blur', editorBlurHandler.current);
      }
    }
    return () => {
      if (quillRef.current) {
        const node = quillRef.current.children.item(0) as HTMLElement;
        if (editorBlurHandler.current) node.removeEventListener('blur', editorBlurHandler.current);
        editorBlurHandler.current = undefined;
      }
    };
  }, [quill, quillRef]);

  //Get content from storage
  //Add quill event handler to update storage
  useEffect(() => {
    if (quill) {
      try {
        const pageText = storageGetValue(currentPagePath);
        quill.setContents(pageText.content);
        textChangeStorageHandler.current = function() {
          const content = quill.getContents();
          storageChangeValue(currentPagePath+'/content', content);
        };
        quill.on('text-change', textChangeStorageHandler.current);
      } catch (err) {
        // Delta can be set as empty array.
        // But setContents wants to see exactly "Delta" type :S
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        quill.setContents([] as any);
        quill.disable();
      }
    }

    return () => {
      if (quill) {
        if (textChangeStorageHandler.current) quill.off('text-change', textChangeStorageHandler.current);
      }
    };
  }, [quill, currentPagePath]);

  //Add styles to page links and marker links
  useEffect(() => {
    if (quillRef.current) {
      const container = quillRef.current.children.item(0) as HTMLElement;
      if (!container) return;
      const childrenP = container.children;
      for (let i = 0; i < childrenP.length; i++) {
        const child = childrenP.item(i);
        if (!child) return;  
        const childrenSpans = child.children;
        for (let j = 0; j < childrenSpans.length; j++) {
          const element = childrenSpans.item(j) as HTMLElement;
          const classFull = element.className;
          if (classFull.includes('ql-markerLink-')) {
            element.classList.add('ql-markerLink');
            element.classList.remove('ql-pageLink');
          }
          else if (classFull.includes('ql-pageLink-')) {
            element.classList.add('ql-pageLink');
            element.classList.remove('ql-markerLink');
          }
        }
      }
    }
  }, [Quill, quill, quillRef, markerModalState, linkModalState, currentPagePath]);

  function clickedInside(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {

    if (e.target instanceof HTMLElement) {
      if (quillRef.current && quillRef.current.contains(e.target)) {
        quill?.enable();
        quill?.focus();
      }
      
      if (markerModalState.display && markerModalRef.current) {
        const parent = markerModalRef.current as HTMLDivElement;
        const child = e.target as HTMLDivElement;
        if (!parent.contains(child)) {
          setMarkerModalState({
            id: markerModalState.id,
            x: 0,
            y: 0,
            display: false,
            selection: null,
            markerName: '',
          });
          quill?.enable();
        }
      }
      if (linkModalState.display && linkModalRef.current) {
        const parent = linkModalRef.current as HTMLDivElement;
        const child = e.target as HTMLDivElement;
        if (!parent.contains(child)) {
          setLinkModalState({
            id: linkModalState.id,
            x: 0,
            y: 0,
            display: false,
            selection: null,
            pageName: '',
          });
          quill?.enable();
        }
      }
      if (imageModalState.display && imageModalRef.current) {
        const parent = imageModalRef.current as HTMLDivElement;
        const child = e.target as HTMLDivElement;
        if (!parent.contains(child)) {
          setImageModalState({
            id: imageModalState.id,
            x: 0,
            y: 0,
            display: false,
            selection: null,
            imageValue: null,
          });
          quill?.enable();
        }
      }

      const image = Quill.find(e.target.parentNode);
      if (image instanceof imageOFPBlot) {
        setShineImage({
          src: image.domNode.getAttribute('data-value'),
          height: image.domNode.getAttribute('data-height'),
          width: image.domNode.getAttribute('data-width'),
          ref: image.domNode,
        });
      } else {
        setShineImage(null);
      }

    }
  }

  return (
    <div className="quill-editor"
      onClick={(e) => {clickedInside(e);}}
    >
      <MarkerModal
        key={markerModalState.id}
        quill={quill}
        divRef={markerModalRef}
        markerObject={markerModalState}
        setMarkerObject={setMarkerModalState}
      ></MarkerModal>
      <LinkModal
        key={linkModalState.id}
        quill={quill}
        divRef={linkModalRef}
        linkObject={linkModalState}
        setLinkObject={setLinkModalState}
      ></LinkModal>
      <ImageModal
        key={imageModalState.id}
        quill={quill}
        divRef={imageModalRef}
        imageObject={imageModalState}
        imageRef={shineImage ? shineImage.ref : null}
        setImageObject={setImageModalState}
      ></ImageModal>
      <div id="toolbar">
        <select
          defaultValue=""
          className="ql-header">
          <option value="">Normal</option>
          <option value="1">H1</option>
          <option value="2">H2</option>
          <option value="3">H3</option>
          <option value="4">H4</option>
          <option value="5">H5</option>
          <option value="6">H6</option>
        </select>
        <select
          defaultValue=""
          className="ql-align">
          <option value="">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
        <MarkerButton
          shine={shineMarker}
          quill={quill}
          modal={markerModalState}
          setModal={setMarkerModalState}
        ></MarkerButton>
        <LinkButton
          shine={shineLink}
          quill={quill}
          modal={linkModalState}
          setModal={setLinkModalState}
        ></LinkButton>
        <ImageButton
          divRef={imageButtonRef}
          shine={shineImage}
          quill={quill}
          modal={imageModalState}
          setModal={setImageModalState}
        ></ImageButton>
      </div>
      <div
        ref={quillRef} />
    </div>
  );
});

export function findStartAndEnd(initial: number, searchFor: string, quill: Quill): RangeStatic {
  let start = initial;
  let end = 1;
  const limit = quill.getLength();
  const wantedFormat = quill.getFormat(start, end);
  const wantedMarkerLink = wantedFormat[searchFor] as string;
  while (start > 0) {
    const checkFormat = quill.getFormat(start, end);
    const checkMarkerLink = checkFormat[searchFor];
    if (!(checkMarkerLink && typeof checkMarkerLink === 'string' && checkMarkerLink === wantedMarkerLink)) {
      start++;
      break;
    }
    start--;
  }
  while (end < limit) {
    const checkFormat = quill.getFormat(start, end);
    const checkMarkerLink = checkFormat[searchFor];
    if (!(checkMarkerLink && typeof checkMarkerLink === 'string' && checkMarkerLink === wantedMarkerLink)) {
      end--;
      break;
    }
    end++;
  }

  return {
    index: start,
    length: end,
  };
}

