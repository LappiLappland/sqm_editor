import Quill from "quill";

const Embed = Quill.import('blots/embed');

export interface imageOFPValue {
  src: string,
  width: number,
  height: number,
}

class imageOFPBlot extends Embed {
  static blotName = 'imageOFP';
  static className = 'ql-imageOFP';
  static tagName = 'SPAN';

  static create(value: imageOFPValue) {
    
    const node = super.create('') as Element;
    node.textContent = `[img: ${value.src} (${value.width}x${value.height})]`;
    node.setAttribute('data-value', value.src);
    node.setAttribute('data-height', value.height+'');
    node.setAttribute('data-width', value.width+'');
    return node;
  }

  static value(domNode: Element) {
    return {
      src: domNode.getAttribute('data-value'),
      height: domNode.getAttribute('data-height'),
      width: domNode.getAttribute('data-width'),
    };
  }
}

export default imageOFPBlot;