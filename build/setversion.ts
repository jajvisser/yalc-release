#!/usr/bin/env ts-node
import { exit } from 'process';
import { getConfig } from './config-reader';
import { fetchTextFile, updateTextFile } from './gitlab-service';
import { generateCommitMessageFromYalc, setVersions } from './yalc-service';

const configFile = process.argv[2];

(async () => {
    if(!configFile) {
        console.log(`Missing config file in command add a 'config.json' to the command with ts-node build/set-version config.json`)
        exit()
    }
    console.log(`Starting version actions for ${configFile}`)
    const config = getConfig(configFile)
    if(!config) {
        exit()
    }
    console.log(`Using this config ${JSON.stringify(config)}`)

    // Download the external file
    const fileResponse = await fetchTextFile({
        baseUrl: config.baseUrl,
        projectId: config.projectId,
        remoteYalcPath: config.remoteYalcPath,
        token: config.token,
        branch: config.branch
    })

    // Setting version in downloaded yalc
    const newYalc = setVersions({
        fileResponse: fileResponse,
        packageName: config.packageName,
        currentYalcPath: config.currentYalcPath,
        version: config.version,
        currentYalcCopyPackages: config.copyPackages ?? []
    })

    // Update file from 
    /*await updateTextFile({
        baseUrl: config.baseUrl,
        projectId: config.projectId,
        remoteYalcPath: config.remoteYalcPath,
        branch: config.branch,
        fileContents: JSON.stringify(newYalc),
        token: config.token,
        message: generateCommitMessageFromYalc(newYalc)
    })*/

    exit()
})()


// Set version

// Upload file