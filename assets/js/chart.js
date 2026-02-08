let currentWidget = null;

function getThemeConfig(symbol = "BINANCE:BTCUSDT", interval = "4H") {
    const root = getComputedStyle(document.documentElement);
    const isDarkTheme = localStorage.getItem('theme') === 'light-theme' ? false : true;

    const backgroundColor = root.getPropertyValue(isDarkTheme ? '--chart-dark-bg' : '--chart-light-bg').trim();
    const gridColor = root.getPropertyValue(isDarkTheme ? '--chart-dark-border' : '--chart-light-border').trim();

    return {
        autosize: true,
        symbol: symbol,
        interval: interval,
        timezone: "Etc/UTC",
        theme: isDarkTheme ? 'dark' : 'light',
        style: "1",
        locale: "en",
        container_id: "chart-widget",
        backgroundColor: backgroundColor,
        gridColor: gridColor,
        hide_side_toolbar: false,
        allow_symbol_change: true,
        save_image: true,
        details: true,
        calendar: false,
        support_host: "https://www.tradingview.com",
        enabled_features: ["header_widget", "timeframes_toolbar"],
        studies: ["RSI@tv-basicstudies", "MACD@tv-basicstudies"]
    };
}

function showLoading() {
    document.getElementById('chart-loading').classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('chart-loading').classList.add('hidden');
}

function createWidget(containerId, widgetConfig, scriptUrl) {
    return new Promise((resolve, reject) => {
        const container = document.getElementById(containerId);
        if (!container) {
            reject(new Error('Container not found'));
            return;
        }

        showLoading();
        
        // Clear the container
        container.innerHTML = '';
        
        const script = document.createElement('script');
        script.src = scriptUrl;
        script.async = true;
        script.onload = () => {
            hideLoading();
            resolve();
        };
        script.onerror = (error) => {
            hideLoading();
            reject(error);
        };

        window.TradingView = {
            widget: widgetConfig
        };
        
        container.appendChild(script);
    });
}

async function initializeWidget(symbol, interval) {
    try {
        const widgetConfig = getThemeConfig(symbol, interval);
        await createWidget('chart-widget', widgetConfig, 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js');
    } catch (error) {
        console.error('Failed to initialize chart:', error);
        hideLoading();
    }
}

// Event Listeners
document.getElementById('timeframeSelect').addEventListener('change', (e) => {
    initializeWidget(document.getElementById('symbolSelect').value, e.target.value);
});

document.getElementById('symbolSelect').addEventListener('change', (e) => {
    initializeWidget(e.target.value, document.getElementById('timeframeSelect').value);
});

// Initialize with default values
initializeWidget("BINANCE:BTCUSDT", "4H");