# Intro
This little script is used for setting versions for `yalc.lock` in a other repository in gitlab. 

# Required dependency
* `ts-node`

# Usage
Create a command in your `package.json` where you also link up the `config.json`
```
...
"scripts": {
  ...
  "set-yalcversion": "ts-node build/set-version.ts config.json",
  ...
}
...
```

Now you can use npm or yarn to run this command
```
yarn set-yalcversion
```

# Creating a config.json
First create a `config.json` this can also be done in a `gitlab-ci.yml`.

### Example files:
```
{
    "baseUrl": "https://mygitlab.com/api/v4",
    "token": "xxxxxxxxxxxx",
    "projectId": "xxxx",
    "branch": "release",
    "remoteYalcPath": "yalc.lock",
    "currentYalcPath": "yalc.lock",
    "packageName": "@test/myyalcpackage",
    "version": "1.0.0",
    "copyPackages": ["@test/myreferencepackage", "@test/myotherreferencepackage"]
}
```

### Generating config.json:
If you want to create the `config.json` in a `gitlab-ci.yml` you can add the following commands to your `gitlab-ci.yml`:
```
json='{"baseUrl": "${CI_API_V4_URL}", "token": "${CI_JOB_TOKEN}", "projectId": "xxxx", "branch": "${CI_COMMIT_REF_NAME}", "remoteYalcPath": "yalc.lock", "currentYalcPath": "yalc.lock", "packageName": "@test/myyalcpackage", "version": "${CI_JOB_ID}", "copyPackages:" ["@test/myreferencepackage", "@test/myotherreferencepackage"] }'
echo "$json" > config.json
yarn setversion config.json
```

Some of these variables are out of the box in gitlab like 
* CI_API_V4_URL - Base url with the v4 appendage [https://gitlab.com/gitlab-org/gitlab-foss/-/issues/54621#note_155205894]
* CI_JOB_TOKEN - Token see [https://docs.gitlab.com/ee/ci/jobs/ci_job_token.html']
* CI_COMMIT_REF_NAME - Current branch name
* CI_JOB_ID - The ID of the current job (if that is the same as the version that is being published, else otherwise use a other variable)

## baseUrl 
This can be set to your own instance of gitlab, this must include the api version `/api/v4` (can not end with a /, this may cause issues)
See: [https://gitlab.com/gitlab-org/gitlab-foss/-/issues/54621#note_155205894](https://gitlab.com/gitlab-org/gitlab-foss/-/issues/54621#note_155205894)

## token
Your access token to connect with gitlab (you must have `api` and `read_repository` permissions)
See [https://docs.gitlab.com/ee/api/repository_files.html](https://docs.gitlab.com/ee/api/repository_files.html) for more information

## branch
The name of the branch you want to change access of the remote repository

## remoteYalcPath
This is the location of the `yalc.lock` on your remote repository

## currentYalcPath
This is the location of the `yalc.lock` on your current repository

## projectId
The projectId of the project in gitlab, this can *NOT* be the project name, use the Id (that is visible under the name in gitlab) 

## packageName
The name of the package in `yalc.lock`

## version
The version that the `packageName` must be set to

## copyPackages
This allows you to copy the versions of packages defined in the current `yalc.lock` to a remote repository so you can copy dependencies to a other project. 
Make sure the dependency tree is completly update for the project. 