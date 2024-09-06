var today = new Date() // Definindo a data atual
const startDate = []   // array que vai conter a data de inicio
const endDate = []     // array que vai conter a data de final
var valueBorrowed = document.getElementById('value') // valor do input que o usuário coloca
var calc = document.querySelector('.calc') // div para mostrar os calculos na tela
var buttonCalc = document.getElementById('button-calc') // button para calcular

var days = document.querySelector('.days')
var percent_div = document.querySelector('.percent-div')
var total = document.querySelector('.total')
var date_div = document.querySelector('.date-div')

var pix = document.getElementById('pix')
var preview = document.getElementById('preview') // div para mostrar um preview da msg para enviar via whats
var message = ''       // variavel para receber a menssagem para enviar via whats
var whats = document.getElementById('whats') // button enviar para o whats
var barValueGo
var barValueBack

// Inicializando o Pikaday para a data de início (start date)
var startPicker = new Pikaday({
    field: document.getElementById('startDate'),
    format: 'DD/MM/YYYY',
    minDate: today,
    onSelect: function(date) {
        startDate.length = 0 // Limpa o array antes de adicionar novos valores
        startDate.push(date.getDate())
        startDate.push(date.getUTCMonth() + 1)
        startDate.push(date.getFullYear())

        endPicker.setMinDate(date)
    }
})

// Inicializando o Pikaday para a data final (end date)
var endPicker = new Pikaday({
    field: document.getElementById('endDate'),
    format: 'DD/MM/YYYY',
    minDate: today,
    onSelect: function(date) {
        endDate.length = 0 // Limpa o array antes de adicionar novos valores
        endDate.push(date.getDate())
        endDate.push(date.getUTCMonth() + 1)
        endDate.push(date.getFullYear())
    }
})

// Formatador para a moeda brasileira
const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
});

// Configurando o valor inicial da data de início para o dia atual
startPicker.setDate(today)

// Função para verificar se todos os inputs têm valor
function checkInputs() {
    if (startDate.length > 0 && endDate.length > 0 && valueBorrowed.value.trim() !== '' && pix.value.trim() !== '') {

        // Expressão regular para procurar ". e ,"
        let regex = /[.,]/

        let find = regex.test(valueBorrowed.value)
        if(find) {
            valueBorrowed.value = ''
            return alert('Insira números inteiros')
        }

        // Faça algo se todos os inputs contiverem valor

        // variavel para converter o valor que o usuário digitou. para fazer as contas
        let valueNumber = Number(valueBorrowed.value)
        let percentCount // variavel para fazer as contas de acordo com o total de porcentagem

        let date_start = addLeadingZero(startDate[0]) + '/' + addLeadingZero(startDate[1]) + '/' + startDate[2]
        let date_end = addLeadingZero(endDate[0]) + '/' + addLeadingZero(endDate[1]) + '/' + endDate[2]

        date_div.textContent = 'Data do pagamento: ' + date_end

        // se o usuário digitou um valor menor que 199  
        if(valueNumber <= 199) {
            days.textContent = 'Dias: ' + calculateDateDifference(startDate, endDate) 
            percent_div.textContent = 'Porcentagem: 50 %'
            percentCount = 50

        } else if(valueNumber >= 200 && valueNumber <= 700) {
            let daysCurrent = calculateDateDifference(startDate, endDate) 
            
            if(daysCurrent <= 14) {
                endPicker.setDate(null)
                return alert('Com esse valor, o mínimo são 15 dias correntes, escolha uma data final maior.')
            }

            days.textContent = `Dias: ${daysCurrent}`

            percentCount = (daysCurrent * 1.8)

            percent_div.textContent = `Porcentagem: ${percentCount.toFixed(2)} %`
        } else {
            let daysCurrent = calculateDateDifference(startDate, endDate) 
            days.textContent = `Dias: ${daysCurrent}`

            percentCount = (daysCurrent * 1.8)
            percent_div.textContent = `Porcentagem: ${percentCount.toFixed(2)} %`
        }

        valueNumber = (valueNumber + ((valueNumber * percentCount ) / 100))
    
        barValueGo = Number(valueBorrowed.value)
        barValueBack = valueNumber

        valueNumber = formatter.format(valueNumber)
        total.textContent = `Total à pagar R$: ${valueNumber}`

        message = `
Mensagem automática
Empréstimos Pinheiro
------------------------------------------ 
🔑Pix: ${pix.value}
📅Data Empréstimo: ${date_start}
Valor do empréstimo 🪙${formatter.format(valueBorrowed.value)}
-------------------------------------------   
📅Data Pagamento: ${date_end}
Total à pagar 🪙${valueNumber}
🔑Pix: 44773849800
🟣: NuBank
🧑🏻: Felipe Pinheiro
        `
        
        preview.textContent = message

        // Atualizar os dados do gráfico
        myBarChart.data.datasets[0].data = [barValueGo, barValueBack];
        myBarChart.update(); // Atualiza o gráfico

        calc.classList.add('true')
    } else {
        calc.classList.remove('true')
    }
}

