import React from 'react';
import { Sprout, Heart, ShieldCheck, Phone, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();
  return (
    <footer className="bg-agri-dark text-agri-pale pt-16 pb-12 border-t border-agri-primary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-agri-primary/40">
          
          {/* Col 1 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-agri-light flex items-center justify-center text-agri-dark">
                <Sprout className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                KISSAN<span className="text-agri-accent">CONNECT</span>
              </span>
            </div>
            <p className="text-sm text-agri-pale/80 leading-relaxed">
              "{t('common.tagline')}"<br />
              {t('footer.about')}
            </p>
            <div className="flex items-center space-x-2 text-xs text-agri-accent font-semibold pt-2">
              <ShieldCheck className="w-4 h-4" /> Verified 100% Intermediary-Free Platform
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 tracking-wide uppercase text-xs">{t('footer.quick_links')}</h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li><Link to="/marketplace" className="hover:text-agri-accent transition-colors">{t('navbar.shop_produce')}</Link></li>
              <li><Link to="/bulk-requests" className="hover:text-agri-accent transition-colors">{t('navbar.bulk_requests')}</Link></li>
              <li><Link to="/register?role=FARMER" className="hover:text-agri-accent transition-colors">{t('navbar.sell_produce')}</Link></li>
              <li><a href="/#ai-forecasting" className="hover:text-agri-accent transition-colors">{t('common.ai_forecast')}</a></li>
              <li><a href="/#smart-logistics" className="hover:text-agri-accent transition-colors">{t('common.smart_logistics')}</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 tracking-wide uppercase text-xs">Platform Roles</h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li><Link to="/login" className="hover:text-agri-accent transition-colors">{t('common.farmer')} {t('common.dashboard')}</Link></li>
              <li><Link to="/login" className="hover:text-agri-accent transition-colors">{t('common.consumer')} Portal</Link></li>
              <li><Link to="/login" className="hover:text-agri-accent transition-colors">{t('common.bulk_buyer')} Hub</Link></li>
              <li><Link to="/login" className="hover:text-agri-accent transition-colors">{t('common.admin')} Analytics</Link></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 tracking-wide uppercase text-xs">Smart India Hackathon 2026</h4>
            <p className="text-xs text-agri-pale/70 mb-3 leading-relaxed">
              Problem Code: SIH26033<br />
              Title: Farmer-to-Consumer Platform<br />
              Eliminating intermediaries, boosting farmer earnings & providing AI intelligence.
            </p>
            <div className="space-y-2 text-xs text-agri-pale/90">
              <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-agri-accent" /> Madanapalle, AP & Nashik, MH Hubs</div>
              <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-agri-accent" /> +91 1800-KISSANCONNECT</div>
              <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-agri-accent" /> support@kissanconnect.in</div>
            </div>
          </div>

        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-agri-pale/60 font-medium">
          <p>© 2026 KISSANCONNECT. {t('footer.rights')}</p>
          <p className="flex items-center gap-1 mt-4 md:mt-0">
            Crafted with <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" /> for Indian Agriculture.
          </p>
        </div>
      </div>
    </footer>
  );
};
