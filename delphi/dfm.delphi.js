(function () {
  'use strict'
  let appDFM = Object.create(null)

  let definitionLoaderDefinition = {
    'className': 'TAjax',
    'method': 'GET'
  }

  let overlayComponentDefinition = {
    'className': 'TOverlay',
    'visible': false
  }

  let messageDialogueDefinition = {
    'className': 'TForm',
    'width': 400,
    'height': 126,
    'screenCenter': true,
    'visible': false,
    'TComponents': {
      'messageDlgPictureTextPanel': {
        'className': 'TPanel',
        'caption': '',
        'top': 0,
        'height': 64,
        'border': false,

        'TComponents': {
          'messageDlgPicture': {
            'className': 'TPicture',
            'height': 32,
            'width': 32,
            'top': 16,
            'left': 8
          },
          'messageDlgText': {
            'className': 'TStaticText',
            'top': 8,
            'left': 48,
            'right': 8,
            'height': 48,
            'textAlign': 'center',
            'multiLine': true
          }
        }
      },

      'messageDlgButtonPanel': {
        'className': 'TPanel',
        'bottom': 0,
        'height': 34,
        'border': false,

        'TComponents': {
          'messageDlgClose': {
            'className': 'TButton',
            'caption': 'Close',
            'modalResult': 'mrClose'
          },
          'messageDlgCancel': {
            'className': 'TButton',
            'caption': 'Cancel',
            'modalResult': 'mrCancel'
          },
          'messageDlgOK': {
            'className': 'TButton',
            'caption': 'OK',
            'modalResult': 'mrOK'
          },
          'messageDlgNo': {
            'className': 'TButton',
            'caption': 'No',
            'modalResult': 'mrNo'
          },
          'messageDlgYes': {
            'className': 'TButton',
            'caption': 'Yes',
            'modalResult': 'mrYes'
          },

          'messageDlgIgnore': {
            'className': 'TButton',
            'caption': 'Ignore',
            'modalResult': 'mrIgnore'
          },

          'messageDlgRetry': {
            'className': 'TButton',
            'caption': 'Retry',
            'modalResult': 'mrRetry'
          },

          'messageDlgAbort': {
            'className': 'TButton',
            'caption': 'Abort',
            'modalResult': 'mrAbort'
          }
        }
      }
    }
  }

  let datePickerComponentDefinition = {
    'className': 'TForm',
    'noTitle': true,
    'width': 230,
    'height': 254,
    'screenCenter': true,
    'visible': false,
    'caption': 'Choose date',
    'iconBase64': {
      'type': 'png',
      'data': 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAfFJREFUeNqUUs9LG1EQ/ja7NVGT0IAQ/IGWepGUFCFCUQgkFz1p8OA5kmNBQoXiLYcN/Q/07qXFQy4eFPSSu9BrPAREjUpEBQkhrbrZ15mXfa+JCK0Ds7vfzPd9zLy3EELgwjBQoqT4RJnlN+NLL1/qsYa1Bj8ufT6bGrFdId6lK5VEORb7mTGMU3TFC73KqOsWLG4+ANPvbXsxdXiIarWKVDKZGE2nE90GqXL5b29+PnFSKPRxXRr8Bvxus4nbRgPHq6t4Oz4O5/6+W9/TYy5rtEFLiH631cLczg4+HB3hjd+Pu7ExhLa3tcHHeByTExMYDIfBXNb0TNCm4lU+j/6BATxR7RfhwNCQNuBjDAaDgOuCuWoCeZJTwLp4ZXiazgQCMF0CnP8TPr5C0ugVGDhs0G6jtL+Pi3od4VAIuZUVKeBajWpfcrmOgWlqA59najq02yMZLC0s4HM2i/r1tcSqxmeiMHPxbAKLJ3h0HJzVavheKiE5OyuxiiZdncadCSw9gfAmeCLCyPAwvq6tYe/gQGKVDfoP1Ddze1aQE3grcN7QT8QChfMbGxLzW62gJuisYBj+Nq1wS8LNrS1EIhEsZzKSzPGtWNSrcK2PuKzRBkQLmZaFaDSKom3/8xqZyxptQGd6PhMI/MDr4pwffwQYAEq9UYX/QmutAAAAAElFTkSuQmCC'
    },
    'TComponents': {
      'rewindMonthBtn': {
        'className': 'TBitButton',
        'iconBase64': {
          'type': 'png',
          'data': 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAb1JREFUeNqkUz1LI1EUPTPzRoMa0WgiCDYKi4JWz0oQbcVttZCIhR8BQZjScv+AIqtYWqVV7BTBX6BT7PpRhK1iIWIRJ5rMzJsv3xszo5i4Frnw5sKde86997z7pCAI0IwR8Rn5dYGWRAJqa2t4iKqCEJLlvyZ5gVyU/PT4GANF4T+bY28EDSzruq72MWA+PzdMlOsiQZB1HUdbnO2n3EOcarkc+i9H+Ah2GNNW539Qw/Dg2DZ814Xv+//XoDZTCM4tjNJCoYKuLjUk4HbZCMjzde5yJAbbtra+ROnVlVFL8PFzaoiKSxKCRZclvKpKODy9ee9AgDdWJuj1tRFXKBkWivcmqqYJh8/veV4YVxQFvT0dYJb1LqJjWTtbu+f64GAHqn6A2xcbBZuh3NYCluqEl+6B35eGm0nDTKXwQBJgnDjugLeYF/Nu/z7Rppdn6N+ig4GkjH9HZ/pX4kmSpH8WMc9FxNn+sTa8NkeLVYBxUoWQcZ5cf/+yXL8HgsRlbOdmN6+3K6E2sCoV+LX5v9+DiISLdrd3EG+i6Kw9mYTCV/xbgojE4wsk3kIUK5dK6M5k6rVo9jXKaNJeBRgAr5/l039biuYAAAAASUVORK5CYII='
        },
        'toolTip': 'Previous month',
        'height': 24,
        'width': 26,
        'left': 2,
        'top': 2
      },
      'monthYearText': {
        'className': 'TStaticText',
        'fontWeight': 'bold',
        'color': '#084B8A',
        'top': 2,
        'left': 28,
        'right': 28,
        'height': 26,
        'textAlign': 'center'
      },
      'fastForwardMonthBtn': {
        'className': 'TBitButton',
        'iconBase64': {
          'type': 'png',
          'data': 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAa9JREFUeNqkU79Lw0AU/lLTqIViHURw6KK4KhwObk4idnDSQbo4ufZPcHR0ESyIIMZJEQdx6OLgJFgHBQUVB7da2mr6K8ldLt5da4y1gtAPXt69y73v/brTfN9HL9DlZ2rzDpqmBZuJkZFgLfazQl0yxkxGKajjKHFtGw8bMy2CTtTe3zEYj3+ZpC0SZufZSDcCGalhWUpLSS+OEaEz8P30vwgkPMbg1Osq3Y8PD+lUklDX/UWiShCNzIbS/CbxPCW2zVAoMKymxsn+yX2m3XgzIBBRyNrKNKnVGOS/r8m01kCl4goSD09PFMsLk+Tw9DYgUQSyo5ZFUSw6QXRXlFBtNNFoNkFFH2QmEs+vfZibTZLcxWPmm0AcMowIEgkDlPt4synKnIPFDPDBKCwRveZwRTAxGsPZ+U1ejHcrXEJ+O5v787IMLc2TQoNjYiiCq+Occo7295vhJq5zzn85yjrFNK5L+gASw8DLwVHL2TDMH1PoBi5qdkRpEnFxSUu7pnLWQ85/EniiafVqNbDLO3st52jU7PoWOmFVKmEzL99Cn66b3c5qvb7GCHrEpwADAFa055IUHoYRAAAAAElFTkSuQmCC'
        },
        'toolTip': 'Next month',
        'height': 24,
        'width': 26,
        'right': 2,
        'top': 2
      },

      'daysPanel': {
        'className': 'TPanel',
        'caption': '',
        'top': 28,
        'left': 1,
        'right': 1,
        'bottom': 31,
        'TComponents': {
          'mondaysCaption': {
            'className': 'TStaticText',
            'fontSize': '12px',
            'fontWeight': 'bold',
            'top': 2,
            'left': 2,
            'width': 26,
            'height': 20,
            'textAlign': 'center',
            'caption': 'Mo'
          },
          'tuesdaysCaption': {
            'className': 'TStaticText',
            'fontSize': '12px',
            'fontWeight': 'bold',
            'top': 2,
            'left': 32,
            'width': 26,
            'height': 20,
            'textAlign': 'center',
            'caption': 'Tu'
          },
          'wednesdaysCaption': {
            'className': 'TStaticText',
            'fontSize': '12px',
            'fontWeight': 'bold',
            'top': 2,
            'left': 62,
            'width': 26,
            'height': 20,
            'textAlign': 'center',
            'caption': 'We'
          },
          'thursdaysCaption': {
            'className': 'TStaticText',
            'fontSize': '12px',
            'fontWeight': 'bold',
            'top': 2,
            'left': 92,
            'width': 26,
            'height': 20,
            'textAlign': 'center',
            'caption': 'Th'
          },
          'fridaysCaption': {
            'className': 'TStaticText',
            'fontSize': '12px',
            'fontWeight': 'bold',
            'top': 2,
            'left': 122,
            'width': 26,
            'height': 20,
            'textAlign': 'center',
            'caption': 'Fr'
          },
          'saturdaysCaption': {
            'className': 'TStaticText',
            'fontSize': '12px',
            'fontWeight': 'bold',
            'color': '#084B8A',
            'top': 2,
            'left': 160,
            'width': 26,
            'height': 20,
            'textAlign': 'center',
            'caption': 'Sa'
          },
          'sundaysCaption': {
            'className': 'TStaticText',
            'fontSize': '12px',
            'fontWeight': 'bold',
            'color': '#084B8A',
            'top': 2,
            'left': 190,
            'width': 26,
            'height': 20,
            'textAlign': 'center',
            'caption': 'Su'
          },
          'day_1_btn': {
            'className': 'TButton',
            'textAlign': 'center',
            'height': 26,
            'width': 28,
            'left': 2,
            'top': 24
          },
          'day_2_btn': {
            'className': 'TButton',
            'textAlign': 'center',
            'height': 26,
            'width': 28,
            'left': 32,
            'top': 24
          },
          'day_3_btn': {
            'className': 'TButton',
            'textAlign': 'center',
            'height': 26,
            'width': 28,
            'left': 62,
            'top': 24
          },
          'day_4_btn': {
            'className': 'TButton',
            'textAlign': 'center',
            'height': 26,
            'width': 28,
            'left': 92,
            'top': 24
          },
          'day_5_btn': {
            'className': 'TButton',
            'textAlign': 'center',
            'height': 26,
            'width': 28,
            'left': 122,
            'top': 24
          },
          'day_6_btn': {
            'className': 'TButton',
            'textAlign': 'center',
            'height': 26,
            'width': 28,
            'left': 160,
            'top': 24
          },
          'day_7_btn': {
            'className': 'TButton',
            'textAlign': 'center',
            'caption': '31',
            'height': 26,
            'width': 28,
            'left': 190,
            'top': 24
          },
          'day_8_btn': {
            'className': 'TButton',
            'textAlign': 'center',
            'height': 26,
            'width': 28,
            'left': 2,
            'top': 52
          },
          'day_9_btn': {
            'className': 'TButton',
            'textAlign': 'center',
            'height': 26,
            'width': 28,
            'left': 32,
            'top': 52
          },
          'day_10_btn': {
            'className': 'TButton',
            'textAlign': 'center',
            'height': 26,
            'width': 28,
            'left': 62,
            'top': 52
          },
          'day_11_btn': {
            'className': 'TButton',
            'textAlign': 'center',
            'height': 26,
            'width': 28,
            'left': 92,
            'top': 52
          },
          'day_12_btn': {
            'className': 'TButton',
            'textAlign': 'center',
            'height': 26,
            'width': 28,
            'left': 122,
            'top': 52
          },
          'day_13_btn': {
            'className': 'TButton',
            'textAlign': 'center',
            'height': 26,
            'width': 28,
            'left': 160,
            'top': 52
          },
          'day_14_btn': {
            'className': 'TButton',
            'textAlign': 'center',
            'caption': '31',
            'height': 26,
            'width': 28,
            'left': 190,
            'top': 52
          },
          'day_15_btn': {
            'className': 'TButton',
            'textAlign': 'center',
            'height': 26,
            'width': 28,
            'left': 2,
            'top': 80
          },
          'day_16_btn': {
            'className': 'TButton',
            'textAlign': 'center',
            'height': 26,
            'width': 28,
            'left': 32,
            'top': 80
          },
          'day_17_btn': {
            'className': 'TButton',
            'textAlign': 'center',
            'height': 26,
            'width': 28,
            'left': 62,
            'top': 80
          },
          'day_18_btn': {
            'className': 'TButton',
            'textAlign': 'center',
            'height': 26,
            'width': 28,
            'left': 92,
            'top': 80
          },
          'day_19_btn': {
            'className': 'TButton',
            'textAlign': 'center',
            'height': 26,
            'width': 28,
            'left': 122,
            'top': 80
          },
          'day_20_btn': {
            'className': 'TButton',
            'textAlign': 'center',
            'height': 26,
            'width': 28,
            'left': 160,
            'top': 80
          },
          'day_21_btn': {
            'className': 'TButton',
            'textAlign': 'center',
            'caption': '31',
            'height': 26,
            'width': 28,
            'left': 190,
            'top': 80
          },
          'day_22_btn': {
            'className': 'TButton',
            'textAlign': 'center',
            'height': 26,
            'width': 28,
            'left': 2,
            'top': 108
          },
          'day_23_btn': {
            'className': 'TButton',
            'textAlign': 'center',
            'height': 26,
            'width': 28,
            'left': 32,
            'top': 108
          },
          'day_24_btn': {
            'className': 'TButton',
            'textAlign': 'center',
            'height': 26,
            'width': 28,
            'left': 62,
            'top': 108
          },
          'day_25_btn': {
            'className': 'TButton',
            'textAlign': 'center',
            'height': 26,
            'width': 28,
            'left': 92,
            'top': 108
          },
          'day_26_btn': {
            'className': 'TButton',
            'textAlign': 'center',
            'height': 26,
            'width': 28,
            'left': 122,
            'top': 108
          },
          'day_27_btn': {
            'className': 'TButton',
            'textAlign': 'center',
            'height': 26,
            'width': 28,
            'left': 160,
            'top': 108
          },
          'day_28_btn': {
            'className': 'TButton',
            'textAlign': 'center',
            'caption': '31',
            'height': 26,
            'width': 28,
            'left': 190,
            'top': 108
          },
          'day_29_btn': {
            'className': 'TButton',
            'textAlign': 'center',
            'height': 26,
            'width': 28,
            'left': 2,
            'top': 136
          },
          'day_30_btn': {
            'className': 'TButton',
            'textAlign': 'center',
            'height': 26,
            'width': 28,
            'left': 32,
            'top': 136
          },
          'day_31_btn': {
            'className': 'TButton',
            'textAlign': 'center',
            'height': 26,
            'width': 28,
            'left': 62,
            'top': 136
          },
          'day_32_btn': {
            'className': 'TButton',
            'textAlign': 'center',
            'height': 26,
            'width': 28,
            'left': 92,
            'top': 136
          },
          'day_33_btn': {
            'className': 'TButton',
            'textAlign': 'center',
            'height': 26,
            'width': 28,
            'left': 122,
            'top': 136
          },
          'day_34_btn': {
            'className': 'TButton',
            'textAlign': 'center',
            'height': 26,
            'width': 28,
            'left': 160,
            'top': 136
          },
          'day_35_btn': {
            'className': 'TButton',
            'textAlign': 'center',
            'caption': '31',
            'height': 26,
            'width': 28,
            'left': 190,
            'top': 136
          },
          'day_36_btn': {
            'className': 'TButton',
            'textAlign': 'center',
            'height': 26,
            'width': 28,
            'left': 2,
            'top': 164
          },
          'day_37_btn': {
            'className': 'TButton',
            'textAlign': 'center',
            'height': 26,
            'width': 28,
            'left': 32,
            'top': 164
          },
          'day_38_btn': {
            'className': 'TButton',
            'textAlign': 'center',
            'height': 26,
            'width': 28,
            'left': 62,
            'top': 164
          },
          'day_39_btn': {
            'className': 'TButton',
            'textAlign': 'center',
            'height': 26,
            'width': 28,
            'left': 92,
            'top': 164
          },
          'day_40_btn': {
            'className': 'TButton',
            'textAlign': 'center',
            'height': 26,
            'width': 28,
            'left': 122,
            'top': 164
          },
          'day_41_btn': {
            'className': 'TButton',
            'textAlign': 'center',
            'height': 26,
            'width': 28,
            'left': 160,
            'top': 164
          },
          'day_42_btn': {
            'className': 'TButton',
            'textAlign': 'center',
            'caption': '31',
            'height': 26,
            'width': 28,
            'left': 190,
            'top': 164
          }
        }
      },
      'clearDateBtn': {
        'className': 'TButton',
        'textAlign': 'center',
        'caption': 'Clear date',
        'height': 26,
        'width': 132,
        'left': 2,
        'bottom': 2
      },
      'cancelBtn': {
        'className': 'TButton',
        'textAlign': 'center',
        'caption': 'Cancel',
        'height': 26,
        'width': 86,
        'right': 2,
        'bottom': 2
      }
    }
  }

  /******************************************************************************************************************/

  function _setName (obj, name) {
    obj.ownerName = name
    obj.registerName = name
    obj.parent = document.body
    return obj
  }

  function _prepareGridColumnHeaderPanel (grid) {
    let obj = {}
    obj.className = 'TPanel'
    obj.border = false
    obj.top = 0
    obj.left = 1
    obj.width = grid.getProperty('rowWidth') + 1
    obj.height = grid.getProperty('headerHeight') || 24
    obj.name = grid.getProperty('name') + '.columnHeaderPanel'
    obj.ownerName = grid.getProperty('ownerName')
    obj.registerName = obj.ownerName + '.' + obj.name
    obj.parent = grid.getProperty('clientArea')
    return obj
  }

  function _prepareGridColumnHeader (grid, column) {
    let obj = {}
    obj.className = 'TStaticText'
    obj.height = grid.getProperty('headerHeight') || 24
    obj.caption = column.caption || 'N/A'
    obj.width = column.width || 50
    obj.textAlign = column.textAlignHeader || 'left'
    obj.lineCount = column.lineCount || 1
    obj.name = grid.getProperty('name') + '.' + column.name
    obj.ownerName = grid.getProperty('ownerName')
    obj.registerName = obj.ownerName + '.' + obj.name
    obj.parent = grid.headerPanel.getProperty('clientArea')
    return obj
  }

  function _prepareGridInnerGrid (grid) {
    let obj = {}
    obj.className = 'TScrollBox'
    obj.border = false
    obj.scrollY = true
    obj.left = 0
    obj.bottom = 0
    obj.right = 0
    obj.top = grid.getProperty('headerHeight') || 24
    obj.name = grid.getProperty('name') + '.innerGrid'
    obj.ownerName = grid.getProperty('ownerName')
    obj.registerName = obj.ownerName + '.' + obj.name
    obj.parent = grid.getProperty('clientArea')
    obj.rowHeight = grid.getProperty('rowHeight')
    return obj
  }

  function _prepareGridRow (grid, row) {
    let obj = {}
    let innerGrid = grid.innerGrid
    obj.className = 'TPanel'
    obj.left = 0
    obj.width = grid.getProperty('rowWidth') + 2
    obj.height = innerGrid.getProperty('rowHeight') || 24
    obj.rownum = row.rownum
    obj.name = 'row_' + row.rownum
    obj.ownerName = innerGrid.getProperty('ownerName')
    obj.registerName = obj.ownerName + '.' + grid.getProperty('name') + '.' + obj.name
    obj.parent = innerGrid.getProperty('clientArea')
    return obj
  }

  function _prepareGridCell (row, column) {
    let obj = {}
    obj.className = 'TStaticText'
    obj.top = 0
    obj.height = row.getProperty('height') || 24
    obj.width = column.width || 50
    obj.textAlign = column.textAlignData || 'left'
    obj.colnum = column.colnum
    obj.name = 'cell_' + column.colnum
    obj.ownerName = row.getProperty('ownerName')
    obj.registerName = row.getProperty('registerName') + '.' + obj.name
    obj.parent = row.getProperty('clientArea')
    return obj
  }

  /******************************************************************************************************************/

  appDFM.definitionLoader = (name) => _setName(definitionLoaderDefinition, name)
  appDFM.overlay = (name) => _setName(overlayComponentDefinition, name)
  appDFM.dialogue = (name) => _setName(messageDialogueDefinition, name)
  appDFM.datePicker = (name) => _setName(datePickerComponentDefinition, name)
  appDFM.gridInnerGrid = (grid) => _prepareGridInnerGrid(grid)
  appDFM.gridColumnHeaderPanel = (grid) => _prepareGridColumnHeaderPanel(grid)
  appDFM.gridColumnHeader = (grid, column) => _prepareGridColumnHeader(grid, column)
  appDFM.gridRow = (grid, row) => _prepareGridRow(grid, row)
  appDFM.gridCell = (row, column) => _prepareGridCell(row, column)

  window.TApplicationDFM = appDFM
}())
