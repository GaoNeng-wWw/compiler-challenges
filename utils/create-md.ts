import { readFileSync, readdirSync, writeFileSync } from 'fs';
import {resolve,join, sep} from 'path';
const root = resolve('./challages')
const mdFiles = readdirSync(root).map((v) => join(root, v, 'README.md'));
export type Levels = 'warm'
| 'easy'
| 'medium'
| 'hard'
| 'hell'
interface Meta {
    title: string,
    level: Levels,
    author: string
}
interface IndexItem {
    color: string;
    children: {title: string, author: string}[]
}
interface Index{
    'warm': IndexItem
    'easy': IndexItem
    'medium': IndexItem
    'hard': IndexItem
    'hell': IndexItem
}
function getYAML(path: string){
    const content = readFileSync(path).toString();
    const fileName = path.split(sep).at(-2)
    const contents = content.split('\n').map((v) => v.replace('\r', ''));
    let cnt = 0
    const yamlContent:string[][] = [];
    for (let i=0;i<contents.length;i++){
        if (cnt === 2){
            break;
        }
        if (cnt !== 0){
            if (contents[i] !== '---'){
                const kv = contents[i]?.split(':').map((v)=>v.trim());
                if (kv){
                    yamlContent.push(kv);
                }
            }
        }
        if (contents[i] === '---'){
            cnt ++
        }
    }
    const meta:Meta = Object.fromEntries([['title', fileName],...yamlContent]);
    return meta;
}

function createIndex(metas: Meta[]){
    const index: Index = {
        warm:  {
            color: '008385',
            children: []
        },
        easy:  {
            color: '008b10',
            children: []
        },
        medium:  {
            color: 'b74406',
            children: []
        },
        hard:  {
            color: 'ff3838',
            children: []
        },
        hell: {
            color: '#4B0404',
            children: []
        }
    }
    for (const item of metas){
        index[item.level].children.push(item);
    }
    return index;
}

function createBadage(indexes: Index){
    const bigCamlCase = (word:string) => `${word[0]?.toUpperCase()}${word.slice(1)}`
    const mdContents = [
        '# Compiler Challages',
        '## Description',
        `In daily life, we may often come into contact with ts compiler. Eg. (constant folding, node find, dependency tracking). This project aims to help you better ~~play with the compiler~~ using compilers to tackle unknown challenges in the future'`
    ];
    for (const key of Object.keys(indexes) as Levels[]){
        const {color, children} = indexes[key];
        const urls = [];
        for (const child of children){
            urls.push(
                `<img src="https://img.shields.io/badge/${child.title.replace(/\-/gim, ' ')}-${color}" />`
            )
        }
        if (urls.length===0){
            urls.push('not ready yet')
        }
        mdContents.push(
            `## ${bigCamlCase(key)}`,
            ...urls
        )
    }
    const content = mdContents.join('\n\n')
    writeFileSync('./README.md', content);
}

const metas = mdFiles.map(getYAML);
const indexes = createIndex(metas);
createBadage(indexes);