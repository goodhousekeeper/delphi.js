/* ********************************************* TCOMPONENT  ********************************************************* */
TApplication.vcl.TComponent = function (props) {
  TApplication.core.createComponent({'name': props.registerName, 'object': this})
  this.setProperty = function (name, value) {
    props[name] = value
  }
  this.getProperty = (name) => props.hasOwnProperty(name) ? props[name] : undefined
}

TApplication.vcl.TComponent.prototype = Object.create(null)

TApplication.vcl.TComponent.prototype.createContent = function () {
  const ownerName = this.getProperty('ownerName')
  Object.entries(this.getProperty('TComponents')).forEach(([name, properties]) => {
    properties.name = name
    properties.parent = this.getProperty('clientArea')
    properties.ownerName = ownerName
    properties.registerName = `${properties.ownerName}.${properties.name}`
    TApplication.core.getComponent(ownerName)[name] = new TApplication.vcl[properties.className](properties)
  })
}

TApplication.vcl.TComponent.prototype.destroy = function () {
  const ownerName = this.getProperty('ownerName')
  Object.keys(this.getProperty('TComponents') || {}).forEach((name, index) => {
    TApplication.core.getComponent(`${ownerName}.${name}`).destroy()
  })
  TApplication.core.removeComponent(ownerName, this.getProperty('registerName'))
  if (this.getProperty('DOMcontainer')) {
    this.getProperty('parent').removeChild(this.getProperty('DOMcontainer'))
  }
}

/* ********************************************* TCONTROL ********************************************************* */

TApplication.vcl.TControl = function (...properties) {
  TApplication.vcl.TComponent.apply(this, properties)
  Object.defineProperty(this, 'isVisible', {
    get: () => this.getProperty('visible')
  })
  Object.defineProperty(this, 'container', {
    get: () => this.getProperty('DOMcontainer')
  })
  Object.defineProperty(this, 'style', {
    get: () => this.container.style
  })
  Object.defineProperty(this, 'caption', {
    configurable: true,
    get: () => document.getElementById(this.container.id + '.Caption').innerText,
    set: function (newCaption) {
      document.getElementById(this.container.id + '.Caption').innerText = newCaption || ''
    }
  })
}

TApplication.vcl.TControl.prototype = Object.create(TApplication.vcl.TComponent.prototype)

TApplication.vcl.TControl.prototype.setEventListener = function (eventName, fnc, runOnce = false) {
  let that = this
  if (runOnce) {
    that.container.addEventListener(eventName, function set (e) {
      e.target.removeEventListener(e.type, set)
      return fnc(e, that)
    })
  } else {
    that.container.addEventListener(eventName, fnc, false)
  }
}

TApplication.vcl.TControl.prototype.createNode = function () {
  'use strict'
  let container = document.createElement('div')

  Object.assign(container, {
    id: this.getProperty('registerName'),
    className: this.getProperty('className')
  })

  Object.assign(container.style, {
    whiteSpace: this.getProperty('multiLine') ? 'normal' : 'nowrap',
    color: this.getProperty('color') ? this.getProperty('color') : '',
    fontSize: this.getProperty('fontSize') ? this.getProperty('fontSize') : '',
    fontWeight: this.getProperty('fontWeight') ? this.getProperty('fontWeight') : '',
    fontStyle: this.getProperty('fontStyle') ? this.getProperty('fontStyle') : '',
    textAlign: this.getProperty('textAlign') ? this.getProperty('textAlign') : '',
    width: this.getProperty('width') ? this.getProperty('width') + 'px' : '',
    minWidth: this.getProperty('minWidth') ? this.getProperty('minWidth') + 'px' : '',
    height: this.getProperty('height') ? this.getProperty('height') + 'px' : '',
    minHeight: this.getProperty('minHeight') ? this.getProperty('minHeight') + 'px' : '',
    top: this.getProperty('top') !== undefined ? this.getProperty('top') + 'px' : '',
    left: this.getProperty('left') !== undefined ? this.getProperty('left') + 'px' : '',
    right: this.getProperty('right') !== undefined ? this.getProperty('right') + 'px' : '',
    bottom: this.getProperty('bottom') !== undefined ? this.getProperty('bottom') + 'px' : '',
    visibility: 'hidden'
  })

  this.getProperty('parent').appendChild(container)
  this.setProperty('DOMcontainer', container)

  if (this.getProperty('TComponents')) {
    let clientArea = document.createElement('div')
    Object.assign(clientArea, {
      id: `${container.id}.ClientArea`,
      className: 'ClientArea'
    })
    container.appendChild(clientArea)
    this.setProperty('clientArea', clientArea)
    this.createContent()
  }

  if (this.getProperty('enabled') === false) {
    this.enabled(false)
  } else {
    this.setProperty('enabled', true)
  }

  this.setProperty('visible', this.getProperty('visible') === undefined ? true : Boolean(this.getProperty('visible')))
  if (this.isVisible === true) {
    this.show()
  }

  this.invalidated(false)

  return container
}

TApplication.vcl.TControl.prototype.onShow = function (fnc, runOnce) {
  this.setEventListener('show', fnc, runOnce)
}

TApplication.vcl.TControl.prototype.show = function () {
  this.setProperty('visible', true)
  this.style.visibility = 'unset'
  this.container.dispatchEvent(new CustomEvent('show'))
  return this
}

TApplication.vcl.TControl.prototype.onHide = function (fnc, runOnce) {
  this.setEventListener('hide', fnc, runOnce)
}

TApplication.vcl.TControl.prototype.hide = function () {
  this.setProperty('visible', false)
  this.style.visibility = 'hidden'
  this.container.dispatchEvent(new CustomEvent('hide'))
  return this
}

TApplication.vcl.TControl.prototype.onChange = function (fnc, runOnce) {
  this.setEventListener('onchange', fnc, runOnce)
}

TApplication.vcl.TControl.prototype.onInput = function (fnc, runOnce) {
  this.setEventListener('oninput', fnc, runOnce)
}

