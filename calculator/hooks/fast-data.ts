import { useMemo } from 'react'

export const useFastData = ({
  fastHtmlcs,
  results,
  pa11y,
  fastIssueTotal,
}: any) => {
  const fastData = useMemo(() => {
    if (pa11y) {
      return {
        lib: 'Kayle',
        libCompare: 'Pa11y',
        loading: results.kayle.loading,
        loadingCompare: results.pa11y.loading,
        links: [
          'https://github.com/a11ywatch/kayle',
          'https://github.com/pa11y/pa11y',
        ],
        results: [['Kayle', '80kb', 14, fastIssueTotal, results.kayle.speed]],
      }
    }
    return fastHtmlcs
      ? {
          lib: 'Fast_Htmlcs',
          libCompare: 'HTML_CodeSniffer',
          loading: results.fast_htmlcs.loading,
          loadingCompare: results.htmlcs.loading,
          links: [
            'https://github.com/a11ywatch/kayle/tree/main/fast_htmlcs',
            'https://github.com/squizlabs/HTML_CodeSniffer',
          ],
          results: [
            [
              'Fast_Htmlcs',
              '130kb',
              9,
              fastIssueTotal,
              results.fast_htmlcs.speed,
            ],
          ],
        }
      : {
          lib: 'Fast_Axecore',
          libCompare: 'Axe-Core',
          loading: results.fast_axecore.loading,
          loadingCompare: results.axecore.loading,
          links: [
            'https://github.com/a11ywatch/kayle/tree/main/fast_axecore',
            'https://github.com/squizlabs/HTML_CodeSniffer',
          ],
          results: [
            [
              'Fast_Axecore',
              '389kb',
              13,
              fastIssueTotal,
              results.fast_axecore.speed,
            ],
          ],
        }
  }, [fastHtmlcs, results, pa11y, fastIssueTotal])

  return fastData
}
