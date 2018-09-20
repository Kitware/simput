import TestProperty from './TestProperty';
import CellEditor from './CellEditor';
import RodEditor from './RodEditor';
import AssemblyEditor from './AssemblyEditor';
import CoreEditor from './CoreEditor';
import StateLabelEditor from './StateLabelEditor';
import StateMapEditor from './StateMapEditor';

function registerWidgets(Simput) {
  if (Simput.registerWidget) {
    Simput.registerWidget('test', TestProperty);
    Simput.registerWidget('CellEditor', CellEditor);
    Simput.registerWidget('RodEditor', RodEditor);
    Simput.registerWidget('AssemblyEditor', AssemblyEditor);
    Simput.registerWidget('CoreEditor', CoreEditor);
    Simput.registerWidget('StateLabelEditor', StateLabelEditor);
    Simput.registerWidget('StateMapEditor', StateMapEditor);
  }
}

if (typeof window !== 'undefined' && window.Simput) {
  registerWidgets(window.Simput);
}
