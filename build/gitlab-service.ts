const baseUrl =  process.env.BASEURL;

const getHeader = (token: string) => {
    const requestHeaders: HeadersInit = new Headers();
    requestHeaders.set('PRIVATE-TOKEN', token);
    return requestHeaders;
}

const getFileUrl = (projectId: string, path: string, branch: string) => `${baseUrl}api/v4/projects/${projectId}/repository/files/${encodeURIComponent(path)}/raw?ref=${branch}`;
const updateFileUrl = (projectId: string, path: string, branch: string) => `${baseUrl}api/v4/projects/${projectId}/repository/files/${encodeURIComponent(path)}?ref=${branch}`;

export const fetchTextFile = async (options: { projectId: string, path: string, branch: string, token: string }) => {
    const fileUrl = getFileUrl(options.projectId, options.path, options.branch);

    return await fetch(fileUrl, {
        method: 'GET',
        headers: getHeader(options.token)
    }).then(async (x) => {
        return await x.text()
    });
}

export const updateTextFile = async (options: { projectId: string, path: string, branch: string, fileContents: string, message: string, token: string }) => {
    const commit = {
        "branch": options.branch, 
        "author_email": "gitlab-script@iodigital.com", 
        "author_name": "Gitlab",
        "content": options.fileContents, 
        "commit_message": options.message
    }

    const fileUrl = updateFileUrl(options.projectId, options.path, options.branch);
    console.log({commit, fileUrl})
    /*
    await fetch(fileUrl, {
        method: 'PUT',
        headers: getHeader(options.token),
        body: JSON.stringify(commit)
    })*/
}
