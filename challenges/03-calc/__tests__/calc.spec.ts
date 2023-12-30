import { describe, expect } from "vitest";
import { calc } from "../template";
import { ExpressionStatement, ScriptTarget, createSourceFile } from "typescript";

const datas = [
`
1+1-1-1
`,
`
(1+1*2*2)/(3-2)
`,
`
(1+1*2*2)/(3-3)
`
]

describe('calc', ()=>{
    datas.forEach((data)=>{
        expect(calc(
            createSourceFile('',data, ScriptTarget.ES2015).getChildAt(0) as ExpressionStatement
        )).toBe(eval(data))
    })
})
