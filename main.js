//OxyParser JS (c0d9d by DesConnet)
const axios = require('axios').default;
const fs = require('fs');

const timeout = 100;

console.clear();

const art = ['   ____             ____                                   _______',
'  / __ \\_  ____  __/ __ \\____ ______________  _____       / / ___/',
' / / / / |/_/ / / / /_/ / __ `/ ___/ ___/ _ \\/ ___/  __  / /\\__ \\ ',
'/ /_/ />  </ /_/ / ____/ /_/ / /  (__  )  __/ /     / /_/ /___/ / ',
'\\____/_/|_|\\__, /_/    \\__,_/_/  /____/\\___/_/      \\____//____/  ',
'          /____/                                                  ',
];

console.log(`${art.join("\r\n")}\n\n by DesConnet\n\n`);

function GenerateString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let counter = 0; counter < length; counter++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

/**
 * Рандомное число из промежутка
 * @param {Number} min - Минимальное число
 * @param {Number} max - Максимальное число
 * @returns Число
 */
function getRandomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Выбор рандомного элемента из массива
 * @param {Array} array - Массив
 * @returns Элемент
 */
function choice(array) {
    const index = getRandomInRange(0, array.length - 1);
    return array[index];
};

let another;
let validLinkArray = [];

function SortUrl(dlUrl) {
    switch (true) {
        case [".mp4", ".mov", ".png", ".jpg", ".jpeg", ".mp3", ".mkv"].some(x => dlUrl.toLowerCase().endsWith(x)):
            const mediaFile = fs.readFileSync(`./${another}/Media.txt`).toString();
            fs.writeFileSync(`./${another}/Media.txt`, `${mediaFile}\n${dlUrl}`);
            console.log(`[INFO] Media: ${dlUrl}`);
            break;

        case [".txt", ".doc", ".docx", ".xls", ".pdf"].some(x => dlUrl.toLowerCase().endsWith(x)):
            const documentFile = fs.readFileSync(`./${another}/Documents.txt`).toString();
            fs.writeFileSync(`./${another}/Documents.txt`, `${documentFile}\n${dlUrl}`);
            console.log(`[INFO] Document: ${dlUrl}`);
            break;

        case [".zip", ".rar", ".7z"].some(x => dlUrl.toLowerCase().endsWith(x)):
            const archiveFile = fs.readFileSync(`./${another}/Archives.txt`).toString();
            fs.writeFileSync(`./${another}/Archives.txt`, `${archiveFile}\n${dlUrl}`);
            console.log(`[INFO] Archive: ${dlUrl}`);
            break;

        case [".exe", ".ps1", ".cmd", ".apk", ".jar"].some(x => dlUrl.toLowerCase().endsWith(x)):
            const executableFile = fs.readFileSync(`./${another}/Executable.txt`).toString();
            fs.writeFileSync(`./${another}/Executable.txt`, `${executableFile}\n${dlUrl}`);
            console.log(`[INFO] Executable: ${dlUrl}`);
            break;

        case [".cs", ".js", ".lua", ".cpp", ".c", ".py", ".json"].some(x => dlUrl.toLowerCase().endsWith(x)):
            const sourceFile = fs.readFileSync(`./${another}/Sources.txt`).toString();
            fs.writeFileSync(`./${another}/Sources.txt`, `${sourceFile}\n${dlUrl}`);
            console.log(`[INFO] Source: ${dlUrl}`);
            break;

        case dlUrl.toLowerCase().endsWith(".torrent"):
            const torrentFile = fs.readFileSync(`./${another}/Torrents.txt`).toString();
            fs.writeFileSync(`./${another}/Torrents.txt`, `${torrentFile}\n${dlUrl}`);
            console.log(`[INFO] Torrent: ${dlUrl}`);
            break;

        default:
            const otherFile = fs.readFileSync(`./${another}/Other.txt`).toString();
            fs.writeFileSync(`./${another}/Other.txt`, `${otherFile}\n${dlUrl}`);
            console.log(`[INFO] Other: ${dlUrl}`);
            break;
    }
}

if (typeof(process.argv[2]) != "undefined" && process.argv[2] == "--unsort") {
    another = `OxyParser-Log_${GenerateString(5)}.txt`;
    fs.writeFileSync(`./${another}`, `${art.join("\r\n")}\n\n by DesConnet\n\n`)
} 
else {
    another = `OxyParser-Logs_${GenerateString(5)}`;
    if (!fs.existsSync(`./${another}/`)) {
        fs.mkdirSync(`./${another}`);
        [`Media.txt`, `Other.txt`, `Documents.txt`, `Archives.txt`, `Executable.txt`, `Torrents.txt`, `Sources.txt`].forEach((file) => fs.writeFileSync(`./${another}/${file}`, `${art.join("\r\n")}\n\n by DesConnet\n\n`))
    }
}


setInterval(() => {
    try {
        const genStr = GenerateString(choice([2, 3, 4, 5, 6, 7]));
        if (validLinkArray.find(x => x === genStr)) return;

        axios.get(`https://oxy.st/d/${genStr})}`, { headers: { UserAgent: "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Vivaldi/5.5.2805.38" } }).then((res) => {
            const url = String(res.data).split("\n").filter(x => x.match(/<div data-template="[A-Za-z0-9]+-t" data-source_name="[^"]*" data-source_url="[^"]*" class="[^"]*">/));
            if (url.length > 0) {
                const dlUrl = url[0].split("\"")[5];
                if (typeof(process.argv[2]) != "undefined" && process.argv[2] == "--unsort") {
                    const file = fs.readFileSync(`./${another}`).toString();
                    if (!file.split("\n").find(x => x === dlUrl)) {
                        fs.writeFileSync(`./${another}`, `${file}\n${dlUrl}`);
                        console.log(`[INFO] New Link: ${dlUrl}`)
                    }
                }
                else SortUrl(dlUrl);
                validLinkArray.push(genStr);
            }
        }).catch((err) => { console.log(err)})
    } catch { };
}, timeout);

