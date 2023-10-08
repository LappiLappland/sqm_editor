import '../../styles/forms.scss';
import { useState } from "react";
import { storageChangeValue } from "../../storage/storage";
import { tooltipProp, useTooltipComponent } from "../../hooks/useTooltip";

export interface FormInputRadioBoxItem {
  name: string,
  id: number,
  value: string,
  image?: string,
}

interface FormInputRadioBoxProps {
  name: string,
  id?: string,
  storagePath?: string,
  className?: string,
  options: FormInputRadioBoxItem[],
  onSelectionChanged?: (id: number, value: string) => void,
  value?: string | number,
  tooltip?: tooltipProp,
}

export default function FormInputRadioBox({name, id = name, storagePath, options, value = -1, className = '', tooltip = null, onSelectionChanged}: FormInputRadioBoxProps) {

  const [tooltipChangeHandler, tooltipLeaveHandler] = useTooltipComponent(tooltip);

  const [selected, setSelected] = useState(() => typeof value === 'string' ? options.findIndex((item) => item.value === value) : value);

  function changeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value;
    setSelected(+newValue);
    if (onSelectionChanged) onSelectionChanged(+newValue, options[+newValue].value);
    if (storagePath) storageChangeValue(storagePath, options[+newValue].value)
  }

  const inputs = options.map((item, index) => {
    return (
      <li key={index}>
        <input
        type="radio"
        id={item.value}
        name={name}
        value={item.id}
        checked={selected === index}
        onChange={(e) => changeHandler(e)}
        />
        <label htmlFor={item.value}>
          {item.image ? (<img
          alt={item.name}
          src={item.image}
          />) : <></>}
          {item.name}
        </label>
      </li>
    )
  })
  
  return (
    <ul
    onMouseMove={(e) => tooltipChangeHandler(e)}
    onMouseLeave={() => tooltipLeaveHandler()}
    className={"form-radioBox " + className}>
      {inputs}
    </ul>
  )
}
