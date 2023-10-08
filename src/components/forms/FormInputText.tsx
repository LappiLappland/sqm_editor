import '../../styles/forms.scss';
import { useEffect, useReducer, useRef, useState } from "react";
import { calculateValue, mathRegex, MathScope, numberRegex } from "../../helpers/math-number";
import { storageChangeValue, storageGetValue } from "../../storage/storage";
import { tooltipProp, useTooltipComponent } from "../../hooks/useTooltip";
import { scrollToChild } from "../../helpers/DOM";

export type autoCompleteType = {
  id: string,
  option: string,
}[];

interface FormInputTextProps {
  name: string,
  id?: string,
  storagePath?: string
  type?: 'string' | 'number' | 'number-math' | 'class',
  placeholder?: string,
  value?: string,
  onValueChanged?: (value: string) => void,
  disabled?: boolean,
  mathScope?: MathScope,
  autoComplete?: autoCompleteType,
  tooltip?: tooltipProp,
  className?: string,
}

type AutoCompleteItem = {
  value: string,
  e: JSX.Element
};

interface AutoCompleteState {
  current: number,
  items: AutoCompleteItem[],
}

export default function FormInputText({
    name,
    id = name,
    storagePath,
    type = 'string',
    placeholder = '',
    value = '',
    onValueChanged,
    disabled = false,
    mathScope = {},
    autoComplete = [],
    tooltip = null,
    className = '',
  }: FormInputTextProps) {

  const datalistRef = useRef<HTMLUListElement>(null);

  const [tooltipChangeHandler, tooltipLeaveHandler] = useTooltipComponent(tooltip);
  
  const [isFocused, setIsFocused] = useState(false);
  const [currentValue, setCurrentValue] = useState(storagePath ? storageGetValue(storagePath) : value);

  function changeCurrentValue(value: string) {
    if (value !== currentValue) {
      setCurrentValue(value)
      if (onValueChanged) onValueChanged(value);
      if (storagePath) storageChangeValue(storagePath, value);
    }
  }
  

  function autoCompleteReducer(state: AutoCompleteState, action: number) {
    //scrollToChild(datalistRef.current, action)
    return {
      current: action,
      items: filterOnlyAvailableOptions(action)
    }
  }

  const [autoCompleteState, setAutoCompleteState] = useReducer(autoCompleteReducer, {
    current: -1,
    items: filterOnlyAvailableOptions(-1)
  })
  
  useEffect(() => {setAutoCompleteState(-1)}, [currentValue])

  function filterOnlyAvailableOptions(selected: number) {
    const array: AutoCompleteItem[] = [];
    for (let i = 0, a = 0; i < autoComplete.length; i++) {
      const item = autoComplete[i];
      if (item.option === currentValue) continue;
      if (!item.option.includes(currentValue)) continue;
      array.push({
        value: item.option,
        e: (
          <li className={a === selected ? 'active' : ''}
          onMouseEnter={() => setAutoCompleteState(a-1)} //? Why it has to be a-1 ?????
          onClick={() => changeCurrentValue(autoCompleteState.items[a-1].value)}
          key={item.id}>
            {item.option}
          </li>
        )
      });
      a++;
    }
    return array;
  }

  function changeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    let newValue = e.target.value;
    const isCorrectNumber = type === 'number' && numberRegex.test(newValue);
    const isCorrectMath = type === 'number-math' && mathRegex.test(newValue);
    const isCorrectClass = type === 'class' && /^([_a-zA-Z][_a-zA-Z0-9]*)?$/.test(newValue);
    const isCorrectString = type === 'string';

    if (isCorrectMath || isCorrectNumber || isCorrectString || isCorrectClass) {
      changeCurrentValue(newValue);
    } else {
      changeCurrentValue(currentValue);
    }


  }

  function getValue() {
    if (type === 'number-math' && !isFocused) {
      const math = calculateValue(currentValue, mathScope);
      return math === currentValue ? math : '#' + math;
    }
    return currentValue
  }

  function autoCompleteNavigation(e: React.KeyboardEvent<HTMLInputElement>) {
    const curr = autoCompleteState.current;

    if (e.key === 'ArrowDown') {
      if (curr <= autoCompleteState.items.length-2) {
        setAutoCompleteState(curr+1)
        scrollToChild(datalistRef.current, curr+1)
      } else {
        setAutoCompleteState(0)
        scrollToChild(datalistRef.current, 0)
      }
    }
    else if (e.key === 'ArrowUp') {
      if (curr >= 1) {
        setAutoCompleteState(curr-1)
        scrollToChild(datalistRef.current, curr-1)
      } else {
        setAutoCompleteState(autoCompleteState.items.length - 1)
        scrollToChild(datalistRef.current, autoCompleteState.items.length - 1)
      }
    }
    else if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      const value = autoCompleteState.items[curr];
      if (value) changeCurrentValue(value.value);
    }
  }

  return (
    <div
    onMouseMove={(e) => tooltipChangeHandler(e)}
    onMouseLeave={() => tooltipLeaveHandler()}
    className={"form-text "+className}>
      {name ? (<label
      htmlFor={id}>
        {name}
      </label>) : <></>}
      <div>
      <input
      type="text"
      id={id}
      name={id}
      value={getValue()}
      placeholder={placeholder}
      onChange={(e) => changeHandler(e)}
      disabled={disabled}
      onFocus={(e) => setIsFocused(true)}
      onBlur={(e) => {setTimeout(() => setIsFocused(false), 150)}} // don't judge me
      onKeyDown={(e) => autoCompleteNavigation(e)}
      ></input>
      {isFocused && autoCompleteState.items.length > 0 ? (
        <ul ref={datalistRef}
        className="form-text-datalist">
          {autoCompleteState.items.map(e => e.e)}
        </ul>
      ) : <></>
      }
      </div>
    </div>
  )
}
