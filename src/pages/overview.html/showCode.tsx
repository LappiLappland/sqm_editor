import '../../styles/overview.scss';
import '../../styles/code.scss';
import TopBar from '../../components/TopBar';
import { composeOverview } from '../../helpers/ofp-html-composer';
import OverviewSideBar from './components/overviewSideBar';

export default function OverviewShowCodePage() {

  const entireCode = composeOverview();

  return (
    <>
    <TopBar></TopBar>
    <div className="Overview">
      <aside className="sidebar-low">
        <div></div>
        <OverviewSideBar></OverviewSideBar>
      </aside>
      <main>
      <pre className="parse-code overview-code"><code>
        {entireCode.join('\n')}
      </code></pre>
      </main>
    </div>
    </>
  )
}