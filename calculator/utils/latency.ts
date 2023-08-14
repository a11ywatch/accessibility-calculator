// measure the latency between request in ms
export const measureLatencyPerKb = (lib: string) => {
  let v = 0
  switch (lib) {
    case 'htmlcs':
    case 'axe':
    case 'kayle': {
      v = 4
      break
    }
    case 'pa11y': {
      v = 8
      break
    }
    case 'fast_axe': {
      v = 3.5
      break
    }
    case 'fast_htmlcs': {
      v = 1
      break
    }
    default:
      break
  }

  return v
}
