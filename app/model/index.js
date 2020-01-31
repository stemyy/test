import Sequelize from "sequelize";
import {app, ipcMain} from "electron";
import path from "path";
import {migrateDatabase} from "../migrations/migrate";
import createMigrationModel from "./migration";
import createStockModel from "./stock";
import createOrderModel from "./order";
import createStockChangeModel from "./stockChange";
import createMakerModel from "./maker";
import createProductModel from "./product";
import createCategoryModel from "./category";
import createProductDataModel from "./productData";
import createRowsModel from "./rows";
import createProviderModel from "./provider";
import createProductMakersModel from "./productMakers";
import createProductProvidersModel from "./productProviders";
import createStockAlert from "./stockAlert";

let sequelize;
let Migration;
let Stock, Order, StockChange, Maker, Product, Category, ProductData, Rows, Provider, ProductMakers, ProductProviders, StockAlert;

export function initSequelize() {
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: path.join(app.getPath('userData'),'database.sqlite'),
    });

    sequelize.authenticate().then(() => {
        Stock = createStockModel(sequelize);
        Order = createOrderModel(sequelize);
        StockChange = createStockChangeModel(sequelize);
        Maker = createMakerModel(sequelize);
        Product = createProductModel(sequelize);
        Category = createCategoryModel(sequelize);
        ProductData = createProductDataModel(sequelize);
        Rows = createRowsModel(sequelize);
        Provider = createProviderModel(sequelize);
        ProductMakers = createProductMakersModel(sequelize);
        ProductProviders = createProductProvidersModel(sequelize);
        Migration = createMigrationModel(sequelize);
        StockAlert = createStockAlert(sequelize);
        Product.belongsToMany(Maker, { through: ProductMakers });
        Maker.belongsToMany(Product, { through: ProductMakers });
        Product.belongsToMany(Provider, { through: ProductProviders, foreignKey: 'productId'});
        Provider.belongsToMany(Product, { through: ProductProviders, foreignKey: 'providerId'});
        Order.belongsTo(Stock);
        Stock.belongsTo(Provider);
        StockChange.belongsTo(Product);
        StockChange.belongsTo(Provider);
        StockChange.belongsTo(Order);
        Provider.hasMany(Stock);
        Product.hasMany(ProductData);
        Product.hasMany(Stock);
        Category.hasMany(Product);
        Order.belongsTo(Product);
        Order.belongsTo(Provider);
        StockAlert.belongsTo(Product);
        StockAlert.belongsTo(Provider);

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

                ipcMain.on('get-stockChanges', (event, productId, providerId) => {
                    if (productId) {
                        StockChange.findAll({
                            include: [Order],
                            order: [
                                ['createdAt', 'DESC']
                            ],
                            where: {
                                productId: productId,
                                providerId: providerId
                            }
                        }).then(stockChanges => {
                            return event.returnValue = JSON.parse(JSON.stringify(stockChanges));
                        })
                    } else {
                        StockChange.findAll({
                            include: [Order],
                            order: [
                                ['createdAt', 'DESC']
                            ]
                        }).then(stockChanges => {
                            return event.returnValue = JSON.parse(JSON.stringify(stockChanges));
                        })
                    }
                });

                ipcMain.on('get-stockAlerts', (event) => {
                    StockAlert.findAll({
                        include: [Product, Provider]
                    }).then(alerts => {
                        return event.returnValue = JSON.parse(JSON.stringify(alerts));
                    });
                });

                ipcMain.on('add-product', (event, arg) => {
                    let providers = arg.providers;
                    let makers = arg.makers;
                    Product.create(arg, {
                        include: [ProductData]
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
                        const provider = stock.providerId;
                        if (updates.quantity < stock.quantity) {
                            Stock.findAll({
                                where: {
                                    productId: product
                                }
                            }).then(stocks => {
                                const quantity = JSON.parse(JSON.stringify(stocks)).reduce( function(a, b){return a + b['quantity'];},0);
                                StockChange.create({
                                    productId : product,
                                    providerId: stock.providerId,
                                    actualQuantity: quantity
                                });
                            });
                        }
                        if (updates.quantity === 0) {
                            return stock.destroy().then(() => {
                                return event.sender.send('stock-updated', updates, product, provider);
                            });
                        } else {
                            return stock.update(updates).then(() => {
                                return event.sender.send('stock-updated', updates, product, provider, JSON.parse(JSON.stringify(stock)));
                            });
                        }
                    })
                });

                ipcMain.on('create-stock-alert', (event, productId, providerId) => {
                    StockAlert.findAll({
                        where: {
                            productId: productId,
                            providerId: providerId
                        }
                    }).then(exists => {
                        if (exists.length < 1) {
                            StockAlert.create({
                                productId: productId,
                                providerId: providerId
                            }, {
                                include: [Product, Provider]
                            }).then(stockAlert => {
                                return stockAlert.reload();
                            }).then(stockAlert => {
                                return event.sender.send('stock-alert-created', JSON.parse(JSON.stringify(stockAlert)));
                            })
                        } else {
                            return false;
                        }
                    });
                });

                ipcMain.on('remove-stock-alert', (event, productId, providerId) => {
                    StockAlert.destroy({
                        where: {
                            productId: productId,
                            providerId: providerId
                        }
                    }).then(() => {
                        return event.sender.send('stock-alert-removed');
                    });
                });

                ipcMain.on('remove-stock-alerts', (event) => {
                    StockAlert.destroy({ where : {}}).then(() => {
                        return event.sender.send('stock-alerts-removed');
                    });
                });

                ipcMain.on('validate-order', (event, orderId, updates) => {
                    Order.findByPk(orderId).then(order => {
                        Stock.findAll({
                            where: {
                                productId: order.productId
                            }
                        }).then(stocks => {
                            const quantity = JSON.parse(JSON.stringify(stocks)).reduce(function(a, b){return a + b['quantity'];},0);
                            StockChange.create({
                                orderId: orderId,
                                productId : order.productId,
                                providerId: order.providerId,
                                actualQuantity: quantity
                            }).then(() => {
                                return order.update(updates).then(() => {
                                    return event.sender.send('order-validated', updates);
                                });
                            });
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

                ipcMain.on('skip-order', (event, order) => {
                    const stock = order.stock;
                    stock.quantity = order.quantity;
                    stock.pricePerUnit = order.price / parseInt(order.quantity);
                    Stock.create(stock, {
                        include: [Provider]
                    }).then((newStock) => {
                        return newStock.reload();
                    }).then(stock => {
                        return event.sender.send('order-skipped', JSON.parse(JSON.stringify(stock)));
                    })
                });

                ipcMain.on('order-stock', (event, ordered) => {
                    const productId = ordered.productId;
                    const providerId = ordered.providerId;
                    Product.findByPk(productId).then(product => {
                        return Provider.findByPk(providerId).then(provider => {
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
