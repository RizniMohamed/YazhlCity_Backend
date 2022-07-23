
// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = "whsec_b04ba3f9a03d7055996aa71e0ac9f1f85a00a534672c8590f595ac7e67257f69";

const stripe_webhook = (request, response) => {
    const sig = request.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    response.status(200).json({ data: event.data.object })

    

};

module.exports = { stripe_webhook }