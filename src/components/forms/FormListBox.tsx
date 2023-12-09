import { useEffect, useRef, useState } from "react";

export interface ListItem {
  id: string | number,
  name: string,
  value: string,
} 

export interface ListItemEvent extends ListItem {
  index: number,
}

export interface ListItemAddEvent {
  value: string,
  index: number
}

interface FormListBoxProps {
  title: string,
  list: ListItem[],
  value?: string,
  regexCheck?: RegExp,
  onChange?: (x: string | null, i: number) => void,
  onSectionAdded?: (item: ListItemAddEvent, isUnique: boolean) => void,
  onSectionRemoved?: (item: ListItemEvent) => void,
}

export default function FormListBox({ title, list, value, onChange, onSectionAdded, onSectionRemoved, regexCheck = /$/}: FormListBoxProps) {

  const inputRef = useRef<HTMLInputElement>(null);

  const [addingNewSection, setAddingNewSection] = useState(false);
  const [selectedValue, setSelectedValue] = useState(-1);
  const [currentInput, setCurrentInput] = useState('');

  function changeSelectedValue(id: number) {
    setSelectedValue(id);
    if (onChange) onChange(list[id] ? list[id].value : null, id);
  }

  function inputChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    if (!regexCheck || regexCheck.test(value)) {
      setCurrentInput(value);
    } else {
      setCurrentInput(x => x);
    }
  }

  //Set initialy selected value
  useEffect(() => {
    const id = list.findIndex(e => e.value === value);
    setSelectedValue(id);
  }, [list, value]);

  //Focus input once it displays
  useEffect(() => {
    if (inputRef.current && addingNewSection) {
      inputRef.current.focus();
    }
  }, [inputRef, addingNewSection]);

  function sectionAddedHandler(value: string, index: number) {
    const isUnique = list.filter((e) => e.name === value).length === 0;
    setAddingNewSection(false);
    setCurrentInput('');
    const itemEvent = {
      value,
      index,
    };
    if (onSectionAdded) onSectionAdded(itemEvent, isUnique);
  }
  function sectionRemovedHandler(index: number) {
    const itemEvent = {
      ...list[selectedValue],
      index,
    };
    if (onSectionRemoved) onSectionRemoved(itemEvent);
  }

  const items = list.map((e, i) => {
    return (
      <li key={e.id} className={`${selectedValue === i ? 'active' : ''}`}
        onClick={() => changeSelectedValue(i)}
      >
        {e.name}
      </li>
    );
  });

  if (onSectionAdded) {
    items.push(
      <li key="adding">
        {!addingNewSection ? (
          <button
            onClick={() => setAddingNewSection(true)}
          >Add new section</button>
        ) : (
          <input
            value={currentInput}
            onBlur={(e) => sectionAddedHandler(e.target.value, list.length)}
            onChange={(e) => inputChangeHandler(e)}
            ref={inputRef}></input>
        )}
      
      </li>
    );}
  
  function handleKeyboard(e: React.KeyboardEvent<HTMLElement>) {
    if (e.target instanceof HTMLElement) {
      if (e.target.tagName !== 'INPUT') {
        if (e.key === 'Delete' || e.key === 'Backspace') {
          sectionRemovedHandler(-1);
        }
      } else {
        if (e.key === 'Enter') {
          if (inputRef.current) inputRef.current.blur();
        }
      }
    }
  }

  return (
    <div className="form-listBox">
      <h2>{title}</h2>
      <ul tabIndex={-1}
        onKeyDown={(e) => handleKeyboard(e)}>
        {items}
      </ul>
    </div>
  );
}