TApplication.vcl.TControl.prototype.click = function () {
  this.container.click()
}

TApplication.vcl.TControl.prototype.onClick = function (fnc, runOnce) {
  this.setEventListener('click', fnc, runOnce)
}

TApplication.vcl.TControl.prototype.enabled = function (status) {
  const DISABLED_CLASS_NAME = TApplication.core.getProperty('disabledClassName')
  switch (status) {
    case true:
      this.container.classList.toggle(DISABLED_CLASS_NAME, false)
      break
    case false:
      this.container.classList.toggle(DISABLED_CLASS_NAME, true)
      break
    default:
      return this.getProperty('enabled')
  }
  this.setProperty('enabled', status)
  Object.keys(this.getProperty('TComponents') || {}).forEach((name, index) => {
    TApplication.core.getComponent(`${this.getProperty('ownerName')}.${name}`).enabled(status)
  })
}

TApplication.vcl.TControl.prototype.checked = function (status) {
  const CHECKED_CLASS_NAME = TApplication.core.getProperty('checkedClassName')
  const UNCHECKED_CLASS_NAME = TApplication.core.getProperty('uncheckedClassName')
  switch (status) {
    case true:
      this.container.classList.toggle(CHECKED_CLASS_NAME, true)
      this.container.classList.toggle(UNCHECKED_CLASS_NAME, false)
      break
    case false:
      this.container.classList.toggle(CHECKED_CLASS_NAME, false)
      this.container.classList.toggle(UNCHECKED_CLASS_NAME, true)
      break
    default:
      return this.getProperty('checked')
  }
  this.setProperty('checked', status)
  this.container.dispatchEvent(new CustomEvent('onchange'))
}

TApplication.vcl.TControl.prototype.invalidated = function (status) {
  const INVALIDATED_CLASS_NAME = TApplication.core.getProperty('invalidatedClassName')
  switch (status) {
    case true:
      this.container.classList.toggle(INVALIDATED_CLASS_NAME, true)
      break
    case false:
      this.container.classList.toggle(INVALIDATED_CLASS_NAME, false)
      break
    default:
      return this.getProperty('invalidated')
  }
  this.setProperty('invalidated', status)
  Object.keys(this.getProperty('TComponents') || {}).forEach((name, index) => {
    TApplication.core.getComponent(`${this.getProperty('ownerName')}.${name}`).invalidated(status)
  })
}

TApplication.vcl.TControl.prototype.fadeIn = function (callback) {
  let style = this.style
  if (style.opacity === '1') {
    return
  }
  if (style.opacity !== '1') {
    style.opacity = '0'
  }
  TApplication.core.animate({
    draw: function (progress) {
      style.opacity = String(progress)
    },
    callback: callback
  })
}

TApplication.vcl.TControl.prototype.fadeOut = function (callback) {
  let style = this.style
  if (style.opacity === '0') {
    return
  }
  TApplication.core.animate({
    draw: function (progress) {
      style.opacity = String(1 - progress)
    },
    callback: callback
  })
}

/* ********************************************* TApplication.vcl.TOverlay ******************************************************* */

TApplication.vcl.TOverlay = function (...properties) {
  TApplication.vcl.TControl.apply(this, properties)
  return this.createNode()
}

TApplication.vcl.TOverlay.prototype = Object.create(TApplication.vcl.TControl.prototype)

TApplication.vcl.TOverlay.prototype.createNode = function () {
  TApplication.vcl.TControl.prototype.createNode.apply(this)
  this.style.zIndex = TApplication.core.getProperty('overlayZindex')
  return this
}

TApplication.vcl.TOverlay.prototype.show = function () {
  TApplication.vcl.TControl.prototype.show.apply(this)
  this.fadeIn()
  return this
}

TApplication.vcl.TOverlay.prototype.hide = function () {
  this.fadeOut(() => TApplication.vcl.TControl.prototype.hide.apply(this))
  return this
}

TApplication.vcl.TOverlay.prototype.getZIndex = function () {
  return parseInt(this.style.zIndex, 10)
}

/* ********************************************* TFORM ******************************************************* */

TApplication.vcl.TForm = function (...properties) {
  TApplication.vcl.TControl.apply(this, properties)
  Object.defineProperty(this, 'modalResult', {value: null, writable: true})
  Object.defineProperty(this, 'isModal', {value: false, writable: true})
  let scripts = this.getProperty('scripts') || []
  const rootPath = TApplication.core.getProperty('absolutePathToApplicationRoot')
  scripts.forEach((scriptPath) => {
    let script = document.createElement('script')
    Object.assign(script, {
      src: rootPath + scriptPath,
      defer: true
    })
    document.head.appendChild(script)
  })
  this.createNode()
  return this
}

TApplication.vcl.TForm.prototype = Object.create(TApplication.vcl.TControl.prototype)

