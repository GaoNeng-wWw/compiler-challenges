import { SourceFile,Node, createSourceFile, ScriptTarget } from 'typescript';
import {expect, test} from 'vitest';
import { visit } from '../template';

const code = [
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
const tsetCase = [
    [ 243, 261, 260, 80, 9, 1 ],
    [
        243, 261, 260, 80, 9,
        260,  80,   9,  1
    ],
    [
        243, 261, 260,  80,   9, 243, 261,
        260,  80,   9, 243, 261, 260,  80,
        226, 217, 226,  80,  40,  80,  42,
        217, 226,  80,  41,  80,   1
    ],
    [
        243, 261, 260,  80, 210, 303, 80,
        11, 303,  80, 112, 303,  80,  9,
        303,  80, 210, 303,  80, 219, 39,
        241,   1
    ],
    [
        243, 261, 260,  80, 219,  39, 219,
        39, 219,  39, 219,  39, 219,  39,
        219,  39, 219,  39, 219,  39, 219,
        39,   9,   1
    ]
]

test('visit', ()=>{
    code.forEach((code, idx)=>{
        const sourcefile = createSourceFile('',code,ScriptTarget.ES2015);
        expect(visit(sourcefile)).toStrictEqual(tsetCase[idx])
    })
})
