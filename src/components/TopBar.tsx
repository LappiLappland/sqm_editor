import { Link } from 'react-router-dom';
import { PAGE_PATH } from '../main';
import '../styles/top-bar.scss';
import NavBar, { pageLink } from './NavBar';
import ThemeSwitch from './ThemeSwitch';

export default function TopBar() {

  const links: pageLink[] = [
    {link: "/briefing.html/", title: 'Briefing'},
    {link: "/overview.html/", title: 'Overview'},
    {link: "/description.ext/", title: 'Description'},
  ];

  return (
    <nav className="top-bar">
      <div>
        <Link to="/">
          <img
            src={PAGE_PATH+'/sqm_editor/lappi.png'}
            alt="Instructions"
          />
        </Link>
        <NavBar
          links={links}
          highlight="red"
          direction="row"
        ></NavBar>
        <ThemeSwitch />
      </div>
    </nav>
  );
}