TApplication.vcl.TForm.prototype.createNode = function () {
  TApplication.vcl.TControl.prototype.createNode.apply(this)
  let container = this.container
  let style = this.style
  let title = document.createElement('div')
  let caption = document.createElement('div')
  let closeButton = document.createElement('div')
  let icon = document.createElement('div')
  let FAVICON = TApplication.core.getProperty('faviconPath')
  let PATH_TO_IMAGES = TApplication.core.getProperty('absolutePathToApplicationRoot')

  function endDrag () {
    document.onmousemove = null
    container.onmouseup = null
    style.opacity = 1.0
  }

  Object.assign(style, {
    height: this.getProperty('height') ? (this.getProperty('height') + 'px') : '',
    width: this.getProperty('width') ? (this.getProperty('width') + 'px') : ''
  })

  container.appendChild(title)
  title.appendChild(caption)
  title.appendChild(closeButton)
  title.appendChild(icon)

  title.className = 'Title'

  caption.className = 'Caption'
  caption.id = container.id + '.Caption'
  this.caption = this.getProperty('caption')

  closeButton.className = 'CloseButton'
  closeButton.id = container.id + '.CloseButton'

  icon.className = 'Icon'
  icon.id = container.id + '.Icon'
  if (this.getProperty('icon')) {
    icon.style.backgroundImage = 'url(' + PATH_TO_IMAGES + this.getProperty('icon') + ')'
  }
  if (this.getProperty('iconBase64')) {
    icon.style.backgroundImage = "url('data:image/" + this.getProperty('iconBase64').type + ';base64, ' + this.getProperty('iconBase64').data + "')"
  }
  if (!this.getProperty('icon') && !this.getProperty('iconBase64') && FAVICON) {
    icon.style.backgroundImage = 'url(' + FAVICON + ')'
  }

  if (this.getProperty('sizeable')) {
    let sizeHandle = document.createElement('div')
    Object.assign(sizeHandle, {
      id: `${container.id}.SizeHandle`,
      className: 'SizeHandle'
    })
    this.getProperty('clientArea').appendChild(sizeHandle)
    sizeHandle.addEventListener('mousedown', (e) => {
      let box = container.getBoundingClientRect()
      let deltaX = e.pageX - box.width
      let deltaY = e.pageY - box.height
      this.bringToFront()

      function sizeAt (e) {
        style.width = e.pageX - deltaX + 'px'
        style.height = e.pageY - deltaY + 'px'
        style.opacity = 0.5
      }

      document.onmousemove = (e) => sizeAt(e)
      container.onmouseup = () => endDrag()
    })
  }

  if (this.getProperty('noTitle')) {
    style.height = (this.getProperty('height') + 'px')
    container.classList.toggle('noTitle', true)
  }

  closeButton.addEventListener('click', () => this.hide())

  title.addEventListener('mousedown', (e) => {
    let box = container.getBoundingClientRect()
    let deltaX = e.pageX - box.left
    let deltaY = e.pageY - box.top
    style.width = (box.width) + 'px'
    style.height = (box.height) + 'px'
    this.bringToFront()

    function moveAt (e) {
      style.left = e.pageX - deltaX + 'px'
      style.top = e.pageY - deltaY + 'px'
      style.opacity = 0.5
    }

    document.onmousemove = (e) => moveAt(e)
    container.onmouseup = () => endDrag()
  })

  return this
}

TApplication.vcl.TForm.prototype.align = function () {
  let container = this.container
  let style = this.style
  let containerWidth = parseInt(style.width, 10)
  let containerHeight = parseInt(style.height, 10)

  if (!this.getProperty('screenCenter')) {
    return this
  }
  if (container.offsetWidth > 0) {
    containerWidth = container.offsetWidth
  }
  if (container.offsetHeight > 0) {
    containerHeight = container.offsetHeight
  }
  style.left = (window.innerWidth - containerWidth) / 2 + 'px'
  style.top = (window.innerHeight - containerHeight) / 2 + 'px'
  return this
}

TApplication.vcl.TForm.prototype.show = function () {
  if (TApplication.core.modalStack.length > 0) {
    this.showModal()
  }
  TApplication.vcl.TControl.prototype.show.apply(this)
  this.align().bringToFront().fadeIn()
}

TApplication.vcl.TForm.prototype.showModal = function () {
  let modalStack = TApplication.core.modalStack
  let overlay = TApplication.core.overlay.show()
  const overlayZindex = overlay.getZIndex()

  TApplication.vcl.TControl.prototype.show.apply(this)
  this.style.zIndex = overlayZindex + 1
  this.align().fadeIn()
  if (modalStack.length > 0) {
    modalStack[modalStack.length - 1].style.zIndex = overlayZindex - 1
  }
  modalStack.push(this)
  this.isModal = true
  this.modalResult = null
}

TApplication.vcl.TForm.prototype.hide = function () {
  let overlay = TApplication.core.overlay
  let modalStack = TApplication.core.modalStack
  let that = this

  function afterFade () {
    TApplication.vcl.TControl.prototype.hide.apply(that)
    if (modalStack.length > 0) {
      modalStack[modalStack.length - 1].style.zIndex = overlay.getZIndex() + 1
    }
  }

  function afterHideQuery () {
    if (that.isModal) {
      that.isModal = false
      modalStack.pop()
      if (modalStack.length === 0) {
        overlay.hide()
      }
      if (!that.modalResult) {
        that.modalResult = TApplication.mrClose
      }
    }
    that.fadeOut(afterFade)
  }

  if (that.hideQuery) {
    that.hideQuery(afterHideQuery)
  } else {
    afterHideQuery()
  }
}

TApplication.vcl.TForm.prototype.bringToFront = function () {
  'use strict'
  if (this.isModal) {
    return this
  }
  if (this === TApplication.core.mainForm) {
    return this
  }
  TApplication.core.getComponentsByClassName('TForm').forEach(function (form) {
    form.style.zIndex = '1'
  })
  this.style.zIndex = TApplication.core.getProperty('bringToFrontZIndex')
  return this
}

/* ********************************************* TMESSAGEDLG ******************************************************* */

TApplication.vcl.TMessageDlg = function (...properties) {
  let that = this
  const BUTTONS = TApplication.core.getProperty('messageDialogueButtons')
  TApplication.vcl.TForm.apply(this, properties)
  that.container.classList.add('TMessageDlg')

  Object.defineProperty(this, 'type', {
    set: function (newDlgType) {
      that.messageDlgPicture.container.className = (newDlgType !== undefined) ? 'TPicture ' + newDlgType : 'TPicture mtCustom'
    },
    get: undefined
  })
  Object.defineProperty(this, 'message', {
    set: function (newMessage) {
      that.messageDlgText.caption = newMessage
    },
    get: undefined
  })
  Object.defineProperty(this, 'buttons', {
    set: function (newButtonSet) {
      BUTTONS.forEach(function (button) {
        that[button].style.display = 'none'
      })
      newButtonSet.forEach(function (button) {
        that[button].style.display = 'block'
      })
    },
    get: undefined

  })

  Object.getOwnPropertyNames(that).forEach(function (component) {
    if (BUTTONS.indexOf(component) >= 0) {
      that[component].onClick(function () {
        let button = that[component]
        that.modalResult = button.getProperty('modalResult')
        that.hide()
      })
    }
  })
  return that
}

