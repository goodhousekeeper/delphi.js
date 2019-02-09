/* *************************** TAPPLICATION ********************************* */
(function () {
  'use strict'
  let applicationInstance = Object.create(null) // App object linked to в window.TApplication
  let applicationProperties = {} // App settings object
  let components = {} // App components storage object
  let modalStack = [] // Modal forms links array
  let uses = {} // Property to store forms and modules
  let vcl = {} // Property to store compomnents library
  let animationEnabled = true // Use animation or not
  let running = false // App running or not
  let caption = 'Delphi.js' // App default caption
  let mainFormName = '' // App main form name

  /* App settings  */
  applicationProperties.faviconPath = window.location.protocol + '//' + window.location.host + window.location.pathname + 'favicon.ico'
  applicationProperties.absolutePathToApplicationRoot = window.location.protocol + '//' + window.location.host + window.location.pathname
  applicationProperties.disabledClassName = 'Disabled'
  applicationProperties.checkedClassName = 'Checked'
  applicationProperties.uncheckedClassName = 'Unchecked'
  applicationProperties.invalidatedClassName = 'Invalidated'
  applicationProperties.bringToFrontZIndex = 1000
  applicationProperties.animationSpeed = 200
  applicationProperties.animationTimingLinear = (timeFraction) => timeFraction
  applicationProperties.animationTimingArc = (timeFraction) => 1 - Math.sin(Math.acos(timeFraction))

  /* TAjax settings - definition loader */
  applicationProperties.definitionLoaderComponentName = 'definitionLoader'

  /* TOverlay settings */
  applicationProperties.overlayComponentName = 'overlay'
  applicationProperties.overlayZindex = 1000000

  /* TDatePickerDlg settings */
  applicationProperties.datePickerComponentName = 'datePickerDlgForm'
  applicationProperties.datePickerMonthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  applicationProperties.chosenDateClassName = 'ChosenDate'
  applicationProperties.dateClassName = 'Date'
  applicationProperties.holidayClassName = 'Holiday'

  /* TMessageDlg settings */
  applicationProperties.messageDialogueName = 'messageDlgForm'
  applicationProperties.messageDialogueButtons = ['messageDlgOK', 'messageDlgNo', 'messageDlgYes', 'messageDlgClose', 'messageDlgCancel', 'messageDlgAbort', 'messageDlgRetry', 'messageDlgIgnore']

  /* TMessageDLG buttons constants. In case of changing - dont't forget DFM.DELPHI.JS and messageDialogueButtons */
  Object.defineProperty(applicationInstance, 'mbOK', {value: 'messageDlgOK'})
  Object.defineProperty(applicationInstance, 'mbYes', {value: 'messageDlgYes'})
  Object.defineProperty(applicationInstance, 'mbNo', {value: 'messageDlgNo'})
  Object.defineProperty(applicationInstance, 'mbAbort', {value: 'messageDlgAbort'})
  Object.defineProperty(applicationInstance, 'mbRetry', {value: 'messageDlgRetry'})
  Object.defineProperty(applicationInstance, 'mbIgnore', {value: 'messageDlgIgnore'})
  Object.defineProperty(applicationInstance, 'mbClose', {value: 'messageDlgClose'})
  Object.defineProperty(applicationInstance, 'mbCancel', {value: 'messageDlgCancel'})

  /* TMessageDLG modalResult constants.  In case of changing - dont't forget  DFM.DELPHI.JS */
  Object.defineProperty(applicationInstance, 'mrOK', {value: 'mrOK'})
  Object.defineProperty(applicationInstance, 'mrYes', {value: 'mrYes'})
  Object.defineProperty(applicationInstance, 'mrNo', {value: 'mrNo'})
  Object.defineProperty(applicationInstance, 'mrAbort', {value: 'mrAbort'})
  Object.defineProperty(applicationInstance, 'mrRetry', {value: 'mrRetry'})
  Object.defineProperty(applicationInstance, 'mrIgnore', {value: 'mrIgnore'})
  Object.defineProperty(applicationInstance, 'mrClose', {value: 'mrClose'})
  Object.defineProperty(applicationInstance, 'mrCancel', {value: 'mrCancel'})

  /* TMessageDLG messageDialogueType constants */
  Object.defineProperty(applicationInstance, 'mtWarning', {value: 'mtWarning'})
  Object.defineProperty(applicationInstance, 'mtError', {value: 'mtError'})
  Object.defineProperty(applicationInstance, 'mtInformation', {value: 'mtInformation'})
  Object.defineProperty(applicationInstance, 'mtConfirmation', {value: 'mtConfirmation'})
  Object.defineProperty(applicationInstance, 'mtCustom', {value: 'mtCustom'})

  /* Property to store core functionality */
  Object.defineProperty(applicationInstance, 'core', {
    get: function () {
      return {
        createComponent: function (properties) {
          let p = properties !== undefined ? properties : Object.create(null)
          if (components.hasOwnProperty(p.name)) {
            console.error('Component with name ' + p.name + ' already exists.')
            return false
          }
          components[p.name] = p.object
        },

        getComponent: function (componentName) {
          if (components.hasOwnProperty(componentName)) {
            return components[componentName]
          } else {
            return false
          }
        },

        removeComponent: function (ownerName, registerName) {
          if (components.hasOwnProperty(registerName)) {
            delete components[registerName]
            if (applicationInstance[registerName]) {
              delete applicationInstance[registerName]
            }
            if (components.hasOwnProperty(ownerName)) {
              delete components[ownerName][registerName]
            }
            return true
          } else {
            return false
          }
        },

        getProperty: (name) => applicationProperties.hasOwnProperty(name) ? applicationProperties[name] : undefined,

        get modalStack () {
          return modalStack
        },

        get definitionLoader () {
          return applicationInstance.core.getComponent(applicationProperties.definitionLoaderComponentName)
        },

        get overlay () {
          return applicationInstance.core.getComponent(applicationProperties.overlayComponentName)
        },

        get messageDlg () {
          return applicationInstance.core.getComponent(applicationProperties.messageDialogueName)
        },

        get datePickerDlg () {
          return applicationInstance.core.getComponent(applicationProperties.datePickerComponentName)
        },

        get mainForm () {
          return applicationInstance.core.getComponent(mainFormName)
        },

        getRadioButtonsByGroup: function (groupName) {
          let result = []
          Object.getOwnPropertyNames(components).forEach(function (componentName) {
            if (components[componentName].radioButtonGroup === groupName) {
              result.push(components[componentName])
            }
          })
          return result
        },

        getComponentsByClassName: function (className) {
          let result = []
          Object.getOwnPropertyNames(components).forEach(function (componentName) {
            if (components[componentName].getProperty('className') === className) {
              result.push(components[componentName])
            }
          })
          return result
        },

        animate: function (options) {
          let start = performance.now()
          const duration = !options.duration ? applicationProperties.animationSpeed : options.duration
          const timing = !options.timing ? applicationProperties.animationTimingLinear : options.timing

          if (applicationInstance.animationEnabled) {
            window.requestAnimationFrame(function animate (time) {
              /* timeFraction от 0 до 1 */
              let timeFraction = (time - start) / duration
              if (timeFraction > 1) {
                timeFraction = 1
              }
              /* current animation state */
              let progress = timing(timeFraction)
              options.draw(progress)
              if (timeFraction < 1) {
                window.requestAnimationFrame(animate)
              } else {
                if (options.callback) {
                  options.callback()
                }
              }
            })
          } else {
            options.draw(1.0)
            if (options.callback) {
              options.callback()
            }
          }
        }
      }
    }
  })

  Object.defineProperty(applicationInstance, 'caption', {
    get: () => caption,
    set: function (newCaption) {
      caption = newCaption
      document.title = newCaption
    }
  })

  Object.defineProperty(applicationInstance, 'animationEnabled', {
    get: () => animationEnabled,
    set: function (value) {
      animationEnabled = Boolean(value)
    }
  })

  Object.defineProperty(applicationInstance, 'mainFormName', {
    get: () => mainFormName,
    set: function (newName) {
      mainFormName = newName
    }
  })

  Object.defineProperty(applicationInstance, 'vcl', {
    get: () => vcl
  })

  Object.defineProperty(applicationInstance, 'uses', {
    get: () => uses
  })

  applicationInstance.messageDlgCustom = function (dlgParams) {
    let dlg = applicationInstance.core.messageDlg
    let params = dlgParams || {}
    dlg.caption = params.caption || 'Custom dialogue'
    dlg.message = params.message || 'Custom dialogue message'
    dlg.type = params.type || applicationInstance.mtCustom
    dlg.buttons = params.buttons || [applicationInstance.mbCancel]
    dlg.showModal()
    return dlg
  }

  applicationInstance.messageDlgConfirmation = function (message) {
    let dlg = applicationInstance.core.messageDlg
    dlg.caption = 'Confirm'
    dlg.message = message
    dlg.type = applicationInstance.mtConfirmation
    dlg.buttons = [applicationInstance.mbYes, applicationInstance.mbNo]
    dlg.showModal()
    return dlg
  }

  applicationInstance.messageDlgInformation = function (message) {
    let dlg = applicationInstance.core.messageDlg
    dlg.caption = 'Inform'
    dlg.message = message
    dlg.type = applicationInstance.mtInformation
    dlg.buttons = [applicationInstance.mbOK]
    dlg.showModal()
    return dlg
  }

  applicationInstance.messageDlgError = function (message) {
    let dlg = applicationInstance.core.messageDlg
    dlg.caption = 'Error'
    dlg.message = message
    dlg.type = applicationInstance.mtError
    dlg.buttons = [applicationInstance.mbOK]
    dlg.showModal()
    return dlg
  }

  applicationInstance.messageDlgWarning = function (message) {
    let dlg = applicationInstance.core.messageDlg
    dlg.caption = 'Warning'
    dlg.message = message
    dlg.type = applicationInstance.mtWarning
    dlg.buttons = [applicationInstance.mbAbort, applicationInstance.mbRetry, applicationInstance.mbIgnore]
    dlg.showModal()
    return dlg
  }

  applicationInstance.getOrCreate = function (name) {
    function _create (def) {
      def.parent = document.body
      def.ownerName = def.name
      def.registerName = def.name
      let component = new applicationInstance.vcl[def.className](def)
      Object.defineProperty(applicationInstance, def.name, {
        get: () => applicationInstance.core.getComponent(def.name)
      })
      if (def.name === applicationProperties.mainFormName) {
        applicationInstance.core.mainForm.onHide(() => applicationInstance.terminate())
      }
      document.dispatchEvent(new CustomEvent(def.name + '.onCreate'))
      return (component)
    };

    return new Promise(function (resolve, reject) {
      if (applicationInstance.core.getComponent(name)) {
        resolve(applicationInstance.core.getComponent(name))
      } else {
        let loader = applicationInstance.core.definitionLoader
        loader.setProperty(
          'URL',
          applicationProperties.absolutePathToApplicationRoot +
                    applicationInstance.uses[name]
        )
        loader.onSuccessHandler = (def) => resolve(_create(JSON.parse(def)))
        loader.onAbortHandler = (error) => reject(new Error(error))
        loader.execute()
      }
    })
  }

  applicationInstance.initialize = function () {
    let link
    if (running) {
      return false
    }
    document.body.classList.add('TApplication')
    applicationInstance.caption = caption
    link = document.createElement('link')
    link.type = 'image/x-icon'
    link.rel = 'shortcut icon'
    link.href = applicationProperties.faviconPath
    document.getElementsByTagName('head')[0].appendChild(link)
    /* eslint-disable no-new */
    new applicationInstance.vcl.TOverlay(TApplicationDFM.overlay(applicationProperties.overlayComponentName))
    new applicationInstance.vcl.TMessageDlg(TApplicationDFM.dialogue(applicationProperties.messageDialogueName))
    new applicationInstance.vcl.TDatePickerDlg(TApplicationDFM.datePicker(applicationProperties.datePickerComponentName))
    new applicationInstance.vcl.TAjax(TApplicationDFM.definitionLoader(applicationProperties.definitionLoaderComponentName))
    /* eslint-enable no-new */
    running = true
    document.dispatchEvent(new CustomEvent('Application.onReady'))
    return applicationInstance
  }

  applicationInstance.terminate = function () {
    applicationInstance.core.getComponentsByClassName('TForm').forEach((form) => form.destroy())
    applicationInstance.core.getComponentsByClassName('TDataModule').forEach((dm) => dm.destroy())
    applicationInstance.core.overlay.destroy()
    applicationInstance = undefined
    applicationProperties = undefined
    components = undefined
    delete window.TApplication
    delete window.TApplicationDFM
  }

  window.TApplication = applicationInstance
}())
