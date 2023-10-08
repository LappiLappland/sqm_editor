import '../styles/index-page.scss';
import TopBar from "../components/TopBar";

export default function IndexPage() {
  return (
    <>
    <TopBar></TopBar>
    <main className="index-main">
      <ExtrasMenu></ExtrasMenu>
      <HotkeysMenu></HotkeysMenu>
    </main>
    </>
  )
}

function HotkeysMenu() {
  return (
    <div>
      <h1>Controls</h1>

      <h2>Tables</h2>
      <ul>
        <li>
          <span className="key">↑</span>
          <span className="key">↓</span>
          <span className="key-desc">move between rows</span>
        </li>
        <li>
          <span className="key">←</span>
          <span className="key">→</span>
          <span className="key-desc">move between columns</span>
        </li>
        <li>
          <span className="key">Delete</span>
          <span className="key">Backspace</span>
          <span className="key-desc">remove selected row</span>
        </li>
        <li>
          <span className="key">Insert</span>
          <span className="key-desc">insert new row after selected</span>
        </li>
      </ul>

      <h2>Text word completion</h2>
      <ul>
        <li>
          <span className="key">↑</span>
          <span className="key">↓</span>
          <span className="key-desc">move between optinos</span>
        </li>
        <li>
          <span className="key">←</span>
          <span className="key">→</span>
          <span className="key-desc">move between columns</span>
        </li>
        <li>
          <span className="key">Enter</span>
          <span className="key">Tab</span>
          <span className="key-desc">accept selected option</span>
        </li>
      </ul>

    </div>
  )
}

function ExtrasMenu() {
  return (
    <div className="index-extras">
      <h1>Useful information</h1>

      <h2>Inputs</h2>
      <ul>
        <li>
          <span>
            When input accepts only numbers,
            you can use basic math operations
          </span>
          <span>(+, -, /, *, ^ power of, % division remainder)</span>
        </li>
        <li>
          On some inputs you can use auto fill
          (vanila ofp values are used)
        </li>
        <li>
          If you hover over input and wait a little, a hint will pop up
        </li>
      </ul>

      <h2>Tables</h2>
      <ul>
        <li>
          You can write 'X' inside cells that accept numbers
          to reference current row
        </li>
      </ul>

    </div>
  )
}