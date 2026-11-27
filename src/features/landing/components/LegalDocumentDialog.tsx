"use client";

import { useState } from "react";
import { X } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

const PRIVACY_POLICY = `
**1. Introduction**

This Privacy Policy explains how Aorbyte Technologies Limited ("Aorbyte", "we", "us" or "our") collects, uses, shares and protects personal data when you use Abio, including our website at abio.site, your Abio profile page, the Abio dashboard, Abio QR codes and the Acard NFC card (together, the "Services").

Aorbyte Technologies Limited is a company registered in Nigeria and is the data controller responsible for your personal data. We process personal data in line with the Nigeria Data Protection Act 2023 (the "NDPA"), the General Application and Implementation Directive issued under it, and any other data protection law that applies to you.

By creating an account, joining our waitlist, ordering an Acard or otherwise using the Services, you confirm that you have read this Privacy Policy. If you do not agree with it, please do not use the Services.

**2. Who this policy applies to**

This policy applies to:

• **Users:** people who create an Abio account and build a profile page;
• **Visitors:** people who view an Abio profile, scan an Abio QR code or tap an Acard;
• **Waitlist members:** people who sign up to our waitlist or receive our updates;
• **Customers:** people who buy an Acard or other Abio product.

**3. Information we collect**

**3.1 Information you give us**

• **Account details:** your name, username (which forms your link, for example abio.site/yourname), email address, phone number and password. We store passwords in encrypted (hashed) form and cannot read them.
• **Profile content:** the content you add to your profile, such as your profile photo, display name, bio, job title, social media handles, website and portfolio links, music, shop or product links, contact details and any other information you choose to publish.
• **Order and delivery details:** your name, delivery address, phone number, email address and order details when you buy an Acard.
• **Waitlist details:** your name, email address and any other details you enter when joining our waitlist.
• **Communications:** messages, feedback, support requests and survey responses you send us.

**3.2 Payment information**

Payments are handled by third-party payment processors. When you pay, your card or bank details go directly to the processor. We do not collect or store your full card number. We receive limited information from the processor, such as your name, the amount paid, the payment reference and whether the payment succeeded.

**3.3 Information we collect automatically**

When you or a visitor use the Services, we automatically collect certain technical and usage information, including:

• IP address, approximate location (city or country level), device type, operating system, browser type and language settings;
• profile views, link clicks, QR code scans and Acard taps, together with the date and time of each event;
• the page or website that referred a visitor to a profile;
• pages viewed, features used and actions taken in the dashboard;
• log and error data that helps us keep the Services working and secure.

We use this information to run the Services and to provide the analytics shown in your dashboard, such as how many people viewed your profile or clicked each link.

**3.4 Information from third parties**

If you sign in with, or connect, a third-party account (for example a social media or Google account), we receive the information that service allows us to receive, such as your name, email address and profile picture. We may also receive information from payment processors and delivery partners about the status of your order.

**4. Your public profile**

Abio is built for sharing. The content you add to your profile is public. Anyone who has your link, scans your QR code or taps your Acard can see it, and it may be found by search engines. Please think carefully before adding personal details such as your phone number, home address or personal email address to your profile. You can edit or remove profile content at any time from your dashboard.

We are not responsible for how other people use information that you have chosen to make public.

**5. How we use your information**

We use personal data to:

• create and manage your account and your abio.site link;
• host and display your profile page and generate your QR code;
• link your Acard to your profile and process, deliver and support your orders;
• provide view, click, scan and tap analytics in your dashboard;
• process payments and prevent fraud;
• send you service messages, such as account verification, security alerts, order updates and changes to our terms;
• send you news, product updates and offers, where you have agreed to receive them or where the law otherwise allows;
• respond to your questions and support requests;
• understand how the Services are used so we can fix problems and build new features;
• detect, prevent and deal with abuse, spam, impersonation, security incidents and breaches of our Terms of Service;
• comply with our legal obligations and enforce our rights.

**6. Legal basis for processing**

We only process personal data where we have a lawful basis under the NDPA. Depending on the activity, we rely on:

• **Contract:** where processing is needed to provide the Services you signed up for or to fulfil your Acard order;
• **Consent:** for example, for marketing emails, optional cookies or where you choose to share certain information. You can withdraw consent at any time without affecting processing that took place before you withdrew it;
• **Legal obligation:** where we must process data to meet tax, accounting, regulatory or other legal requirements;
• **Legitimate interests:** for example, to keep the Services secure, prevent fraud and improve our product, where those interests are not overridden by your rights and freedoms.

**7. How we share your information**

We do not sell your personal data. We share it only as described below:

• **Service providers:** companies that help us run the Services, such as cloud hosting, database, email delivery, analytics, customer support, payment processing and card production and delivery providers. They may only use your data to perform services for us and must protect it;
• **The public:** anyone who views your profile, scans your QR code or taps your Acard will see the content you have published;
• **Legal and safety reasons:** where we believe in good faith that disclosure is required by law, court order or a lawful request from a government or regulatory authority, or is needed to protect the rights, property or safety of Aorbyte, our users or others;
• **Business transfers:** if we are involved in a merger, acquisition, financing, reorganisation or sale of assets, your data may be transferred as part of that transaction. We will tell you before your data becomes subject to a different privacy policy;
• **With your consent:** with other parties where you have asked us to or agreed to it.

**8. International transfers**

Some of our service providers store or process data outside Nigeria. Where personal data is transferred outside Nigeria, we will only do so in line with the NDPA, for example where the recipient country has an adequate level of protection, where appropriate contractual safeguards are in place, or where another lawful basis for the transfer applies.

**9. How long we keep your information**

We keep personal data only for as long as we need it for the purposes set out in this policy. In general:

• account and profile data is kept while your account is active and deleted or anonymised within a reasonable period after you delete your account;
• order and payment records are kept for as long as required by tax and accounting laws;
• analytics data is kept in identifiable form for as long as it is useful to provide dashboard insights, after which it is deleted or aggregated so it no longer identifies anyone;
• waitlist data is kept until the waitlist closes or you ask us to remove you.

We may keep some information for longer where the law requires it or where we need it to resolve disputes, prevent fraud or enforce our agreements.

**10. How we protect your information**

We use reasonable technical and organisational measures to protect personal data, including encryption in transit, hashed passwords, access controls and limiting access to staff and providers who need it. No method of transmission or storage is completely secure, so we cannot guarantee absolute security. Please keep your password safe and tell us straight away if you think your account has been accessed without your permission.

If a personal data breach occurs that is likely to put your rights and freedoms at risk, we will notify the Nigeria Data Protection Commission and, where required, affected users, within the time limits set by law.

**11. Your rights**

Subject to the NDPA and any other law that applies to you, you have the right to:

• be informed about how we use your personal data;
• ask for a copy of the personal data we hold about you;
• ask us to correct personal data that is inaccurate or incomplete;
• ask us to delete your personal data;
• ask us to restrict how we use your personal data;
• object to processing based on our legitimate interests, including profiling, and to direct marketing at any time;
• receive your personal data in a commonly used, machine-readable format and have it sent to another organisation where technically possible;
• withdraw consent at any time where we rely on consent;
• lodge a complaint with the Nigeria Data Protection Commission or the data protection authority in your country.

You can update most of your account and profile information yourself in your dashboard. To exercise any other right, contact us using the details in section 17. We may need to verify your identity before acting on your request. We will respond within the time required by law.

**12. Children**

The Services are not intended for anyone under 18 years of age unless a parent or legal guardian has given consent and supervises their use. We do not knowingly collect personal data from children without that consent. If you believe a child has given us personal data without the consent of a parent or guardian, please contact us and we will delete it.

**13. Cookies and similar technologies**

We use cookies, local storage and similar technologies to keep you signed in, remember your settings, keep the Services secure and understand how the Services are used. Some are strictly necessary for the Services to work. Others, such as analytics cookies, help us improve the Services. Where the law requires it, we will ask for your consent before setting non-essential cookies. You can also block or delete cookies through your browser settings, but some parts of the Services may not work properly if you do.

**14. Third-party links and services**

Abio profiles link to third-party websites and platforms, such as social media networks, messaging apps, music services and online shops. When you or a visitor follow one of those links, the third party's own privacy policy applies. We do not control and are not responsible for how those third parties handle personal data.

**15. Marketing**

We may send you emails or messages about new features, offers and Abio news. You can opt out at any time by using the unsubscribe link in the message or by contacting us. Even if you opt out of marketing, we will still send you service messages about your account and orders.

**16. Changes to this policy**

We may update this Privacy Policy from time to time. When we do, we will change the "Last updated" date at the top. If the changes are significant, we will let you know by email or through a notice in the Services before they take effect. Your continued use of the Services after a change means you accept the updated policy.

**17. Contact us**

If you have any questions about this Privacy Policy or how we handle your personal data, or if you want to exercise your rights, please contact us:

Aorbyte Technologies Limited

Address: 66 Obayan Street

Email: support@abio.site

Website: abio.site`;

