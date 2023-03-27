import fs from 'fs'

export const setVersions = (options: { fileResponse: string, packageName: string, version: string, currentYalcCopyPackages?: string[] }): any => {
    const yalc = JSON.parse(options.fileResponse);
    
    // Setting the yalc with the current version
    if(yalc.packages[options.packageName]) {
        yalc.packages[options.packageName].replaced = options.version;
        console.log(`Setting ${options.packageName} to ${options.version}`)
    } else {
        console.error(`Package ${options.packageName} not found in external file`)
    }

    // Optional copyPackages, copies the version of the current yalc.lock to the input file
    if(options.currentYalcCopyPackages) {
        for(const item in options.currentYalcCopyPackages) {
            if(yalc.packages[item]) {
                const version = getVersionFromYalc({
                    packageName: item
                })
                if(version) {
                    yalc.packages[item].replaced = version
                    console.log(`Setting ${item} to ${options.version} from yalc.lock`)
                } else {
                    console.error(`No version found for ${item} in the current yalc.lock`)
                }
            } else {
                console.error(`${item} not found in the current yalc.lock`)
            }
        }
    }

    return yalc;
}

// Copy the current version defined in this project to the external project
const getVersionFromYalc = (options: { packageName: string }): string => {
    const currentYalc = readCurrentYalc()
    return currentYalc.packages[options.packageName].replaced
}

const readCurrentYalc = ():any  => {
    const buffer = fs.readFileSync('yalc.lock')
    return JSON.parse(buffer.toString('utf8'))
}


export const generateCommitMessageFromYalc = (yalc: any) => {
    const items = [];
    for(const i in yalc.packages) {
        items.push(`Package: ${i} -- Version: ${yalc.packages[i].replaced}`)
    }
    return `Yalc.lock updated ${items.join(', ')}`
}