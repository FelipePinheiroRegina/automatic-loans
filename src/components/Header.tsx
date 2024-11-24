import { Switch } from "@/components/ui/switch"
import { useTheme } from "@/hooks/useTheme"
import { FormAddress } from "@/components/FormAddress"
import { useState } from "react"
import { useDataUser } from "@/hooks/useDataUser"

export function Header() {
    const { setTheme } = useTheme()
    const { data } = useDataUser()

    const [ isChecked, setIsChecked ] = useState(() => {
        const currentTheme = localStorage.getItem('vite-ui-theme')
        if(currentTheme === 'light') {
            return true
        } else {
            return false
        }
    })

    function handleLight(checked: boolean) {
        setIsChecked(checked)

        if(checked === false) {
            return setTheme('dark')
        } else {
            return setTheme('light')
        }
    }

    return (
        <header className="sticky top-0 z-50 w-full  flex items-center justify-between gap-4 p-4 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-border">
            <div className="flex items-center gap-4">
                <Switch
                    checked={isChecked}
                    onCheckedChange={handleLight}
                />
    
                <FormAddress/>

               { !data.isChecked && <small className="text-primary">Formulário obrigatório</small> }
            </div>
            
            {data.name !== '' && 
                <div className="flex flex-col items-end">
                    <span>Bem-vindo</span>
                    <strong className="pr-2">{data.name}</strong>
                </div>
            }
        </header>
    )
}