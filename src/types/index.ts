import type { Context, Scenes, Telegraf } from 'telegraf'

export interface MyWizardSessionData extends Scenes.WizardSessionData {}
export interface MySceneSession
  extends Scenes.SceneSession<MyWizardSessionData> {}

export type Bot = Telegraf<MyContext>
export type MyContext = Context & {
  session: MySceneSession
  scene: Scenes.SceneContextScene<MyContext, MyWizardSessionData>
  wizard: Scenes.WizardContextWizard<MyContext>
}

export type KeyboardButtons = Record<string, string>
