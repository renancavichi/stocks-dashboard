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
    event.preventDefault()
    const newTickerName = event.target.ticker.value

    const tickerWasFound = tickersList.find((ticker) => {
        return ticker.name === newTickerName
    })
    
    if(tickerWasFound){
        alert("Ticker já adicionado!")
        return
    }

    try{
        const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${newTickerName}&apikey=HAUCFV4MBFM2A2Z1`) // faz a requisição na API
        const data = await response.json() // transforma a resposta JSON em objeto
        const price = data["Global Quote"]["05. price"]
        const previousClosePrice = data["Global Quote"]["08. previous close"]
        if(price && previousClosePrice){
            const priceFormatted = parseFloat(price).toFixed(2)
            const previousClosePriceFormatted = parseFloat(previousClosePrice).toFixed(2)

            const newTicker = {name: newTickerName, price: priceFormatted, closePrice: previousClosePriceFormatted}
            tickersList.push(newTicker)
            closeModal('#add-stock')
            renderTickers()
        }else{
            alert(`Price or Close Price not Found!`)
        }
    } catch (error){
        alert(error)
    }
}

// const handleAddTicker = async (event) => {
//     event.preventDefault() // impede que o form seja enviado
//     const ticker = event.target.ticker.value // pega o valor do input ticker

//     const h2Tickers = document.querySelectorAll(".ticker h2")

//     let tickerWasFound = false
//     h2Tickers.forEach((h2) => {
//         if(h2.textContent === ticker){
//             alert("Ticker já adicionado!")
//             tickerWasFound = true
//         }
//     })
//     if(tickerWasFound){
//         return
//     }

//     console.log('teste')

//     try{
//         const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=HAUCFV4MBFM2A2Z1`) // faz a requisição na API
//         const data = await response.json() // transforma a resposta JSON em objeto
//         const price = data["Global Quote"]["05. price"]
//         const previousClosePrice = data["Global Quote"]["08. previous close"]
//         if(price && previousClosePrice){
//             const priceFormatted = parseFloat(price).toFixed(2)
//             const previousClosePriceFormatted = parseFloat(previousClosePrice).toFixed(2)
//             let priceChange = ''
//             let Symbol = ''
//             if (priceFormatted !== previousClosePriceFormatted) {
//                 if (priceFormatted > previousClosePriceFormatted) {
//                     priceChange = 'increase'
//                     Symbol = '▲'
//                 } else {
//                     priceChange = 'decrease'
//                     Symbol = '▼'
//                 }
//             }

//             const newTicker = 
//             `<div class="ticker">
//                 <button class="btn-close" onclick="removeTicker(event)">x</button>
//                 <button class="btn-refresh" onclick="refreshTicker(event)">R</button>
//                 <h2>${ticker}</h2>
//                 <p class="${priceChange}">${Symbol} $ ${priceFormatted}</p>
//             </div>
//             `
//             const tickersList = document.querySelector("#tickers-list")
//             tickersList.innerHTML = newTicker + tickersList.innerHTML
//             addTickersEvents()
//             closeModal('#add-stock')
//         }else{
//             alert(`Ticker ${ticker} não encontrado!`)
//         }
//     } catch (error){
//         alert(error)
//     }
// }

// const refreshTicker = async (event) => {
//     const divTicker = event.target.closest('.ticker')
//     const ticker = divTicker.querySelector('h2').textContent
//     const pPrice = divTicker.querySelector('p')
//     const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=HAUCFV4MBFM2A2Z1`) // faz a requisição na API
//     const data = await response.json() // transforma a resposta JSON em objeto
//     const price = data["Global Quote"]["05. price"]
//     const previousClosePrice = data["Global Quote"]["08. previous close"]
//     if(price && previousClosePrice){
//         const priceFormatted = parseFloat(price).toFixed(2)
//         const previousClosePriceFormatted = parseFloat(previousClosePrice).toFixed(2)
//         let priceChange = ''
//         let Symbol = ''
//         if(priceFormatted !== previousClosePriceFormatted){
//             if(priceFormatted > previousClosePriceFormatted){
//                 priceChange = 'increase'
//                 Symbol = '▲'
//             }else{
//                 priceChange = 'decrease'
//                 Symbol = '▼'
//             }
//         }
//         pPrice.innerHTML = `${Symbol} ${priceFormatted}`
//         pPrice.className = priceChange
//     }else{
//         alert(`Ticker ${ticker} não encontrado para atualização!`)
//     }
// }

const refreshTicker = async (event) => {
    const divTicker = event.target.closest('.ticker')
    const tickerName = divTicker.querySelector('h2').textContent
    try{
        const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${tickerName}&apikey=HAUCFV4MBFM2A2Z1`) // faz a requisição na API
        const data = await response.json() // transforma a resposta JSON em objeto
        const price = data["Global Quote"]["05. price"]
        const previousClosePrice = data["Global Quote"]["08. previous close"]
        if(price && previousClosePrice){
            const priceFormatted = parseFloat(price).toFixed(2)
            const previousClosePriceFormatted = parseFloat(previousClosePrice).toFixed(2)
            const newTickerList = tickersList.map((ticker) => {
                if(ticker.name === tickerName){
                    return {name: ticker.name, price: priceFormatted, closePrice: previousClosePriceFormatted}
                }else{
                    return ticker
                }
            })
            tickersList = newTickerList
            renderTickers()
        }else{
            alert(`Ticker ${ticker} não encontrado para atualização!`)
        }
    } catch (error){
        alert(error)
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

// const removeTicker = (event) => {
//     const btnClose = event.target
//     const ticker = btnClose.closest('.ticker')
//     ticker.remove()
// }

const removeTicker = (event) => {
    const btnClose = event.target
    const ticker = btnClose.closest('.ticker')
    const h2Ticker = ticker.querySelector('h2')
    const tickerName = h2Ticker.textContent
    // const tickerIndex = tickersList.findIndex((ticker) => {
    //     return ticker.name === tickerName
    // })
    // tickersList.splice(tickerIndex, 1)
    // renderTickers()
    newTickerList = tickersList.filter((ticker) => {
        return ticker.name !== tickerName
    })
    tickersList = newTickerList
    renderTickers()
}

const modal = document.querySelector(".modal")
modal.addEventListener("click", handleModalClose)

addTickersEvents()

const renderTickers = () => {
    const divTickersList = document.querySelector("#tickers-list")
    divTickersList.innerHTML = ''
    tickersList.forEach((ticker) => {
        let priceChange = ''
        let symbol = ''
        if (ticker.price !== ticker.closePrice) {
            if (ticker.price > ticker.closePrice) {
                priceChange = 'increase'
                symbol = '▲'
            } else {
                priceChange = 'decrease'
                symbol = '▼'
            }
        }

        const newTicker = 
        `<div class="ticker">
            <button class="btn-close" onclick="removeTicker(event)">x</button>
            <button class="btn-refresh" onclick="refreshTicker(event)">R</button>
            <h2>${ticker.name}</h2>
            <p class="${priceChange}">${symbol} $ ${ticker.price}</p>
        </div>
            `
        divTickersList.innerHTML += newTicker
    })
    addTickersEvents()
}

let tickersList = [{name: 'AMZN', price: 10.50, closePrice: 9.0}, {name: 'AAPL', price: 10.70, closePrice: 10.0}]
renderTickers()