TApplication.vcl.TMessageDlg.prototype = Object.create(TApplication.vcl.TForm.prototype)

/* ********************************************* TDATEPICKERDLG ******************************************************* */

TApplication.vcl.TDatePickerDlg = function (...properties) {
  let that = this
  const DATE_CLASS_NAME = TApplication.core.getProperty('dateClassName')
  const HOLIDAY_CLASS_NAME = TApplication.core.getProperty('holidayClassName')

  TApplication.vcl.TForm.apply(this, properties)

  that.container.classList.toggle('TDatePickerDlg', true)

  Object.defineProperty(this, 'date', {value: undefined, writable: true})

  function clickToDate () {
    let btn = TApplication.core.getComponent(this.id)
    that.modalResult = TApplication.mrOK
    that.date = new Date(that.date.getFullYear(), that.date.getMonth(), parseInt(btn.caption, 10))
    that.hide()
  }

  function changeMonth (delta) {
    that.date.setDate(1)
    that.date.setMonth(that.date.getMonth() + delta)
    that.refresh()
  }

  for (let i = 1; i <= 42; i += 1) {
    let btn = that['day_' + i + '_btn']
    btn.container.classList.add(DATE_CLASS_NAME)
    if (i % 7 === 0 || (i + 1) % 7 === 0) {
      btn.container.classList.add(HOLIDAY_CLASS_NAME)
    }
    btn.caption = ''
    btn.onClick(clickToDate)
  }

  that.rewindMonthBtn.onClick(() => changeMonth(-1))
  that.fastForwardMonthBtn.onClick(() => changeMonth(1))

  that.cancelBtn.onClick(function () {
    that.modalResult = TApplication.mrCancel
    that.hide()
  })
  that.clearDateBtn.onClick(function () {
    that.modalResult = TApplication.mrOK
    that.date = null
    that.hide()
  })
  return that
}

TApplication.vcl.TDatePickerDlg.prototype = Object.create(TApplication.vcl.TForm.prototype)

TApplication.vcl.TDatePickerDlg.prototype.refresh = function () {
  const CHOSEN_DATE_CLASS_NAME = TApplication.core.getProperty('chosenDateClassName')
  const MONTHS = TApplication.core.getProperty('datePickerMonthNames')
  const daysCount = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).getDate()
  let firstDayPosition = new Date(this.date.getFullYear(), this.date.getMonth(), 1).getDay()

  if (firstDayPosition === 0) {
    firstDayPosition = 7
  }

  for (let i = 1; i <= 42; i += 1) {
    let btn = this['day_' + i + '_btn']
    btn.container.classList.remove(CHOSEN_DATE_CLASS_NAME)
    btn.hide()
  }

  for (let i = 0; i < daysCount; i += 1) {
    let btn = this['day_' + (i + firstDayPosition) + '_btn']
    if (this.date.getDate() === (i + 1)) {
      btn.container.classList.add(CHOSEN_DATE_CLASS_NAME)
    }
    btn.caption = i + 1
    btn.show()
  }

  this.monthYearText.caption = MONTHS[this.date.getMonth()] + ' ' + this.date.getFullYear()
}

TApplication.vcl.TDatePickerDlg.prototype.showModal = function () {
  if (this.date === null) {
    this.date = new Date()
  }
  this.refresh()

  TApplication.vcl.TForm.prototype.showModal.apply(this)
  return this
}

/* ********************************************* TPANEL ******************************************************* */

TApplication.vcl.TPanel = function (...properties) {
  TApplication.vcl.TControl.apply(this, properties)
  return this.createNode()
}

TApplication.vcl.TPanel.prototype = Object.create(TApplication.vcl.TControl.prototype)

TApplication.vcl.TPanel.prototype.createNode = function () {
  TApplication.vcl.TControl.prototype.createNode.apply(this)
  let container = this.container
  let style = this.style
  if (this.getProperty('caption')) {
    let caption = document.createElement('div')
    container.appendChild(caption)
    Object.assign(caption, {
      id: `${container.id}.Caption`,
      className: 'Caption'
    })
    Object.assign(caption.style, {
      color: this.getProperty('captionColor') ? this.getProperty('captionColor') : '',
      fontSize: this.getProperty('captionFontSize') ? this.getProperty('captionFontSize') : '',
      fontWeight: this.getProperty('captionFontWeight') ? this.getProperty('captionFontWeight') : '',
      fontStyle: this.getProperty('captionFontStyle') ? this.getProperty('captionFontStyle') : ''
    })

    this.caption = this.getProperty('caption')
  }
  if (this.getProperty('border') === false) {
    container.classList.toggle('NoBorder', true)
  } else {
    if (this.getProperty('depressed')) {
      container.classList.toggle('Depressed', true)
    }
  }
  if (!this.getProperty('TComponents')) {
    let clientArea = document.createElement('div')
    Object.assign(clientArea, {
      id: `${container.id}.ClientArea`,
      className: 'ClientArea'
    })
    container.appendChild(clientArea)
    this.setProperty('clientArea', clientArea)
  }
  style.backgroundColor = (this.getProperty('backgroundColor') !== undefined) ? this.getProperty('backgroundColor') : ''
  return this
}

/* ********************************************* TSCROLLBOX ******************************************************* */

TApplication.vcl.TScrollBox = function (...properties) {
  TApplication.vcl.TPanel.apply(this, properties)
  this.container.classList.add('TPanel')
  Object.defineProperty(this, 'caption', {value: undefined})
  let clientArea = document.getElementById(this.container.id + '.ClientArea')
  if (this.getProperty('scrollX')) {
    clientArea.style.overflowX = 'auto'
  }
  if (this.getProperty('scrollY')) {
    clientArea.style.overflowY = 'auto'
  }
  return this
}

