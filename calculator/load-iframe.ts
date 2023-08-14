export function loadIframeElement(content: string) {
  let element: any = null

  // todo: remove iframe handling
  if (typeof content === 'string') {
    let elementFrame = document.createElement('iframe')
    elementFrame.className = 'hidden'
    elementFrame = document.body.insertBefore(elementFrame, null)

    if (elementFrame.contentDocument) {
      element = elementFrame.contentDocument
    }

    // @ts-ignore
    elementFrame.load = function () {
      this.onload = null
      Object.defineProperties(Image.prototype, {
        src: {
          get() {
            return ''
          },
          set() {},
        },
      })
      element = element.querySelector('body')
    }

    // // Satisfy IE which doesn't like onload being set dynamically.
    // @ts-ignore
    elementFrame.onreadystatechange = function () {}

    // @ts-ignore
    elementFrame.onload = elementFrame.load

    element.write(content)

    // element.id = `frame-${Math.random() + ""}`

    element.close()
  } else {
    element = content
  }

  return element
}