const scrolldown = document.getElementById('scroll-down')
const slogan = document.getElementById('container-top-fixed')
const container_hidden = document.querySelector('.container-hidden')

window.addEventListener('scroll', () => {
    var scrollMoment = window.scrollY
    if(scrollMoment <= 5) {
        slogan.classList.add('true')
        container_hidden.classList.remove('true')
        scrolldown.classList.remove('true')
    } else {
        slogan.classList.remove('true')
        container_hidden.classList.add('true')
        scrolldown.classList.add('true')
    }
})

// Função para calcular o total de dias entre duas datas
function calculateDateDifference(startDate, endDate) {
    // Converte as datas em objetos Date
    var start = new Date(startDate[2], startDate[1] - 1, startDate[0])
    var end = new Date(endDate[2], endDate[1] - 1, endDate[0])

    // Garante que end seja após start
    if (end < start) {
        [start, end] = [end, start]
    }

    // Calcula a diferença em milissegundos
    var differenceInMillis = end - start

    // Converte a diferença em dias
    var differenceInDays = Math.ceil(differenceInMillis / (1000 * 60 * 60 * 24)) + 1

    return differenceInDays
}

buttonCalc.addEventListener('click', (e) => {
    e.preventDefault()

    checkInputs()
})

whats.addEventListener('click', () => {
    sendWhats(message)
})

function addLeadingZero(number) {
    // Converte o número para string
    let numberString = String(number)
    
    // Verifica se o comprimento da string é 1
    if (numberString.length === 1) {
        // Adiciona '0' à esquerda
        numberString = '0' + numberString
    }
    
    return numberString
}

function sendWhats(message) {
    let phoneNumber = '55014997778955' 

    // Codificando a mensagem para o formato de URL
    let encodedMessage = encodeURIComponent(message)

    // Criando a URL para o WhatsApp
    let whatsappLink = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`

    // Exibindo o link ou redirecionando para ele
    console.log(whatsappLink)
    window.location.href = whatsappLink // Redireciona para o WhatsApp
}


var ctx = document.getElementById('myBarChart').getContext('2d');
var myBarChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Valor Emprestado', 'Valor à Devolver'], // Rótulos para cada barra
        datasets: [
            {
                label: 'Valores',
                data:[barValueGo, barValueBack], // Valores para cada barra
                backgroundColor: ['rgba(251, 190, 36, 0.378)', 'rgba(128, 0, 128, 0.333)'], // Cor da barra "Valor Emprestado"
                borderColor: ['rgb(251, 191, 36)', 'rgb(128, 0, 128)'],  // Cor da borda da barra "Valor Emprestado"
                borderWidth: 1
            }
        ]
    },
    options: {
        animation: {
            duration: 5000
        }
        ,
        plugins : {
            legend: {
                display: false,
            }
        }
       
    }
});





 