TApplication.vcl.TScrollBox.prototype = Object.create(TApplication.vcl.TPanel.prototype)

/* ********************************************* TGRID ******************************************************* */

TApplication.vcl.TGrid = function (...properties) {
  TApplication.vcl.TPanel.apply(this, properties)
  let that = this
  let gridDefinition = TApplicationDFM.gridInnerGrid(that)
  let columnDefinitionCurrent
  let rowWidth = 0

  Object.defineProperty(that, 'caption', {value: undefined})
  Object.defineProperty(that, 'onClick', {value: undefined})
  that.container.classList.add('TPanel')
  that.headers = {}
  that.getProperty('columns').forEach(function (column) {
    rowWidth += (column.width || 50)
  })
  that.setProperty('rowWidth', rowWidth)

  let headerPanelDefinition = TApplicationDFM.gridColumnHeaderPanel(that)

  /* Обработчик клика внутри скроллируемого контейнера */
  function gridClick (event) {
    let target = event.target
    let cell
    let row
    let details = {}
    if (!that.enabled()) {
      return
    }
    /* найдём ряд и ячейку, на которых был клик */
    while (target !== that.innerGrid.container) {
      if (target.classList.contains('TStaticText')) {
        cell = TApplication.core.getComponent(target.id)
      }
      if (target.classList.contains('TPanel')) {
        row = TApplication.core.getComponent(target.id)
      }
      target = target.parentNode
    }
    /* отправим событие от имени компонента */
    details.cell = cell
    details.row = row
    details.cellValue = cell !== undefined ? cell.caption : undefined
    details.colnum = cell !== undefined ? cell.getProperty('colnum') : undefined
    details.rowId = row !== undefined ? row.getProperty('rowId') : undefined
    details.rownum = row !== undefined ? row.getProperty('rownum') : undefined
    that.container.dispatchEvent(new CustomEvent('onRowClick', {detail: details}))
    /* пометим выбранную запись */
    if (that.getProperty('activeRowId') !== undefined) {
      that.rows[that.getProperty('activeRowId')].container.classList.remove('ActiveRow')
    }
    that.setProperty('activeRowId', row.getProperty('rownum'))
    that.rows[row.getProperty('rownum')].container.classList.add('ActiveRow')
  }

  /* -------------------------------------------------------------------------------------------------------------- */

  that.headerPanel = new TApplication.vcl[headerPanelDefinition.className](headerPanelDefinition)
  that.headerPanel.container.classList.add('ColumnHeaderPanel')

  that.getProperty('columns').forEach(function (column) {
    columnDefinitionCurrent = TApplicationDFM.gridColumnHeader(that, column)
    that.headers[column.name] = new TApplication.vcl[columnDefinitionCurrent.className](columnDefinitionCurrent)
  })

  that.innerGrid = new TApplication.vcl[gridDefinition.className](gridDefinition)
  that.innerGrid.onClick((event) => gridClick(event))

  if (that.getProperty('data')) {
    that.setData(that.getProperty('data'))
  }

  return that
}

TApplication.vcl.TGrid.prototype = Object.create(TApplication.vcl.TPanel.prototype)

TApplication.vcl.TGrid.prototype.onRowClick = function (fnc, runOnce) {
  'use strict'
  this.setEventListener('onRowClick', fnc, runOnce)
}

TApplication.vcl.TGrid.prototype.enabled = function (val) {
  'use strict'
  let that = this
  let status = TApplication.vcl.TControl.prototype.enabled.apply(this, [val])
  const DISABLED_CLASS_NAME = TApplication.core.getProperty('disabledClassName')
  if (val === undefined) {
    return status
  }
  if (val === true) {
    that.innerGrid.container.classList.remove(DISABLED_CLASS_NAME)
  }
  if (val === false) {
    that.container.classList.remove(DISABLED_CLASS_NAME)
    that.innerGrid.container.classList.add(DISABLED_CLASS_NAME)
  }
}

TApplication.vcl.TGrid.prototype.setData = function (data) {
  'use strict'
  let that = this
  let columns = that.getProperty('columns')
  let rowIdName = that.getProperty('rowId') !== undefined ? that.getProperty('rowId') : 'rowId'
  let i = 0
  let j = 0
  let rowDef
  let row
  let cellDef
  let rowTop = 0

  function clearData () {
    that.rows.forEach(function (row) {
      row.cells.forEach(function (cell) {
        cell.destroy()
      })
      row.destroy()
    })
    that.rows = []
    that.setProperty('activeRowId', undefined)
  }

  that.rows = []
  that.innerGrid.setProperty('rowId', rowIdName)
  clearData()

  if (!data) {
    return that
  }

  data.forEach(function (record) {
    record.rownum = i
    rowDef = TApplicationDFM.gridRow(that, record)
    rowDef.top = rowTop
    row = new TApplication.vcl[rowDef.className](rowDef)
    row.container.classList.add('RowPanel')
    row.setProperty('rowId', record[rowIdName] || i)
    row.cells = []

    columns.forEach(function (column) {
      column.colnum = j
      cellDef = TApplicationDFM.gridCell(row, column)
      cellDef.caption = record[column.name] || ''
      row.cells.push(new TApplication.vcl[cellDef.className](cellDef))
      j += 1
    })

    that.rows.push(row)
    rowTop += rowDef.height
    i += 1
    j = 0
  })

  return that
}

/* ********************************************* TBUTTON ******************************************************* */

TApplication.vcl.TButton = function (...properties) {
  TApplication.vcl.TControl.apply(this, properties)
  return this.createNode()
}

TApplication.vcl.TButton.prototype = Object.create(TApplication.vcl.TControl.prototype)

