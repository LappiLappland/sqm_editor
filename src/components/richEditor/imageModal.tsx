import Quill, { RangeStatic } from "quill";
import { useEffect, useState } from "react";
import FormInputText from "../forms/FormInputText";
import { imageOFPValue } from "./imageOFPclass";

export type imageOFPValueModal = imageOFPValue & {ref: HTMLElement | null};

export interface ImageModalStateObject {
  id: number | string,
  x: number,
  y: number,
  display: boolean,
  selection: RangeStatic | null,
  imageValue: imageOFPValueModal | null,
}

interface ImageModalProps {
  quill: Quill | undefined,
  divRef?: React.MutableRefObject<null>,
  imageObject: ImageModalStateObject,
  imageRef: HTMLElement | null,
  setImageObject: React.Dispatch<React.SetStateAction<ImageModalStateObject>>,
}

export function ImageModal({quill, divRef, imageObject, imageRef, setImageObject}: ImageModalProps) {

  const [pathName, setPathName] = useState(imageObject.imageValue?.src || '');
  const [width, setWidth] = useState(imageObject.imageValue ? imageObject.imageValue.width+'' : '')
  const [height, setHeight] = useState(imageObject.imageValue ? imageObject.imageValue.height+'' : '')
  const show = imageObject.display ? 'grid' : 'none';
  
  function keyboardHandler(e: React.KeyboardEvent<HTMLElement>) {
    if (e.key === 'Enter') {
      acceptImageName();
    }
  }
  function acceptImageName() {
    const selection = imageObject.selection;
    if (quill) {
      if (selection) {
        if (pathName) {
          const imageValue: imageOFPValue = {
            src: pathName,
            width: width !== '' ? +width : 128,
            height: height !== '' ? +height : 128,
          }
          if (!imageObject.imageValue) {
            quill.insertEmbed(selection.index, 'imageOFP', imageValue);
          }
          else if (imageObject.imageValue && imageObject.imageValue.ref) {
            const image = Quill.find(imageObject.imageValue.ref);
            if (image) {
              const node = image.domNode as HTMLElement;
              //This is fine =)
              node.setAttribute('data-value', pathName);
              node.setAttribute('data-height', height !== '' ? height : '128');
              node.setAttribute('data-width', width !== '' ? width : '128');
              image.contentNode.textContent = `[img: ${imageValue.src} (${imageValue.width}x${imageValue.height})]`;
            }
          }
          
          //quill.formatText(selection, 'markerLink', 'marker:'+pathName);
        }
      }
      quill.enable();
      setImageObject({
        id: imageObject.id,
        x: 0,
        y: 0,
        display: false,
        selection: null,
        imageValue: null,
      });
    }
    //setMarkerName('')
  }

  useEffect(() => {
    if (imageObject.display && quill) {
      quill?.disable();
    }
  }, [imageObject, quill])

  return (
    <div
    style={{
      display: show,
      top: imageObject.y,
      left: imageObject.x,
    }}
    ref={divRef}
    onKeyDown={(e) => keyboardHandler(e)}
    id="imageModal">
      <FormInputText  className="briefing-input"
      type='string'
      name=''
      placeholder='Enter image path...'
      value={pathName}
      onValueChanged={(x) => setPathName(x)}
      />
      <button
      onClick={() => acceptImageName()}
      >
        →
      </button>
      <div>
        <label htmlFor="width">Width:</label>
        <select id="width"
        value={width} onChange={(e) => {setWidth(e.target.value)}}>
          <option value="512">512</option>
          <option value="256">256</option>
          <option value="">128</option>
          <option value="64">64</option>
          <option value="32">32</option>
          <option value="16">16</option>
          <option value="4">4</option>
          <option value="2">2</option>
          <option value="1">1</option>
        </select>
      </div>
      <div>
        <label htmlFor="height">Height:</label>
        <select id="height"
        value={height} onChange={(e) => {setHeight(e.target.value)}}>
          <option value="512">512</option>
          <option value="256">256</option>
          <option value="">128</option>
          <option value="64">64</option>
          <option value="32">32</option>
          <option value="16">16</option>
          <option value="4">4</option>
          <option value="2">2</option>
          <option value="1">1</option>
        </select>
      </div>
      
    </div>
  )
}