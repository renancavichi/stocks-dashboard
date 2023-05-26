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
                <button class="btn-close" onclick="removeTicker(event)">x</button>
                <h2>${ticker}</h2>
                <p class="${priceChange}">${Symbol} $ ${priceFormatted}</p>
            </div>
            `
            const tickersList = document.querySelector("#tickers-list")
            tickersList.innerHTML = newTicker + tickersList.innerHTML
            addTickersEvents()
            closeModal('#add-stock')
        }else{
            alert(`Ticker ${ticker} não encontrado!`)
        }
    } catch (error){
        alert(error)
    }
}

const refreshTicker = async (event) => {
    const divTicker = event.target.closest('.ticker')
    const ticker = divTicker.querySelector('h2').textContent
    const pPrice = divTicker.querySelector('p')
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
        pPrice.innerHTML = `${Symbol} ${priceFormatted}`
        pPrice.className = priceChange
    }else{
        alert(`Ticker ${ticker} não encontrado para atualização!`)
    }
}

const handleTickerMouseEnter = (event) => {
    const ticker = event.target
    const btnClose = ticker.querySelector(".btn-close")
    const btnRefresh = ticker.querySelector(".btn-refresh")
    btnClose.style.display = "block"
    btnRefresh.style.display = "block"
}

const addTickersEvents = () => {
    const tickers = document.querySelectorAll(".ticker")
    tickers.forEach((ticker) => {
        ticker.addEventListener("mouseenter", handleTickerMouseEnter)
        ticker.addEventListener("mouseleave", handleTickerMouseLeave)
    })
}

const handleTickerMouseLeave = (event) => {
    const ticker = event.target
    const btnClose = ticker.querySelector(".btn-close")
    const btnRefresh = ticker.querySelector(".btn-refresh")
    btnClose.style.display = "none"
    btnRefresh.style.display = "none"
}

const removeTicker = (event) => {
    const btnClose = event.target
    const ticker = btnClose.closest('.ticker')
    ticker.remove()
}

const modal = document.querySelector(".modal")
modal.addEventListener("click", handleModalClose)

addTickersEvents()
