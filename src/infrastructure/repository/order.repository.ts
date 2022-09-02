import OrderRepositoryInterface from "../../domain/repository/order-repository.interface";
import Order from "../../domain/entity/order";
import OrderModel from "../db/sequelize/model/order.model";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import OrderItem from "../../domain/entity/order-item";

export default class OrderRepository implements OrderRepositoryInterface {
    async create(entity: Order): Promise<void> {
        await OrderModel.create({
            id: entity.id,
            customerId: entity.customerId,
            total: entity.total(),
            items: entity.items.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                productId: item.productId,
                quantity: item.quantity
            }))
        }, {include: [{model: OrderItemModel}]});
    }

    async find(id: string): Promise<Order> {
        let orderModel: OrderModel;
        try {
            orderModel = await OrderModel.findOne({where: {id}, include: OrderItemModel, rejectOnEmpty: true});
        } catch (e) {
            throw new Error('Order not found');
        }

        return this.getOrderFromModel(orderModel);
    }

    async findAll(): Promise<Order[]> {
        const ordersModel = await OrderModel.findAll({include: OrderItemModel});
        return ordersModel.map(orderModel => this.getOrderFromModel(orderModel));
    }

    async update(entity: Order): Promise<void> {
        //
    }

    private getOrderFromModel(model: OrderModel) {
        const items = model.items.map(itemModel =>
            new OrderItem(itemModel.id, itemModel.name, (itemModel.price / itemModel.quantity),
                itemModel.productId, itemModel.quantity));
        return new Order(model.id, model.customerId, items);
    }
}