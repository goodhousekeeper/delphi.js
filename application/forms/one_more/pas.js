(function () {
  'use strict'
  TApplication.one_more_form.hideQuery = function (callback) {
    let dlg
    dlg = TApplication.messageDlgConfirmation('Вы действительно хотите закрыть это окно?')
    dlg.onHide(function () {
      if (dlg.modalResult === TApplication.mrYes) {
        callback()
      }
    }, true)
  }
}())
