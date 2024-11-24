export function formatCurrency(money: number) {
    return `R$ ${money.toFixed(2).replace('.', ',').padEnd(2, '0')}`
}