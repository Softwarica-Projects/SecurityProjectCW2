const Stripe = require('stripe');
const MovieRepository = require('../repositories/MovieRepository');
const TransactionRepository = require('../repositories/TransactionRepository');
const { NotFoundException, ValidationException } = require('../exceptions');

class PaymentService {
    constructor() {
        const stripeKey = process.env.STRIPE_SECRET_KEY;
        if (!stripeKey) throw new Error('STRIPE_SECRET_KEY not configured');
        this.stripe = new Stripe(stripeKey);
        this.movieRepository = new MovieRepository();
        this.transactionRepository = new TransactionRepository();
    }
    async verifyTransaction(movieId, sessionId, userId) {
        // ensure movie exists
        const movie = await this.movieRepository.findById(movieId);
        if (!movie) throw new NotFoundException('Movie', movieId);
        // avoid creating duplicate transaction for same session
        const existing = await this.transactionRepository.findBySessionId(sessionId);
        if (existing) throw new Error("This Payment has already been processed.");
        const session = await this.stripe.checkout.sessions.retrieve(
            sessionId,
            { expand: ["payment_intent"] }
        );
        if (!session.payment_intent) {
            throw new ValidationException("No payment found");
        }

        const paymentIntent = session.payment_intent;

        const isPaid =
            paymentIntent.status === "succeeded" &&
            paymentIntent.amount_received === paymentIntent.amount;

        const transactionPayload = {
            userId: userId,
            movieId: movieId,
            stripeSessionId: session.id,
            stripePaymentIntent: paymentIntent.id,
            amount: paymentIntent.amount / 100,
            currency: paymentIntent.currency,
            status: isPaid ? "paid" : "failed"
        };
        const created = await this.transactionRepository.create(transactionPayload);
        return created;
    }
    async createCheckoutSession({ movieId, userId, successUrl, cancelUrl }) {
        const movie = await this.movieRepository.findById(movieId);
        if (!movie) throw new NotFoundException('Movie', movieId);

        const amount = parseFloat(process.env.DEFAULT_MOVIE_PRICE_USD || '50') * 100; // cents
        let session;
        try {
            session = await this.stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                mode: 'payment',
                line_items: [
                    {
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: movie.title,
                            },
                            unit_amount: Math.round(amount)
                        },
                        quantity: 1
                    }
                ],
                metadata: { movieId: movieId.toString(), userId: userId ? userId.toString() : '' },
                // include placeholders so Stripe fills the session id on redirect; include movieId for route verification
                success_url: `${successUrl}${successUrl.includes('?') ? '&' : '?'}session_id={CHECKOUT_SESSION_ID}&movieId=${movieId}`,
                cancel_url: cancelUrl
            });
        } catch (err) {
            throw new Error(`Failed to create Stripe checkout session: ${err.message}`);
        }
        return { session };
    }

    async handleWebhook(event) {
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const sessionId = session.id;
            const transaction = await this.transactionRepository.findBySessionId(sessionId);
            if (!transaction) return;
            await this.transactionRepository.updateById(transaction._id, { status: 'paid', stripePaymentIntent: session.payment_intent });
        }
    }
}

module.exports = PaymentService;
