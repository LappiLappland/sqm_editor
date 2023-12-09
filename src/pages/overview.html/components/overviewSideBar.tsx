import '../../../styles/briefing.scss';
import NavBar, { pageLink } from '../../../components/NavBar';
import { composeOverview } from '../../../helpers/ofp-html-composer';
import { saveFile } from '../../../helpers/fs';

export default function OverviewSideBar() {

  const links: pageLink[] = [
    {link: '', title: 'Overview'},
    {link: 'showCode', title: 'Show code'},
    {link: () => {saveOverview();}, title: 'Save'},
    {link: false, title: 'Load'},
  ];

  return (
    <NavBar
      links={links}
      sharedLink="/overview.html/"
    ></NavBar>
  );
}

function saveOverview() {
  const code = composeOverview();
  saveFile('overview.html', code.join('\n'));
}
