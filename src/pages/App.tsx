import { Header } from "@/components/Header"
import { Toaster } from '@/components/ui/toaster'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { MessageCircleWarning } from "lucide-react"
import { DatePickerDemo } from '../components/DataPicker'
import { Simulation } from "@/components/Simulation"
import { differenceInCalendarDays } from 'date-fns'

import { Input } from "@/components/ui/input"
import { ChangeEvent, useState, useEffect } from "react"
import { useDataUser } from "@/hooks/useDataUser"

interface PropsInitialDates {
  startDate: Date | undefined,
  endDate: Date | undefined
}

export interface PropsSimulation {
  id: string,
  startDate: Date,
  endDate: Date,
  moneyBorrowed: number,
  moneyReturn: number,
  sumMoneyTotal: number,
  percentageDay: number,
  percentageTotal: number,
  created_at: Date,
  days: number
}

export function App() {
    const { data } = useDataUser()
    const disableIfNotDataUser = data.isChecked === false

    const [moneyBorrowed, setMoneyBorrowed] = useState(0)
    // Tipando diretamente como PropsInitialdates
    const [dates, setDates] = useState<PropsInitialDates>({
      startDate: undefined,
      endDate: undefined,
    })

    const [ simulation, setSimulation ] = useState({} as PropsSimulation)

    const handleDateChange = (key: keyof PropsInitialDates) => (date: Date | undefined) => {
      setDates((prev) => ({
        ...prev,
        [key]: date,
      }))
    }

    function handleChangeMoneyBorrowed(event: ChangeEvent<HTMLInputElement>){
      const inputValue = event.target.value
      // Permitir apenas números positivos
      if (/^\d*$/.test(inputValue)) {
        setMoneyBorrowed(Number(inputValue))
      }
    }
  
    useEffect(() => {
      if(!dates.startDate || !dates.endDate || !moneyBorrowed || moneyBorrowed < 150) return
      const percentageDay = 1.9
      const days = differenceInCalendarDays(dates.endDate as Date, dates.startDate as Date) + 1
      const percentageTotal = days * percentageDay
      const moneyReturn = moneyBorrowed * percentageTotal / 100
      const sumMoneyTotal = moneyReturn + moneyBorrowed

      const id = String(new Date().getTime()) 

      setSimulation({
        id,
        startDate: dates.startDate,
        endDate: dates.endDate,
        moneyBorrowed,
        moneyReturn,
        percentageDay,
        percentageTotal,
        sumMoneyTotal,
        created_at: new Date(),
        days
      })
  
    }, [dates, moneyBorrowed])

    return (
      <div>
        <Header/>
        <Toaster/>
        <div className="w-full">
          <div className="p-4 flex flex-col gap-2">
            <Alert>
              <MessageCircleWarning className="h-4 w-4" />
              <AlertTitle>Regras de negócio</AlertTitle>
              <AlertDescription>
                Preencha o formulário antes de realizar as suas simulações. Clique na prancheta acima!
              </AlertDescription>
            </Alert>

            <Alert>
              <MessageCircleWarning className="h-4 w-4" />
              <AlertTitle>Regras de negócio</AlertTitle>
              <AlertDescription>
                Valor mínimo é de R$ 150
              </AlertDescription>
            </Alert>

            <Alert>
              <MessageCircleWarning className="h-4 w-4" />
              <AlertTitle>Regras de negócio</AlertTitle>
              <AlertDescription>
                Será cobrado a porcentagem de 1.9% dia.
              </AlertDescription>
            </Alert>

            <form className="flex flex-col gap-2">
                <label htmlFor="value" className="font-josefin">Insira o valor</label>
                <Input
                  id="value"
                  placeholder="Valor"
                  value={moneyBorrowed}
                  onChange={handleChangeMoneyBorrowed}
                  readOnly={disableIfNotDataUser}
                  className={`${disableIfNotDataUser ? 'opacity-30' : ''}`}
                />
                { !disableIfNotDataUser &&
                  <DatePickerDemo
                    label="Data inicial" 
                    date={dates.startDate}
                    handleSetDate={(date) => handleDateChange('startDate')(date)}
                  />
                }
               { !disableIfNotDataUser &&
                  <DatePickerDemo 
                    label="Data final" 
                    date={dates.endDate}
                    handleSetDate={(date) => handleDateChange('endDate')(date)}
                  />
              }
              <Simulation simulation={simulation}/>
            </form>
          </div>
        </div>
      </div>
    )
}