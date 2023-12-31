import Yaml from 'yaml';
import type {Action, Github,Context, Quiz} from '../types';
import { PushCommit } from '@type-challenges/octokit-create-pull-request'


const action:Action = async (github, ctx, core) => {
    const payload = ctx.payload || {};
    const issue = payload.issue;
    const no = ctx.issue.number;
    if (!issue){
        return;
    }
    const labels: string[] = (issue['lables'] || []).map((i:any) => i && i.name).filter(Boolean);
    if (labels.includes('challenge')){
        const body = issue.body || '';
        const yaml = getCodeBlock('Challenge Info', 'yaml', body);
        const template = getCodeBlock('Template', 'typescript', body);
        const Judge = getCodeBlock('Judge', 'typescript', body);
        let info;
        try {
            info = Yaml.parse(yaml ?? '');
        } catch {
            info = null;
        }
        if (!yaml || !template || !Judge){
            await updateComment(
                github,
                ctx,
                'Pull Request created.'
            )
            return;
        }
        core.info('---Get Username---')
        const {data:user} = await github.rest.users.getByUsername({
            username: issue['user'].login
        })
        core.info(`---Username ${user.name}---`)
        if (!info.author){
            info.author = info.author || {};
            info.author.github = issue['user'].login
            if (user){
                info.author.name = user.name;
            }
        }
        const { data: pulls } = await github.rest.pulls.list({
            owner: ctx.repo.owner,
            repo: ctx.repo.repo,
            state: 'open',
        })
      
        const exists = pulls.find(
          i => i.user?.login === 'github-actions[bot]' && i.title.startsWith(`#${no} `),
        )
        if (exists){
            core.info(`---Pr Exists---`);
        }
        
        const dir = `challenges/${no}-${info.title.replace(/\ /gim,'-')}`
        const files = {
            [`${dir}/template.ts`]: template,
            [`${dir}/__tests__/judge.test.ts`]: Judge
        };
        const userEmail = `${user.id}+${user.login}@users.noreply.github.com`   
        await PushCommit(github as any, {
            owner: ctx.repo.owner,
            repo: ctx.repo.repo,
            base: 'main',
            head: `pulls/${no}`,
            changes:{
                files,
                commit: `feat(challenges): add #${no}-${info.title}`,
                author: {
                    name: `${user.name || user.id || user.login}`,
                    email: userEmail,
                },
            },
            fresh: !exists,
        })
        const createBody = (prNo: number) => {
            return `#${prNo} - Pull Request updated.`
        }
        if (exists){
            core.info(`--- PR ${no} Exists ---`)
            await updateComment(github, ctx, createBody(no));
            return;
        }
        const { data: pr } = await github.rest.pulls.create({
            owner: ctx.repo.owner,
            repo: ctx.repo.repo,
            base: 'main',
            head: `pulls/${no}`,
            title: `#${no} - ${info.title}`,
            body: `Closes #${no}`,
            labels: ['auto gen'],
        })
        await github.rest.issues.addLabels({
          owner: ctx.repo.owner,
          repo: ctx.repo.repo,
          issue_number: pr.number,
          labels: ['auto gen'],
        })
        if (pr){
            await updateComment(github,ctx, createBody(pr.number));
        }
    }
}
const getCodeBlock = (title: string, lang: 'typescript' | 'yaml', content: string) => {
    const reg = new RegExp(
        `## ${title} Info[\s\S]*?\`\`\`${lang}[\s\S]*?\`\`\``
    )
    const match = content.match(reg);
    if (match && match[1]){
        return match[1].toString().trim();
    }
    return null;
}

async function updateComment(github: Github, ctx: Context, body: string){
    const {data: comments} = await github.rest.issues.listComments({
        issue_number: ctx.issue.number,
        owner: ctx.repo.owner,
        repo: ctx.repo.repo
    })
    const exists = comments.find(i => i.user?.login === 'github-actions[bot]')
    if (exists){
        return await github.rest.issues.updateComment({
            comment_id: exists.id,
            issue_number: ctx.issue.number,
            owner: ctx.repo.owner,
            repo: ctx.repo.repo,
            body,
          })
    }
    return await github.rest.issues.createComment({
        issue_number: ctx.issue.number,
        owner: ctx.repo.owner,
        repo: ctx.repo.repo,
        body
    })
}