const bitcoinPriceElement = document.getElementById('bitcoin-price-value');
const currencySelect = document.getElementById('currency-select');
const currencyDescription = document.getElementById('currency-description');
const refreshButton = document.getElementById('refresh-button');
const average5MinutesValue = document.getElementById('average-5-minutes-value');
const average30MinutesValue = document.getElementById('average-30-minutes-value');
const average60MinutesValue = document.getElementById('average-60-minutes-value');

const takeaverage = [];
const time = [5, 30, 60]; // Χρονικά διαστήματα σε λεπτά.

function calculateAverages() {
    for (const interval of time) {
        const pricesInInterval = takeaverage.slice(-interval);
        const average = pricesInInterval.reduce((total, price) => total + price, 0) / interval;
        const averageElement = document.getElementById(`average-${interval}-minutes-value`);
        averageElement.textContent = isNaN(average) ? '-' : average.toFixed(2);
    }
}

function fetchBitcoinPrice() {
    const selectedCurrency = currencySelect.value;
    let description = '';
    switch (selectedCurrency) {
        case 'EUR':
            description = 'Η τρέχουσα τιμή του Bitcoin σε EUR:';
            break;
        case 'USD':
            description = 'Η τρέχουσα τιμή του Bitcoin σε USD:';
            break;
        
    }

    currencyDescription.textContent = description;

    fetch(`https://api.coinbase.com/v2/prices/spot?currency=${selectedCurrency}`)
        .then(response => response.json())
        .then(data => {
            const bitcoinPrice = parseFloat(data.data.amount);
            bitcoinPriceElement.textContent = bitcoinPrice.toFixed(2);
            takeaverage.push(bitcoinPrice);
            
            // Μέσοι όροι
            calculateAverages();

            this.chartOptions.xaxis.categories.push(new Date().toLocaleTimeString());
            this.chartSeries[0].data.push(bitcoinPrice);
        })
        .catch(error => {
            console.error('Error while loading Bitcoin:', error);
        });
}

refreshButton.addEventListener('click', fetchBitcoinPrice);

// Επανεκκίνηση υπολογισμού μέσων όρων
calculateAverages();

// Ανανέωση κάθε ένα λεπτό.
setInterval(fetchBitcoinPrice, 60000);
