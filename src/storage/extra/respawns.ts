import { FormInputRadioBoxItem } from "../../components/forms/FormInputRadioBox";

export const RESPAWN_OPTIONS: FormInputRadioBoxItem[] = [
  {
    name: 'None',
    value: 'NONE',
    id: 0,
  },
  {
    name: 'Seagull',
    value: 'BIRD',
    id: 1,
  },
  {
    name: 'Respawn on body',
    value: 'INSTANT',
    id: 2,
  },
  {
    name: 'Respawn on marker',
    value: 'BASE',
    id: 3,
  },
  {
    name: 'Respawn as AI group member',
    value: 'GROUP',
    id: 4,
  },
];