TApplication.vcl.TButton.prototype.createNode = function () {
  'use strict'
  TApplication.vcl.TControl.prototype.createNode.apply(this)
  let container = this.container
  let caption = document.createElement('div')
  if (this.getProperty('toolTip')) {
    container.title = this.getProperty('toolTip')
  }
  container.appendChild(caption)
  caption.className = 'Caption'
  caption.id = container.id + '.Caption'
  caption.style.lineHeight = (parseInt(container.style.height, 10) - 2) + 'px'
  this.caption = this.getProperty('caption')
  return this
}

/* ********************************************* TBITBUTTON **************************************************** */

TApplication.vcl.TBitButton = function (...properties) {
  TApplication.vcl.TButton.apply(this, properties)
  this.container.classList.add('TButton')
  let container = this.container
  let caption = document.getElementById(container.id + '.Caption')
  let PATH_TO_IMAGES = TApplication.core.getProperty('absolutePathToApplicationRoot')
  if (this.getProperty('icon')) {
    caption.style.backgroundImage = 'url(' + PATH_TO_IMAGES + this.getProperty('icon') + ')'
  }
  if (this.getProperty('iconBase64')) {
    caption.style.backgroundImage = "url('data:image/" + this.getProperty('iconBase64').type + ';base64, ' + this.getProperty('iconBase64').data + "')"
  }
  return this
}

TApplication.vcl.TBitButton.prototype = Object.create(TApplication.vcl.TButton.prototype)

/* ********************************************* TTOOLBAR **************************************************** */

TApplication.vcl.TToolBar = function (...properties) {
  TApplication.vcl.TPanel.apply(this, properties)
  this.container.classList.add('TPanel')
  Object.defineProperty(this, 'caption', {value: undefined})
  return this
}

TApplication.vcl.TToolBar.prototype = Object.create(TApplication.vcl.TPanel.prototype)

/* ********************************************* TTOOLBUTTON **************************************************** */

TApplication.vcl.TToolButton = function (...properties) {
  TApplication.vcl.TBitButton.apply(this, properties)
  this.container.classList.add('TBitButton')
  Object.defineProperty(this, 'caption', {value: undefined})
  return this
}

TApplication.vcl.TToolButton.prototype = Object.create(TApplication.vcl.TBitButton.prototype)

/* ******************************************* TTOOLBARSEPARATOR ************************************************ */

TApplication.vcl.TToolBarSeparator = function (...properties) {
  TApplication.vcl.TControl.apply(this, properties)
  TApplication.vcl.TControl.prototype.createNode.apply(this)
  return this
}

TApplication.vcl.TToolBarSeparator.prototype = Object.create(TApplication.vcl.TControl.prototype)

/* ********************************************* TEDIT ******************************************************* */

TApplication.vcl.TEdit = function (...properties) {
  TApplication.vcl.TControl.apply(this, properties)
  return this.createNode()
}

TApplication.vcl.TEdit.prototype = Object.create(TApplication.vcl.TControl.prototype)

TApplication.vcl.TEdit.prototype.createNode = function () {
  'use strict'
  TApplication.vcl.TControl.prototype.createNode.apply(this)
  let container = this.container
  let input = document.createElement('input')
  input.id = container.id + '.Input'
  input.className = 'Input'
  input.type = 'text'
  input.style.lineHeight = this.getProperty('height') - 2 + 'px'
  input.placeholder = this.getProperty('placeholder') ? this.getProperty('placeholder') : ''
  input.type = this.getProperty('password') ? 'password' : 'text'
  input.onchange = () => container.dispatchEvent(new CustomEvent('onchange'))
  input.oninput = () => container.dispatchEvent(new CustomEvent('oninput'))
  container.appendChild(input)
  this.setProperty('input', input)
  return this
}

TApplication.vcl.TEdit.prototype.value = function (val) {
  'use strict'
  let input = this.getProperty('input')
  if (val === undefined) {
    return input.value
  }
  if (val !== undefined) {
    input.value = val
  }
}

TApplication.vcl.TEdit.prototype.enabled = function (val) {
  'use strict'
  let status = TApplication.vcl.TControl.prototype.enabled.apply(this, [val])
  if (val === undefined) {
    return status
  }
  this.getProperty('input').disabled = val ? undefined : 'disabled'
}

/* ********************************************* TDATEPICKER ******************************************************* */

TApplication.vcl.TDatePicker = function (...properties) {
  let that = this
  let dlg
  let app = TApplication
  TApplication.vcl.TEdit.apply(this, properties)
  that.container.classList.add('TEdit')
  Object.defineProperty(this, 'date', {value: null, writable: true})
  Object.defineProperty(this, 'dateStringISO', {value: '', writable: true})
  Object.defineProperty(this, 'dateStringValue', {value: '', writable: true})
  let container = this.container
  let button = document.createElement('div')

  this.getProperty('input').readOnly = true

  button.className = 'Button'
  container.appendChild(button)
  button.addEventListener('click', function () {
    if (!that.enabled()) {
      return false
    }
    dlg = app.core.datePickerDlg
    dlg.date = that.date
    dlg.showModal()
    dlg.onHide(function () {
      if (dlg.modalResult === app.mrOK) {
        that.value(dlg.date)
      }
    }, true)
  })
  return this
}

TApplication.vcl.TDatePicker.prototype = Object.create(TApplication.vcl.TEdit.prototype)

TApplication.vcl.TDatePicker.prototype.value = function (val) {
  'use strict'
  let that = this

  function _setValue (dt) {
    that.date = dt
    that.dateStringISO = dt.getFullYear() + '-' + ('0' + (dt.getMonth() + 1)).slice(-2) + '-' + ('0' + dt.getDate()).slice(-2)
    that.dateStringValue = ('0' + dt.getDate()).slice(-2) + '.' + ('0' + (dt.getMonth() + 1)).slice(-2) + '.' + dt.getFullYear()
    that.getProperty('input').value = that.dateStringValue
  }

  function _clearValue () {
    that.date = null
    that.dateStringISO = ''
    that.dateStringValue = ''
    that.getProperty('input').value = that.dateStringValue
  }

  if (val === undefined) {
    return {'date': this.date, 'dateStringISO': this.dateStringISO, 'dateStringValue': this.dateStringValue}
  }
  if (val === null) {
    _clearValue()
    return true
  }
  if (Object.prototype.toString.call(val) === '[object Date]') {
    _setValue(val)
    return true
  }
  if (typeof (val) === 'string' && !Number.isNaN(Date.parse(val))) {
    _setValue(new Date(val))
    return true
  }
  console.error('Wrong Date format')
  return false
}

