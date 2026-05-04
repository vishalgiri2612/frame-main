'use client';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const FaceShapeIcon = ({ type, isLight }) => {
  const strokeColor = isLight ? '#4A4540' : '#C9A84C';
  const circleBg = isLight ? 'rgba(74, 69, 64, 0.05)' : 'rgba(247, 244, 239, 0.5)';
  
  const styles = {
    triangle: <path d="M50 20 L80 80 L20 80 Z" stroke={strokeColor} strokeWidth="0.8" fill="none" />,
    diamond: <path d="M50 15 L85 50 L50 85 L15 50 Z" stroke={strokeColor} strokeWidth="0.8" fill="none" />,
    heart: <path d="M50 85 C10 55 10 25 50 25 C90 25 90 55 50 85" stroke={strokeColor} strokeWidth="0.8" fill="none" />,
    oblong: <rect x="30" y="15" width="40" height="70" rx="20" stroke={strokeColor} strokeWidth="0.8" fill="none" />,
    oval: <ellipse cx="50" cy="50" rx="30" ry="45" stroke={strokeColor} strokeWidth="0.8" fill="none" />,
    rectangle: <rect x="20" y="25" width="60" height="50" rx="4" stroke={strokeColor} strokeWidth="0.8" fill="none" />,
    round: <circle cx="50" cy="50" r="40" stroke={strokeColor} strokeWidth="0.8" fill="none" />,
    square: <rect x="20" y="20" width="60" height="60" rx="4" stroke={strokeColor} strokeWidth="0.8" fill="none" />
  };
  return (
    <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
      <div className="absolute inset-0 rounded-full border" style={{ 
        background: circleBg, 
        borderColor: isLight ? 'rgba(74, 69, 64, 0.1)' : 'rgba(201, 168, 76, 0.1)' 
      }} />
      <svg viewBox="0 0 100 100" className="w-16 h-16 relative z-10">
        {styles[type] || styles.oval}
      </svg>
    </div>
  );
};

const FrameAnatomyDiagram = ({ isLight }) => {
  const strokeColor = isLight ? '#4A4540' : '#C9A84C';
  const labelColor = isLight ? '#8A8078' : '#7ECAC3';
  return (
    <svg viewBox="0 0 400 160" className="w-full max-w-lg mx-auto opacity-80">
      <rect x="50" y="40" width="120" height="80" rx="10" stroke={strokeColor} strokeWidth="1.5" fill="none" />
      <rect x="230" y="40" width="120" height="80" rx="10" stroke={strokeColor} strokeWidth="1.5" fill="none" />
      <path d="M170 60 Q200 45 230 60" stroke={strokeColor} strokeWidth="1.5" fill="none" />
      <path d="M50 50 L10 50" stroke={strokeColor} strokeWidth="1.5" fill="none" />
      <path d="M350 50 L390 50" stroke={strokeColor} strokeWidth="1.5" fill="none" />
      <g fontSize="10" fill={labelColor} fontFamily="var(--font-inter)" letterSpacing="0.1em">
        <text x="85" y="140">LENS WIDTH</text>
        <line x1="50" y1="130" x2="170" y2="130" stroke={labelColor} strokeWidth="0.5" strokeDasharray="4" />
        <text x="185" y="30">BRIDGE</text>
        <line x1="170" y1="20" x2="230" y2="20" stroke={labelColor} strokeWidth="0.5" strokeDasharray="4" />
      </g>
    </svg>
  );
};

