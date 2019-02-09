(function () {
  'use strict'
  let form = TApplication.main_form
  let abBtn = form.aboutButton
  let cncBtn = form.concatenateButton
  let resultTbl = form.labelResult
  let firstEdit = form.editStringOne
  let secondEdit = form.editStringTwo
  let memo = form.myMemo
  let chbx = form.firstCheckBox
  let getUsdRateBtn = form.getUSDRateButton
  let getEuroRateBtn = form.getEuroDRateButton
  let getCurrencyRate = TApplication.data_module.getCurrencyRate

  abBtn.onClick(function () {
    TApplication.getOrCreate('other_form').then((form) => form.align().show())
  })

  function showCurrencyRate (button, currName) {
    let dlgParams = {}
    button.enabled(false)
    dlgParams.caption = 'Сообщение о курсе валюты'
    dlgParams.type = TApplication.mtInformation
    dlgParams.buttons = [TApplication.mbOK]
    getCurrencyRate.data.currName = currName
    getCurrencyRate.onSuccessHandler = function (result) {
      let response = JSON.parse(result)
      dlgParams.message = "Курс валюты '" + response.Name + "' : " + response.Value + ' руб.'
      TApplication.messageDlgCustom(dlgParams)
      button.enabled(true)
    }
    getCurrencyRate.execute()
  }

  /* concatenate two strings  */
  cncBtn.onClick(function () {
    resultTbl.caption = firstEdit.value() + secondEdit.value()
  })

  firstEdit.onInput(function () {
    console.info(firstEdit.value())
  })

  chbx.onChange(function () {
    console.info(chbx.checked())
  })

  memo.onInput(function () {
    console.info(memo.value())
  })

  getUsdRateBtn.onClick(function () {
    if (getUsdRateBtn.enabled()) {
      showCurrencyRate(getUsdRateBtn, 'USD')
    }
  })

  getEuroRateBtn.onClick(function () {
    if (getEuroRateBtn.enabled()) {
      showCurrencyRate(getEuroRateBtn, 'EUR')
    }
  })

  TApplication.main_form.hideQuery = function () {
    let dlg = TApplication.messageDlgConfirmation('Вы действительно хотите завершить работу с приложением?')
    dlg.onHide(function () {
      if (dlg.modalResult === TApplication.mrYes) {
        TApplication.terminate()
      }
    }, true)
  }
}())