/* ********************************************* TCOMBOBOX  ****************************************************** */

TApplication.vcl.TComboBox = function (...properties) {
  TApplication.vcl.TControl.apply(this, properties)
  return this.createNode()
}

TApplication.vcl.TComboBox.prototype = Object.create(TApplication.vcl.TControl.prototype)

TApplication.vcl.TComboBox.prototype.createNode = function () {
  'use strict'
  TApplication.vcl.TControl.prototype.createNode.apply(this)
  let container = this.container
  let input = document.createElement('select')
  let button = document.createElement('div')
  let sizer = document.createElement('div')

  sizer.className = 'Sizer'
  container.appendChild(sizer)

  button.className = 'Button'
  container.appendChild(button)

  input.id = container.id + '.Input'
  input.className = 'Input'
  input.style.height = this.getProperty('height') - 2 + 'px'
  input.onchange = () => container.dispatchEvent(new CustomEvent('onchange'))
  sizer.appendChild(input)
  this.setProperty('input', input)

  this.setData(this.getProperty('items'))
  if (this.getProperty('initialValue')) {
    this.value(this.getProperty('initialValue'))
  }

  return this
}

TApplication.vcl.TComboBox.prototype.enabled = function (val) {
  'use strict'
  TApplication.vcl.TControl.prototype.enabled.apply(this, [val])
  if (val === undefined) {
    return
  }
  this.getProperty('input').disabled = val ? undefined : 'disabled'
}

TApplication.vcl.TComboBox.prototype.value = function (val) {
  'use strict'
  let input = this.getProperty('input')
  if (val === undefined) {
    return input.value
  }
  if (val !== undefined) {
    input.value = val
  }
}

TApplication.vcl.TComboBox.prototype.valueText = function () {
  'use strict'
  let input = this.getProperty('input')
  if (input.selectedIndex !== -1) {
    return input.options[input.selectedIndex].text
  } else {
    return ''
  }
}

TApplication.vcl.TComboBox.prototype.setData = function (data) {
  'use strict'
  let input = this.getProperty('input')
  let opt
  if (data) {
    while (input.options.length > 0) {
      input.options.remove(0)
    }
    data.forEach(function (option) {
      opt = document.createElement('option')
      opt.value = option[0]
      opt.innerHTML = option[1]
      input.appendChild(opt)
    })
  }
  return this
}

/* ********************************************* TSTATICTEXT ******************************************************* */

TApplication.vcl.TStaticText = function (...properties) {
  TApplication.vcl.TControl.apply(this, properties)
  return this.createNode()
}

TApplication.vcl.TStaticText.prototype = Object.create(TApplication.vcl.TControl.prototype)

TApplication.vcl.TStaticText.prototype.createNode = function () {
  'use strict'
  TApplication.vcl.TControl.prototype.createNode.apply(this)
  let container = this.container
  let caption = document.createElement('div')
  let lineCount = this.getProperty('lineCount') || 1
  container.appendChild(caption)
  caption.className = 'Caption'
  caption.id = container.id + '.Caption'
  if (!this.getProperty('multiLine')) {
    caption.style.lineHeight = (parseInt(container.style.height, 10) / lineCount) + 'px'
  }
  this.caption = this.getProperty('caption')
  return this
}

/* ********************************************* TCHECKBOX ******************************************************* */

TApplication.vcl.TCheckBox = function (...properties) {
  TApplication.vcl.TControl.apply(this, properties)
  return this.createNode()
}

TApplication.vcl.TCheckBox.prototype = Object.create(TApplication.vcl.TControl.prototype)

TApplication.vcl.TCheckBox.prototype.createNode = function () {
  'use strict'
  TApplication.vcl.TControl.prototype.createNode.apply(this)
  let container = this.container
  let caption = document.createElement('div')
  let tick = document.createElement('div')
  let that = this
  container.appendChild(tick)
  container.appendChild(caption)

  caption.className = 'Caption'
  caption.id = container.id + '.Caption'
  caption.style.lineHeight = this.style.height

  tick.className = 'Tick'
  tick.id = container.id + '.Tick'
  tick.style.top = (this.getProperty('height') - 14) / 2 + 'px'

  that.caption = that.getProperty('caption')
  that.checked(null)

  container.addEventListener('click', function () {
    let newStatus
    if (!that.enabled()) {
      return false
    }
    newStatus = that.checked() === undefined || that.checked() === null || that.checked() === false
    that.checked(newStatus)
  })
  return that
}

/* ********************************************* TRADIOBUTTON ******************************************************* */

TApplication.vcl.TRadioButton = function (...properties) {
  TApplication.vcl.TControl.apply(this, properties)
  Object.defineProperty(this, 'radioButtonGroup', {value: undefined, writable: true})
  return this.createNode()
}

TApplication.vcl.TRadioButton.prototype = Object.create(TApplication.vcl.TControl.prototype)

TApplication.vcl.TRadioButton.prototype.createNode = function () {
  'use strict'
  TApplication.vcl.TControl.prototype.createNode.apply(this)
  let container = this.container
  let caption = document.createElement('div')
  let tick = document.createElement('div')
  let that = this
  container.appendChild(tick)
  container.appendChild(caption)

  caption.className = 'Caption'
  caption.id = container.id + '.Caption'
  caption.style.lineHeight = this.style.height

  tick.className = 'Tick'
  tick.id = container.id + '.Tick'
  tick.style.top = (this.getProperty('height') - 14) / 2 + 'px'

  this.radioButtonGroup = this.getProperty('parent').id + '.RBG'

  container.addEventListener('click', function () {
    TApplication.core.getRadioButtonsByGroup(that.radioButtonGroup).forEach((rb) => rb.checked(false))
    that.checked(true)
  })

  that.caption = that.getProperty('caption')
  return that
}

