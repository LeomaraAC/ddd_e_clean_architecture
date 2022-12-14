import Order from './order';
import OrderItem from './order-item';

describe('Order unit test', () => {
    it('should throw error when id is empty', () => {
        expect(() => {
            const item = new OrderItem('i1', 'Item 1', 200, 'p1', 1);
            const order = new Order('', '123', [item]);
        }).toThrowError('order: Id is required');
    });

    it('should throw error when customerId is empty', () => {
        expect(() => {
            const item = new OrderItem('i1', 'Item 1', 200, 'p1', 1);
            const order = new Order('123', '', [item]);
        }).toThrowError('order: CustomerId is required');
    });

    it('should throw error when items is empty', () => {
        expect(() => {
            const order = new Order('123', '1', []);
        }).toThrowError('order: Items are required');
    });

    it('should calculate total', () => {
        const item = new OrderItem('i1', 'Item 1', 100, 'p1', 2);
        const item2 = new OrderItem('i2', 'Item 2', 200, 'p2', 2);
        const order = new Order('o1', 'c1', [item]);

        let total = order.total();

        expect(total).toBe(200);

        const order2 = new Order('o1', 'c1', [item, item2]);
        total = order2.total();
        expect(total).toBe(600);
    });

    it('should throw if the item quantity is less or equal than 0', () => {
        expect(() => {
            const item = new OrderItem('i1', 'Item 1', 100, 'p1', 0);
            const order = new Order('o1', 'c1', [item]);
        }).toThrowError('order: Quantity must be greater than 0');
    });

    it('should add a new item to order', () => {
        const item = new OrderItem('i1', 'Item 1', 100, 'p1', 2);
        const item2 = new OrderItem('i2', 'Item 2', 200, 'p2', 2);
        const order = new Order('o1', 'c1', [item]);
        order.addItem(item2);
        expect(order.items).toStrictEqual([item, item2]);
    });

    it('should throw error when id, customerId and items are empty', () => {
        expect(() => {
            const order = new Order('', '', []);
        }).toThrowError('order: Id is required,order: CustomerId is required,order: Items are required');
    });
});
