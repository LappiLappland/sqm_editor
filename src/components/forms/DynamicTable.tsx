import '../../styles/forms.scss';
import { useReducer, useState } from "react";
import { findClosestParent, findIndexOfChild } from "../../helpers/DOM";
import { calculateValue, mathRegex, numberRegex } from "../../helpers/math-number";
import { tooltipProp, useTooltipComponent } from "../../hooks/useTooltip";
import { storageChangeValue, storageCreateValue, storageRemoveValue } from "../../storage/storage";
import { CHAR_TYPES } from "../../storage/types";

type DynamicTableTypes = 'string' | 'class' | 'number' | 'number-math' | 'row-id' | 'remove-button';

interface DynamicTableContent {
  name: string,
  placeholder?: string,
  type: DynamicTableTypes,
}

interface DynamicTableProps {
  content: DynamicTableContent[],
  id: string,
  value?: string[][],
  storagePath?: string,
  className?: string,
  canSelect?: boolean,
  forceSelect?: boolean,
  showBottomButtons?: boolean,
  tooltip?: tooltipProp,
  onSelected?: (id: number) => void,
}

export function DynamicTable({
  content,
  id,
  value,
  storagePath,
  className = '',
  canSelect = false, 
  forceSelect = false,
  showBottomButtons = false,
  tooltip = null,
  onSelected,
}: DynamicTableProps) {

  const [tooltipChangeHandler, tooltipLeaveHandler] = useTooltipComponent(tooltip);

  const [currentFocus, setCurrentFocus] = useState(-1);
  const [selectedValue, setSelectedValue] = useReducer((state: number, action: number) => {
    if (onSelected) onSelected(action)
    return action;
  }, forceSelect ? 0 : -1);

  const [values, setValues] = useState(() => value ? setInitialValues(value) : [])

  function setInitialValues(values: string[][]) {
    return values.map((row: string[]) => {
      return row.map((str: string) => {
        return str.slice(1);
      })
    })
  }

  const typesArray = content.map(item => {
    switch (item.type) {
      case 'number':
        return CHAR_TYPES.NUMBER;
      case 'number-math':
        return CHAR_TYPES.NUMBER;
      case 'row-id':
        return CHAR_TYPES.NUMBER;
      case 'string':
        return CHAR_TYPES.STRING;
      case 'class':
        return CHAR_TYPES.STRING;
      default:
        return CHAR_TYPES.STRING;
    }
  })
  
  function updateValue(row: number, col: number, value: string, type: DynamicTableTypes) {
    let newValue = value;

    const isCorrectNumber = type === 'number' && numberRegex.test(newValue);
    const isCorrectMath = type === 'number-math' && mathRegex.test(newValue);
    const isCorrectClass = type === 'class' && /^([_a-zA-Z][_a-zA-Z0-9]*)?$/.test(newValue);
    const isCorrectString = type === 'string';

    if (isCorrectMath || isCorrectNumber || isCorrectString || isCorrectClass) {
      const copy = [...values];
      copy[row][col] = newValue;
      setValues(copy);
      if (storagePath) storageChangeValue(storagePath+`/${row}/${col}`, newValue);  
    } else {
      setValues([...values]);
    }

  }
  function addValue(id: number) {
    const copy = [...values];
    copy.splice(id, 0, Array(content.length).fill(''));
    if (canSelect && forceSelect && selectedValue < 0) {
      setSelectedValue(0);
    }
    setValues(copy);
    if (storagePath) storageCreateValue(storagePath, id+'', Array(content.length).fill(''), typesArray);
  }
  function removeValue(id: number) {
    if (id < 0) return;
    const copy = [...values];
    copy.splice(id, 1);
    if (canSelect && forceSelect && selectedValue === id) {
      setSelectedValue(selectedValue-1);
    }
    setValues(copy);
    if (storagePath) storageRemoveValue(storagePath+'/'+id);
  }

  function arrowsNavigation(e: React.KeyboardEvent<HTMLTableSectionElement>) {
    const target = e.target;
    if (target instanceof HTMLInputElement) {
      if (e.key === 'ArrowDown') {
        const row = findClosestParent(target, 'tr')!;
        const col = findClosestParent(target, 'td')!;
        const index = findIndexOfChild(col);

        const next = row.nextElementSibling as HTMLElement;
        if (next) {
          let newCol = next.children.item(index) as HTMLElement;
          if (newCol.children.length > 0) {
            const input = newCol.children.item(0) as HTMLElement;
            input.focus();
          }
        }
      }
      else if (e.key === 'ArrowUp') {
        const row = findClosestParent(target, 'tr')!;
        const col = findClosestParent(target, 'td')!;
        const index = findIndexOfChild(col);

        const previous = row.previousElementSibling as HTMLElement;
        if (previous) {
          let newCol = previous.children.item(index) as HTMLElement;
          if (newCol.children.length > 0) {
            const input = newCol.children.item(0) as HTMLElement;
            input.focus();
          }
        }
      }
      else if (e.key === 'ArrowLeft') {
        const col = findClosestParent(target, 'td')!;
        const previous = col.previousElementSibling as HTMLElement;
        if (previous && previous.children.length > 0) {
          const input = previous.children.item(0) as HTMLElement;
          input.focus();
        }
      }
      else if (e.key === 'ArrowRight') {
        const col = findClosestParent(target, 'td')!;
        const next = col.nextElementSibling as HTMLElement;
        if (next && next.children.length > 0) {
          const input = next.children.item(0) as HTMLElement;
          input.focus();
        }
      }
    } else {
      keyboardManipulations(e);
    }
  }
  function keyboardManipulations(e: React.KeyboardEvent<HTMLElement>) {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      removeValue(selectedValue);
    }
    else if (e.key === 'Insert') {
      addValue(selectedValue+1);
    }
  }

  function changeFocus(e: React.FocusEvent<HTMLElement, Element>) {
    const target = e.target as HTMLElement;
    if (target && target.tagName === 'INPUT' && !target.nextElementSibling) {
      const row = findClosestParent(target, 'tr')!;
      const index = findIndexOfChild(row);
      setCurrentFocus(index);
    }
    else {
      setCurrentFocus(-1);
    }
  }
  function changeSelectedValue(e: React.MouseEvent<HTMLElement, MouseEvent>, row: number) {
    if (e.target instanceof HTMLElement && e.target.tagName === 'TD' && canSelect) {
      setSelectedValue(row);
    }
  }

  function getCalculatedValue(value: string, row: number) {
    if (currentFocus === row) return value;
    const scope = {x: row+1, X: row+1};
    const calculated = calculateValue(value, scope);
    if (calculated === value) return value;
    return '#'+calculated;
  }

  function createCell(row: number, col: number) {
    const typeDefinition = content[col];
    const type = typeDefinition.type;
    const cell = values[row][col];
    if (type === 'string' || type === 'number' || type === 'class') {
      return (
        <td key={col} onClick={(e) => changeSelectedValue(e, row)}
        >
          <input
          type='text'
          placeholder={typeDefinition.placeholder}
          onChange={(e) => updateValue(row, col, e.target.value, typeDefinition.type)}
          value={cell}
          />
        </td>
      )
    }
    else if (type === 'row-id') {
      return (
        <td key={col} onClick={() => {if (canSelect) setSelectedValue(row)}}
        >{row}</td>
      )
    }
    else if (type === 'remove-button') {
      return (
        <td key={col}
        ><button onClick={() => {removeValue(row)}}>
        X</button></td>
      )
    }
    else if (type === 'number-math') {
      return (
        <td key={col} onClick={(e) => changeSelectedValue(e, row)}
        >
          <input
          type='text'
          placeholder={typeDefinition.placeholder}
          onChange={(e) => updateValue(row, col, e.target.value, typeDefinition.type)}
          value={getCalculatedValue(cell, row)}
          />
        </td>
      )
    }
  }

  const tableHeaders = content.map((item, index) => {
    return (
      <th key={index}>{item.name}</th>
    )
  })

  const tableItems = values.map((row, indexR) => {
    return (
      <tr key={indexR} tabIndex={-1} className={indexR === selectedValue ? 'selected' : ''}>
        {row.map((cell, indexC) => createCell(indexR, indexC))}
      </tr>
    )
  })


  return (
    <fieldset
    onMouseMove={(e) => tooltipChangeHandler(e)}
    onMouseLeave={() => tooltipLeaveHandler()}
    onFocus={(e) => {changeFocus(e)}}
    className={className}>

      <table >
        <thead>
          <tr>
            {tableHeaders}
          </tr>
        </thead>
        <tbody onKeyDown={(e) => arrowsNavigation(e)}>
          {tableItems}
        </tbody>
      </table>

      {showBottomButtons ? (<div className="buttons">
        <button onClick={(e) => {e.preventDefault();addValue(values.length)}}
        >
          Add value
        </button>
        <button onClick={(e) => {e.preventDefault();removeValue(values.length-1)}}
        >
          Remove value
        </button>
      </div>) : <></>}

    </fieldset>
  )

}