const FAQAccordion = ({ sections }) => {
  const [activeSection, setActiveSection] = useState(0);
  const [activeQuestion, setActiveQuestion] = useState(null);

  return (
    <div className="space-y-12">
      {sections.map((section, sIdx) => (
        <div key={sIdx} className="space-y-6">
          <h2 style={{ 
            fontFamily: 'var(--font-cormorant)', 
            fontSize: '32px', 
            color: '#0F1117', 
            letterSpacing: '0.05em',
            borderBottom: '1px solid rgba(166,138,59,0.3)',
            paddingBottom: '12px'
          }}>
            {section.title}
          </h2>
          <div className="space-y-4">
            {section.questions.map((q, qIdx) => {
              const isOpen = activeSection === sIdx && activeQuestion === qIdx;
              return (
                <div key={qIdx} style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                  <button 
                    onClick={() => {
                      setActiveSection(sIdx);
                      setActiveQuestion(isOpen ? null : qIdx);
                    }}
                    className="w-full py-5 flex justify-between items-center text-left transition-colors"
                    style={{ color: isOpen ? '#A68A3B' : '#3A3530' }}
                  >
                    <span style={{ fontFamily: 'var(--font-inter)', fontSize: '16px', fontWeight: 500 }}>{q.question}</span>
                    <span style={{ fontSize: '20px', fontWeight: 300 }}>{isOpen ? '−' : '+'}</span>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="pb-8 pr-12" style={{ 
                          fontFamily: 'var(--font-inter)', 
                          fontSize: '15px', 
                          color: '#6B6259', 
                          lineHeight: 1.8 
                        }}>
                          {q.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

const SUPPORT_PAGES = {
  'faqs': {
    title: 'FAQs',
    subtitle: 'Everything you need to know about EYELOVEYOU',
    content: 'Find answers to common questions regarding our boutique services, shipping, and premium eyewear standards.',
    isFAQ: true,
    sections: [
      {
        title: 'General Terms',
        questions: [
          {
            question: 'Are online terms different from in-store policies?',
            answer: 'All conditions detailed below are subject to change without prior notice and apply specifically to products purchased online at our official boutique website. Occasionally, information on our site may contain inaccuracies or omissions related to product descriptions, pricing, or availability. We reserve the right to correct these at any time.'
          },
          {
            question: 'What is your liability regarding delivery delays?',
            answer: 'Punjab Optical is committed to excellence, however, we are not liable to compensate for delays in product delivery beyond originally committed dates due to logistical factors beyond our control.'
          },
          {
            question: 'What happens if an item I ordered is unavailable?',
            answer: 'We reserve the right to cancel an order due to unavailability of a product. In such events, a full refund of the deposit amount will be issued via wire transfer or the original payment method. Our liability is limited to the refund of the paid amount.'
          },
          {
            question: 'Should I record the unboxing of my order?',
            answer: 'We highly recommend all clients record a video while opening their order. This serves as vital proof during any investigation in the rare case of a claim or damage.'
          }
        ]
      },
      {
        title: 'Orders',
        questions: [
          {
            question: 'Can I update or cancel my order after it has been placed?',
            answer: 'Since we process orders quickly to ensure timely delivery, changes or cancellations must be requested within 2 hours of placement. Please contact our concierge team immediately for assistance.'
          },
          {
            question: 'Can you add prescription lenses to my frames / sunglasses?',
            answer: 'Yes! Please e-mail your prescription to our specialists at concierge@eyeloveyou.com and one of our optometrists will recommend the lenses most suitable for you. Note that certain high-curve sunglasses may not support prescription lenses.'
          },
          {
            question: 'I have a doctor’s prescription, but I’m unsure of what it means.',
            answer: 'No need to worry. Simply share a photo of your prescription with our team, and our lens experts will guide you through the selection process.'
          },
          {
            question: 'My purchase is a gift, can you gift wrap it?',
            answer: 'Every EYELOVEYOU purchase arrives in our signature luxury packaging. For special gift wrapping and personalized notes, please select the "Gift" option at checkout.'
          },
          {
            question: 'Are prices displayed inclusive of taxes?',
            answer: 'All prices displayed on our boutique website are inclusive of applicable GST and luxury taxes within the region.'
          }
        ]
      },
      {
        title: 'Shipping',
        questions: [
          {
            question: 'How much does shipping cost?',
            answer: 'We provide complimentary secure shipping on all orders within Pan India. For international shipments, costs are calculated at checkout based on destination and weight.'
          },
          {
            question: 'How much time will it take to ship my order?',
            answer: 'Standard frames typically ship within 2-3 business days. Orders requiring custom prescription lenses may take 5-7 business days to undergo our precision quality checks.'
          },
          {
            question: 'What happens if I miss my delivery?',
            answer: 'Our courier partners will attempt delivery up to three times. If unsuccessful, the product will be returned to our boutique, and we will contact you to arrange a re-delivery.'
          }
        ]
      },
      {
        title: 'Returns & Exchanges',
        questions: [
          {
            question: 'What are the pre-conditions for returns & exchanges?',
            answer: 'Items must be returned in their original, unworn condition with all security tags, luxury packaging, and certificates of authenticity intact. Custom-made prescription lenses are non-returnable.'
          },
          {
            question: 'What is the process of returning my product?',
            answer: 'Initiate your return through your account dashboard or contact our concierge. We will arrange a secure pickup for your convenience.'
          },
          {
            question: 'I received a damaged or incorrect product, what do I do?',
            answer: 'Please contact us within 24 hours of receipt with your unboxing video. We will prioritize an immediate replacement or full refund.'
          }
        ]
      },
      {
        title: 'After Sales & Servicing',
        questions: [
          {
            question: 'What is the warranty on my product?',
            answer: 'All our frames come with a 1-year manufacturer warranty covering structural defects. This does not cover accidental damage, scratches, or wear and tear from regular use.'
          },
          {
            question: 'The product doesn’t fit properly or has become loose.',
            answer: 'We offer complimentary lifetime adjustments at any of our Punjab Optical stores. If you are not near a store, our concierge can guide you on safe adjustment techniques or help arrange a service.'
          }
        ]
      }
    ]
  },
  'shape-and-style-guide': {
    title: 'Shape & Style Guide',
    subtitle: 'The Art of the Frame',
    content: 'Discover the frames that celebrate your unique geometry. A perfect fit is where artisan craftsmanship meets facial architecture.',
    isGuide: true,
    measurements: [
      { label: 'Lens Width', value: '47-52mm', description: 'The horizontal diameter of the lens at its widest point.' },
      { label: 'Bridge Width', value: '18-22mm', description: 'The distance between the two lenses over your nose.' },
      { label: 'Temple Length', value: '140-150mm', description: 'The length of the "arms" from the hinge to the tip.' },
      { label: 'Frame Width', value: '135-145mm', description: 'The total horizontal width across the front of the frame.' }
    ],
    guideSections: [
      {
        shape: 'BASE-DOWN TRIANGLE',
        traits: 'Frames shapes that are heavy and wider on top half to give a proportionate look.',
        recommendation: 'Aviator | Cats eye | Oval | Wayfarer',
        visualId: 'triangle'
      },
      {
        shape: 'DIAMOND',
        traits: 'Frames that distract attention from the pointed chin and draw attention towards the narrow top of the face.',
        recommendation: 'Cats eye | Oval | Rectangular | Wayfarer',
        visualId: 'diamond'
      },
      {
        shape: 'HEART',
        traits: 'Frames that are wider at the bottom with a light appearance that reduce the apparent top of the face.',
        recommendation: 'Aviator | Rectangular | Wayfarer',
        visualId: 'heart'
      },
      {
        shape: 'OBLONG',
        traits: 'Frames with more width than depth or frames that give the perception of more width.',
        recommendation: 'Aviator | Wayfarer',
        visualId: 'oblong'
      },
      {
        shape: 'OVAL',
        traits: 'Frames that are wide or wider than the broadest part of the face so as to maintain the natural balance.',
        recommendation: 'Aviator | Butterfly | Cats eye | Rectangular | Round | Wayfarer',
        visualId: 'oval'
      },
      {
        shape: 'RECTANGLE',
        traits: 'Frames that are wider and curved so as to soften the naturally shaped angles and balance the cheek bones.',
        recommendation: 'Aviator | Cats eye | Oval | Round | Wayfarer',
        visualId: 'rectangle'
      },
      {
        shape: 'ROUND',
        traits: 'Angular and narrow frames that impart length to the curved face.',
        recommendation: 'Aviator | Rectangular | Wayfarer',
        visualId: 'round'
      },
      {
        shape: 'SQUARE',
        traits: 'Narrow oval and rounded frames to soften the face shape\'s angles and make it look longer.',
        recommendation: 'Aviator | Cats eye | Oval | Round | Wayfarer',
        visualId: 'square'
      }
    ],
    stylingTips: [
      { title: 'The Bridge', text: 'A high bridge adds length to a short nose.' },
      { title: 'Color', text: 'Deep tones add authority; translucents offer a contemporary look.' },
      { title: 'Proportion', text: 'Frames should follow the line of your eyebrows.' }
    ]
  },
  'orders': {
    title: 'Orders',
    subtitle: 'Track and Manage',
    content: 'View your order history, track current shipments, and manage your account details.'
  },
  'shipping': {
    title: 'Shipping',
    subtitle: 'Delivery Excellence',
    content: 'We provide secure, insured shipping for all our premium eyewear. Learn more about our delivery times and international shipping options.'
  },
  'returns-and-exchanges': {
    title: 'Returns & Exchanges',
    subtitle: 'Our Commitment to Quality',
    content: 'We offer a seamless exchange process for our boutique collection to ensure your total satisfaction.',
    isPolicy: true,
    policyContent: [
      {
        heading: 'Policy Overview',
        text: 'Your utmost satisfaction is our priority. In case you are unhappy with a purchase made online, you may exchange it within 7 days of receipt for store credit. The store credit does not have an expiration date.\n\nPlease note:\n1. All sales are final and we operate a no-refund policy.\n2. Exchanges are only permitted for pieces sold from available stock. Any product(s) sourced or customized especially for you are not applicable for exchanges.'
      },
      {
        heading: 'Boutique Tune-Ups',
        text: 'Sometimes, dissatisfaction might be due to the fit. We encourage you to book a "Frame Tune-Up" at any of our Punjab Optical stores where our expert technicians can perform simple adjustments to completely uplift your comfort level.'
      },
      {
        heading: 'Pre-conditions for Returns',
        text: 'All store credits are subject to a thorough quality check. \n\nContact Lenses:\nBoxes must be unopened and in original condition. We do not accept returns if the box has been tampered with.\n\nSunglasses & Frames:\n- Must be in unused and unworn condition.\n- Proof of purchase (invoice) must be provided.\n- All tags, warranty certificates, and luxury packaging must be included in their original condition.'
      },
      {
        heading: 'The Return Process',
        text: 'i. Please write to our concierge at concierge@eyeloveyou.com or contact us via our support line at +92 (300) 123-4567 with your invoice and a photograph of the product.\nii. Once approved, ship the product to our boutique address. Ensure packaging is secure. We do not accept in-store returns for online purchases.\niii. We will notify you upon receipt. Please allow 3–4 working days for quality verification.'
      },
      {
        heading: 'Damaged or Incorrect Items',
        text: 'In the rare event of receiving a damaged or incorrect product, we require video proof of the unboxing along with photos of the defect. This must be shared with us within 72 hours of delivery. Once verified, we will arrange for a replacement or store credit within 15 days.'
      },
      {
        heading: 'Gifts & Late Returns',
        text: 'Items received as gifts may be returned for store credit only with original proof of purchase. Unfortunately, we cannot accept return requests made after 7 days of receipt.'
      }
    ]
  },
  'privacy-policy': {
    title: 'Privacy Policy',
    subtitle: 'Commitment to Your Privacy',
    content: 'Our privacy policy outlines how we handle your personal data with the utmost care and transparency.',
    isPolicy: true,
    policyContent: [
      {
        heading: 'Introduction',
        text: 'This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from our official boutique website (the “Site”).'
      },
      {
        heading: 'Personal Information We Collect',
        text: 'When you visit the Site, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device. We refer to this automatically-collected information as “Device Information”.\n\nAdditionally, when you make a purchase or attempt to make a purchase through the Site, we collect certain information from you, including your name, billing address, shipping address, payment information, email address, and phone number. We refer to this as “Order Information”.'
      },
      {
        heading: 'How We Use Your Personal Information',
        text: 'We use the Order Information generally to fulfill any orders placed through the Site (including processing payment information, arranging for shipping, and providing you with invoices and/or order confirmations). Additionally, we use this information to:\n- Communicate with you;\n- Screen our orders for potential risk or fraud;\n- Provide you with information or advertising relating to our products or services when in line with your shared preferences.'
      },
      {
        heading: 'Sharing Your Personal Information',
        text: 'We share your Personal Information with trusted third parties to help us provide you with our boutique experience. For example, we use analytics tools to understand how our customers interact with the Site. We may also share information to comply with applicable laws and regulations, or to protect our rights.'
      },
      {
        heading: 'Behavioural Advertising',
        text: 'As described above, we use your Personal Information to provide you with targeted advertisements or marketing communications we believe may be of interest to you. You can opt out of targeted advertising through your browser settings or via major platform ad-preferences pages (Facebook, Google, Bing).'
      },
      {
        heading: 'Data Retention',
        text: 'When you place an order through the Site, we will maintain your Order Information for our records unless and until you ask us to delete this information.'
      },
      {
        heading: 'Contact Us',
        text: 'For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by e‑mail at concierge@eyeloveyou.com or by mail at:\n\n[To: The Compliance Officer]\nPunjab Optical Boutique, HQ - New Delhi, India'
      }
    ]
  },
  'terms-of-service': {
    title: 'Terms of Service',
    subtitle: 'Boutique Usage Agreement',
    content: 'Our terms and conditions govern your interaction with the EYELOVEYOU boutique and our digital services.',
    isPolicy: true,
    policyContent: [
      {
        heading: 'Overview',
        text: 'This website is operated by Punjab Optical. Throughout the site, the terms “we”, “us” and “our” refer to Punjab Optical. EYELOVEYOU offers this website, including all information, tools and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies and notices stated here.'
      },
      {
        heading: '1. Online Store Terms',
        text: 'By agreeing to these Terms of Service, you represent that you are at least the age of majority in your jurisdiction. You may not use our products for any illegal or unauthorized purpose nor may you violate any laws in your jurisdiction (including but not limited to copyright laws).'
      },
      {
        heading: '2. General Conditions',
        text: 'We reserve the right to refuse service to anyone for any reason at any time. You understand that your content (not including credit card information), may be transferred unencrypted over various networks. Credit card information is always encrypted during transfer over networks.'
      },
      {
        heading: '3. Accuracy of Information',
        text: 'We are not responsible if information made available on this site is not accurate, complete or current. The material on this site is provided for general information only and should not be relied upon as the sole basis for making decisions.'
      },
      {
        heading: '4. Modifications and Prices',
        text: 'Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice.'
      },
      {
        heading: '5. Products or Services',
        text: 'Certain products or services may be available exclusively online through the website. We have made every effort to display as accurately as possible the colors and images of our products. We cannot guarantee that your monitor\'s display of any color will be accurate.'
      },
      {
        heading: '6. Accuracy of Billing',
        text: 'We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household or per order. You agree to provide current, complete and accurate purchase information for all purchases.'
      },
      {
        heading: '7. Prohibited Uses',
        text: 'In addition to other prohibitions, you are prohibited from using the site or its content: (a) for any unlawful purpose; (b) to solicit others to perform unlawful acts; (c) to infringe upon or violate our intellectual property rights or the rights of others.'
      },
      {
        heading: '8. Disclaimer of Warranties',
        text: 'We do not guarantee that your use of our service will be uninterrupted, timely, or error-free. In no case shall Punjab Optical, our directors, officers, or employees be liable for any injury, loss, claim, or any direct, indirect, incidental, or consequential damages of any kind.'
      },
      {
        heading: '9. Governing Law',
        text: 'These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of India.'
      },
      {
        heading: '10. Contact Information',
        text: 'Questions about the Terms of Service should be sent to us at concierge@eyeloveyou.com.'
      }
    ]
  },
  'refund-policy': {
    title: 'Refund Policy',
    subtitle: 'Store Credit & Exchange Policy',
    content: 'We offer a flexible store credit system to ensure you find the perfect eyewear for your collection.',
    isPolicy: true,
    policyContent: [
      {
        heading: 'No Refund Policy',
        text: 'Your utmost satisfaction is our priority. Please note that all sales are final, and we operate a strict no-refund policy. However, we offer seamless exchanges for store credit.'
      },
      {
        heading: 'Store Credit & Exchanges',
        text: 'If you are unhappy with a purchase made online, you may exchange it within 7 days of receipt for store credit. The store credit does not have an expiration date.\n\nYou can apply your store credit to your next purchase. If the new product price is higher, the difference must be paid. Any leftover credit will remain in your account for future use.'
      },
      {
        heading: 'Frame Tune-Ups',
        text: 'Often, discomfort is simply a matter of fit. We encourage you to visit any Punjab Optical boutique for a complimentary "Frame Tune-Up." Our master technicians can perform precision adjustments to ensure a perfect fit.'
      },
      {
        heading: 'Pre-conditions for Exchange',
        text: 'All items returned for store credit must pass a thorough quality check:\n\nContact Lenses: Boxes must be unopened and in original condition.\n\nSunglasses & Frames:\n- Must be in unused and unworn condition.\n- Original invoice must be provided.\n- All tags, warranty cards, catalogues, and luxury dust bags must be returned in original condition.'
      },
      {
        heading: 'Further Information',
        text: 'For more details and a comprehensive list of common questions, please visit our [FAQs](/support/faqs) page.'
      }
    ]
  }
};

export default function SupportPage() {
  const { slug } = useParams();
  const pageData = SUPPORT_PAGES[slug] || {
    title: 'Support',
    subtitle: 'How can we help you?',
    content: 'Select a category from the footer to learn more about our services and policies.'
  };

  return (
    <main style={{ background: 'var(--navy)', minHeight: '100vh' }}>
      <Navbar />
      
      <div className="pt-40 pb-20 px-6 container mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="mb-20 text-center">
            <span style={{ 
              fontSize: '10px', 
              fontFamily: 'var(--font-inter)', 
              fontWeight: 500, 
              letterSpacing: '0.4em', 
              textTransform: 'uppercase', 
              color: '#A68A3B',
              display: 'block',
              marginBottom: '24px'
            }}>
              Support & Services
            </span>
            <h1 style={{ 
              fontFamily: 'var(--font-cormorant)', 
              fontSize: 'clamp(3rem, 8vw, 5rem)', 
              fontWeight: 300, 
              color: '#0F1117', 
              lineHeight: 1.1,
              letterSpacing: '-0.02em'
            }}>
              {pageData.title}
            </h1>
            <div className="mt-8 flex justify-center">
              <div style={{ width: '40px', height: '1px', background: 'rgba(166,138,59,0.3)' }} />
            </div>
            <p className="mt-8" style={{ 
              fontFamily: 'var(--font-inter)', 
              fontSize: '18px', 
              color: '#A68A3B', 
              fontWeight: 300,
              letterSpacing: '0.05em'
            }}>
              {pageData.subtitle}
            </p>
          </div>

          {/* Content Area */}
          <div style={{ 
            background: '#FFFFFF', 
            border: '1px solid rgba(166,138,59,0.1)',
            padding: pageData.isFAQ ? '60px 40px' : '80px 60px',
            borderRadius: '2px',
            boxShadow: '0 20px 60px rgba(166,138,59,0.05)'
          }}>
            <div style={{ 
              fontFamily: 'var(--font-inter)', 
              fontSize: '16px', 
              color: '#3A3530', 
              lineHeight: 1.8,
              letterSpacing: '0.01em'
            }}>
              {!pageData.isFAQ && <p className="mb-16 text-center italic" style={{ 
                fontFamily: 'var(--font-cormorant)', 
                fontSize: '22px',
                color: '#6B6259'
              }}>{pageData.content}</p>}
              
              {pageData.isFAQ ? (
                <FAQAccordion sections={pageData.sections} />
              ) : pageData.isGuide ? (
                <div className="space-y-32">
                  {/* Face Shapes Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-y-20 gap-x-12">
                    {pageData.guideSections.map((section, idx) => (
                      <div key={idx} className="flex flex-col items-center text-center">
                        <h3 style={{ 
                          fontFamily: 'var(--font-inter)', 
                          fontSize: '14px', 
                          color: '#0F1117', 
                          marginBottom: '24px',
                          letterSpacing: '0.2em',
                          fontWeight: 500
                        }}>
                          {section.shape}
                        </h3>
                        
                        <FaceShapeIcon type={section.visualId} isLight={true} />
                        
                        <p style={{ 
                          color: '#6B6259', 
                          fontSize: '13px', 
                          lineHeight: 1.6, 
                          marginBottom: '20px',
                          maxWidth: '280px'
                        }}>
                          {section.traits}
                        </p>

                        <div className="space-y-1">
                          <p style={{ 
                            color: '#0F1117', 
                            fontSize: '12px', 
                            fontWeight: 700,
                            letterSpacing: '0.02em'
                          }}>
                            Frame shapes best suited to this cut
                          </p>
                          <p style={{ 
                            color: '#A68A3B', 
                            fontSize: '12px', 
                            fontStyle: 'italic',
                            fontFamily: 'var(--font-cormorant)'
                          }}>
                            {section.recommendation}
                          </p>
                        </div>

                        <Link href="/shop" className="mt-8 group">
                          <span style={{ 
                            fontSize: '11px', 
                            color: '#0F1117', 
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            borderBottom: '1px solid #0F1117',
                            paddingBottom: '2px',
                            transition: 'all 0.3s ease'
                          }}
                          className="group-hover:text-[#A68A3B] group-hover:border-[#A68A3B]"
                          >
                            SHOP FOR THIS SHAPE
                          </span>
                        </Link>
                      </div>
                    ))}
                  </div>

                  {/* Anatomy Section */}
                  <div className="pt-32" style={{ borderTop: '1px solid rgba(166,138,59,0.1)' }}>
                    <div className="text-center space-y-12">
                      <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '32px', color: '#0F1117' }}>Anatomy of the Frame</h2>
                      <div className="py-12 bg-[var(--navy)] rounded-sm border border-rgba(166,138,59,0.1)">
                        <FrameAnatomyDiagram isLight={true} />
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {pageData.measurements.map((m, idx) => (
                          <div key={idx} className="space-y-2">
                            <p style={{ color: '#A68A3B', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em' }}>{m.label}</p>
                            <p style={{ color: '#0F1117', fontSize: '18px', fontFamily: 'var(--font-cormorant)' }}>{m.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : pageData.isPolicy ? (
                <div className="space-y-12">
                  {pageData.policyContent.map((section, idx) => (
                    <section key={idx}>
                      <h3 style={{ 
                        color: '#0F1117', 
                        fontSize: '22px', 
                        fontFamily: 'var(--font-cormorant)', 
                        marginBottom: '16px', 
                        letterSpacing: '0.05em',
                        borderLeft: '2px solid #A68A3B',
                        paddingLeft: '16px'
                      }}>
                        {section.heading}
                      </h3>
                      <div className="whitespace-pre-line text-[#3A3530]">
                        {section.text.split(/(\[FAQs\]\(\/support\/faqs\))/).map((part, i) => {
                          if (part === '[FAQs](/support/faqs)') {
                            return (
                              <Link key={i} href="/support/faqs" style={{ color: '#A68A3B', textDecoration: 'underline' }}>
                                FAQs
                              </Link>
                            );
                          }
                          return part;
                        })}
                      </div>
                    </section>
                  ))}
                </div>
              ) : (
                <div className="space-y-12 mt-16">
                  <section>
                    <h3 style={{ color: '#0F1117', fontSize: '22px', fontFamily: 'var(--font-cormorant)', marginBottom: '16px', letterSpacing: '0.05em' }}>
                      Overview
                    </h3>
                    <p>
                      At Punjab Optical, we believe in providing a seamless luxury experience. Our {pageData.title.toLowerCase()} is designed to ensure you receive the highest standard of service and support.
                    </p>
                  </section>

                  <section>
                    <h3 style={{ color: '#0F1117', fontSize: '22px', fontFamily: 'var(--font-cormorant)', marginBottom: '16px', letterSpacing: '0.05em' }}>
                      Contact Our Concierge
                    </h3>
                    <p>
                      Should you require further assistance regarding {pageData.title.toLowerCase()}, our dedicated concierge team is available to assist you personally.
                    </p>
                    <div className="mt-8 p-8" style={{ border: '1px solid rgba(166,138,59,0.2)', background: 'var(--navy)' }}>
                      <p style={{ fontSize: '12px', color: '#6B6259', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Support Hotline</p>
                      <p style={{ color: '#0F1117', fontSize: '20px', fontWeight: 600 }}>+92 (300) 123-4567</p>
                    </div>
                  </section>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Back */}
          <div className="mt-20 flex justify-center">
            <Link href="/" style={{ 
              fontFamily: 'var(--font-inter)', 
              fontSize: '11px', 
              letterSpacing: '0.2em', 
              textTransform: 'uppercase', 
              color: '#6B6259',
              borderBottom: '1px solid rgba(107,98,89,0.3)',
              paddingBottom: '4px',
              transition: 'all 0.3s ease',
              display: 'block'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#A68A3B';
              e.currentTarget.style.borderBottomColor = '#A68A3B';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#6B6259';
              e.currentTarget.style.borderBottomColor = 'rgba(107,98,89,0.3)';
            }}
            >
              Back to Boutique
            </Link>
          </div>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}
