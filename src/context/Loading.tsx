import * as React from 'react'

export type LoadingsContextProps = {
  loading: { loading: boolean }
  setLoading: (loading: boolean) => void
}

export const LoadingsContext = React.createContext<LoadingsContextProps>({} as LoadingsContextProps)

interface props {
  children: JSX.Element | JSX.Element[]
  initialState: boolean
}

export const LoadingProvider = ({ children, initialState }: props) => {
  const [loading, dispatch] = React.useReducer(loadingReducer, { loading: initialState })

  const setLoading = (loading: boolean) => dispatch({ type: 'setLoading', payload: loading })

  React.useEffect(() => {
    setLoading(initialState)
  }, [initialState])

  return (
    <LoadingsContext.Provider
      value={{
        loading,
        setLoading,
      }}
    >
      {children}
    </LoadingsContext.Provider>
  )
}

type LoadingAction = {
  type: 'setLoading'

  payload: boolean
}

export const loadingReducer = (state: { loading: boolean }, action: LoadingAction) => {
  switch (action.type) {
    case 'setLoading':
      return {
        loading: action.payload as boolean,
      }

    default:
      return state
  }
}
