import CellProperty from 'simput/src/components/properties/CellProperty';
import EnumProperty from 'simput/src/components/properties/EnumProperty';
import CheckboxProperty from 'simput/src/components/properties/CheckboxProperty';
import MapProperty from 'simput/src/components/properties/MapProperty';

export default function registerDefaults(registerFn) {
  registerFn('cell', CellProperty);
  registerFn('enum', EnumProperty);
  registerFn('checkbox', CheckboxProperty);
  registerFn('map', MapProperty);
}