const TERMS_AND_CONDITIONS = `
TERMS AND CONDITIONS OF SERVICE

PLEASE READ THESE TERMS AND CONDITIONS CAREFULLY BEFORE ACCESSING OR USING THE ABIO PLATFORM, WEBSITE, OR ANY ASSOCIATED SERVICES. BY CLICKING "I AGREE," REGISTERING AN ACCOUNT, OR OTHERWISE ACCESSING THE SERVICE, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE LEGALLY BOUND BY THESE TERMS. IF YOU DO NOT AGREE, YOU MUST NOT ACCESS OR USE THE SERVICE.

**1. Parties and Definitions**

These Terms and Conditions ("Agreement") constitute a legally binding contract between you ("User," "you," or "your") and Abio Technologies Limited ("Abio," "Company," "we," "us," or "our"), the entity that owns and operates the Abio platform and associated services.

• **Platform:** The Abio website, web application, mobile application, and any associated software, APIs, or digital infrastructure operated by Abio.

• **Service(s):** All features, functionalities, tools, and content made available to Users through the Platform.

• **Account:** A registered user profile created by or on behalf of an individual or legal entity to access the Service.

• **Content:** Any data, text, files, images, software, audio, video, or other material uploaded to, processed through, or generated by the Service.

• **User Data:** Personal and non-personal data submitted, uploaded, or otherwise provided by the User in connection with use of the Service.

• **Intellectual Property:** All patents, trademarks, trade secrets, copyrights, and other proprietary rights owned by or licensed to Abio.

• **Subscription:** A paid or trial-period access plan granting access to specified features of the Service.

• **Third-Party Integrations:** External services, platforms, or APIs that the User connects to the Platform.

**2. Acceptance and Eligibility**

**2.1 Eligibility**

To use the Service, you must: (a) be at least eighteen (18) years of age, or the age of majority in your jurisdiction if higher; (b) have the legal capacity to enter into binding contracts; and (c) not be prohibited from receiving the Service under applicable law, including applicable sanctions regulations.

**2.2 Entity Use**

If you are accessing the Service on behalf of a company, organisation, or other legal entity, you represent and warrant that you have the authority to bind that entity to this Agreement. In such cases, "you" refers to both the individual and the entity.

**2.3 Continuous Acceptance**

Your continued use of the Service following any modification to this Agreement constitutes acceptance of the modified terms. It is your responsibility to review this Agreement periodically.

**3. Account Registration and Security**

**3.1 Registration Requirements**

To access certain features of the Service, you must register for an Account. You agree to provide accurate, current, and complete information during registration and to update such information promptly as necessary.

**3.2 Credential Security**

You are solely responsible for: (a) maintaining the confidentiality of your login credentials; (b) all activity occurring under your Account; and (c) immediately notifying Abio of any unauthorized use of your Account or any security breach at security@abio.site.

**3.3 Account Restrictions**

You may not: (a) create multiple Accounts to circumvent restrictions or bans; (b) sell, transfer, or sublicense your Account; or (c) use automated means to create or access Accounts without prior written consent.

**3.4 Abio's Rights**

Abio reserves the right to suspend, disable, or terminate any Account at its sole discretion, including in cases of suspected fraudulent activity, policy violation, or non-payment of fees, with or without prior notice where legally permissible.

**4. Description of Service**

**4.1 Service Scope**

Abio provides a digital networking and business identity platform that enables users to create, manage, and share professional profiles, contact information, social links, and business details through NFC enabled products and personalized profile pages. The Platform is designed to simplify networking, lead generation, and professional interactions through seamless digital contact exchange. Features and functionality available to a User may vary depending on their Subscription tier and selected services.

**4.2 Service Modifications**

Abio reserves the right to modify, suspend, or discontinue any aspect of the Service, temporarily or permanently, with or without notice. Abio shall not be liable for any modification, suspension, or discontinuation except as otherwise specified in a separate service level agreement.

**4.3 Beta Features**

Abio may offer access to beta, preview, or experimental features from time to time. Such features are provided "as-is" without warranty and may be discontinued at any time. Use of beta features is at your sole risk.

**5. Subscriptions and Payment**

**5.1 Subscription Plans**

Access to certain features requires purchase of a Subscription. Current pricing, plan features, and billing cycles are published on the Platform and are subject to change with reasonable notice.

**5.2 Payment Terms**

By subscribing, you authorize Abio or its designated payment processor to charge your selected payment method on the applicable billing cycle. All fees are stated in the currency specified at checkout and are inclusive of applicable taxes unless otherwise stated.

**5.3 Automatic Renewal**

Subscriptions automatically renew at the end of each billing period unless cancelled by the User at least 24 hours before the renewal date through Account settings or by contacting billing@abio.site.

**5.4 Refund Policy**

Fees paid are generally non-refundable except where required by applicable law or as expressly stated in Abio's Refund Policy, available on the Platform. Trial periods, where offered, may be subject to additional conditions.

**5.5 Taxes**

You are responsible for all taxes, duties, and levies imposed by any governmental authority in connection with your use of the Service, excluding taxes on Abio's net income.

**6. Acceptable Use Policy**

**6.1 Permitted Use**

You may use the Service solely for lawful purposes and in accordance with this Agreement, applicable laws and regulations, and any guidelines published by Abio.

**6.2 Prohibited Conduct**

You must not use the Service to:

• Upload, transmit, or distribute content that is unlawful, defamatory, obscene, fraudulent, or infringes any third-party rights.

• Engage in activity that interferes with, disrupts, or places an unreasonable burden on the Platform or its associated infrastructure.

• Attempt to gain unauthorized access to any part of the Platform, other Accounts, or connected systems.

• Reverse engineer, decompile, disassemble, or otherwise attempt to derive source code or underlying models from the Platform.

• Use automated scripts, bots, or other tools to scrape, crawl, or extract data from the Platform without prior written authorization.

• Transmit malware, spyware, ransomware, or any other malicious software.

• Violate any applicable export control or sanctions laws.

• Circumvent, disable, or interfere with security-related features of the Platform.

• Process biometric data, protected health information (PHI), or other Sensitive Personal Data categories without a signed Data Processing Agreement (DPA) with Abio.

**6.3 Monitoring**

Abio reserves the right, but not the obligation, to monitor use of the Platform to ensure compliance with this Agreement. Abio may investigate suspected violations and take appropriate action, including Account suspension and referral to law enforcement.

**7. User Content and Data**

**7.1 User Ownership**

You retain all ownership rights in User Data that you submit to the Service. Nothing in this Agreement transfers ownership of your User Data to Abio.

**7.2 License to Abio**

By submitting User Data to the Service, you grant Abio a non-exclusive, worldwide, royalty-free, sublicensable license to use, process, reproduce, display, and transmit your User Data solely to the extent necessary to operate, maintain, and improve the Service and to comply with applicable law. This license terminates upon deletion of your User Data or termination of your Account.

**7.3 User Responsibility**

You are solely responsible for ensuring that: (a) you have all necessary rights to submit User Data to the Platform; (b) User Data does not violate any third-party rights or applicable law; and (c) all required notifications, consents, or obligations have been fulfilled prior to submission.

**7.4 Content Removal**

Abio reserves the right to remove any User Data that it determines, in its sole discretion, violates this Agreement or applicable law, without prior notice.

**8. Intellectual Property Rights**

**8.1 Abio Ownership**

The Platform, Service, and all associated technology, software, algorithms, models, interfaces, documentation, branding, and Intellectual Property are and remain the exclusive property of Abio and its licensors. No rights are granted to you other than those expressly stated in this Agreement.

**8.2 License to User**

Subject to your compliance with this Agreement and payment of applicable fees, Abio grants you a limited, non-exclusive, non-transferable, revocable license to access and use the Service for your internal business or personal purposes during your Subscription term.

**8.3 Feedback**

If you provide Abio with suggestions, ideas, or feedback regarding the Service, you grant Abio an irrevocable, royalty-free, worldwide, perpetual license to use and incorporate such Feedback without restriction or compensation to you.

**8.4 Trademark Restrictions**

You may not use Abio's name, logo, or trademarks in any manner that suggests sponsorship, endorsement, or affiliation without Abio's prior written consent.

**9. Third-Party Services, Links, and Integrations**

The Service may integrate with or contain links to third-party websites, APIs, or services. Abio does not endorse and is not responsible for the availability, accuracy, privacy practices, or content of Third-Party Services. Your use of Third-Party Services is subject to their respective terms and policies. Abio shall not be liable for any loss or damage arising from your interaction with Third-Party Services.

**10. Confidentiality**

Each party agrees to hold the other party's confidential Information in strict confidence and not to disclose such information to third parties without prior written consent, except as required by law or court order. "Confidential Information" means any non-public information designated as confidential or that a reasonable person would recognize as confidential given the nature and circumstances of disclosure. This obligation survives termination of the Agreement for three (3) years.

**11. Disclaimer of Warranties**

TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, ACCURACY, OR UNINTERRUPTED OPERATION. ABIO DOES NOT WARRANT THAT: (A) THE SERVICE WILL MEET YOUR REQUIREMENTS; (B) THE SERVICE WILL BE AVAILABLE, UNINTERRUPTED, TIMELY, OR ERROR-FREE; OR (C) ANY ERRORS OR DEFECTS WILL BE CORRECTED.

**12. Limitation of Liability**

**12.1 Exclusion of Consequential Damages**

TO THE FULLEST EXTENT PERMITTED BY LAW, NEITHER ABIO NOR ITS AFFILIATES, OFFICERS, DIRECTORS, EMPLOYEES, OR LICENSORS SHALL BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, BUSINESS OPPORTUNITIES, OR GOODWILL, ARISING FROM OR RELATED TO YOUR USE OF THE SERVICE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.

**12.2 Liability Cap**

ABIO'S TOTAL CUMULATIVE LIABILITY TO YOU FOR ALL CLAIMS ARISING UNDER OR RELATED TO THIS AGREEMENT SHALL NOT EXCEED THE GREATER OF: (A) THE TOTAL FEES PAID BY YOU TO ABIO IN THE TWELVE (12) MONTHS IMMEDIATELY PRECEDING THE EVENT GIVING RISE TO THE CLAIM; OR (B) ONE HUNDRED THOUSAND NGN NAIRA (NGN #100.000.00).

**12.3 Essential Basis**

You acknowledge that Abio has set its pricing and entered into this Agreement in reliance on the limitations of liability stated herein, which form an essential basis of the bargain between the parties.

**13. Indemnification**

You agree to indemnify, defend, and hold harmless Abio and its affiliates, officers, directors, employees, agents, and licensors from and against any claims, liabilities, damages, losses, costs, and expenses (including reasonable legal fees) arising out of or relating to: (a) your use of the Service; (b) your violation of this Agreement or applicable law; (c) your violation of any third-party rights; or (d) any User Data submitted by you.

**14. Governing Law and Dispute Resolution**

**14.1 Governing Law**

This Agreement shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria, without regard to its conflict-of-laws principles.

**14.2 Informal Resolution**

Before initiating formal legal proceedings, you agree to first contact Abio at legal@abio.io to attempt good-faith resolution. The parties shall have thirty (30) days from the date of notice to attempt resolution before proceeding to formal dispute mechanisms.

**14.3 Arbitration**

If informal resolution fails, any dispute, controversy, or claim arising out of or relating to this Agreement shall be submitted to binding arbitration administered under the rules of the Lagos Court of Arbitration (LCA). The arbitration shall be conducted in English in Lagos, Nigeria. The arbitral award shall be final and binding.

**14.4 Class Action Waiver**

YOU AGREE TO RESOLVE DISPUTES WITH ABIO ON AN INDIVIDUAL BASIS ONLY. YOU WAIVE ANY RIGHT TO PARTICIPATE IN CLASS ACTIONS, CLASS-WIDE ARBITRATIONS, OR OTHER REPRESENTATIVE PROCEEDINGS.

**14.5 Injunctive Relief**

Notwithstanding the foregoing, Abio may seek injunctive or other equitable relief in any court of competent jurisdiction to protect its Intellectual Property or Confidential Information.

**15. Term and Termination**

**15.1 Term**

This Agreement commences on the date you first access the Service and continues until terminated by either party in accordance with this Section.

**15.2 Termination by User**

You may terminate this Agreement at any time by cancelling your Subscription and ceasing use of the Service. Termination does not entitle you to a refund except as stated in Section 5.4.

**15.3 Termination by Abio**

Abio may suspend or terminate your access immediately, with or without notice, if: (a) you breach any provision of this Agreement; (b) continued access poses a security or legal risk; (c) you fail to pay applicable fees; or (d) Abio discontinues the Service.

**15.4 Effect of Termination**

Upon termination: (a) all licenses granted under this Agreement immediately terminate; (b) you must cease all use of the Platform; (c) Abio may delete your Account and User Data subject to the Privacy Policy and applicable retention obligations; and (d) all accrued payment obligations survive.

**15.5 Surviving Provisions**

Sections 7, 8, 10, 11, 12, 13, 14, and 16 shall survive termination of this Agreement.

**16. General Provisions**

**16.1 Entire Agreement**

This Agreement, together with Abio's Privacy Policy and any applicable Subscription Order Form or Data Processing Agreement, constitutes the entire agreement between you and Abio with respect to the Service and supersedes all prior discussions, representations, and agreements.

**16.2 Amendments**

Abio reserves the right to modify this Agreement at any time. Material changes will be communicated at least fifteen (15) days in advance via email or prominent notice on the Platform. Your continued use after the effective date constitutes acceptance.

**16.3 Waiver and Severability**

Abio's failure to enforce any right or provision is not a waiver of that right. If any provision is found invalid or unenforceable, it shall be modified to the minimum extent necessary to make it enforceable, with the remainder in full force and effect.

**16.4 Force Majeure**

Abio shall not be liable for delays or failures in performance resulting from causes beyond its reasonable control, including natural disasters, acts of government, labour disputes, power failures, cyberattacks, or telecommunications failures.

**16.5 Assignment**

You may not assign or transfer your rights or obligations under this Agreement without Abio's prior written consent. Abio may freely assign this Agreement, including in connection with a merger, acquisition, or sale of assets.

**16.6 Notices**

All legal notices to Abio must be sent in writing to legal@abio.io or to Abio Technologies Limited, Lagos, Nigeria. Abio may send notices to you at the email address associated with your Account.

**16.7 No Third-Party Beneficiaries**

This Agreement is for the sole benefit of the parties hereto and does not create any rights in any third party.

**17. Contact Information**

For questions, concerns, or notices regarding these Terms, please contact Abio at:

Contact Channel General Enquiries contact-us@abio.site Legal & Compliance legal@abio.site Billing & Payments billing@abio.site Security Incidents security@abio.site Mailing Address    Abio Technologies Limited, Lagos, Nigeria

© 2026 Abio Technologies Limited. All rights reserved.
`;

