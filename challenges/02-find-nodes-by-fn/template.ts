import { SourceFile, Node, forEachChild } from "typescript";

export function find(root:SourceFile, fn: (node: Node)=>boolean): Node[] {
    const ans:Node[] = [];
    return ans;
}