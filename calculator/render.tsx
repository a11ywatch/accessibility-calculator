import React, { useMemo } from 'react'
import useTranslation from 'next-translate/useTranslation'
import { useCalculator } from '@app/components/calculator/hooks/use-calculator'
import { RenderCalculator } from '@app/components/calculator/render-calculator'
import { Section } from '../general'

export const RenderCalculatorApp = () => {
  const { t, lang } = useTranslation('oss-accessibility-benchmarks')

  const {
    onPa11yBenchEvent,
    onCounterChange,
    onAxeBenchEvent,
    onAxeCounterChange,
    onCounterPa11yChange,
    onPa11yButtonClick,
    onHtmlcsBenchEvent,
    // data
    results,
    counter,
    counterAxe,
    counterPa11y,
    fastAxe,
    axecore,
    htmlcs,
    fastHtmlcs,
    onButtonClick,
  } = useCalculator({ lang })

  const vsHtmlcs = 'Fast_Htmlcs'
  const vsAxe = 'Fast_Axecore'
  const vsPa11y = 'Kayle'

  const thresholdText = t('threshold')
  const benchmarkText = t('benchmark')

  const cores = useMemo(
    () => ({
      fastAxe,
      axecore,
      htmlcs,
      fastHtmlcs,
    }),
    [fastAxe, axecore, htmlcs, fastHtmlcs]
  )

  return (
    <>
      <Section className='space-y-4 py-4'>
        <RenderCalculator
          results={results}
          header={vsHtmlcs}
          subtitleKey={'oss-accessibility-benchmarks:htmlcs-compare'}
          subtitle={'https://github.com/squizlabs/HTML_CodeSniffer'}
          onSubmit={onHtmlcsBenchEvent}
          cores={cores}
          lang={lang}
          onButtonClick={onButtonClick}
          t={t}
          counterValues={{
            onCounterChange: onCounterChange,
            counter,
            thresholdText,
            counterId: 'htmlcs-constraints',
          }}
          benchmarkText={benchmarkText}
          fastHtmlcs
        />
      </Section>

      <Section className='space-y-4 py-4'>
        <RenderCalculator
          results={results}
          header={vsAxe}
          subtitleKey={'oss-accessibility-benchmarks:axe-compare'}
          subtitle={'https://github.com/dequelabs/axe-core'}
          onSubmit={onAxeBenchEvent}
          cores={cores}
          lang={lang}
          onButtonClick={onButtonClick}
          t={t}
          counterValues={{
            onCounterChange: onAxeCounterChange,
            counter: counterAxe,
            thresholdText,
            counterId: 'axe-constraints',
          }}
          benchmarkText={benchmarkText}
          fastHtmlcs={false}
          pa11y={false}
        />
      </Section>

      <Section className='space-y-4 py-4'>
        <RenderCalculator
          results={results}
          header={vsPa11y}
          subtitleKey={'oss-accessibility-benchmarks:pa11y-compare'}
          subtitle={'https://github.com/pa11y/pa11y'}
          onSubmit={onPa11yBenchEvent as any}
          cores={cores}
          lang={lang}
          onButtonClick={onPa11yButtonClick as any}
          t={t}
          counterValues={{
            onCounterChange: onCounterPa11yChange,
            counter: counterPa11y,
            thresholdText,
            counterId: 'pa11y-constraints',
          }}
          benchmarkText={benchmarkText}
          pa11y
        />
      </Section>
    </>
  )
}
