import TopBar from '../../components/TopBar';
import '../../styles/description.scss';
import DescriptionSidebar from './components/sidebar';

export default function DescriptionCameraEffectsPage() {

  
  return (
    <>
    <TopBar></TopBar>
    <div className="main-cfgs">
      <DescriptionSidebar />
      <main>
        <h1>CameraEffects configuration</h1>
        <div>Currently not available</div>
        <div>But may be in the future!</div>
      </main>
    </div>
    </>
  )
}