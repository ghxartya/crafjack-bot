import { prisma } from '@/lib/prisma'

export const Shipment = {
  async calculateStats(startDate: Date, endDate: Date) {
    const shipments = await prisma.shipment.findMany({
      where: { status: 'sent', sentAt: { gte: startDate, lte: endDate } },
      include: { order: true }
    })

    const turnover = shipments.reduce((sum, { order }) => {
      const cost = order.totalCost
      return sum + Number(cost)
    }, 0)

    const netProfit = shipments.reduce((sum, { order }) => {
      const cost = order.totalCost
      const price = order.totalCostPrice
      return sum + (Number(cost) - Number(price))
    }, 0)

    const count = shipments.length
    return { turnover, netProfit, count }
  }
}
