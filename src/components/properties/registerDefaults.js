import CellProperty from 'simput/src/components/properties/CellProperty';
import EnumProperty from 'simput/src/components/properties/EnumProperty';

export default function registerDefaults(registerFn) {
  registerFn('cell', CellProperty);
  registerFn('enum', EnumProperty);
}
