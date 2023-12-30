import { expect, test } from "vitest"
import { find } from "../template"
import { ScriptTarget, createSourceFile, isArrowFunction, isNumericLiteral, isObjectLiteralExpression, isStringLiteral } from "typescript"

const code:string[] = [
`const a = 1`,
`const a = 1,b=2`,
`
const a=1;
const b=2;
const c=(a+b)*(a-b);
`,
`
const obj = {
    s: '',
    b: true,
    n: 1,
    o: {},
    f: ()=>{}
}
`,
`
const fn = ()=>()=>()=>()=>()=>()=>()=>()=>()=>0
`
]

test('find node by fn', ()=>{
    expect(find(createSourceFile('', code[0]!, ScriptTarget.ES2015), isNumericLiteral)).toHaveLength(1);
    expect(find(createSourceFile('', code[1]!, ScriptTarget.ES2015), isNumericLiteral)).toHaveLength(2);
    expect(find(createSourceFile('', code[2]!, ScriptTarget.ES2015), isNumericLiteral)).toHaveLength(2);
    expect(find(createSourceFile('', code[3]!, ScriptTarget.ES2015), isObjectLiteralExpression)).toHaveLength(2);
    expect(find(createSourceFile('', code[3]!, ScriptTarget.ES2015), isStringLiteral)).toHaveLength(1);
    expect(find(createSourceFile('', code[3]!, ScriptTarget.ES2015), isNumericLiteral)).toHaveLength(1);
    expect(find(createSourceFile('', code[3]!, ScriptTarget.ES2015), isArrowFunction)).toHaveLength(1);
    expect(find(createSourceFile('', code[4]!, ScriptTarget.ES2015), isArrowFunction)).toHaveLength(9);
    expect(find(createSourceFile('', code[4]!, ScriptTarget.ES2015), isNumericLiteral)).toHaveLength(1);
})
