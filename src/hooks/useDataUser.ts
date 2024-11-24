import { createContext, useContext } from 'react'
import { PropsDataUserContext } from '@/contexts/DataUserContext'

export const DataUserContext = createContext({} as PropsDataUserContext)

export function useDataUser() {
    const context = useContext(DataUserContext)
    
    return context
}