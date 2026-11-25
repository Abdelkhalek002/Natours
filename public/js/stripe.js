import axios from 'axios';
import { showAlert } from '../js/alerts.js';

export const bookTour = async (tourId, publishableKey) => {
  try {
    if (!window.Stripe) {
      throw new Error(
        'Stripe.js is not loaded. Make sure the Stripe script is included.',
      );
    }
    if (!publishableKey) {
      throw new Error('Stripe publishable key is not configured.');
    }
    const stripe = window.Stripe(publishableKey);

    // 1) get checkout session from API endpoint
    const session = await axios(
      `/api/v1/bookings/checkout-session/${tourId}`,
    );

    // 2) get checkout form + charge credit card
    if (session.data.session.url) {
      window.location.assign(session.data.session.url);
      return;
    }

    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (error) {
    showAlert(
      'error',
      error.response?.data?.message || error.message || 'Unable to start checkout.',
    );
  }
};
