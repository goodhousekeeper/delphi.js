document.addEventListener('DOMContentLoaded', function () {
  'use strict'
  /* Create dictionary of forms and modules */
  TApplication.uses.data_module = 'application/modules/main/dm.json'
  TApplication.uses.main_form = 'application/forms/main/mf.json'
  TApplication.uses.other_form = 'application/forms/other/oth.json'
  TApplication.uses.one_more_form = 'application/forms/one_more/om.json'
  TApplication.uses.splash_form = 'application/forms/splash/sp.json'
  /* Set up application properties */
  TApplication.mainFormName = 'main_form'
  TApplication.caption = 'Delphi.js Boilerplate'
  TApplication.animationEnabled = true
  /* ------------------------------------------------------ */
  TApplication.initialize()
  /* ------------------------------------------------------ */
  TApplication.getOrCreate('data_module')
  TApplication.getOrCreate('main_form')
  /* ------------------------------------------------------ */
})
