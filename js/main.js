const openModal = (idModal) => {
    const divModal = document.querySelector(idModal)
    divModal.style.display = "flex"
}

const closeModal = (idModal) => {
    const divModal = document.querySelector(idModal)
    divModal.style.display = "none"
}

const handleModalClose = (event) => {
    if(event.target.className === "modal"){
        event.target.style.display = "none"
    }
}

const handleAddTicker = async (event) => {
    event.preventDefault() // impede que o form seja enviado
    const ticker = event.target.ticker.value // pega o valor do input ticker
    try{
        const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=HAUCFV4MBFM2A2Z1`) // faz a requisição na API
        const data = await response.json() // transforma a resposta JSON em objeto
        const price = data["Global Quote"]["05. price"]
        const previousClosePrice = data["Global Quote"]["08. previous close"]
        if(price && previousClosePrice){
            const priceFormatted = parseFloat(price).toFixed(2)
            const previousClosePriceFormatted = parseFloat(previousClosePrice).toFixed(2)
            let priceChange = ''
            let Symbol = ''
            if(priceFormatted !== previousClosePriceFormatted){
                if(priceFormatted > previousClosePriceFormatted){
                    priceChange = 'increase'
                    Symbol = '▲'
                }else{
                    priceChange = 'decrease'
                    Symbol = '▼'
                }
            }

            const newTicker = 
            `<div class="ticker">
                <h2>${ticker}</h2>
                <p class="${priceChange}">${Symbol} U$ ${priceFormatted}</p>
            </div>
            `
            const tickersList = document.querySelector("#tickers-list")
            tickersList.innerHTML = newTicker + tickersList.innerHTML
            closeModal('#add-stock')
        }else{
            alert(`Ticker ${ticker} não encontrado!`)
        }
    } catch (error){
        alert(error)
    }
}

const handleTickerMouseEnter = (event) => {
    const ticker = event.target
    const btnClose = ticker.querySelector(".btn-close")
    btnClose.style.display = "block"
}

const handleTickerMouseLeave = (event) => {
    const ticker = event.target
    const btnClose = ticker.querySelector(".btn-close")
    btnClose.style.display = "none"
}

const modal = document.querySelector(".modal")
const tickers = document.querySelectorAll(".ticker")
modal.addEventListener("click", handleModalClose)

tickers.forEach((ticker) => {
    ticker.addEventListener("mouseenter", handleTickerMouseEnter)
    ticker.addEventListener("mouseleave", handleTickerMouseLeave)
})
