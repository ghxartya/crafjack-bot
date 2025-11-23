import type { Context, Scenes } from 'telegraf'

export interface MyWizardSessionData extends Scenes.WizardSessionData {}
export interface MySceneSession
  extends Scenes.SceneSession<MyWizardSessionData> {}

export type MyContext = Context & {
  session: MySceneSession
  scene: Scenes.SceneContextScene<MyContext, MyWizardSessionData>
  wizard: Scenes.WizardContextWizard<MyContext>
}
