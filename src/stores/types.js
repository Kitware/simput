function objEnum(names) {
  const obj = {};
  names.forEach((name) => {
    obj[name] = name;
  });
  return obj;
}

export const Actions = objEnum([
  // files
  'PROMPT_FOR_FILES',
  'OPEN_FILES',
  'OPEN_REMOTE_FILES',
  'READ_FILES',
  'READ_REMOTE_FILES',

  // templates
  'LOAD_TEMPLATE',
]);

export const Getters = objEnum([
  // templates
  'TEMPLATE_URLS',
  'MODEL',
  'DATAMANAGER',
]);

export const Mutations = objEnum([
  // index
  'SHOW_APP',
  'SHOW_LANDING',

  // files
  'FILE_SET_FILES', // private
  'FILE_PRELOAD', // private
  'FILE_LOAD', // private
  'FILE_ERROR', // private
  'FILE_IDLE', // private
  'FILE_SET_RAW_INFO', // private
  'FILE_SET_ERROR', // private
  'FILE_UPDATE_PROGRESS', // private

  // widgets
  'ADD_WIDGET',

  // model
  'SET_MODEL',

  // templates
  'SET_MODEL',
  'SET_DATAMANAGER',
  'REGISTER_TEMPLATE',
  'UPDATE_TYPE_STATUS',

  // properties
  'ADD_PROPERTY_MAPPING',
]);

export default {
  Actions,
  Getters,
  Mutations,
};
