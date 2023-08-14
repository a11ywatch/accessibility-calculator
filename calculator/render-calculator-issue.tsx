import React from 'react'
import { classNames } from '@app/utils'

type TextMap = { errors: string; warnings: string; notices: string }

// todo: use translation map
const getType = (n: number | string, textMap: TextMap) => {
  if (typeof n === 'number') {
    if (n === 1) {
      return textMap.errors
    }
    if (n === 2) {
      return textMap.warnings
    }
    if (n === 3) {
      return textMap.notices
    }
  }

  if (typeof n === 'string') {
    const nj = `${n}s`

    if (nj in textMap) {
      return textMap[nj as keyof typeof textMap]
    }
  }

  return n
}

export const RenderCalculatorIssue = ({
  item,
  textMap,
}: {
  item: any
  textMap: TextMap
}) => {
  return (
    <li className='px-2 py-3 space-y-1'>
      <div className='font-semibold capitalize'>
        {getType(item.type || item.impact, textMap)}
      </div>
      <div className='text-sm'>{item.code || item.help}</div>
      <div className='text-base'>
        {item.description || item.msg || item.message || 'N/A'}
      </div>
      <div
        className={classNames(item.recurrence ? '' : 'invisible', 'text-xs')}
      >
        +{item.recurrence || 0}
      </div>
    </li>
  )
}
