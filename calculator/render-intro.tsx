import React, { SyntheticEvent } from 'react'
import { Button } from '@app/components/general'
import { Link } from '@app/components/stateless/typo/link'
import { blueLink } from '@app/components/stateless/typo/link-style'
import { Header, Header2, Header3 } from '@app/components/general/header'
import { Paragraph } from '@app/components/stateless/typo/paragraph'
import { a11yDark } from '@app/styles'
import { EditableMixture } from '@app/components/mixtures/editable-mixture'
import Trans from 'next-translate/Trans'
import { useCalculator } from './hooks/use-calculator'
import { useRandomData } from './hooks/use-random'
import useTranslation from 'next-translate/useTranslation'

const lineProps = () => ({
  style: { display: 'block', cursor: 'pointer' },
})

export const RenderCalculatorIntro = () => {
  const { t, lang } = useTranslation('oss-accessibility-benchmarks')
  const { setHtml, html } = useCalculator({ lang })

  const { generateRandomValidHTML } = useRandomData()

  const onRandomizeHtml = async (e: SyntheticEvent<HTMLButtonElement>) => {
    if (e && e.preventDefault) {
      e.preventDefault()
    }
    setHtml(await generateRandomValidHTML())
  }

  return (
    <>
      <div>
        <Header>{t('header')}</Header>
        <Trans
          i18nKey='oss-accessibility-benchmarks:header-d'
          components={[
            <Paragraph key={'1'} />,
            <Link
              href='https://github.com/a11ywatch/kayle'
              key={'link4'}
              target='_blank'
              rel='noopener'
              className={blueLink}
            />,
          ]}
        />
      </div>
      <div>
        <Header2>{t('subheader')}</Header2>
        <Paragraph>{t('subheader-d')}</Paragraph>
      </div>

      <div className='py-3'>
        <Header3>{t('enter-html')}</Header3>
        <Paragraph>{t('enter-d')}</Paragraph>
      </div>

      <div className='pb-3'>
        <Button
          type='button'
          onClick={onRandomizeHtml}
          className={'hover:bg-blue-600 hover:text-white uppercase py-2 flex-1'}
        >
          {t('randomize')}
        </Button>
      </div>

      <EditableMixture
        language='html'
        style={a11yDark}
        lineProps={lineProps}
        setScript={setHtml}
        editMode={true}
        height={'25vh'}
      >
        {html || ''}
      </EditableMixture>
    </>
  )
}
