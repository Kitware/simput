import HelloWorld from './HelloWorld';
import RegionSelector from './RegionSelector';

function registerWidgets(Simput) {
  if (Simput.registerWidget) {
    Simput.registerWidget('HelloWorld', HelloWorld);
    Simput.registerWidget('RegionSelector', RegionSelector);
  }
}

if (typeof window !== 'undefined' && window.Simput) {
  registerWidgets(window.Simput);
}
