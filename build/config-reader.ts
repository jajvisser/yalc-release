import { readFileSync } from "fs"

export const getConfig = (configFile: string)  => {
    const file = readFileSync(configFile);
    const config = JSON.parse(file.toString());
    const requiredProperties = ["baseUrl", "token", "branch", "remoteYalcPath", "version", "projectId", "packageName", "currentYalcPath"]
    // Validate the config file
    for(const property of requiredProperties) {
        if(!config[property]) {
            console.error(`Required ${property} is missing in ${configFile}`)
            return null;
        }
    }
    return config;
}