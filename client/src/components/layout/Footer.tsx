import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Facebook, Twitter, Linkedin, MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  const { t } = useTranslation();
  
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1 */}
          <div>
            <h3 className="text-xl font-bold mb-6">{t('footer.about')}</h3>
            <p className="mb-6">{t('footer.aboutText')}</p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-gray-200 transition duration-200">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-gray-200 transition duration-200">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-gray-200 transition duration-200">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Column 2 */}
          <div>
            <h3 className="text-xl font-bold mb-6">{t('footer.services')}</h3>
            <ul className="space-y-3">
              <li><Link href="/services#infrastructure"><a className="hover:text-gray-200 transition duration-200">{t('services.infrastructure.title')}</a></Link></li>
              <li><Link href="/services#engineering"><a className="hover:text-gray-200 transition duration-200">{t('services.engineering.title')}</a></Link></li>
              <li><Link href="/services#realestate"><a className="hover:text-gray-200 transition duration-200">{t('services.realestate.title')}</a></Link></li>
              <li><Link href="/services#insurance"><a className="hover:text-gray-200 transition duration-200">{t('services.insurance.title')}</a></Link></li>
              <li><Link href="/services#partnerships"><a className="hover:text-gray-200 transition duration-200">{t('services.partnerships.title')}</a></Link></li>
            </ul>
          </div>
          
          {/* Column 3 */}
          <div>
            <h3 className="text-xl font-bold mb-6">{t('footer.navigation')}</h3>
            <ul className="space-y-3">
              <li><Link href="/"><a className="hover:text-gray-200 transition duration-200">{t('nav.home')}</a></Link></li>
              <li><Link href="/about"><a className="hover:text-gray-200 transition duration-200">{t('nav.about')}</a></Link></li>
              <li><Link href="/services"><a className="hover:text-gray-200 transition duration-200">{t('nav.services')}</a></Link></li>
              <li><Link href="/projects"><a className="hover:text-gray-200 transition duration-200">{t('nav.projects')}</a></Link></li>
              <li><Link href="/team"><a className="hover:text-gray-200 transition duration-200">{t('nav.team')}</a></Link></li>
              <li><Link href="/news"><a className="hover:text-gray-200 transition duration-200">{t('nav.news')}</a></Link></li>
              <li><Link href="/contact"><a className="hover:text-gray-200 transition duration-200">{t('nav.contact')}</a></Link></li>
            </ul>
          </div>
          
          {/* Column 4 */}
          <div>
            <h3 className="text-xl font-bold mb-6">{t('footer.contact')}</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mt-1 mr-3" />
                <span>{t('contact.info.addressLine1')}</span>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 mt-1 mr-3" />
                <span>{t('contact.info.phone1')}<br/>{t('contact.info.phone2')}</span>
              </li>
              <li className="flex items-start">
                <Mail className="h-5 w-5 mt-1 mr-3" />
                <span>{t('contact.info.emailAddress')}</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p>{t('footer.copyright').replace('2023', currentYear.toString())}</p>
          <div className="mt-4 md:mt-0 flex space-x-4">
            <a href="#" className="text-sm hover:text-gray-200 transition duration-200">{t('footer.privacy')}</a>
            <a href="#" className="text-sm hover:text-gray-200 transition duration-200">{t('footer.legal')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
