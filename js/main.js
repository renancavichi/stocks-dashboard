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
    const ticker = event.target.ticker.value
    try{
        const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=XXXXXXXXX`)
        const data = await response.json()
        console.log(data)
        if(data["Global Quote"]["05. price"]){
            alert('Deu certo!')
        }else{
            alert(`Ticker ${ticker} não encontrado!`)
        }
    } catch(error){
        alert(error)
    }
}

const modal = document.querySelector(".modal")
modal.addEventListener("click", handleModalClose)