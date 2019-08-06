import ViewerWidget from './ViewerWidget';

function registerWidgets(Simput) {
  if (Simput.registerWidget) {
    Simput.registerWidget('ViewerWidget', ViewerWidget);
  }
}

if (typeof window !== 'undefined' && window.Simput) {
  registerWidgets(window.Simput);
}
