import React, { useMemo } from 'react'
import { Translate } from 'next-translate'
import { CalculatorTable } from '@app/components/calculator/render-calculator-table'
import { RenderCalculatorIssue } from '@app/components/calculator/render-calculator-issue'
import dynamic from 'next/dynamic'
import { useFastTotal } from './hooks/fast-total'
import { Res } from './data/t'
import { useFastData } from './hooks/fast-data'
import type { PageIssue } from '@app/types'
import { InView } from 'react-intersection-observer'

// @ts-ignore
const LagRadar = dynamic(() => import('react-lag-radar'), { ssr: false }) as any

const sortIssues = (
  a: PageIssue & { type?: number },
  b: PageIssue & { type?: number }
) => {
  if ('typeCode' in a) {
    return (a.typeCode || 0) > (b.typeCode || 0) ? 1 : 0
  }

  // @ts-ignore
  return (a.type || 0) < (b.type || 0) ? -1 : 0
}

export const CalculatorSection = ({
  results,
  fastHtmlcs,
  pa11y,
  t,
}: {
  t: Translate
  lang: string
  results: Res
  fastHtmlcs?: boolean
  onButtonClick?: any
  label: string
  pa11y?: boolean
}) => {
  const [fastAligner, _]:
    | ['kayle', 'pa11y']
    | ['fast_htmlcs', 'htmlcs']
    | ['fast_axecore', 'axecore'] = useMemo(() => {
    if (pa11y) {
      return ['kayle', 'pa11y']
    }
    return fastHtmlcs ? ['fast_htmlcs', 'htmlcs'] : ['fast_axecore', 'axecore']
  }, [fastHtmlcs, pa11y])

  const mainData =
    !fastHtmlcs && !pa11y
      ? results.fast_axecore.issues
      : results[fastAligner].issues

  // TODO: divide up tally warnings,errors,notices include all errors from recurrences
  const fastIssueTotal = useFastTotal(mainData)

  const textMap = useMemo(() => {
    const errors = t('errors')
    const warnings = t('warnings')
    const notices = t('notices')

    return {
      errors,
      warnings,
      notices,
    }
  }, [t])

  const fastData = useFastData({ fastHtmlcs, results, pa11y, fastIssueTotal })

  const axeDataView = typeof mainData === 'object' && !Array.isArray(mainData)
  const htmlcsDataView =
    mainData && Array.isArray(mainData) && (mainData as any[]).length

  return (
    <div className='py-4 border-t dark:border-gray-700'>
      <div className='py-4 flex flex-wrap gap-3 overflow-hidden'>
        <div className='w-full md:w-auto md:flex-1 md:max-w-[49.5vw] overflow-auto'>
          <CalculatorTable
            t={t}
            links={fastData.links}
            results={fastData.results}
          />
        </div>
        <div className='w-full md:w-auto  md:flex-1 rounded md:max-w-[49.5vw] overflow-hidden flex place-content-center place-items-center'>
          <InView>
            {({ inView, ref }) => (
              <div
                ref={ref}
                className='place-items-center flex place-content-center'
              >
                {inView ? <LagRadar size={50} speed={0.0015} /> : null}
              </div>
            )}
          </InView>
        </div>
      </div>

      <div className='py-2'>
        {axeDataView ? (
          <div className='max-h-[40vh] overflow-auto'>
            <ul className='py-2 px-4'>
              {((mainData as any).violations || []).map(
                (item: any, j: number) => (
                  <RenderCalculatorIssue
                    key={`f-${j}`}
                    item={item}
                    textMap={textMap}
                  />
                )
              )}
            </ul>
            <ul className='py-2 px-4'>
              {((mainData as any).incomplete || []).map(
                (item: any, j: number) => (
                  <RenderCalculatorIssue
                    key={`f-${j}`}
                    item={item}
                    textMap={textMap}
                  />
                )
              )}
            </ul>
          </div>
        ) : htmlcsDataView ? (
          <ul className='py-2 px-4 max-h-[40vh] overflow-auto'>
            {(mainData as any[])
              .sort(sortIssues)
              .map((item: any, j: number) => (
                <RenderCalculatorIssue
                  key={`f-${j}`}
                  item={item}
                  textMap={textMap}
                />
              ))}
          </ul>
        ) : (
          t('empty-results')
        )}
      </div>
    </div>
  )
}
