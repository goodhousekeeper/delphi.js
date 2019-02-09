(function () {
  'use strict'
  let omfCallBtn = TApplication.other_form.OMF_Button
  let omfCallmodalBtn = TApplication.other_form.OMF_Modal_Button
  let omfCallSplasBtn = TApplication.other_form.OMF_Splash_Button
  let dlgBtn = TApplication.other_form.DLG_Button
  let dateEdit = TApplication.other_form.dateEdit
  let grid = TApplication.other_form.protoGrid

  dateEdit.value('2017-03-19')

  omfCallSplasBtn.onClick(function () {
    TApplication.getOrCreate('splash_form').then((form) => form.align().showModal())
  })

  omfCallBtn.onClick(function () {
    TApplication.getOrCreate('one_more_form').then((form) => form.align().show())
  })

  omfCallmodalBtn.onClick(function () {
    TApplication.getOrCreate('one_more_form').then((form) => form.align().showModal())
  })

  /* show MessageDLG */
  dlgBtn.onClick(function () {
    if (dlgBtn.enabled()) {
      let dlgParams = {}
      let dlg
      dlgParams.caption = 'Test of dialogue'
      dlgParams.message = 'Just a single line of message. Got it?'
      dlgParams.buttons = [TApplication.mbYes, TApplication.mbNo, TApplication.mbCancel]
      dlg = TApplication.messageDlgCustom(dlgParams)
      dlg.onHide(function () {
        console.info(dlg.modalResult)
      }, true)
    }
  })

  grid.onRowClick(function (event) {
    console.info(event.detail)
  })
}())
