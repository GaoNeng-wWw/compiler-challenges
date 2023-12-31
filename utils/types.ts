import { context, getOctokit } from "@actions/github"
import type Core from '@actions/core'
import type IO from '@actions/io'

export type Github = ReturnType<typeof getOctokit>
export type Context = typeof context
export type Action = (github: Github, context: Context, core: typeof Core, io: typeof IO) => Promise<void>

export interface QuizMetaInfo {
  title: string
  author: {
    name: string
    email: string
    github: string
  }
  tsconfig?: Record<string, any>
  original_issues: number[]
  recommended_solutions: number[]
  tags: string[]
  related?: string[]
}

export type Levels = 'warm'
| 'easy'
| 'medium'
| 'hard'
| 'hell'

type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>;
} : T;

export interface Quiz {
  no: number
  difficulty: Levels
  path: string
  readme: Record<string, string>
  template: string
  info: Record<string, DeepPartial<QuizMetaInfo> | undefined>
  tests?: string
  solutions?: {
    code?: string
    readme?: Record<string, string>
  }
}