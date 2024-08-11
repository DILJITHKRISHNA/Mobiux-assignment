const fs = require('fs');

function processSalesData(filePath) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            return;
        }

        const lines = data.trim().split('\n');

        let totalSales = 0;
        const MonthlySales = {};
        const itemOrders = {};

        lines.forEach((line, index) => {
            if (index >= 0 && !line.startsWith('Date')) {
                const [date, item, quantity, revenue] = line.split(',');

                const quantityNum = parseInt(quantity, 10);
                const revenueNum = parseFloat(revenue);
                const month = date.substring(0, 7);

                totalSales += revenueNum;

                if (!MonthlySales[month]) {
                    MonthlySales[month] = {
                        totalRevenue: 0,
                        items: {}
                    };
                }
                MonthlySales[month].totalRevenue += revenueNum;

                if (!MonthlySales[month].items[item]) {
                    MonthlySales[month].items[item] = {
                        quantity: 0,
                        revenue: 0,
                        orders: 0
                    };
                }
                MonthlySales[month].items[item].quantity += quantityNum;
                MonthlySales[month].items[item].revenue += revenueNum;
                MonthlySales[month].items[item].orders += 1;

                if (!itemOrders[item]) {
                    itemOrders[item] = [];
                }
                itemOrders[item].push(quantityNum);
            }
        });

        console.log(`Total Sales: ${totalSales.toFixed(2)}`);

        for (const month in MonthlySales) {
            const monthData = MonthlySales[month];
            console.log(`\nMonth: ${month}`);
            console.log(`Total Sales: ${monthData.totalRevenue.toFixed(2)}`);

            let PopularItem = null;
            let maxQuantity = 0;
            let mostRevenueItem = null;
            let maxRevenue = 0;

            for (const item in monthData.items) {
                const itemData = monthData.items[item];

                if (itemData.quantity > maxQuantity) {
                    PopularItem = item;
                    maxQuantity = itemData.quantity;
                }

                if (itemData.revenue > maxRevenue) {
                    mostRevenueItem = item;
                    maxRevenue = itemData.revenue;
                }
            }

            console.log(`Most Popular Item: ${PopularItem} (Quantity: ${maxQuantity})`);
            console.log(`Item Generating Most Revenue: ${mostRevenueItem} (${maxRevenue.toFixed(2)})`);

            if (PopularItem) {
                const orders = itemOrders[PopularItem];
                const minOrders = Math.min(...orders);
                const maxOrders = Math.max(...orders);
                const avgOrders = orders.reduce((a, b) => a + b, 0) / orders.length;

                console.log(`Min Orders for Most Popular Item: ${minOrders}`);
                console.log(`Max Orders for Most Popular Item: ${maxOrders}`);
                console.log(`Avg Orders for Most Popular Item: ${avgOrders.toFixed(2)}`);
            }
        }
    });
}

processSalesData('./Database/sales_data.csv');
