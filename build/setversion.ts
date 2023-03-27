#!/usr/bin/env ts-node
import { exit } from 'process';
import { fetchTextFile, updateTextFile } from './gitlab-service';
import { generateCommitMessageFromYalc, setVersions } from './yalc-service';

const token = process.env.GITLAB_TOKEN!;

const branch = process.env.BRANCH!; // Git branch
const path = process.env.FILEPATH!; // path of the file on ref
const projectId = process.env.PROJECTID!; // id or name of project (postnl-nl - 4327)
const packageName = process.env.PACKAGENAME!;

const version = process.argv[2];

(async () => {
    console.log(`Starting version actions for ${path}`)

    // Download the external file
    const fileResponse = await fetchTextFile({
        projectId: projectId,
        path: path,
        token: token!,
        branch: branch
    })

    // Setting version in downloaded yalc
    const newYalc = setVersions({
        fileResponse: fileResponse,
        packageName: packageName,
        version: version,
        currentYalcCopyPackages: [
            "test"
        ]
    })

    // Update file from 
    await updateTextFile({
        projectId: projectId,
        path: path,
        branch: branch,
        fileContents: JSON.stringify(newYalc),
        token: token!,
        message: generateCommitMessageFromYalc(newYalc)
    })

    exit()
})()


// Set version

// Upload file