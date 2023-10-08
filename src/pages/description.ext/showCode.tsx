import TopBar from '../../components/TopBar';
import { composeDescription } from '../../helpers/ofp-composer';
import '../../styles/description.scss';
import '../../styles/code.scss';
import DescriptionSidebar from './components/sidebar';

export default function DescriptionShowCodePage() {

  const entireCode = composeDescription();

  return (
    <>
    <TopBar></TopBar>
    <div className="desc-shared desc-gear">
      <DescriptionSidebar />
      <main>
      { 
      entireCode[1].length === 0 ? <></> : (
      <ul className="parse-errors">
        {entireCode[1].map((item, index) => <li key={index}>{item}</li>)}
      </ul> )
      }
      <pre className="parse-code"><code>
        {entireCode[0].join('\n')}
      </code></pre>
      </main>
    </div>
    </>
  )
}