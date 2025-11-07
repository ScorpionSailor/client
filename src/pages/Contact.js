import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  return (
    <div className="contact-page">
      <div className="container">
        <h1 className="contact-title">Contact Us</h1>
        
        <div className="contact-grid">
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <p>Have a question, comment, or just want to say hello? We'd love to hear from you!</p>
            
            <div className="contact-item">
              <h3>📧 Email</h3>
              <p>support@maytastic.com</p>
            </div>
            
            <div className="contact-item">
              <h3>📱 Phone</h3>
              <p>+91 98765 43210</p>
            </div>
            
            <div className="contact-item">
              <h3>💬 WhatsApp</h3>
              <a href="https://wa.me/PHONE_NUMBER">Chat with us on WhatsApp</a>
            </div>
          </div>

          <div className="contact-form-container">
            <h2>Send a Message</h2>
            <form className="contact-form" onSubmit={(e) => {
              e.preventDefault();
              // Replace PHONE_NUMBER with your WhatsApp number (with country code, no spaces or special chars)
              const phoneNumber = 'PHONE_NUMBER';
              const message = `*New Contact Form Message*\n\nName: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`;
              const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
              window.open(whatsappUrl, '_blank');
            }}>
              <input 
                type="text" 
                placeholder="Your Name" 
                required 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <input 
                type="email" 
                placeholder="Your Email" 
                required 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <textarea 
                placeholder="Your Message" 
                rows="5" 
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              ></textarea>
              <button type="submit" className="btn btn-neon">Send Message on WhatsApp</button>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        .contact-page {
          padding: 4rem 0;
          min-height: 60vh;
        }

        .contact-title {
          font-family: var(--font-bold);
          font-size: 42px;
          margin-bottom: 3rem;
          text-align: center;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
        }

        .contact-info h2 {
          margin-bottom: 1rem;
        }

        .contact-item {
          margin-bottom: 2rem;
        }

        .contact-item h3 {
          color: var(--color-neon-green);
          margin-bottom: 0.5rem;
        }

        .contact-item a {
          color: var(--color-neon-green);
        }

        .contact-form input,
        .contact-form textarea {
          width: 100%;
          padding: 12px;
          margin-bottom: 1rem;
          border: 2px solid var(--color-gray-300);
          border-radius: 5px;
          font-size: 16px;
        }

        .contact-form input:focus,
        .contact-form textarea:focus {
          outline: none;
          border-color: var(--color-neon-green);
        }

        @media (max-width: 968px) {
          .contact-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Contact;

