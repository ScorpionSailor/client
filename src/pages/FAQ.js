import React from 'react';

const FAQ = () => {
  const faqs = [
    {
      q: 'What is Maytastic?',
      a: 'Maytastic is a youth streetwear brand that creates bold, expressive clothing for those who dare to stand out.'
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We accept UPI, Credit/Debit Cards, Net Banking, Cash on Delivery, and Razorpay payments.'
    },
    {
      q: 'What is your shipping policy?',
      a: 'We offer free shipping on orders above ₹1000. Standard shipping takes 3-7 business days.'
    },
    {
      q: 'Can I return or exchange my order?',
      a: 'Yes! You can return or exchange items within 15 days of delivery in their original condition.'
    },
    {
      q: 'How do I track my order?',
      a: 'Once your order ships, you\'ll receive a tracking number via email and SMS.'
    }
  ];

  return (
    <div className="faq-page">
      <div className="container">
        <h1 className="faq-title">Frequently Asked Questions</h1>
        
        <div className="faqs">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <h3>{faq.q}</h3>
              <p>{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .faq-page {
          padding: 4rem 0;
          min-height: 60vh;
        }

        .faq-title {
          font-family: var(--font-bold);
          font-size: 42px;
          margin-bottom: 3rem;
          text-align: center;
        }

        .faqs {
          max-width: 800px;
          margin: 0 auto;
        }

        .faq-item {
          background-color: var(--color-white);
          padding: 2rem;
          border-radius: 10px;
          box-shadow: var(--shadow-md);
          margin-bottom: 1.5rem;
        }

        .faq-item h3 {
          color: var(--color-neon-green);
          margin-bottom: 1rem;
        }

        .faq-item p {
          line-height: 1.8;
        }
      `}</style>
    </div>
  );
};

export default FAQ;

