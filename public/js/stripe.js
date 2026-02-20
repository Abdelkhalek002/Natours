import axios from 'axios';
import { showAlert } from '../js/alerts.js';

export const bookTour = async (tourId) => {
  try {
    // if (!window.Stripe) {
    //   throw new Error(
    //     'Stripe.js is not loaded. Make sure the Stripe script is included.',
    //   );
    // }
    const stripe = window.Stripe(
      'pk_test_51T1XHwD65aiMRex3vcHRsNWnMpadFBziiTzN7EIutTNOoEql9YexF6FLVJOwBP9xWvd9eCbh4RgyDKLhc0kzPliB00B4kY1DgB',
    );

    // 1) get checkout session from API endpoint
    const session = await axios(
      `http://localhost:8000/api/v1/bookings/checkout-session/${tourId}`,
    );
    console.log(session);

    // 2) get checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (error) {
    showAlert('error', error);
  }
};
