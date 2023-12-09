import NavBar, { pageLink } from "../../../components/NavBar";
import { saveFile, uploadFile } from "../../../helpers/fs";
import { composeDescription } from "../../../helpers/ofp-composer";
import parseDescription from "../../../helpers/ofp-parser";


export default function DescriptionSidebar() {

  const mainLinks: pageLink[] = [
    {link: '', title: 'Mission options'},
    {link: 'cfgIdentities'},
    {link: 'cfgSounds'},
    {link: 'cfgMusic'},
    {link: 'cfgRadio'},
    {link: 'cfgSFX'},
    {link: false, title: 'cfgCameraEffects'},
    {link: 'gear'},
  ];

  const extraLinks: pageLink[] = [
    {link: 'showCode', title: 'Show code'},
    {link: () => {saveDescription();}, title: 'Save'},
    {link: () => {loadDescription();}, title: 'Load'},
  ];

  const sharedLink = "/description.ext/";

  return (
    <aside className="main-sidebar">
      <nav>
        <NavBar
          links={mainLinks}
          sharedLink={sharedLink}
        ></NavBar>
        <NavBar
          links={extraLinks}
          sharedLink={sharedLink}
        ></NavBar>
      </nav>
    </aside>
  );
}

function saveDescription() {
  const code = composeDescription();
  if (code[1].length > 0) {
    const conf = window.confirm('Some errors happened during saving! You can check them in "Show code" tab\nDo you still wish to save file?');
    if (!conf) return;
  } 
  saveFile('description.ext', code[0].join('\n'));
}

async function loadDescription() {
  const content = await uploadFile();
  if (content) {
    try {
      parseDescription(content);
    } catch(err) {
      window.alert('Failed to read data from the file.');
    }
  }
}