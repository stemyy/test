import Sequelize from "sequelize";
import {app, ipcMain} from "electron";
import path from "path";
import {migrateDatabase} from "../migrations/migrate";
import createMigrationModel from "./migration";
import createStockModel from "./stock";
import createOrderModel from "./order";
import createMakerModel from "./maker";
import createProductModel from "./product";
import createCategoryModel from "./category";
import createProductDataModel from "./productData";
import createRowsModel from "./rows";
import createProviderModel from "./provider";
import createProductMakersModel from "./productMakers";
import createProductProvidersModel from "./productProviders";

let sequelize;
let Migration;
let Stock;
let Order;
let Maker;
let Product;
let Category;
let ProductData;
let Rows;
let Provider;
let ProductMakers;
let ProductProviders;

export function initSequelize() {
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: path.join(app.getPath('userData'),'database.sqlite'),
    });

    sequelize.authenticate().then(() => {
        Stock = createStockModel(sequelize);
        Order = createOrderModel(sequelize);
        Maker = createMakerModel(sequelize);
        Product = createProductModel(sequelize);
        Category = createCategoryModel(sequelize);
        ProductData = createProductDataModel(sequelize);
        Rows = createRowsModel(sequelize);
        Provider = createProviderModel(sequelize);
        ProductMakers = createProductMakersModel(sequelize);
        ProductProviders = createProductProvidersModel(sequelize);
        Migration = createMigrationModel(sequelize);
        Product.belongsToMany(Maker, { through: ProductMakers });
        Maker.belongsToMany(Product, { through: ProductMakers });
        Product.belongsToMany(Provider, { through: ProductProviders, foreignKey: 'productId'});
        Provider.belongsToMany(Product, { through: ProductProviders, foreignKey: 'providerId'});
        Order.belongsTo(Stock);
        Stock.belongsTo(Provider);
        Provider.hasMany(Stock);
        Product.hasMany(ProductData);
        Product.hasMany(Stock);
        Category.hasMany(Product);

        sequelize.sync(/*{alter: true}*/).then(() => {
            return migrateDatabase().then(() => {
                ipcMain.on('get-products', (event) => {
                    Product.findAll({
                        include: [ProductData, Maker, Provider, { model: Stock,include: [Provider]}]
                    }).then(products => {
                        return event.returnValue = JSON.parse(JSON.stringify(products));
                    });
                });

                ipcMain.on('get-rows', (event) => {
                    Rows.findAll().then(rows => {
                        return event.returnValue = JSON.parse(JSON.stringify(rows));
                    });
                });

                ipcMain.on('get-categories', (event) => {
                    Category.findAll().then(categories => {
                        return event.returnValue = JSON.parse(JSON.stringify(categories));
                    });
                });

                ipcMain.on('get-providers', (event) => {
                    Provider.findAll({
                        include: [Product, Stock]
                    }).then(providers => {
                        return event.returnValue = JSON.parse(JSON.stringify(providers));
                    });
                });

                ipcMain.on('get-makers', (event) => {
                    Maker.findAll({
                        include: [Product]
                    }).then(makers => {
                        return event.returnValue = JSON.parse(JSON.stringify(makers));
                    });
                });

                ipcMain.on('get-orders', (event) => {
                    Order.findAll().then(orders => {
                        return event.returnValue = JSON.parse(JSON.stringify(orders));
                    });
                });

                ipcMain.on('add-product', (event, arg) => {
                    let providers = arg.providers;
                    let makers = arg.makers;
                    Product.create(arg, {
                        include: [ ProductData]
                    }).then(product => {
                        return product.setProviders(providers).then(() => {
                            return product.setMakers(makers).then(() => {
                                return Product.findByPk(product.id, { include: [ProductData, Maker, Provider, { model: Stock,include: [Provider]}]}).then(p => {
                                    return event.sender.send('product-created', JSON.parse(JSON.stringify(p)));
                                });
                            });
                        });
                    });
                });

                ipcMain.on('update-product', (event, id, updates) => {
                    Product.findByPk(id, { include: [Provider]}).then(product => {
                        const actualProviders = JSON.parse(JSON.stringify(product)).providers;
                        return product.update(updates).then(() => {
                            if (updates.providers) {
                                const oldProvidersIds = actualProviders.map(provider => provider.id);
                                const newProviders = updates.providers.filter(provider => (oldProvidersIds.indexOf(provider.id) === -1)).map(provider => provider.id);
                                product.addProviders(newProviders);
                            }
                            const newProvidersIds = updates.providers.map(provider => provider.id);
                            const providersToRemove = actualProviders.filter(provider => (newProvidersIds.indexOf(provider.id) === -1)).map(provider => provider.id);
                            return product.removeProviders(providersToRemove).then(() => {
                                return event.sender.send('product-updated', updates);
                            })
                        });
                    })
                });

                ipcMain.on('update-products-categories', (event, id, updates) => {
                    Product.update({ categoryId : id }, { where : { id : updates.filter(product => product.categoryId === id).map(product => product.id)}}).then(() => {
                        return Product.update({ categoryId : null }, { where : { id : updates.filter(product => product.categoryId === null).map(product => product.id)}}).then(() => {
                            return event.sender.send('products-categories-updated');
                        });
                    });
                });

                ipcMain.on('remove-products', (event, selected) => {
                    Product.destroy({ where : { id: selected }}).then(() => {
                        return ProductProviders.destroy({ where: { productId: selected } }).then(() => {
                            return ProductMakers.destroy({ where: { productId: selected } }).then(() => {
                                return event.sender.send('products-removed', selected);
                            })
                        });
                    });
                });

                ipcMain.on('add-category', (event, category) => {
                    Category.create(category).then(category => {
                        return event.sender.send('category-created', JSON.parse(JSON.stringify(category)));
                    });
                });

                ipcMain.on('update-category', (event, id, categoryUpdates) => {
                    Category.findByPk(id).then(category => {
                        return category.update(categoryUpdates).then(() => {
                            return event.sender.send('category-updated', categoryUpdates);
                        });
                    })
                });

                ipcMain.on('remove-category', (event, id) => {
                    Category.destroy({ where : { id: id }}).then(() => {
                        return event.sender.send('category-removed', id);
                    });
                });

                ipcMain.on('add-provider', (event, provider) => {
                    Provider.create(provider).then(provider => {
                        return event.sender.send('provider-created', JSON.parse(JSON.stringify(provider)));
                    });
                });

                ipcMain.on('update-provider', (event, id, updates) => {
                    Provider.findByPk(id).then(provider => {
                        return provider.update(updates).then(() => {
                            return event.sender.send('provider-updated', updates);
                        });
                    })
                });

                ipcMain.on('remove-provider', (event, id) => {
                    Provider.destroy({ where : { id: id }}).then(() => {
                        return ProductProviders.destroy({ where: { providerId: id } }).then(() => {
                            return event.sender.send('provider-removed', id);
                        })
                    });
                });

                ipcMain.on('add-maker', (event, maker) => {
                    Maker.create(maker).then(maker => {
                        return event.sender.send('maker-created', JSON.parse(JSON.stringify(maker)));
                    });
                });

                ipcMain.on('update-maker', (event, id, updates) => {
                    Maker.findByPk(id).then(maker => {
                        return maker.update(updates).then(() => {
                            return event.sender.send('maker-updated', updates);
                        });
                    })
                });

                ipcMain.on('remove-maker', (event, id) => {
                    Maker.destroy({ where : { id: id }}).then(() => {
                        return ProductMakers.destroy({ where: { makerId: id } }).then(() => {
                            return event.sender.send('maker-removed', id);
                        })
                    });
                });

                ipcMain.on('update-stock', (event, stockId, updates) => {
                    Stock.findByPk(stockId, {include: [Provider]}).then(stock => {
                        const product = stock.productId;
                        if (updates.quantity === 0) {
                            return stock.destroy().then(() => {
                                return event.sender.send('stock-updated', updates, product);
                            });
                        } else {
                            return stock.update(updates).then(() => {
                                return event.sender.send('stock-updated', updates, product, JSON.parse(JSON.stringify(stock)));
                            });
                        }
                    })
                });

                ipcMain.on('validate-order', (event, orderId, updates) => {
                    Order.findByPk(orderId).then(order => {
                        return order.update(updates).then(() => {
                            return event.sender.send('order-validated', updates);
                        });
                    })
                });

                ipcMain.on('cancel-order', (event, orderId) => {
                    Order.findByPk(orderId).then(order => {
                        return order.destroy().then(() => {
                            return event.sender.send('order-canceled');
                        });
                    })
                });

                ipcMain.on('order-stock', (event, ordered) => {
                    Product.findByPk(ordered.stock.productId).then(product => {
                        return Provider.findByPk(ordered.stock.providerId).then(provider => {
                            ordered.stock.product = product;
                            ordered.stock.provider = provider;
                            return Order.create(ordered, {
                                include: [ {model : Stock} ]
                            }).then(order => {
                                return event.sender.send('stock-ordered', JSON.parse(JSON.stringify(order)));
                            });
                        })
                    });
                });

                return null;
            })
        }).catch(err => {
            console.log(err);
        });
        return null;
    }).catch(err => {
        console.log(err);
    });
}

export {sequelize, Migration};
