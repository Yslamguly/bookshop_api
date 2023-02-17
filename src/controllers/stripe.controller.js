const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
require('dotenv').config()
const {addAddress} = require("./addresses.controller");
const {createOrder} = require("./orders.controller");
const {deleteItemsFromShoppingCart} = require("./shopping_cart.controller");
exports.createCheckoutSession = async (req, res) => {
    const customer = await stripe.customers.create({
        metadata: {
            userId: req.body.userId.toString(),
            cart: JSON.stringify(req.body.books.toString()),
        },
    });
    const line_items = req.body.books.map((item) => {
        return {
            price_data: {
                currency: "usd",
                product_data: {
                    name: item.title,
                    images: [item.image],
                    metadata: {
                        id: item.id
                    }
                },
                unit_amount: item.selling_price * 100,
            },
            quantity: item.quantity
        };
    })

    const session = await stripe.checkout.sessions.create({
        shipping_address_collection: {allowed_countries: ['US', 'CA','HU']},
        shipping_options: [
            {
                shipping_rate_data: {
                    type: 'fixed_amount',
                    fixed_amount: {amount: 0, currency: 'usd'},
                    display_name: 'Free shipping',
                    delivery_estimate: {
                        minimum: {unit: 'business_day', value: 5},
                        maximum: {unit: 'business_day', value: 7},
                    },
                },
            },
        ],
        line_items,
        mode: 'payment',
        customer:customer.id,
        success_url: `${process.env.CLIENT_URL}/checkout-success`,
        cancel_url: `${process.env.CLIENT_URL}/books`,
    });
    res.send({url: session.url});
}


exports.webhook = async (req, res) => {
    let data;
    let eventType;
    // Check if webhook signing is configured.
    const webhookSecret = process.env.STRIPE_WEB_HOOK;

    if (webhookSecret) {
        // Retrieve the event by verifying the signature using the raw body and secret.
        let event;
        let signature = req.headers["stripe-signature"];

        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                signature,
                webhookSecret
            );
        } catch (err) {
            console.log(`⚠️  Webhook signature verification failed:  ${err}`);
            return res.sendStatus(400);
        }
        // Extract the object from the event.
        data = event.data.object;
        eventType = event.type;
        console.log(eventType)
    } else {
        data = req.body.data.object;
        eventType = req.body.type;
    }

    // Handle the checkout.session.completed event
    if (eventType === "checkout.session.completed") {
        stripe.customers
            .retrieve(data.customer)
            .then((customer) => {
                const userId = customer.metadata.userId
                const line1 = data.customer_details.address.line1
                const city = data.customer_details.address.city
                const state = data.customer_details.address.state
                const postal_code = data.customer_details.address.postal_code
                const final_price = data.amount_total / 100

                async function completeOrder(){
                    await addAddress(userId, line1, city, state, postal_code)
                    await createOrder(userId, final_price)
                    deleteItemsFromShoppingCart(userId)
                }
                completeOrder()

            })
            .catch((err) => console.log(err.message));
    }

    res.status(200).end();
}
