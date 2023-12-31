import { Node, ScriptTarget, SourceFile, createSourceFile, forEachChild, isVariableDeclaration } from "typescript";
import { describe, expect, test } from "vitest";
import { record } from "../template";

const datas = [
`
const a = 1;
`,
`
const a = '';
const b = 1;
const c = {};
const d = false;
const e = ()=>{};
const obj = {
    a,b,c,d,e
}
const arr = [obj]
`,
``,
`
function fn(){
    const a = 1;
    const b = 2;
    return a+b;
}
const c = fn()
`
]

const ans = [
    [9],
    [11,9,210,97,219,210,209],
    [],
    [9,9,213]
]

test('variable-record', ()=>{
    datas.forEach((data,idx) => {
        expect(record(createSourceFile('',data,ScriptTarget.ES2015))).toStrictEqual(ans[idx])
    })
})