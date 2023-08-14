import React from 'react'
import { ResponsiveBar } from '@nivo/bar'
import { Translate } from 'next-translate'
import { useTheme } from '../themes/theme'

export const RenderCalculatorBar = ({
  data,
  label,
  t,
}: {
  t: Translate
  label: string
  data: { [k: string]: any }[]
}) => {
  const { theme } = useTheme()

  return (
    <ResponsiveBar
      data={data}
      theme={{
        textColor: theme === 'dark' ? '#fff' : '#000',
        tooltip: {
          container: {
            color: '#000',
          },
        },
      }}
      colors={(d) => d.data.speedColor}
      keys={['speed']}
      indexBy='runner'
      label={(d) => `${d.data.speed}ms`}
      margin={{ top: 10, right: 10, bottom: 45, left: 110 }}
      layout={'horizontal'}
      axisRight={null}
      axisBottom={{
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Duration MS',
        legendPosition: 'middle',
        legendOffset: 40,
      }}
      axisTop={{
        legend: t('speed'),
        legendPosition: 'middle',
        tickValues: 0,
        legendOffset: -5,
      }}
      labelSkipWidth={12}
      labelSkipHeight={12}
      role='application'
      ariaLabel={label}
      barAriaLabel={(e) =>
        e.id + ': ' + e.formattedValue + ' in lib: ' + e.indexValue
      }
    />
  )
}