/* ********************************************* TMEMO ******************************************************* */

TApplication.vcl.TMemo = function (...properties) {
  TApplication.vcl.TControl.apply(this, properties)
  return this.createNode()
}

TApplication.vcl.TMemo.prototype = Object.create(TApplication.vcl.TControl.prototype)

TApplication.vcl.TMemo.prototype.createNode = function () {
  'use strict'
  TApplication.vcl.TControl.prototype.createNode.apply(this)
  let container = this.container
  let input = document.createElement('textarea')
  input.id = container.id + '.Input'
  input.className = 'Input'
  input.wrap = 'soft'
  input.placeholder = this.getProperty('placeholder') ? this.getProperty('placeholder') : ''
  input.onchange = () => container.dispatchEvent(new CustomEvent('onchange'))
  input.oninput = () => container.dispatchEvent(new CustomEvent('oninput'))
  container.appendChild(input)
  this.setProperty('input', input)
  return this
}

TApplication.vcl.TMemo.prototype.value = function (val) {
  'use strict'
  return TApplication.vcl.TEdit.prototype.value.apply(this, [val])
}

TApplication.vcl.TMemo.prototype.enabled = function (val) {
  'use strict'
  return TApplication.vcl.TEdit.prototype.enabled.apply(this, [val])
}

/* ********************************************* TPICTURE ******************************************************* */

TApplication.vcl.TPicture = function (...properties) {
  TApplication.vcl.TControl.apply(this, properties)
  return this.createNode()
}

TApplication.vcl.TPicture.prototype = Object.create(TApplication.vcl.TControl.prototype)

TApplication.vcl.TPicture.prototype.createNode = function () {
  'use strict'
  TApplication.vcl.TControl.prototype.createNode.apply(this)
  let style = this.style
  if (this.getProperty('image')) {
    this.setImage(this.getProperty('image'))
  }
  style.backgroundColor = (this.getProperty('backgroundColor') !== undefined) ? this.getProperty('backgroundColor') : ''
  style.backgroundRepeat = (this.getProperty('backgroundRepeat') !== undefined) ? this.getProperty('backgroundRepeat') : ''
  style.backgroundPosition = (this.getProperty('backgroundPosition') !== undefined) ? this.getProperty('backgroundPosition') : ''
  style.backgroundClip = (this.getProperty('backgroundClip') !== undefined) ? this.getProperty('backgroundClip') : ''
  style.backgroundSize = (this.getProperty('backgroundSize') !== undefined) ? this.getProperty('backgroundSize') : ''
  return this
}

TApplication.vcl.TPicture.prototype.setImage = function (imagePath) {
  'use strict'
  if (imagePath) {
    this.style.backgroundImage = 'url(' + TApplication.core.getProperty('absolutePathToApplicationRoot') + imagePath + ')'
  }
}

/* ********************************************* TDATAMODULE ******************************************************* */

TApplication.vcl.TDataModule = function (...properties) {
  TApplication.vcl.TComponent.apply(this, properties)
  if (this.getProperty('TComponents')) {
    this.createContent()
  }
  return this
}

TApplication.vcl.TDataModule.prototype = Object.create(TApplication.vcl.TComponent.prototype)

/* ********************************************* TDATAMODULEGROUP ******************************************************* */

/* Аналог TPanel, для группировки невизуальных компонентов */

TApplication.vcl.TDataModuleGroup = function (...properties) {
  TApplication.vcl.TComponent.apply(this, properties)
  if (this.getProperty('TComponents')) {
    this.createContent()
  }
  return this
}

TApplication.vcl.TDataModuleGroup.prototype = Object.create(TApplication.vcl.TComponent.prototype)

/* ********************************************* TAjax ******************************************************* */

TApplication.vcl.TAjax = function (...properties) {
  TApplication.vcl.TComponent.apply(this, properties)
  Object.defineProperty(this, 'data', {value: {}, writable: true})
  Object.defineProperty(this, 'headers', {value: {}, writable: true})
  Object.defineProperty(this, 'onSuccessHandler', {value: undefined, writable: true})
  Object.defineProperty(this, 'onAbortHandler', {value: undefined, writable: true})
  return this
}

TApplication.vcl.TAjax.prototype = Object.create(TApplication.vcl.TComponent.prototype)

TApplication.vcl.TAjax.prototype.execute = function () {
  'use strict'
  let xhr = new XMLHttpRequest()
  let that = this
  const METHOD = this.getProperty('method') ? this.getProperty('method') : 'POST'
  const HEADER_CONTENT_TYPE = this.getProperty('headerContentType') ? this.getProperty('headerContentType') : 'application/x-www-form-urlencoded; charset=UTF-8'

  let onResultDefault = function (result) {
    console.info(result)
  }

  let prepareHeaders = function (xhr) {
    if (!that.headers) {
      return false
    }
    Object.getOwnPropertyNames(that.headers).forEach((hd) => xhr.setRequestHeader(hd, that.headers[hd]))
    return true
  }

  let prepareParams = function () {
    let result = ''
    if (!that.data) {
      return result
    }
    Object.getOwnPropertyNames(that.data).forEach(function (dt) {
      result += '&' + dt + '=' + encodeURIComponent(that.data[dt])
    })
    return result
  }

  xhr.open(METHOD, this.getProperty('URL'), true)
  xhr.setRequestHeader('Content-Type', HEADER_CONTENT_TYPE)
  prepareHeaders(xhr)
  xhr.onload = () => this.onSuccessHandler ? this.onSuccessHandler(xhr.responseText) : onResultDefault(xhr.responseText)
  xhr.onabort = () => this.onAbortHandler ? this.onAbortHandler(xhr.responseText) : onResultDefault(xhr.responseText)
  xhr.send(prepareParams())
}
