import { Scenes } from 'telegraf'
import { message } from 'telegraf/filters'

import { buildInlineKeyboard } from '@/keyboards'

import { BUTTONS } from '@/constants/buttons'
import { MESSAGES } from '@/constants/messages'

import { Category } from '@/services/category'
import { Color } from '@/services/color'
import { Product } from '@/services/product'

import { Decimal } from '@/prisma/runtime/client'

import type { MyContext } from '@/types'

import {
  getCategoryButtons,
  getColorButtons,
  getProductButtons,
  getProductStockButtons
} from '@/utils/warehouse'

const { WAREHOUSE } = MESSAGES
const { MAIN, CONFIRM, STOCK, BACK } = BUTTONS.WAREHOUSE

const warehouseScene = new Scenes.WizardScene<MyContext>(
  'warehouse',
  async ctx => {
    delete ctx.scene.session.warehouse
    await ctx.reply(WAREHOUSE.ENTRANCE, buildInlineKeyboard(MAIN))
    return ctx.wizard.next()
  },
  async ctx => {
    if (!ctx.has(message('text'))) return
    const ws = ctx.scene.session.warehouse
    if (!ws?.action)
      return await ctx.reply(
        '⚠️ Пожалуйста, используйте кнопки ниже.',
        buildInlineKeyboard(MAIN)
      )
    if (ws.action === 'ADD_PRODUCT') {
      if (ws.step === 'name') {
        const name = ctx.message.text.trim()
        if (!name) {
          return ctx.reply(
            '⚠️ Название не может быть пустым. Попробуйте ещё раз:'
          )
        }
        ws.temp ??= {}
        ws.temp.name = name
        ws.step = 'category'
        const { buttons } = await getCategoryButtons()
        return await ctx.reply(
          'Выберите категорию:',
          buildInlineKeyboard(buttons, { columns: 3, prefix: 'ADD_CATEGORY' })
        )
      }
      if (ws.step === 'cost') {
        const cost = parseFloat(ctx.message.text.replace(',', '.'))
        if (isNaN(cost) || cost <= 0)
          return await ctx.reply(
            '⚠️ Введите корректную цену (положительное число):'
          )
        ws.temp!.cost = cost
        ws.step = 'costPrice'
        return await ctx.reply('Введите себестоимость:')
      }
      if (ws.step === 'costPrice') {
        const costPrice = parseFloat(ctx.message.text.replace(',', '.'))
        if (isNaN(costPrice) || costPrice < 0)
          return await ctx.reply('⚠️ Введите корректную себестоимость (≥ 0):')
        ws.temp!.costPrice = costPrice
        ws.step = 'comment'
        return await ctx.reply(
          'Введите комментарий/описание (или . чтобы пропустить):'
        )
      }
      if (ws.step === 'comment') {
        const comment =
          ctx.message.text.trim() === '.' ? null : ctx.message.text.trim()
        ws.temp!.comment = comment ?? undefined
        ws.step = 'confirm_add'
        const [category, color] = [
          await Category.get(ws.temp!.categoryId!),
          await Color.get(ws.temp!.colorId!)
        ]
        const info =
          `<b>Новый товар:</b>\n` +
          `Название: ${ws.temp!.name}\n` +
          `Категория: ${category?.name}\n` +
          `Цвет: ${color?.name}\n` +
          `Цена: ${ws.temp!.cost}\n` +
          `Себестоимость: ${ws.temp!.costPrice}\n` +
          `Комментарий: ${comment ?? 'отсутствует'}\n`
        await ctx.replyWithHTML(info)
        return await ctx.replyWithHTML(
          '<b><i>Подтвердить добавление?</i></b>',
          buildInlineKeyboard(CONFIRM.ADD, { prefix: 'ADD_CONFIRM' })
        )
      }
    }
    if (ws.action === 'ADJUST_STOCK' && ws.step === 'quantity') {
      const quantity = parseInt(ctx.message.text, 10)
      if (isNaN(quantity) || quantity <= 0)
        return await ctx.reply('⚠️ Введите положительное целое число:')
      await Product.adjustStock({
        productId: ws.productId!,
        sizeId: ws.sizeId!,
        quantity,
        operation: ws.operation!
      })
        .then(async () => {
          await ctx.reply(
            `✅ Количество успешно ${ws.operation === 'increment' ? 'увеличено' : 'уменьшено'} на ${quantity} шт.`
          )
          const { text } = await getProductStockButtons(ws.productId!)
          await ctx.replyWithHTML(text, buildInlineKeyboard(BACK))
        })
        .catch(
          async (error: Error) =>
            await ctx.reply(
              `❌ Ошибка: ${error.message}`,
              buildInlineKeyboard(BACK)
            )
        )
    }
  }
)

warehouseScene.action(/^ADD_PRODUCT$/, async ctx => {
  ctx.scene.session.warehouse = {
    action: 'ADD_PRODUCT',
    step: 'name',
    temp: {}
  }
  await ctx.reply('➕ Добавление нового товара')
  await ctx.reply('Введите название товара:')
  await ctx.answerCbQuery()
})

warehouseScene.action(/^ADD_CATEGORY:(\d+)$/, async ctx => {
  const ws = ctx.scene.session.warehouse
  if (ws?.action !== 'ADD_PRODUCT' || ws?.step !== 'category')
    return ctx.answerCbQuery()
  const categoryId = Number(ctx.match[1])
  ws.temp!.categoryId = categoryId
  ws.step = 'color'
  const { buttons } = await getColorButtons()
  await ctx.reply(
    'Выберите цвет:',
    buildInlineKeyboard(buttons, { columns: 3, prefix: 'ADD_COLOR' })
  )
  await ctx.answerCbQuery()
})

