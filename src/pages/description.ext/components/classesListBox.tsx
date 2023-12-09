import { useReducer } from "react";
import { SoundClass } from "../../../storage/data/cfgSounds";
import { storageCreateValue, storageGetValue, storageRemoveValue } from "../../../storage/storage";

interface ClassesListBoxProps {
  value: number,
  setValue: React.Dispatch<React.SetStateAction<number>>,
  storagePath: string,
  storageCreator: () => void,
}

export default function ClassesListBox({value, setValue, storagePath, storageCreator}: ClassesListBoxProps) {

  const [ , forceUpdate] = useReducer((x) => x + 1, 0);

  const classes: SoundClass[] = storageGetValue(storagePath);

  function buttonAddClicked() {
    const id = classes.length;
    storageCreateValue(storagePath, id+'', storageCreator());
    if (id === 0) {
      setValue(0);
    } else {
      forceUpdate();
    }
  }

  function buttonRemoveClicked(id: number) {
    storageRemoveValue(storagePath+'/'+id);
    if (value === id) {
      setValue(value - 1);
    } else {
      forceUpdate();
    }
  }

  function classSelected(e: React.MouseEvent<HTMLLIElement, MouseEvent>, id: number) {
    const target = e.target as HTMLElement;
    if (target.tagName !== 'BUTTON') {
      setValue(id);
    }
  }

  const items = classes.map((item, index) => {
    return (
      <li className={index === value ? 'active' : ''}
        onClick={(e) => classSelected(e, index)}
        key={index} >
        <p>{item.className.slice(1)}</p>
        <button onClick={() => buttonRemoveClicked(index)}
        >X</button>
      </li>
    );
  });

  return (
    <div>
      <h2>Classes</h2>
      <ul>
        {items}
      </ul>
      <button onClick={() => buttonAddClicked()}
      >Add</button>
    </div>
  );
}