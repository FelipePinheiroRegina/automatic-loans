import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function dateFormat(date: Date) {
    return format(date, "dd 'de' LLLL", {
        locale: ptBR
    })
}