function renderInline(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={index}>{part.slice(2, -2)}</strong>
    ) : (
      part
    ),
  );
}

export function LegalDocumentDialog({
  title,
  triggerLabel,
  content,
}: {
  title: string;
  triggerLabel: string;
  content: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-left transition-colors duration-200 hover:text-white"
      >
        {triggerLabel}
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className="max-h-[85dvh] w-[calc(100%-2rem)] max-w-3xl gap-0 overflow-hidden border-2 border-[#331400] bg-[#FEF4EA] p-0 text-[#331400] dark:border-[#F5EEE4] dark:bg-[#1C1611] dark:text-[#F5EEE4]"
        >
          <DialogHeader className="gap-3 border-b border-[#331400]/15 px-6 py-4 dark:border-[#F5EEE4]/15 sm:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex shrink-0 items-center gap-[1px]" aria-label="Abio">
                <img
                  src="/icons/A.bio.svg"
                  alt=""
                  width={32}
                  height={32}
                  className="h-8 w-8 object-contain"
                />
                <span className="text-2xl font-medium tracking-wide">bio</span>
              </div>
              <DialogClose
                render={
                  <button
                    type="button"
                    aria-label={`Close ${title}`}
                    className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#331400]/20 transition-colors hover:bg-[#331400]/5 dark:border-[#F5EEE4]/20 dark:hover:bg-white/10"
                  />
                }
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </DialogClose>
            </div>
            <DialogTitle className="mb-0 pr-8 text-xl font-bold sm:text-2xl">
              {title}
            </DialogTitle>
          </DialogHeader>
          <article className="no-scrollbar max-h-[calc(85dvh-8rem)] overflow-y-auto px-6 py-5 text-sm leading-7 sm:px-8">
            {content.split("\n").map((line, index) => {
              if (!line.trim()) return null;
              if (/^\*\*\d+(?:\.\d+)?\.?\s+.+\*\*$/.test(line)) {
                return (
                  <h3 key={index} className="mb-2 mt-6 text-base font-bold first:mt-0">
                    {line.slice(2, -2)}
                  </h3>
                );
              }
              if (line.startsWith("• ")) {
                return (
                  <p key={index} className="mb-2 pl-4">
                    <span className="-ml-4 mr-2">•</span>
                    {renderInline(line.slice(2))}
                  </p>
                );
              }
              if (line.startsWith("Last updated:")) {
                return (
                  <p key={index} className="mb-4 text-xs text-[#666464] dark:text-[#F5EEE4]/60">
                    {line}
                  </p>
                );
              }
              return <p key={index} className="mb-3">{renderInline(line)}</p>;
            })}
          </article>
        </DialogContent>
      </Dialog>
    </>
  );
}

export { PRIVACY_POLICY, TERMS_AND_CONDITIONS };
