import { SyntheticEvent, useCallback, useState, startTransition } from 'react'
import { defaultHTML } from '@app/components/calculator/data/b'
import type { PageIssue } from '@app/types'
import { measureLatencyPerKb } from '../utils/latency'
import { runAxeCore } from '../tools/kayle/runners/axe'
import { runA11y } from '../tools/kayle/runner'
import { loadIframeElement } from '../load-iframe'

const defaultData: {
  speed: number
  issues: Partial<PageIssue>[]
  loading: boolean
} = {
  speed: 0,
  issues: [],
  loading: false,
}

const defaultState = {
  fast_htmlcs: defaultData,
  htmlcs: defaultData,
  fast_axecore: defaultData,
  axecore: defaultData,
  kayle: defaultData,
  pa11y: defaultData,
}

const bindWindow = (cf: Record<string, any>) => {
  for (const [key, value] of Object.entries(cf)) {
    // @ts-ignore
    window[key] = value
  }
}

const preventDefault = (e: SyntheticEvent) => {
  if (e && e.preventDefault) {
    e.preventDefault()
  }
}

export const useCalculator = ({ lang }: { lang?: string }) => {
  // STATE
  const [counter, setCounter] = useState<number | null>(10)
  const [counterAxe, setAxeCounter] = useState<number | null>(10)
  const [counterPa11y, setPa11yCounter] = useState<number | null>(10)
  // input data
  const [html, setHtml] = useState(defaultHTML)
  // MODULES data
  const [fastHtmlcs, setFastHtmlcs] = useState()
  const [htmlcs, _] = useState()
  const [fastAxe, setFastAxe] = useState()
  const [axecore, setAxecore] = useState()
  // RESULTS FROM TEST
  const [results, setResults] = useState<typeof defaultState>(defaultState)

  const loadHtmlCs = useCallback(async () => {
    let cf = null
    let cff = null

    if (!fastHtmlcs) {
      try {
        cf = (await import(
          `fast_htmlcs/build/HTMLCS${lang === 'en' ? '' : `.${lang}`}.js`
        )).default
      } catch (_) {
        cf = (await import('fast_htmlcs/build/HTMLCS.js' as any)).default
      }
      setFastHtmlcs(cf)
    }
    
    return {
      cf: cf ?? fastHtmlcs,
      cff: cff ?? htmlcs,
    }
  }, [setFastHtmlcs, lang, fastHtmlcs, htmlcs])

  const loadAxeCf = useCallback(async () => {
    let cf = null
    let cff = null

    if (!fastAxe) {
      try {
        cf = (await import(
          `fast_axecore/axe${
            lang === 'en' ? '' : `.${(lang || '').replace('-', '_')}`
          }.min.js`
        )).default

      } catch (_) {
       ( cf = await import('fast_axecore/axe.min.js' as any)).default
      }
      setFastAxe(cf)
    }

    if (!axecore) {
      cff = (await import('axe-core/axe.min.js' as any)).default
      setAxecore(cff)
    }

    return { cf: cf ?? fastAxe, cff: cff ?? axecore }
  }, [setFastAxe, setAxecore, fastAxe, lang, axecore])

  const onHtmlcsBenchEvent = async (e: SyntheticEvent<HTMLFormElement>) => {
    preventDefault(e)

    const { cf } = await loadHtmlCs()

    // prevent running benches in progress
    await onBenchFastEvent(null, cf)
  }

  const onAxeBenchEvent = async (e: SyntheticEvent<HTMLFormElement>) => {
    preventDefault(e)
    const { cf } = await loadAxeCf()

    // prevent running benches in progress
    await onBenchFastEvent(null, cf, true)
  }

  const onPa11yBenchEvent = async (
    e: SyntheticEvent<HTMLFormElement | HTMLButtonElement>,
    ignore?: { kayle?: boolean; pa11y?: boolean }
  ) => {
    preventDefault(e)
    // LOAD the MODULES
    const { cf: fastHtmlcsCF } = await loadHtmlCs()
    const { cf: fastAxeCF } = await loadAxeCf()
    const ccount = counterPa11y ?? 1
    let pa11yData: any = null
    let kayleData: any = null

    if (!ignore?.kayle) {
      setResults((x: any) => ({
        ...x,
        ['kayle']: {
          ...x['kayle'],
          loading: true,
        },
      }))

      const start = performance.now()

      for (let i = 0; i < (ccount || 1); i++) {
        const kayleHtmlcs: any = await onBenchFastEvent(
          null,
          fastHtmlcsCF,
          false,
          1,
          true
        )
        const kayleAxe = await onBenchFastEvent(null, fastAxeCF, true, 1, true)
        const axeD = runAxeCore(kayleAxe ? kayleAxe.issues : [])

        kayleData = await runA11y({
          runners: [
            { issues: axeD || [], name: 'axecore' },
            { issues: kayleHtmlcs.issues || [], name: 'htmlcs' },
          ],
        })
      }

      const elasped = performance.now() - start

      const latency = measureLatencyPerKb('kayle') * (ccount || 1)

      setResults((x: any) => ({
        ...x,
        ['kayle']: {
          ...x['kayle'],
          issues: kayleData ? kayleData.issues : [],
          speed: `${elasped + latency}ms`,
          loading: false,
        },
      }))
    }

    return {
      kayleData: kayleData,
      pa11yData: pa11yData,
    }
  }

  // main audit
  const onButtonClick = useCallback(
    async (
      fast?: boolean,
      cf?: any,
      ax?: boolean,
      c?: number,
      nostate?: boolean
    ) => {
      const [ffKey, ffKeyAlt] = ax
        ? ['fast_axecore', 'axecore']
        : ['fast_htmlcs', 'htmlcs']

      const { cf: fastFF, cff: normalFF } = ax
        ? await loadAxeCf()
        : await loadHtmlCs()

      const cc = cf ? cf : ((fast ? fastFF : normalFF) as any)
      const mainKey = fast ? ffKey : ffKeyAlt

      if (!nostate) {
        setResults((x: any) => ({
          ...x,
          [mainKey]: {
            ...x[mainKey],
            loading: true,
          },
        }))
      }

      const processMethod = async () => {
        await loadIframeElement(html)
        return new Promise((resolve) => {
          const myframe: HTMLIFrameElement | null =
            document.querySelector('iframe')
            
          if (ax) {
            let result = []

            try {
              // @ts-ignore
              result = window.axe.run(myframe.contentDocument)
            } catch (e) {
              console.error(e)
            }

            myframe?.remove()

            resolve(result || [])
          } else {
            // @ts-ignore
            cc.HTMLCS.process(
              'WCAG2AAA',
              myframe?.contentDocument,
              (error: any) => {
                myframe?.remove()

                if (!error) {
                  resolve(cc.HTMLCS.getMessages())
                } else {
                  resolve([])
                }
              },
              () => {},
              lang
            )
          }
        })
      }

      bindWindow(cc)
      
      let lastResult: any[] | null | unknown = null

      const start = performance.now()

      const ccount = c ?? counter

      for (let i = 0; i < (ccount || 1); i++) {
        lastResult = await processMethod()
      }

      const elapsed = performance.now() - start

      const latency =
        measureLatencyPerKb(fast ? ffKey : ffKeyAlt) * (ccount || 1)

      const res = {
        issues: lastResult ?? [],
        speed: `${elapsed + latency}ms`,
        loading: false,
      }

      if (!nostate) {
        startTransition(() => {
          setResults((x: any) => ({
            ...x,
            [mainKey]: res,
          }))
        })
      }

      return res
    },
    [counter, html, lang, loadAxeCf, loadHtmlCs]
  )

  // fast fork
  const onBenchFastEvent = async (
    e: any,
    cf: any,
    aa?: boolean,
    c?: number,
    nostate?: boolean
  ) => {
    preventDefault(e)

    try {
      return await onButtonClick(true, cf, aa, c, nostate)
    } catch (e) {
      console.error(e)
    }
  }


  const onCounterChange = (e: SyntheticEvent<HTMLInputElement>) => {
    const n = e.currentTarget.value ? Number(e.currentTarget.value) : null
    setCounter(n && n > 1000 ? 1000 : n)
  }

  const onAxeCounterChange = (e: SyntheticEvent<HTMLInputElement>) => {
    const n = e.currentTarget.value ? Number(e.currentTarget.value) : null
    setAxeCounter(n && n > 1000 ? 1000 : n)
  }

  const onCounterPa11yChange = (e: SyntheticEvent<HTMLInputElement>) => {
    const n = e.currentTarget.value ? Number(e.currentTarget.value) : null
    setPa11yCounter(n && n > 1000 ? 1000 : n)
  }

  const onPa11yButtonClick = async (
    e: SyntheticEvent<HTMLButtonElement>,
    kayle?: boolean
  ) => {
    preventDefault(e)
    if (kayle) {
      await onPa11yBenchEvent(e, { kayle: true })
    } else {
      await onPa11yBenchEvent(e, { pa11y: true })
    }
  }

  return {
    // state direct updaters
    setResults,
    setHtml,
    onPa11yBenchEvent,
    onCounterChange,
    onAxeBenchEvent,
    onAxeCounterChange,
    onCounterPa11yChange,
    onPa11yButtonClick,
    onHtmlcsBenchEvent,
    onButtonClick,
    // data
    html,
    counter,
    counterAxe,
    counterPa11y,
    results,
    fastAxe,
    axecore,
    htmlcs,
    fastHtmlcs,
    // load
    loadAxeCf,
    loadHtmlCs,
  }
}
