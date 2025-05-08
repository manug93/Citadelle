import { useTranslation } from "react-i18next";
import ContactForm from "@/components/contact/ContactForm";
import { MapPin, Phone, Mail, Clock, Check } from "lucide-react";

const ContactSection = () => {
  const { t } = useTranslation();
  
  const contactAreas = t('contact.areas.list', { returnObjects: true }) as string[];

  return (
    <section id="contact" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-primary mb-4">{t('contact.title')}</h2>
          <div className="w-20 h-1 bg-[#2c9c6a] mx-auto mb-6"></div>
          <p className="max-w-3xl mx-auto text-lg text-neutral">{t('contact.description')}</p>
        </div>
        
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
              
              <div className="space-y-4">
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
  );
};

export default ContactSection;
