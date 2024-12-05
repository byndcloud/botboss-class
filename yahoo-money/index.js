import puppeteer from 'puppeteer';
import { json2csv } from 'json-2-csv';
import { writeFileSync } from 'fs';

const oneYearInSeconds = 60 * 60 * 24 * 365
const toTimestamp = Math.floor(Date.now() / 1_000) // now é em milissegundos, mas a API espera em segundos
const fromTimestamp = Math.floor(toTimestamp - oneYearInSeconds)

async function main() {
    const url = `https://finance.yahoo.com/quote/BTC-USD/history/?period1=${fromTimestamp}&period2=${toTimestamp}&frequency=1d`
    const page = await setupPage(url)

    const tableRows = await fetchTableRows(page);
    const data = await parseStockRowData(tableRows);
    console.table(data)

    exportDataToCSV(data);

    process.exit(0)
}

main().then()


/**
 * Exporta dados para um arquivo CSV.
 *
 * @param {Object[]} data - Os dados a serem exportados para CSV.
 */
function exportDataToCSV(data) {
    const csvData = json2csv(data);
    writeFileSync('yahoo-money.csv', csvData, 'utf8');
}

/**
 * Busca as linhas da tabela em uma página específica.
 *
 * @param {object} page - A instância da página do Puppeteer.
 * @returns {Promise<Array>} Uma promessa que resolve para um array de elementos de linha da tabela.
 */
async function fetchTableRows(page) {
    console.log('Aguardando a tabela de dados...');
    await page.waitForSelector('div.table-container table tbody');
    console.log('Tabela de dados carregada!');
    const tableRows = await page.$$('div.table-container table tbody tr');
    return tableRows;
}

/**
 * Analisa os dados das linhas de uma tabela de ações.
 *
 * @param {Array} tableRows - Um array de elementos de linha de tabela (table row elements).
 * @returns {Promise<Array>} Uma promessa que resolve para um array de objetos contendo os dados das ações.
 * Cada objeto possui as seguintes propriedades:
 *   - date: A data da linha da tabela.
 *   - open: O valor de abertura da ação.
 *   - high: O valor mais alto da ação.
 *   - low: O valor mais baixo da ação.
 *   - close: O valor de fechamento da ação.
 *   - volume: O volume de ações negociadas.
 */
async function parseStockRowData(tableRows) {
    const data = [];

    for (const row of tableRows) {
        const item = await row.evaluate(el => ({
            date: el.cells[0].textContent,
            open: el.cells[1].textContent,
            high: el.cells[2].textContent,
            low: el.cells[3].textContent,
            close: el.cells[4].textContent,
            // adjClose: el.cells[5],
            volume: el.cells[6].textContent,
        }));
        console.log(item);

        data.push(item);
    }
    return data;
}

/**
 * Configura uma nova página do navegador e navega para a URL especificada.
 *
 * @param {string} url - A URL para a qual a página deve navegar.
 * @returns {Promise<import('puppeteer').Page>} Uma promessa que resolve para a nova página do navegador.
 */
async function setupPage(url) {
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    await page.goto(url, { waitUntil: 'domcontentloaded' })
    return page
}