class Counter {
  constructor (quill, options) {
    this.quill = quill
    this.options = options
    this.container = document.querySelector(options.container)
    quill.on('text-change', this.update.bind(this))
    this.update() // Account for initial contents
  }

  calculate () {
    var text = this.quill.getText()
    if (this.options.unit === 'word') {
      text = text.trim()
      // Splitting empty text returns a non-empty array
      return text.length > 0 ? text.split(/\s+/).length : 0
    } else {
      return text.length - 1 > 0 ? text.length - 1 : 0
    }
  }

  update () {
    var length = this.calculate()
    var label = this.options.unit
    if (length !== 1) {
      label += 's'
    }
    this.container.innerHTML = length + ' ' + label
  }
}

export default Counter
