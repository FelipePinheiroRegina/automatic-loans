import { PropsSimulation } from "@/pages/App"
import { PropsDataUser } from "@/contexts/DataUserContext"
import { formatCurrency } from "./formartCurrency"
import { dateFormat } from "./dateFormat"
import { formatPercent } from "./formartPercent"

export interface PropsMessage {
    simulation: PropsSimulation,
    data: PropsDataUser
}

export function message(message: PropsMessage) {
    return `
        Mensagem automática
        ------------------------------------------ 
        Rua: ${message.data.street}
        Número casa: ${message.data.numberHouse}
        Cidade: ${message.data.city}
        Estado: ${message.data.state}
        ------------------------------------------ 
        Nome: ${message.data.name}
        Pix: ${message.data.pix}
        Banco: ${message.data.bank}
        *No dia: ${dateFormat(message.simulation.startDate)} quero emprestado ${formatCurrency(message.simulation.moneyBorrowed)}*
        -------------------------------------------   
*Eu concordei que devo pagar o valor de ${formatCurrency(message.simulation.sumMoneyTotal)} no dia ${dateFormat(message.simulation.endDate)}.*
        -------------------------------------------
        Informações adicionais;;;
        Total dias ${message.simulation.days} 
        Total porcentagem ${formatPercent(message.simulation.percentageTotal)}
        Total juros em dinheiro ${formatCurrency(message.simulation.moneyReturn)}
    `
}
