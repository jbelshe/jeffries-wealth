import React from 'react';
import { ExternalLink, FileText, Lock } from 'lucide-react';
import logoUrl from "../assets/logo.svg";

const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-950 border-t border-stone-800 pt-16 pb-24 text-sm">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-12 md:gap-32 mb-16 border-b border-stone-800 pb-12">
          
          {/* Brand Column */}
          <div className="text-center md:text-left max-w-md">
            <div className="flex justify-center md:justify-start items-center gap-2 mb-4">
               <img src={logoUrl} alt="Logo" className="h-8 w-auto text-emerald-500 -mt-2" />
               <span className="text-xl font-bold text-stone-200">Jeffries Wealth</span>
            </div>
            <p className="text-stone-500 mb-6">
              Modern financial planning for the accumulation phase. 
              Specializing in equity compensation, advanced tax strategy, and subscription-based advice.
            </p>
            <div className="text-stone-600 text-xs">
              &copy; {new Date().getFullYear()} Jeffries Wealth Management, LLC. All rights reserved.
            </div>
          </div>

          {/* Important Links Column */}
          <div className="text-center md:text-left">
             <h4 className="text-stone-200 font-bold mb-6">Important Links</h4>
             <ul className="space-y-4 inline-block text-left">
                <li>
                  <a 
                    href="https://adviserinfo.sec.gov/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-stone-400 hover:text-emerald-500 transition-colors group"
                  >
                    <FileText size={16} />
                    <span>Form ADV (IAPD)</span>
                    <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
                <li>
                  <a 
                    href="./public/assets/Privacy-Policy.pdf" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-stone-400 hover:text-emerald-500 transition-colors group"
                  >
                    <Lock size={16} />
                    <span>Privacy Statement</span>
                    <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
             </ul>
          </div>
        </div>

        {/* Legal Disclosures */}
        <div className="text-[10px] leading-relaxed text-stone-600 text-justify space-y-4 max-w-5xl mx-auto">
          <p>
            Jeffries Wealth Management, LLC (Jeffries Wealth Management) and its representatives are in compliance with the current filing requirements imposed upon registered investment advisors by those jurisdictions in which Jeffries Wealth Management maintains clients. Jeffries Wealth Management may only transact business in those states in which it is registered, or qualifies for an exemption or exclusion from registration requirements. Jeffries Wealth Management's website is limited to the dissemination of general information pertaining to its advisory services, together with access to additional investment related information, publications, and links. Accordingly, the publication of Jeffries Wealth Management's website on the Internet should not be construed by any consumer and/or prospective client as Jeffries Wealth Management's solicitation to effect, or attempt to effect transactions in securities, or the rendering of personalized investment advice for compensation, over the Internet. Any subsequent, direct communication by Jeffries Wealth Management with a prospective client shall be conducted by a representative that is either registered or qualifies for an exemption or exclusion from registration in the state where the prospective client resides. For information pertaining to the registration status of Jeffries Wealth Management, please contact the SEC, FINRA or the state securities regulators for those states in which Jeffries Wealth Management maintains a filing.
          </p>

          <p>
            A copy of Jeffries Wealth Management's current written disclosure statement discussing Jeffries Wealth Management's business operations, service, and fees is available from Jeffries Wealth Management upon written request. Jeffries Wealth Management does not make any representations or warranties as to the accuracy, timeliness, suitability, completeness, or relevance of any information prepared by any unaffiliated third party, whether linked to Jeffries Wealth Management's website or Incorporated herein, and takes no responsibility therefor. All such information is provided solely for convenience purposes only and all users thereof should be guided accordingly.
          </p>

          <p>
            Past performance may not be indicative of future results. Therefore, no current or prospective client should assume that future performance of any specific investment or investment strategy (Including the investments and/or investment strategies recommended or undertaken by Jeffries Wealth Management) made reference to directly or indirectly by Jeffries Wealth Management in its website, or indirectly by a link to an unaffiliated third party website, will be profitable or equal the corresponding indicated performance level(s). Different types of investments involve varying degrees of risk, and there can be no assurance that any specific investment will either be suitable or profitable for a client or prospective client’s investment portfolio.
          </p>

          <p>
            Certain portions of Jeffries Wealth Management's website (i.e. newsletters, articles, commentaries, etc.) may contain a discussion of, and/or provide access to, Jeffries Wealth Management's (and those of other investment and non-investment professionals) positions and/or recommendations of a specific prior date. Due to various factors, including changing market conditions, such discussion may no longer be reflective of current position(s) and/or recommendations(s). Moreover, no client or prospective client should assume that any such discussion serves as the receipt of, or a substitute for, personalized advice from Jeffries Wealth Management, or form any other investment professional. Jeffries Wealth Management is neither an attorney nor an accountant, and no portion of the website content should be interpreted as legal, accounting or tax advice.
          </p>

          <p>
            To the extent that any client or prospective client utilizes any economic calculator or similar device contained within or linked to Jeffries Wealth Management's website, the client and/or prospective client acknowledges and understands that the information resulting from the use of any such calculator/device, is not, and should not be construed, in any manner whatsoever, as the receipt of, or a substitute for, personalized individual advice from Jeffries Wealth Management, or from any other investment professional.
          </p>

          <p>
            Jeffries Wealth Management may provide links from this Site to a non- Jeffries Wealth Management Website or permit a link from a non- Jeffries Wealth Management Website to this Site. Such links are for your convenience only and do not imply any affiliation with, or an endorsement, authorization, sponsorship or promotion of the non- Jeffries Wealth Management website or its owner Jeffries Wealth Management does not control or review any link, and accepts no responsibility for the content, products or services provided at these linked websites. If you decide to access such non- Jeffries Wealth Management Websites, you do so solely at your own risk and you should be aware that non- Jeffries Wealth Management websites are governed by their own terms and conditions and privacy policies. Links to this site may be made only with the permission of Jeffries Wealth Management A link to this Site may be permitted in Jeffries Wealth Management's discretion, where, without limitation, such link (a) is to this site’s homepage, (b) clearly informs users that the link is to the Jeffries Wealth Management Website, (c) does not imply any affiliation, endorsement, sponsorship or other relationship between the link Jeffries Wealth Management Website or the Website owner and Jeffries Wealth Management, (d) delivers this site’s Content without framing or similar environment, and (e) maintains the integrity of this site’s layout, content and look and feel. Jeffries Wealth Management reserves the right in its sole discretion to refuse permission or to cancel permission to link to this site at any time.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;