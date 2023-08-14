import { PageIssue } from '@app/types'

export type defaultData = {
  speed: number
  issues: Partial<PageIssue>[]
  loading: boolean
}

export type Res = {
  fast_htmlcs: defaultData
  htmlcs: defaultData
  fast_axecore: defaultData
  axecore: defaultData
  pa11y: defaultData
  kayle: defaultData
}
