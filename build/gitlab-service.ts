const getHeader = (token: string) => {
    const requestHeaders: HeadersInit = new Headers();
    requestHeaders.set('PRIVATE-TOKEN', token);
    return requestHeaders;
}

const getFileUrl = (baseUrl: string, projectId: string, remoteYalcPath: string, branch: string) => `${baseUrl}/projects/${projectId}/repository/files/${encodeURIComponent(remoteYalcPath)}/raw?ref=${branch}`;
const updateFileUrl = (baseUrl: string, projectId: string, remoteYalcPath: string, branch: string) => `${baseUrl}/projects/${projectId}/repository/files/${encodeURIComponent(remoteYalcPath)}?ref=${branch}`;

export const fetchTextFile = async (options: { baseUrl: string,  projectId: string, remoteYalcPath: string, branch: string, token: string }) => {
    const fileUrl = getFileUrl(options.baseUrl, options.projectId, options.remoteYalcPath, options.branch);

    return await fetch(fileUrl, {
        method: 'GET',
        headers: getHeader(options.token)
    }).then(async (x) => {
        return await x.text()
    });
}

export const updateTextFile = async (options: { baseUrl: string, projectId: string, remoteYalcPath: string, branch: string, fileContents: string, message: string, token: string }) => {
    const commit = {
        "branch": options.branch, 
        "author_email": "gitlab-script@iodigital.com", 
        "author_name": "Gitlab",
        "content": options.fileContents, 
        "commit_message": options.message
    }

    const fileUrl = updateFileUrl(options.baseUrl, options.projectId, options.remoteYalcPath, options.branch);
    console.log({commit, fileUrl})
    /*
    await fetch(fileUrl, {
        method: 'PUT',
        headers: getHeader(options.token),
        body: JSON.stringify(commit)
    })*/
}
