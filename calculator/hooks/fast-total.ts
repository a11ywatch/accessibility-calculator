import { useMemo } from 'react'

// get the total for a record
export const useFastTotal = (mainData: Record<string, any> | any[]) => {
  const fastIssueTotal = useMemo(() => {
    let total = 0

    if (typeof mainData === 'object' && !Array.isArray(mainData)) {
      for (const item of (mainData as any).violations || []) {
        total++
        if (item.recurrence) {
          total += item.recurrence
        }
      }
      for (const item of (mainData as any).incomplete || []) {
        total++
        if (item.recurrence) {
          total += item.recurrence
        }
      }
    }

    if (mainData && Array.isArray(mainData)) {
      for (const item of mainData) {
        total++
        if (item.recurrence) {
          total += item.recurrence
        }
      }
    }

    return total
  }, [mainData])

  return fastIssueTotal
}
