import { useContext } from "react";
import { ThemeContext } from "./ThemeContext";

export default function ThemeSwitch() {

  const theme = useContext(ThemeContext);

  if (!theme) return (<div></div>);

  const changeThemeTo = theme.theme === 'dark' ? 'light' : 'dark';

  return (
    <div className="theme-switcher">
      <button
        onClick={() => theme.setTheme(changeThemeTo)}
      >
        {theme.theme[0].toUpperCase() + theme.theme.slice(1)} Theme
      </button>
    </div>
  );
}