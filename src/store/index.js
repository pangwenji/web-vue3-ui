import { createStore } from 'vuex'
import IM from './modules/IM'
import app from './modules/app'
import user from './modules/user'
import personnel from './modules/personnel'
import upload from './modules/upload'
import project from './modules/project'
import tagsView from './modules/tagsView'
import permission from './modules/permission'
import settings from './modules/settings'
import getters from './getters'
import file from './modules/file'
import tool from './modules/tool'
import clouddisk from './modules/clouddisk'
import material from './modules/material'
import workspace from './modules/workspace'
const store = createStore({
  modules: {
    IM,
    app,
    tool,
    user,
    file,
    upload,
    project,
    settings,
    material,
    tagsView,
    workspace,
    personnel,
    clouddisk,
    permission,
  },
  getters
});


export default store