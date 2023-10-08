import { Link } from 'react-router-dom';
import '../styles/top-bar.scss'
import NavBar, { pageLink } from './NavBar';

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
          src="/sqm_editor/lappi.png"
          alt="Instructions"
          />
        </Link>
        <NavBar
        links={links}
        highlight="red"
        direction="row"
        ></NavBar>
        <div></div>
      </div>
    </nav>
  )
}