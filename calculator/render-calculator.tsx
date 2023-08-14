import { Translate } from 'next-translate'
import { GrAlert } from 'react-icons/gr'
import Trans from 'next-translate/Trans'
import { CalculatorSection } from './render-calculator-section'
import { Link } from '../stateless/typo/link'
import { blueLink } from '../stateless/typo/link-style'
import { Paragraph } from '../stateless/typo/paragraph'
import { Button } from '../general/buttons'
import { Header3 } from '../general/header'

export const RenderCalculator = ({
  t,
  results,
  lang,
  header,
  subtitle,
  subtitleKey,
  onSubmit,
  counterValues,
  onButtonClick,
  benchmarkText,
  pa11y,
  fastHtmlcs,
}: {
  cores: {
    fastAxe: any
    axecore: any
    htmlcs: any
    fastHtmlcs: any
  }
  t: Translate
  results: any
  lang: string
  header: string
  subtitle: string
  subtitleKey: string
  fastHtmlcs?: boolean
  pa11y?: boolean
  onSubmit?: (e: React.SyntheticEvent<HTMLFormElement, Event>) => Promise<void>
  counterValues: {
    onCounterChange: (e: React.SyntheticEvent<HTMLInputElement, Event>) => void
    counter: number | null
    thresholdText: string
    counterId: string
  }
  benchmarkText: string
  onButtonClick?: (
    fast?: boolean | undefined,
    cf?: any,
    ax?: boolean | undefined,
    c?: number | undefined,
    nostate?: boolean | undefined
  ) => Promise<
    | {
        issues: {}
        speed: string
        loading: boolean
      }
    | undefined
  >
}) => {
  const { onCounterChange, counter, thresholdText, counterId } = counterValues

  return (
    <div className='p-4 border dark:border-gray-700 rounded'>
      <Header3>{header}</Header3>
      <Trans
        i18nKey={subtitleKey}
        components={[
          <Paragraph key={'1'} />,
          <Link
            href={subtitle}
            target='_blank'
            rel='noopener noreferrer'
            key={'link2'}
            className={blueLink}
          />,
        ]}
      />

      <form className='py-4 flex flex-wrap gap-2' onSubmit={onSubmit}>
        <Button
          type={'submit'}
          className='hover:bg-blue-600 hover:text-white uppercase'
        >
          {benchmarkText}
        </Button>

        <label htmlFor={counterId} className='sr-only'>
          {thresholdText}
        </label>

        <input
          type={'number'}
          id={counterId}
          className='border p-3 rounded dark:border-gray-700'
          placeholder={thresholdText}
          onChange={onCounterChange}
          defaultValue={counter ?? 10}
          max={1000}
        ></input>

        <div className='p-3 border dark:border-gray-700 flex place-items-center space-x-2 rounded'>
          <GrAlert className='grIcon' />
          <div>{t('careful')}</div>
        </div>
      </form>

      <CalculatorSection
        results={results}
        lang={lang}
        fastHtmlcs={fastHtmlcs}
        pa11y={pa11y}
        label={header}
        t={t}
        onButtonClick={onButtonClick}
      />
    </div>
  )
}
