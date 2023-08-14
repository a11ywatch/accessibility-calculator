const elementTypes = [
  'div',
  'p',
  'h1',
  'h2',
  'h3',
  'span',
  'a',
  'strong',
  'em',
  'img',
  'input',
  'button',
  'ul',
  'ol',
  'li',
]

// Map of valid attributes for each element type
const validAttributes = {
  div: ['class', 'id', 'style'],
  p: ['style'],
  h1: ['style'],
  h2: ['style'],
  h3: ['style'],
  span: ['class', 'style'],
  a: ['href', 'target', 'style'],
  strong: ['style'],
  em: ['style'],
  img: ['src', 'alt', 'title', 'width', 'height', 'style'],
  input: ['type', 'name', 'id', 'placeholder', 'value', 'style'],
  button: ['type', 'class', 'id', 'value', 'style'],
  ul: ['class', 'style'],
  ol: ['class', 'style'],
  li: ['class', 'style'],
}

let chance: any
let prettier: any
let prettierHtmlParse: any

export const useRandomData = () => {
  async function loadChance() {
    if (!chance) {
      const wchance = (
        await import('node_modules/chance/dist/chance.min.js' as any)
      ).default
      wchance()
      // @ts-ignore
      chance = new Chance()
    }
    if (!prettier) {
      prettier = (await import('node_modules/prettier/standalone' as any))
        .default

      prettierHtmlParse = await import(
        'node_modules/prettier/plugins/html.js' as any
      )
    }
  }

  // Generate attributes HTML
  function generateAttributesHTML(attributes: any) {
    return Object.entries(attributes)
      .map(([attribute, value]) => ` ${attribute}="${value}"`)
      .join('')
  }

  // Generate random attribute value based on attribute name
  function generateRandomAttribute(attribute: string) {
    switch (attribute) {
      case 'class':
        return chance.word()
      case 'id':
        return chance.word()
      case 'style':
        return generateRandomStyle()
      case 'src':
        return `https://example.com/${chance.word()}.jpg`
      case 'alt':
        return chance.sentence({ words: 3 })
      case 'title':
        return chance.sentence({ words: 3 })
      case 'width':
        return chance.integer({ min: 50, max: 500 })
      case 'height':
        return chance.integer({ min: 50, max: 300 })
      case 'type':
        return chance.pickone(['text', 'button', 'checkbox', 'radio'])
      case 'name':
        return chance.word()
      case 'placeholder':
        return chance.sentence({ words: 3 })
      case 'value':
        return chance.word()
      case 'href':
        return `https://example.com/${chance.word()}`
      case 'target':
        return chance.pickone(['_blank', '_self', '_parent'])
      default:
        return null
    }
  }

  // Generate random inline style
  function generateRandomStyle() {
    const styleProps = ['color', 'font-size', 'background-color']

    const ss: any[] = chance.pickset(styleProps)

    const style = ss
      .map(
        (prop, i) =>
          `${prop}: ${
            ['font-size'].includes(prop)
              ? `${chance.integer({ min: 1, max: 55 })}px`
              : chance.color()
          }${i === styleProps.length - 1 ? ';' : ''}`
      )
      .join('; ')

    return style
  }

  function isEmptyTag(element: any) {
    return ['input', 'img', 'br', 'hr', 'meta'].includes(element)
  }

  // Generate random HTML element
  function generateRandomHTMLElement(depth = 1) {
    const randomElementType = chance.pickone(elementTypes)

    const validAttrs =
      validAttributes[randomElementType as keyof typeof validAttributes]

    // Generate random attributes
    const attributes: any = {}

    if (validAttrs) {
      for (let i = 0; i < validAttrs.length; i++) {
        const attrName = validAttrs[i]
        const attrValue = generateRandomAttribute(attrName)
        if (attrValue) {
          attributes[attrName] = attrValue
        }
      }
    }

    // Generate random content if not an empty tag
    let content = ''

    if (!isEmptyTag(randomElementType) && depth < 3) {
      const childCount = chance.integer({ min: 1, max: 3 })
      for (let i = 0; i < childCount; i++) {
        const childElement = generateRandomHTMLElement(depth + 1)
        content += childElement
      }
    } else if (
      ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(randomElementType)
    ) {
      content = chance.paragraph({ sentences: 1 })
    }
    // TODO: add list construct ul

    // Construct the HTML
    let html = `<${randomElementType}${generateAttributesHTML(attributes)}>`

    if (isEmptyTag(randomElementType)) {
      html = `<${randomElementType}${generateAttributesHTML(attributes)}/>`
    }

    html += content

    if (!isEmptyTag(randomElementType)) {
      html += `</${randomElementType}>`
    }

    return html
  }

  async function generateRandomValidHTML() {
    await loadChance()

    const elementCount = chance.integer({ min: 3, max: 15 })
    let html = ''

    for (let i = 0; i < elementCount; i++) {
      const randomElement = generateRandomHTMLElement()
      html += randomElement
    }

    const taggedHTML = `<html><body>${html}</body></html>`

    try {
      return `<!DOCTYPE html>\n${await prettier.format(taggedHTML, {
        parser: 'html',
        plugins: [prettierHtmlParse],
      })}`
    } catch (e) {
      console.error(e)

      return `<!DOCTYPE html>${taggedHTML}`
    }
  }

  return { chance, loadChance, generateRandomValidHTML }
}
