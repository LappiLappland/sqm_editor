import '../../../styles/briefing.scss';
import NavBar, { pageLink } from '../../../components/NavBar';
import { composeBriefing } from '../../../helpers/ofp-html-composer';
import { saveFile } from '../../../helpers/fs';

export default function BriefingSideBar() {

  const links: pageLink[] = [
    {link: '', title: 'Briefing'},
    {link: 'Objectives'},
    {link: 'showCode', title: 'Show code'},
    {link: () => {saveBriefing();}, title: 'Save'},
    {link: false, title: 'Load'},
  ];

  return (
    <NavBar
      links={links}
      sharedLink="/briefing.html/"
    ></NavBar>
  );
}

function saveBriefing() {
  const code = composeBriefing();
  saveFile('briefing.html', code.join('\n'));
}