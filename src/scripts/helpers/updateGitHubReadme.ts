import { Octokit } from '@octokit/rest'
import { Buffer } from 'buffer'
import {
    removeCodeBlockWrapper,
    removeImageWrapper,
} from '../../converterFunctions/helpers/preProcessHtml'
import { removeTipTapArtifacts } from '../../converterFunctions/helpers/removeTipTapArtifacts'
import { getUserRepoPairFromUrl } from './InputLinkHelpers/getUserRepoPairFromUrl'

window.Buffer = Buffer

interface PullRequest {
    head: {
        ref: string
    }
    number: number
    state: string
}

export class RetrievePRError extends Error {
    constructor() {
        super('Unable to retrieve PR (GitHub may be down)')
    }
}

export class NonExistentRepoError extends Error {
    constructor() {
        super('Repository does not exist, please check the link')
    }
}

export class InvalidUserError extends Error {
    constructor() {
        super('The repository does not belong to you')
    }
}

//github api stores file contents in base64
const prepareFileContent = (content: HTMLElement) => {
    removeCodeBlockWrapper(content)
    removeImageWrapper(content)
    removeTipTapArtifacts(content)
    var buffer = Buffer.from(content.innerHTML)
    return buffer.toString('base64') //encodes in base64
}

export const updateGitHubReadme = async (url: string, token: string, content: HTMLElement) => {
    const octokit = new Octokit({ auth: token })

    //branch to get readme from, will be set by running of 'getBranchCommitHash'
    var branch = ''

    const base64Content = prepareFileContent(content)

    //body message of PR
    const body =
        "<p>Review the changes below and merge it when you're ready 😊</p><h3>Preview:</h3><hr contenteditable='false'><p></p>" +
        content.innerHTML

    const [owner, repo] = getUserRepoPairFromUrl(url)

    const checkUserId = async () => {
        const res = await octokit.rest.users.getAuthenticated()
        const userId = res.data.login

        if (userId !== owner) {
            throw new InvalidUserError()
        }
    }

    //gets default branch of repo
    //checks if repo exists
    const getDefaultBranch = async () => {
        try {
            const res = await octokit.rest.repos.get({
                owner,
                repo,
            })
            return res.data.default_branch
        } catch (e) {
            throw new NonExistentRepoError()
        }
    }

    //gets latest commit hash of markgh-branch (if already created) or default branch
    const getBranchCommitHash = async () => {
        try {
            branch = 'markgh-readme'
            const res = await octokit.rest.repos.getBranch({
                owner,
                repo,
                branch,
            })
            return res.data.commit.sha
        } catch (e: any) {
            switch (e.status) {
                //markgh-readme branch has not been created, get default branch's (master) hash
                case 404:
                    branch = await getDefaultBranch()
                    const res = await octokit.rest.repos.getBranch({
                        owner,
                        repo,
                        branch,
                    })
                    return res.data.commit.sha
                default:
                    throw e
            }
        }
    }

    //create branch named 'markgh-readme'
    const createBranch = async () => {
        const ref = `refs/heads/markgh-readme`

        //list of branches
        const listBranches = await octokit.rest.repos.listBranches({
            owner,
            repo,
        })

        //check if branch already exists
        const branchExists =
            listBranches.data.filter((branch) => branch.name === 'markgh-readme').length > 0

        //new branch will be created from this commit (if markgh-readme branch not yet created)
        if (!branchExists) {
            const sha = await getBranchCommitHash()

            await octokit.rest.git.createRef({
                owner,
                repo,
                ref,
                sha,
            })
            return
        }
        //branch already exists,
        // change head branch(where the target readme file to update is located) to markgh-readme
        branch = 'markgh-readme'
    }

    const getPRIssueNumber = async () => {
        const res = await octokit.rest.pulls.list({
            owner,
            repo,
        })

        const PRArray = res.data as PullRequest[]

        for (let i = 0; i < PRArray.length; i++) {
            const PR: PullRequest = PRArray[i]
            //Find an open PR from 'markgh-readme' branch
            if (PR.head.ref === 'markgh-readme' && PR.state === 'open') {
                return PR.number
            }
        }
        return -1
    }

    //create pull request with branch 'markgh-readme' onto user's default branch
    const createOrUpdatePullRequest = async () => {
        const pull_number = await getPRIssueNumber()

        //Currently no open PRs with 'markgh-readme' branch, create one
        if (pull_number < 0) {
            const head = 'markgh-readme'
            const base = await getDefaultBranch()
            const title = 'README created with MarkGH'
            const res = await octokit.rest.pulls.create({
                owner,
                repo,
                head,
                base,
                title,
                body,
            })
            //else, a PR already exists, continue on that one
            await octokit.rest.pulls.update({
                owner,
                repo,
                pull_number,
                body,
            })
        }
    }
    //gets the hash of the file to update
    //gets from 'master' branch if it is the first push
    //gets from 'markgh-readme' branch if it already exists
    const getTargetFileHash = async () => {
        try {
            const targetFile = 'README.md'
            const path = ''
            const ref = branch //determind by whether a 'markgh-readme' branch was already created prior to this push
            const res = await octokit.rest.repos.getReadme({
                owner,
                repo,
                path,
                ref,
            })

            return res.data.sha
        } catch (e) {
            throw e
        }
    }

    //push new readme to (newly) created 'markgh-readme' branch
    const updateReadMeToBranch = async () => {
        const path = 'README.md'
        const message = 'Update README by MarkGH'
        const content = base64Content

        const res = await octokit.repos.createOrUpdateFileContents({
            owner,
            repo,
            path,
            message,
            content,
            branch: 'markgh-readme',
            sha: await getTargetFileHash(),
        })

        return res
    }

    const generatePRLink = (issueNumber: number) => {
        return `https://github.com/${owner}/${repo}/pull/${issueNumber}`
    }

    const res = await octokit.rest.users.getAuthenticated()

    //returns link to PR for user to click and view
    return await checkUserId()
        .then(() => createBranch())
        .then(() => updateReadMeToBranch())
        .then(() => createOrUpdatePullRequest())
        .then(async () => {
            return generatePRLink(await getPRIssueNumber())
        })
        .catch((e) => {
            throw e
        })
}
