import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"

import { PropsSimulation } from "@/pages/App"
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from "date-fns/locale"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { HandCoins, Percent, Send, Sun } from "lucide-react"
import { Button } from "./ui/button"
import { useDataUser } from "@/hooks/useDataUser"
import { message } from "@/utils/message"
import { formatCurrency } from "@/utils/formartCurrency"
import { dateFormat } from "@/utils/dateFormat"
import { formatPercent } from "@/utils/formartPercent"

interface Props {
    simulation: PropsSimulation
}

export function Simulation({simulation}: Props) {
    const { data } = useDataUser()
    const ifNotId = !simulation.id
    const lassThenOneHundredAndFifty = simulation.moneyBorrowed < 150
    
    function dateDistance(date: Date) {
        return formatDistanceToNow(date, {
            locale: ptBR,
            addSuffix: true
        })
    }

    function sendWhats() {
        const phoneNumber = '55014997778955' 
        
        const dataMessage = {
            simulation,
            data
        }

        const msg = message(dataMessage)
        // Codificando a mensagem para o formato de URL
        const encodedMessage = encodeURIComponent(msg)
    
        // Criando a URL para o WhatsApp
        const whatsappLink = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`
    
        window.location.href = whatsappLink // Redireciona para o WhatsApp
    }

    return (
        <Dialog>
            <DialogTrigger
                disabled={ifNotId || lassThenOneHundredAndFifty}
                className={`
                    w-max flex items-center self-end p-2 rounded-lg border border-primary bg-background shadow-sm 
                    ${ifNotId || lassThenOneHundredAndFifty ? 'filter opacity-30' : ''}
                `}>
                Ver simulação
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex self-start items-start gap-1 mt-5">
                        <span>Simulação {simulation.created_at && dateDistance(simulation.created_at)}</span> 
                    </DialogTitle>
                    <DialogDescription className="flex self-start">
                        Veja os detalhes da sua simulação
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-8">
                    <header className="flex flex-col gap-1">
                        <span className="self-end">{simulation.startDate && dateFormat(simulation.startDate)}</span>
                    
                        <span className="self-end">{simulation.endDate && dateFormat(simulation.endDate)}</span>
                    </header>

                    <section className="flex flex-col gap-1">
                        <Alert>
                            <HandCoins className="h-4 w-4" />
                            <AlertTitle>Valor há emprestar</AlertTitle>
                            <AlertDescription>
                                {simulation.moneyBorrowed && formatCurrency(simulation.moneyBorrowed)}
                            </AlertDescription>
                        </Alert>

                        <Alert>
                            <HandCoins className="h-4 w-4" />
                            <AlertTitle>Juros</AlertTitle>
                            <AlertDescription>
                                {simulation.moneyReturn && formatCurrency(simulation.moneyReturn)}
                            </AlertDescription>
                        </Alert>

                        <Alert>
                            <HandCoins className="h-4 w-4" />
                            <AlertTitle>Valor há retornar</AlertTitle>
                            <AlertDescription>
                                {simulation.sumMoneyTotal && formatCurrency(simulation.sumMoneyTotal)}
                            </AlertDescription>
                        </Alert>
                    </section>

                    <section className="flex flex-col gap-1">
                        <Alert>
                            <Sun className="h-4 w-4" />
                            <AlertTitle>Total dias</AlertTitle>
                            <AlertDescription>
                                {simulation.days && simulation.days}
                            </AlertDescription>
                        </Alert>

                        <Alert>
                            <Percent className="h-4 w-4" />
                            <AlertTitle>Total porcentagem</AlertTitle>
                            <AlertDescription>
                                {simulation.percentageTotal && formatPercent(simulation.percentageTotal)}
                            </AlertDescription>
                        </Alert>
                    </section>
                </div>
                <DialogFooter>
                    <Button 
                        onClick={sendWhats}
                        variant='default'>
                        <Send/> Enviar para o whats!
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}