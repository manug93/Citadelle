import { useTranslation } from "react-i18next";
import Layout from "@/components/layout/Layout";
import { Helmet } from "react-helmet";
import ContactForm from "@/components/contact/ContactForm";
import { MapPin, Phone, Mail, Clock, Check } from "lucide-react";

const ContactPage = () => {
  const { t } = useTranslation();
  
  const contactAreas = t('contact.areas.list', { returnObjects: true }) as string[];

  return (
    <Layout>
      <Helmet>
        <title>{t('contact.title')} | Groupe La Citadelle S.A.</title>
        <meta 
          name="description" 
          content={t('contact.description')} 
        />
        <meta property="og:title" content={`${t('contact.title')} | Groupe La Citadelle S.A.`} />
        <meta property="og:description" content={t('contact.description')} />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-primary text-white">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <div 
          className="relative h-[400px] bg-cover bg-center z-0" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=800')" }}
        >
          <div className="container mx-auto px-4 h-full flex items-center z-20 relative">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('contact.title')}</h1>
              <p className="text-lg max-w-2xl">{t('contact.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info and Form */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold text-primary mb-6">{t('contact.form.title')}</h3>
                <ContactForm />
              </div>
            </div>
            
            <div>
              <div className="bg-white p-8 rounded-lg shadow-md mb-8">
                <h3 className="text-2xl font-bold text-primary mb-6">{t('contact.info.title')}</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-gray-50 p-3 rounded-full text-primary mr-4">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-neutral">{t('contact.info.address')}</h4>
                      <p className="text-neutral">{t('contact.info.addressLine1')}</p>
                      <p className="text-neutral">{t('contact.info.addressLine2')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-gray-50 p-3 rounded-full text-primary mr-4">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-neutral">{t('contact.info.phone')}</h4>
                      <p className="text-neutral">{t('contact.info.phone1')}</p>
                      <p className="text-neutral">{t('contact.info.phone2')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-gray-50 p-3 rounded-full text-primary mr-4">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-neutral">{t('contact.info.email')}</h4>
                      <p className="text-neutral">{t('contact.info.emailAddress')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-gray-50 p-3 rounded-full text-primary mr-4">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-neutral">{t('contact.info.hours')}</h4>
                      <p className="text-neutral">{t('contact.info.hoursWeekday')}</p>
                      <p className="text-neutral">{t('contact.info.hoursWeekend')}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold text-primary mb-6">{t('contact.areas.title')}</h3>
                
                <div className="space-y-2">
                  {contactAreas.map((area, index) => (
                    <div key={index} className="flex items-center">
                      <Check className="text-[#2c9c6a] h-5 w-5 mr-2" />
                      <span>{area}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-primary mb-8 text-center">Notre Localisation</h2>
          <div className="h-[400px] rounded-lg overflow-hidden shadow-md">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63695.00098983952!2d11.469870620033414!3d3.8665975747749!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x108bcf7a309a7977%3A0x8484d0584454c909!2sYaound%C3%A9%2C%20Cameroon!5e0!3m2!1sen!2sus!4v1688456972065!5m2!1sen!2sus" 
              className="w-full h-full border-0"
              title="Groupe La Citadelle S.A. Location"
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">Besoin d'une consultation spécifique?</h2>
          <p className="text-lg text-neutral mb-8 max-w-3xl mx-auto">
            Nos experts sont disponibles pour vous accompagner dans vos projets. Contactez-nous pour un rendez-vous personnalisé.
          </p>
          <div className="inline-flex space-x-4">
            <a href={`tel:${t('contact.info.phone1').replace(/[^\d+]/g, '')}`} className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md font-medium transition duration-300">
              Appelez-nous
            </a>
            <a href={`mailto:${t('contact.info.emailAddress')}`} className="bg-[#2c9c6a] hover:bg-[#2c9c6a]/90 text-white px-6 py-3 rounded-md font-medium transition duration-300">
              Envoyez un email
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactPage;
