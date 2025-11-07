import React from 'react';

const ShippingPolicy = () => {
  return (
    <div className="policy-page">
      <div className="policy-hero">
        <h1>Shipping & Payment Policy</h1>
        <p>Updated at 2024-11-20</p>
      </div>

      <div className="container">
        <div className="policy-content">
          <section>
            <p>
              We endeavour to dispatch all products ordered within 48 hours after the order has been placed and accepted by us. You will be given an indication of the expected delivery time when you place your order online. MAYtastic insures each order through transit up until it is delivered to you or is collected. You need to sign a confirmation of receipt of the products when the products are collected and by doing so, you accept the responsibility for the products ordered from that moment on. If the recipient or collector is not the original purchaser, or in case of delivery of a gift, then you accept this signature as evidence of delivery and fulfillment of your order.
            </p>
          </section>

          <section>
            <h2>Delivery Charges</h2>
            <p>
              All domestic orders are delivered for free of charge (based on selection).
            </p>
          </section>

          <section>
            <h2>Additional Charges</h2>
            <p>
              There are no additional charges. The total payable amount is indicated on the individual items.
            </p>
          </section>

          <section>
            <h2>Delivery Time</h2>
            <p>
              This may vary depending on the delivery location and services of our logistics partner. However, we endeavour to deliver orders within 4 to 7 Business days (excludes public holidays).
            </p>
          </section>

          <section>
            <h2>Delivery Areas</h2>
            <p>
              We deliver PAN India. For further information please call us on 7738267309 from 10 AM to 5 PM, Monday to Saturday on business days (excludes public holidays) or write to us at support@maytastic.com.
            </p>
          </section>

          <section>
            <h2>Payment Mode</h2>
            <p>You can pay by:</p>
            <ul>
              <li>Cash on Delivery (COD)</li>
              <li>Online through Internet banking</li>
              <li>Visa</li>
              <li>MasterCard</li>
              <li>American Express</li>
              <li>Maestro</li>
              <li>Debit cards</li>
              <li>IMPS</li>
            </ul>
          </section>

          <section>
            <h2>Order Processing</h2>
            <p>
              Once you place an order, it will be processed within 24-48 hours. You will receive an email confirmation with your order details and tracking information once your order has been shipped. You can track your order status through your account dashboard or by contacting our customer support team.
            </p>
          </section>

          <section>
            <h2>Shipping Insurance</h2>
            <p>
              All orders are insured during transit. In case of any damage or loss during shipping, please contact us immediately with your order number and photos of the damaged item. We will investigate and provide a replacement or refund as appropriate.
            </p>
          </section>

          <section>
            <h2>Contact Us</h2>
            <p>
              For any queries regarding shipping or payment, please contact us:
            </p>
            <ul>
              <li><strong>Email:</strong> support@maytastic.com</li>
              <li><strong>Phone:</strong> 7738267309</li>
              <li><strong>Hours:</strong> Mon to Sat (10AM to 5PM) - Business days only</li>
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

export default ShippingPolicy;

