const fs = require("fs")
const copydir = require("copy-dir")

const packageJSON = require("../package.json")

console.log(`Pubblico ${packageJSON.name} versione ${packageJSON.version}`)
console.log()

const baseOut = "./release"
const outDir = `${baseOut}/${new Date().getTime()}-${packageJSON.name}-${packageJSON.version.replace(/\./g, "-")}`

console.log(`Directory di output: ${outDir}`)
console.log()

makeDir(baseOut)
makeDir(outDir)

// File con le variabili d'ambiente per la produzione
makeEnvFile(outDir)
// bundle
publishDir("./dist", outDir)

// Librerie terze
publishDir("./libs", outDir)

// makeDir(`${outDir}/src/libs`)
// publishDir("./src/libs/bimserverapi", outDir)
// publishDir("./src/libs/bimsurfer", outDir)
// publishDir("./src/libs/common", outDir)

// file singoli
publishFile("./ctrl_index.htm", outDir)
publishFile("./config.js", outDir)
// publishFile("./jOmnisHotSwap.js", outDir)

console.log()
console.log(`Pubblicazione completata!`)

function makeEnvFile(dir) {
    const env = `window.ENV = { mode: "PROD", basePath: "" };`
    fs.writeFileSync(`${dir}/ENV.js`, env, "utf8")
}

function makeDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
    }
}

function publishDir(sourceDir, dest) {
    const outPath = sourceDir.replace("./", dest + "/")
    console.log(`Copia di ${sourceDir}/* in ${outPath}/*`)
    copydir(sourceDir, outPath, {
        utimes: true, // keep add time and modify time
        mode: true, // keep file mode
        cover: true // cover file when exists, default is true
    })
}

function publishFile(sourceFile, dir) {
    const outPath = sourceFile.replace("./", dir + "/")
    console.log(`Copia di ${sourceFile} in ${outPath}`)
    fs.copyFileSync(sourceFile, outPath)
}
