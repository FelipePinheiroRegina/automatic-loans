import { ReactNode, useState } from 'react'
import { DataUserContext } from '@/hooks/useDataUser'

export interface PropsDataUserContext {
    data: PropsDataUser,
    handleSaveData: (dataUser: PropsDataUser) => void,
    handleRemoveDataUser: () => void
}

interface PropsDataUserProvider {
    children: ReactNode
}


export interface PropsDataUser {
    name: string,
    street: string
    pix: string,
    bank: string,
    cep: string,
    numberHouse: string,
    city: string,
    state: string,
    isChecked: boolean
}

export function DataUserProvider({ children }: PropsDataUserProvider) {
    const [data, setData] = useState<PropsDataUser>(() => {
    const isDataUserOnLocalStorage = localStorage.getItem("@emprestimosPinheiro:datas");
    return isDataUserOnLocalStorage
        ? JSON.parse(isDataUserOnLocalStorage)
        : {
            name: "",
            street: "",
            pix: "",
            bank: "",
            cep: "",
            numberHouse: "",
            city: "",
            state: "",
            isChecked: false,
        };
    })
    

    function handleSaveData(dataUser: PropsDataUser) {
        setData(dataUser)
        localStorage.setItem("@emprestimosPinheiro:datas", JSON.stringify(dataUser))
    }

    function handleRemoveDataUser() {
        setData({
            name: "",
            street: "",
            pix: "",
            bank: "",
            cep: "",
            numberHouse: "",
            city: "",
            state: "",
            isChecked: false
        })

        localStorage.removeItem("@emprestimosPinheiro:datas")
    }

    return (
        <DataUserContext.Provider value={{
            data,
            handleSaveData,
            handleRemoveDataUser
        }}>
            {children}
        </DataUserContext.Provider>
    )
}