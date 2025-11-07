import React from 'react';

const RefundPolicy = () => {
  return (
    <div className="policy-page">
      <div className="policy-hero">
        <h1>Return & Refund Policy</h1>
        <p>Updated at 2024-11-20</p>
      </div>

      <div className="container">
        <div className="policy-content">
          <section>
            <p>
              If you are not happy with your purchase, we will accept a return of an unused product within 7 days from the date of delivery of the products.
            </p>
          </section>

          <section>
            <h2>Refund Process</h2>
            <p>
              Once we receive the returned item Clothing & Fashion will then give a full refund (excluding shipping as we are unable to refund the initial shipping cost of your order) post verification of the product at our warehouse. Refund shall be processed as per the applicable guidelines / notification / law passed by RBI from time to and it may take 07-14 days additional business days to reflect the same in your account.
            </p>
          </section>

          <section>
            <h2>Return Conditions</h2>
            <ul>
              <li>Products must be unused and in their original packaging</li>
              <li>Returns must be initiated within 7 days of delivery</li>
              <li>Items must be in original condition with all tags attached</li>
              <li>Shipping charges are non-refundable</li>
            </ul>
          </section>

          <section>
            <h2>Refund Timeline</h2>
            <p>
              Once your return is received and verified, we will process your refund within 7-14 business days. The refund will be credited to the original payment method used for the purchase. Please note that it may take additional time for your bank or credit card company to process and post the refund to your account.
            </p>
          </section>

          <section>
            <h2>Contact Us</h2>
            <p>
              If you have any questions about our refund policy, please contact us:
            </p>
            <ul>
              <li><strong>Email:</strong> support@maytastic.com</li>
              <li><strong>Phone:</strong> 7738267309</li>
              <li><strong>Hours:</strong> Mon to Fri (9AM to 6PM)</li>
            </ul>
          </section>
        </div>
      </div>

      <style jsx>{`
        .policy-page {
          min-height: 100vh;
        }

        .policy-hero {
          background: linear-gradient(135deg, var(--color-black) 0%, var(--color-charcoal) 100%);
          color: var(--color-white);
          padding: 4rem 0;
          text-align: center;
        }

        .policy-hero h1 {
          font-family: var(--font-bold);
          font-size: 48px;
          margin-bottom: 0.5rem;
          color: var(--color-neon-green);
        }

        .policy-hero p {
          font-size: 16px;
          color: var(--color-gray-300);
        }

        .policy-content {
          padding: 3rem 0;
          max-width: 900px;
          margin: 0 auto;
        }

        .policy-content section {
          margin-bottom: 2.5rem;
        }

        .policy-content h2 {
          font-family: var(--font-bold);
          font-size: 28px;
          margin-bottom: 1rem;
          color: var(--color-black);
        }

        .policy-content p {
          font-size: 16px;
          line-height: 1.8;
          margin-bottom: 1rem;
          color: var(--color-gray-700);
        }

        .policy-content ul {
          margin-left: 2rem;
          margin-bottom: 1rem;
        }

        .policy-content ul li {
          font-size: 16px;
          line-height: 1.8;
          margin-bottom: 0.5rem;
          color: var(--color-gray-700);
        }

        .policy-content ul li strong {
          color: var(--color-black);
        }

        @media (max-width: 768px) {
          .policy-hero h1 {
            font-size: 32px;
          }

          .policy-content {
            padding: 2rem 0;
          }

          .policy-content h2 {
            font-size: 24px;
          }
        }
      `}</style>
    </div>
  );
};

export default RefundPolicy;

