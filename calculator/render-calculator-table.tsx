import React from 'react'
import { Translate } from 'next-translate'
import { Link } from '@app/components/stateless/typo/link'
import { blueLink } from '@app/components/stateless/typo/link-style'
import { classNames } from '@app/utils'

const tableHeadCSS =
  'border border-slate-300 px-1 py-1 dark:border-gray-700 font-semibold'

export const CalculatorTable = ({
  results,
  t,
  links,
}: {
  results: any
  t: Translate
  links: string[]
}) => {
  return (
    <table className='table-auto border-collapse border border-slate-400 rounded dark:border-gray-700'>
      <thead>
        <tr>
          <th className={tableHeadCSS}>{t('library')}</th>
          <th className={tableHeadCSS}>{t('size')}</th>
          <th className={tableHeadCSS}>{t('languages')}</th>
          <th className={tableHeadCSS}>{t('issues')}</th>
          <th className={tableHeadCSS}>{t('speed')}</th>
        </tr>
      </thead>
      <tbody>
        {results.map((row: string[], i: number) => {
          return (
            <tr key={`row-${i}`}>
              {row.map((d: any, ii) => {
                return (
                  <td
                    className={classNames(
                      'border border-slate-30 px-4 py-1 dark:border-gray-700',
                      ii === 4 ? 'min-w-[7rem]' : ''
                    )}
                    key={`td-${ii}`}
                  >
                    {ii === 0 ? (
                      <Link
                        href={links[i]}
                        target='_blank'
                        rel='noopener noreferrer'
                        className={classNames(blueLink, 'no-underline')}
                      >
                        {d}
                      </Link>
                    ) : (
                      d
                    )}
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
