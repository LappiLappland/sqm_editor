import '../../styles/overview.scss';
import FormInputText from '../../components/forms/FormInputText';
import RichEditorQuill from '../../components/richEditor/RichEditorQuill';
import TopBar from '../../components/TopBar';
import OverviewSideBar from "./components/overviewSideBar";

export default function OverviewPage() {

  return (
    <>
      <TopBar></TopBar>
      <div className="Overview">
        <aside className="sidebar-low">
          <nav>
            <OverviewSideBar></OverviewSideBar>
          </nav>
        </aside>
        <main>
          <fieldset>
            <h2>Mission title</h2>
            <FormInputText className="mission-title"
              id="missiontitle"
              name=""
              placeholder="mission title"
              storagePath="overview/title"
            ></FormInputText>
          </fieldset>

          <fieldset className="picture-settings">
            <h2>Picture</h2>
            <FormInputText className="picture-path"
              id="picture"
              name=""
              placeholder="picture path"
              storagePath="overview/image/src"
            ></FormInputText>
            <FormInputText className="picture-width"
              id="width"
              name="width:"
              placeholder="170"
              type="number"
              storagePath="overview/image/width"
            ></FormInputText>
            <FormInputText className="picture-height"
              id="heigth"
              name="height:"
              placeholder="64"
              type="number"
              storagePath="overview/image/height"
            ></FormInputText>
          </fieldset>
          <fieldset className="mission-description">
            <h2>Description</h2>
            <RichEditorQuill
              currentPagePath="overview/description"
            ></RichEditorQuill>
          </fieldset>
        </main>
      </div>
    </>
  );
}