import '../../styles/forms.scss';
import { useState } from "react";
import { storageChangeValue } from "../../storage/storage";
import { tooltipProp, useTooltipComponent } from "../../hooks/useTooltip";

interface FormInputSwitchProps {
  name: string,
  className?: string,
  id?: string,
  storagePath?: string,
  value?: boolean,
  tooltip?: tooltipProp;
  onChange?: (x: boolean) => void;
}

export default function FormInputSwitch({name, id = name, storagePath, value = false, tooltip = null, className, onChange}: FormInputSwitchProps) {

  const [tooltipChangeHandler, tooltipLeaveHandler] = useTooltipComponent(tooltip);

  const [checked, setChecked] = useState(value);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setChecked(e.target.checked);
    if (storagePath) storageChangeValue(storagePath, e.target.checked);
    if (onChange) onChange(e.target.checked);
  }

  return (
    <div
    onMouseMove={(e) => tooltipChangeHandler(e)}
    onMouseLeave={() => tooltipLeaveHandler()}
    className={"form-switch " + className}>
      <span>{name}</span>
      <label
      htmlFor={id}>
        <input
        type="checkbox"
        id={id}
        name={id}
        checked={checked}
        onChange={(e) => handleChange(e)}
        ></input>
        <span className="slider"></span>
      </label>
      
    </div>
  )
}
