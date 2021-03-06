import Quill from 'quill'
import Fuse from 'fuse.js'
import emojiList from './emoji-list.js'

const Module = Quill.import('core/module')

class ToolbarEmoji extends Module {
  constructor (quill, options) {
    super(quill, options)

    this.quill = quill
    this.toolbar = quill.getModule('toolbar')
    if (typeof this.toolbar !== 'undefined') this.toolbar.addHandler('emoji', this.checkPalatteExist)

    var emojiBtns = document.getElementsByClassName('ql-emoji')
    if (emojiBtns) {
      [].slice.call(emojiBtns).forEach(function (emojiBtn) {
        emojiBtn.innerHTML = options.buttonIcon
      })
    }
  }

  checkPalatteExist () {
    let quill = this.quill
    fnCheckDialogOpen(quill)
    this.quill.on('text-change', function (delta, oldDelta, source) {
      if (source === 'user') {
        fnClose()
        fnUpdateRange(quill)
      }
    })
  }
}

ToolbarEmoji.DEFAULTS = {
  buttonIcon: '<svg viewbox="0 0 18 18"><circle class="ql-fill" cx="7" cy="7" r="1"></circle><circle class="ql-fill" cx="11" cy="7" r="1"></circle><path class="ql-stroke" d="M7,10a2,2,0,0,0,4,0H7Z"></path><circle class="ql-stroke" cx="9" cy="9" r="6"></circle></svg>'
}

function fnClose () {
  let eleEmojiPlate = document.getElementById('emoji-palette')
  document.getElementById('emoji-close-div').style.display = 'none'
  if (eleEmojiPlate) { eleEmojiPlate.remove() }
}

function fnCheckDialogOpen (quill) {
  let elementExists = document.getElementById('emoji-palette')
  if (elementExists) {
    elementExists.remove()
  } else {
    fnShowEmojiPalatte(quill)
  }
}

function fnUpdateRange (quill) {
  let range = quill.getSelection()
  return range
}

function fnShowEmojiPalatte (quill) {
  let eleEmojiArea = document.createElement('div')
  // let toolbar_container = document.querySelector('.ql-toolbar')
  let range = quill.getSelection()
  const atSignBounds = quill.getBounds(range.index)

  quill.container.appendChild(eleEmojiArea)
  let paletteMaxPos = atSignBounds.left + 250// palette max width is 250
  eleEmojiArea.id = 'emoji-palette'
  eleEmojiArea.style.top = 10 + atSignBounds.top + atSignBounds.height + 'px'
  if (paletteMaxPos > quill.container.offsetWidth) {
    eleEmojiArea.style.left = (atSignBounds.left - 250) + 'px'
  } else {
    eleEmojiArea.style.left = atSignBounds.left + 'px'
  }

  let tabToolbar = document.createElement('div')
  tabToolbar.id = 'tab-toolbar'
  eleEmojiArea.appendChild(tabToolbar)

  // panel
  let panel = document.createElement('div')
  panel.id = 'tab-panel'
  eleEmojiArea.appendChild(panel)

  var emojiType = [
    {'type': 'p', 'name': 'people', 'content': '<div class="i-people"></div>'},
    {'type': 'n', 'name': 'nature', 'content': '<div class="i-nature"></div>'},
    {'type': 'd', 'name': 'food', 'content': '<div class="i-food"></div>'},
    {'type': 's', 'name': 'symbols', 'content': '<div class="i-symbols"></div>'},
    {'type': 'a', 'name': 'activity', 'content': '<div class="i-activity"></div>'},
    {'type': 't', 'name': 'travel', 'content': '<div class="i-travel"></div>'},
    {'type': 'o', 'name': 'objects', 'content': '<div class="i-objects"></div>'},
    {'type': 'f', 'name': 'flags', 'content': '<div class="i-flags"></div>'}
  ]

  let tabElementHolder = document.createElement('ul')
  tabToolbar.appendChild(tabElementHolder)

  if (document.getElementById('emoji-close-div') === null) {
    let closeDiv = document.createElement('div')
    closeDiv.id = 'emoji-close-div'
    closeDiv.addEventListener('click', fnClose, false)
    document.getElementsByTagName('body')[0].appendChild(closeDiv)
  } else {
    document.getElementById('emoji-close-div').style.display = 'block'
  }

  emojiType.map(function (emojiType) {
    // add tab bar
    let tabElement = document.createElement('li')
    tabElement.classList.add('emoji-tab')
    tabElement.classList.add('filter-' + emojiType.name)
    let tabValue = emojiType.content
    tabElement.innerHTML = tabValue
    tabElement.dataset.filter = emojiType.type
    tabElementHolder.appendChild(tabElement)

    let emojiFilter = document.querySelector('.filter-' + emojiType.name)
    emojiFilter.addEventListener('click', function () {
      let tab = document.querySelector('.active')
      if (tab) {
        tab.classList.remove('active')
      }
      emojiFilter.classList.toggle('active')
      fnUpdateEmojiContainer(emojiFilter, panel, quill)
    })
  })
  fnEmojiPanelInit(panel, quill)
}

function fnEmojiPanelInit (panel, quill) {
  fnEmojiElementsToPanel('p', panel, quill)
  document.querySelector('.filter-people').classList.add('active')
}

function fnEmojiElementsToPanel (type, panel, quill) {
  let fuseOptions = {
    shouldSort: true,
    matchAllTokens: true,
    threshold: 0.3,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 3,
    keys: [
      'category'
    ]
  }
  let fuse = new Fuse(emojiList, fuseOptions)
  let result = fuse.search(type)
  result.sort(function (a, b) {
    return a.emojiOrder - b.emojiOrder
  })

  quill.focus()
  let range = fnUpdateRange(quill)

  result.map(function (emoji) {
    let span = document.createElement('span')
    let t = document.createTextNode(emoji.shortname)
    span.appendChild(t)
    span.classList.add('bem')
    span.classList.add('bem-' + emoji.name)
    span.classList.add('ap')
    span.classList.add('ap-' + emoji.name)
    let output = '' + emoji.codeDecimal + ''
    span.innerHTML = output + ' '
    panel.appendChild(span)

    let customButton = document.querySelector('.bem-' + emoji.name)
    if (customButton) {
      customButton.addEventListener('click', function () {
        makeElement('span', { className: 'ico', innerHTML: '' + emoji.codeDecimal + ' ' })
        // let emojiIconHtml = makeElement('span', { className: 'ico', innerHTML: '' + emoji.codeDecimal + ' ' })
        // let emojiIcon = emojiIconHtml.innerHTML
        quill.insertEmbed(range.index, 'emoji', emoji)
        fnClose()
      })
    }
  })
}

function fnUpdateEmojiContainer (emojiFilter, panel, quill) {
  while (panel.firstChild) {
    panel.removeChild(panel.firstChild)
  }
  let type = emojiFilter.dataset.filter
  fnEmojiElementsToPanel(type, panel, quill)
}

function makeElement (tag, attrs, ...children) {
  const elem = document.createElement(tag)
  Object.keys(attrs).forEach(key => (elem[key] = attrs[key]))
  children.forEach(child => {
    if (typeof child === 'string') child = document.createTextNode(child)
    elem.appendChild(child)
  })
  return elem
}

export default ToolbarEmoji
