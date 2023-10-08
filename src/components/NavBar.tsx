import { NavLink } from "react-router-dom";
import '../styles/nav-bar.scss';

export interface pageLink {
  title?: string,
  link: string | (() => void) | false,
}

interface NavBarProps {
  sharedLink?: string,
  links: pageLink[],
  highlight?: 'blue' | 'red',
  direction?: 'row' | 'column'
}

export default function NavBar({sharedLink = '', links, highlight = 'blue', direction = 'column'}: NavBarProps) {

  const pageLinks = links.map((linkObj, index) => {
    if (typeof linkObj.link === 'string') {
      return (
        <PageLink key={index} link={sharedLink + linkObj.link}>{linkObj.title || linkObj.link}</PageLink>
      )
    }
    else if (typeof linkObj.link === 'boolean') {
      return (
        <li key={index} className="locked">{linkObj.title}</li>
      )
    }
    else {
      const callback = linkObj.link;
      return (
        <li key={index}><button onClick={() => callback()}>{linkObj.title || "button"}</button></li>
      )
    }
  })

  return (
    <ul className={["nav-bar",highlight,direction].join(' ')}>
      {pageLinks}
    </ul>
  )
}

interface PageLinkProps {
  children: string;
  link: string,
}

function PageLink({children, link}: PageLinkProps) {
  return (
    <li>
      <NavLink
        to={link}
        className={({ isActive }) =>
        isActive ? "active" : ""
        }
      >
        {children}
      </NavLink>
    </li>
  )
}

