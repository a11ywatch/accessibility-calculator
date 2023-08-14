import { PropsWithChildren, createContext, useContext, FC } from 'react'
import { useCalculator } from '../calculator/hooks/use-calculator'

const AppContext = createContext({})

type GqlProps = PropsWithChildren<{
  lang: string
}>

// skip fetching the website query
const CalculatorProviderComponent: FC<GqlProps> = ({ children, lang }) => {
  const state = useCalculator({ lang })

  return <AppContext.Provider value={state}>{children}</AppContext.Provider>
}

export const CalculatorProvider: FC<GqlProps> = ({
  children,
  lang,
  ...extra
}) => {
  return (
    <CalculatorProviderComponent {...extra} lang={lang}>
      {children}
    </CalculatorProviderComponent>
  )
}

export function useCalculatorContext() {
  return useContext(AppContext)
}
