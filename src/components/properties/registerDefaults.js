import CellProperty from 'simput/src/components/properties/CellProperty';
import EnumProperty from 'simput/src/components/properties/EnumProperty';
import CheckboxProperty from 'simput/src/components/properties/CheckboxProperty';

export default function registerDefaults(registerFn) {
  registerFn('cell', CellProperty);
  registerFn('enum', EnumProperty);
  registerFn('checkbox', CheckboxProperty);
}
