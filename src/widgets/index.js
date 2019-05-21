import RegionSelector from './RegionSelector';
import ParflowIntroduction from './Introduction';
import SoilDefinition from './SoilDefinition';
import Forcing from './Forcing';

function registerWidgets(Simput) {
  if (Simput.registerWidget) {
    Simput.registerWidget('RegionSelector', RegionSelector);
    Simput.registerWidget('ParflowIntroduction', ParflowIntroduction);
    Simput.registerWidget('SoilDefinition', SoilDefinition);
    Simput.registerWidget('Forcing', Forcing);
  }
}

if (typeof window !== 'undefined' && window.Simput) {
  registerWidgets(window.Simput);
}