warehouseScene.action(/^ADD_COLOR:(\d+)$/, async ctx => {
  const ws = ctx.scene.session.warehouse
  if (ws?.action !== 'ADD_PRODUCT' || ws?.step !== 'color')
    return ctx.answerCbQuery()
  const colorId = Number(ctx.match[1])
  ws.temp!.colorId = colorId
  ws.step = 'cost'
  await ctx.reply('Введите цену продажи (например: 2500 или 2500.50):')
  await ctx.answerCbQuery()
})

warehouseScene.action(/^ADD_CONFIRM:(YES|NO)$/, async ctx => {
  const ws = ctx.scene.session.warehouse
  if (ws?.action !== 'ADD_PRODUCT' || ws?.step !== 'confirm_add')
    return ctx.answerCbQuery()
  const isDisagreement = ctx.match[1] === 'NO'
  if (isDisagreement)
    await ctx.reply('❌ Добавление товара отменено.', buildInlineKeyboard(BACK))
  else
    await Product.createProduct({
      name: ws.temp!.name!,
      categoryId: ws.temp!.categoryId!,
      colorId: ws.temp!.colorId!,
      cost: Decimal(ws.temp!.cost!),
      costPrice: Decimal(ws.temp!.costPrice!),
      comment: ws.temp!.comment!
    })
      .then(async ({ id }) => {
        await ctx.reply(`✅ Товар успешно добавлен!`)
        const { text } = await getProductStockButtons(id)
        await ctx.replyWithHTML(text)
        await ctx.reply(
          '⚠️ Не забудьте откорректировать количество товара по размерам!',
          buildInlineKeyboard(BACK)
        )
      })
      .catch(
        async (error: Error) =>
          await ctx.reply(
            `❌ Ошибка: ${error.message}`,
            buildInlineKeyboard(BACK)
          )
      )
})

warehouseScene.action(['VIEW_STOCK', 'ADJUST_STOCK'], async ctx => {
  const isView = ctx.match[0] === 'VIEW_STOCK'
  const { buttons } = await getCategoryButtons()
  await ctx.reply(
    `➡️ Выберите категорию для ${isView ? 'просмотра' : 'корректировки'} количества:`,
    buildInlineKeyboard(buttons, {
      columns: 3,
      prefix: `${isView ? 'VIEW' : 'ADJUST'}_CATEGORY`
    })
  )
  await ctx.answerCbQuery()
})

warehouseScene.action(/^(VIEW|ADJUST)_CATEGORY:(\d+)$/, async ctx => {
  const isView = ctx.match[1] === 'VIEW'
  const categoryId = Number(ctx.match[2])
  const { length, buttons } = await getProductButtons(categoryId)
  if (!length)
    return await ctx.reply(
      `⚠️ В этой категории нет товаров для ${isView ? 'просмотра' : 'корректировки'}!`,
      buildInlineKeyboard(BACK)
    )
  await ctx.reply(
    `➡️ Выберите товар для ${isView ? 'просмотра' : 'корректировки'} количества:`,
    buildInlineKeyboard(buttons, {
      prefix: `${isView ? 'VIEW' : 'ADJUST'}_PRODUCT`
    })
  )
  await ctx.answerCbQuery()
})

warehouseScene.action(/^(VIEW|ADJUST)_PRODUCT:(\d+)$/, async ctx => {
  const isView = ctx.match[1] === 'VIEW'
  const productId = Number(ctx.match[2])
  const { text, buttons } = await getProductStockButtons(productId)
  if (isView) await ctx.replyWithHTML(text, buildInlineKeyboard(BACK))
  else {
    ctx.scene.session.warehouse = {
      action: 'ADJUST_STOCK',
      productId,
      step: 'choose_size'
    }
    await ctx.replyWithHTML(text)
    await ctx.reply(
      '➡️ Выберите размер для корректировки количества:',
      buildInlineKeyboard(buttons, { prefix: 'ADJUST_SIZE' })
    )
  }
  await ctx.answerCbQuery()
})

warehouseScene.action(/^ADJUST_SIZE:(\d+)$/, async ctx => {
  const ws = ctx.scene.session.warehouse
  if (ws?.action !== 'ADJUST_STOCK') return ctx.answerCbQuery()
  const sizeId = Number(ctx.match[1])
  ws.sizeId = sizeId
  ws.step = 'choose_operation'
  await ctx.reply(
    'Выберите операцию корректировки количества:',
    buildInlineKeyboard(STOCK, { prefix: 'ADJUST_OPERATION' })
  )
  await ctx.answerCbQuery()
})

warehouseScene.action(/^ADJUST_OPERATION:(ADD|SUBTRACT)$/, async ctx => {
  const ws = ctx.scene.session.warehouse
  if (ws?.action !== 'ADJUST_STOCK' || ws?.step !== 'choose_operation')
    return ctx.answerCbQuery()
  const isAdd = ctx.match[1] === 'ADD'
  ws.operation = isAdd ? 'increment' : 'decrement'
  ws.step = 'quantity'
  await ctx.reply(
    `Введите количество для ${isAdd ? 'прихода (+)' : 'расхода (-)'}:`
  )
  await ctx.answerCbQuery()
})

warehouseScene.action(/^BACK_TO_WAREHOUSE$/, async ctx => {
  delete ctx.scene.session.warehouse
  await ctx.reply(WAREHOUSE.ENTRANCE, buildInlineKeyboard(MAIN))
  await ctx.answerCbQuery()
})

export default warehouseScene
