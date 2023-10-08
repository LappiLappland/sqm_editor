import TopBar from '../../components/TopBar';
import { composeBriefing } from '../../helpers/ofp-html-composer';
import '../../styles/description.scss';
import '../../styles/code.scss';
import BriefingSideBar from './components/briefingSideBar';

export default function BriefingShowCodePage() {

  const entireCode = composeBriefing();

  return (
    <>
    <TopBar></TopBar>
    <div className="Briefing two-columns">
      <aside className="sidebar-low">
        <div></div>
        <BriefingSideBar />
      </aside>
      <main>
        <pre className="parse-code briefing-code"><code>
          {entireCode.join('\n')}
        </code></pre>
      </main>
    </div>
    </>
  )
}