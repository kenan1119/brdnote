import Quill from 'quill'

const ImageFormatAttributesList = [
  'alt',
  'height',
  'width',
  'style'
]

var BaseImageFormat = Quill.import('formats/image')
class ImageFormat extends BaseImageFormat {
  static formats (domNode) {
    return ImageFormatAttributesList.reduce(function (formats, attribute) {
      if (domNode.hasAttribute(attribute)) {
        formats[attribute] = domNode.getAttribute(attribute)
      }
      return formats
    }, {})
  }
  format (name, value) {
    if (ImageFormatAttributesList.indexOf(name) > -1) {
      if (value) {
        this.domNode.setAttribute(name, value)
      } else {
        this.domNode.removeAttribute(name)
      }
    } else {
      super.format(name, value)
    }
  }
}

export default ImageFormat
