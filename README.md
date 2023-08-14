# accessibility-calculator

The web accessibility calculator used at [A11yWatch](https://a11ywatch.com).

The source code is setup to be view only and not something to start up. In order to use the code you need to drop it in your project by copying the code and making some adjustments.

## Required Modules

The code used has some modules that we depend on to help improve the experience. The also depends on next.js since that is what we use at A11yWatch for the client.

Install the following for the application:

1. react
1. next-translate
1. @nivo/core
1. @nivo/bar
1. react-lag-radar
1. react-icons
1. @headlessui/react
1. prettier
1. chance

Install the following for testing comparison:

1. kayle
1. axe-core@4.2.1 - used to load deps missing for browser

Install dev modules:

1. typescript
1. tailwindcss

Optional: setup your translations with a target named `oss-accessibility-benchmarks`

## Getting Started.

```ts
import { CalculatorProvider } from './calculator/provider'
import { RenderCalculatorApp } from './calculator/render-intro'
import { RenderCalculatorApp } from './calculator/render'

export const OSSWebAccessibilityBenchmarks = () => {
  const { lang } = useTranslation('oss-accessibility-benchmarks')

  return (
    <CalculatorProvider lang={lang}>
        <>
            <RenderCalculatorIntro />
            <RenderCalculatorApp />
        </>
    </CalculatorProvider>
  )
}
```

In the future we plan on releasing it as an npm package that could be included. It should take very minimal changes to get the project up and running.