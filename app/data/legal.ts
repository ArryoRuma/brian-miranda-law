import { CONTACT } from "~/data/site";

export type LegalPageKey =
  "privacy" | "cookies" | "disclaimer" | "accessibility";

export const LEGAL_PAGES = {
  privacy: {
    title: "Privacy Policy",
    description:
      "Read how Miranda Law may handle information submitted through this website and how to contact the firm with privacy questions.",
    updated: "August 14, 2026",
    intro:
      "This policy describes the general categories of information that may be processed through the Miranda Law website. It should be reviewed again when the secure intake, scheduling, analytics, and hosting services are finalized.",
    sections: [
      {
        title: "Information you choose to provide",
        paragraphs: [
          "You may choose to provide contact information and a general description of your legal needs when communicating with the firm. Do not submit confidential, highly sensitive, or time-sensitive information until Miranda Law confirms that the communication method is appropriate and that the firm represents you.",
        ],
      },
      {
        title: "Website and analytics information",
        paragraphs: [
          "The website and its service providers may process technical information such as browser type, device type, referring page, pages visited, approximate location, and interaction data for security, performance, and website improvement.",
        ],
      },
      {
        title: "How information may be used",
        paragraphs: [],
        bullets: [
          "Respond to inquiries and help schedule consultations",
          "Evaluate whether the firm can consider a matter",
          "Operate, secure, and improve the website",
          "Maintain records and comply with legal or professional obligations",
          "Prevent misuse, fraud, or threats to the website and its users",
        ],
      },
      {
        title: "Service providers and legal requirements",
        paragraphs: [
          "Information may be processed by service providers that support hosting, communications, scheduling, analytics, security, or intake. Information may also be disclosed when required by law, court process, professional obligation, or a good-faith need to protect rights and safety.",
        ],
      },
      {
        title: "Questions and requests",
        paragraphs: [
          `Questions about this policy may be sent to ${CONTACT.email}. The availability of particular privacy rights depends on the law that applies to the request.`,
        ],
      },
    ],
  },
  cookies: {
    title: "Cookie Notice",
    description:
      "Learn how Miranda Law's website may use essential storage and limited analytics technologies.",
    updated: "August 14, 2026",
    intro:
      "Cookies and similar browser technologies can help a website function, remember preferences, measure performance, and protect against misuse.",
    sections: [
      {
        title: "Essential technologies",
        paragraphs: [
          "Essential technologies may be used when necessary to deliver pages, maintain security, remember a user choice, or support a requested feature. Blocking them may affect how parts of the website work.",
        ],
      },
      {
        title: "Analytics",
        paragraphs: [
          "The website may use privacy-conscious analytics to understand aggregate traffic and page usage. The final analytics configuration and retention settings should be confirmed before launch.",
        ],
      },
      {
        title: "Managing browser storage",
        paragraphs: [
          "Most browsers allow you to delete or block cookies and other stored website data. Those controls are available in the privacy or site-settings area of your browser.",
        ],
      },
      {
        title: "Updates",
        paragraphs: [
          "This notice may be updated when the website's hosting, analytics, intake, or scheduling services change. The updated date above identifies the current version.",
        ],
      },
    ],
  },
  disclaimer: {
    title: "Website Disclaimer",
    description:
      "Read the Miranda Law website disclaimer concerning general information, attorney-client relationships, communications, and results.",
    updated: "August 14, 2026",
    intro:
      "This website provides general information about Miranda Law and selected legal topics. It is not a substitute for advice from an attorney who has reviewed your circumstances.",
    sections: [
      {
        title: "No legal advice",
        paragraphs: [
          "Website content is educational and may not reflect every legal development, exception, deadline, or fact that could affect a matter. Do not act or refrain from acting solely because of information on this website.",
        ],
      },
      {
        title: "No attorney-client relationship",
        paragraphs: [
          "Viewing the website, using a questionnaire, sending a message, or speaking with the office does not by itself create an attorney-client relationship. Representation begins only after Miranda Law confirms acceptance and the required agreement is completed.",
        ],
      },
      {
        title: "Communications and deadlines",
        paragraphs: [
          "Do not send confidential information until the firm confirms that it is appropriate to do so. Do not rely on an unconfirmed website, email, text, or voicemail communication to protect a filing date, court date, response period, or other deadline.",
        ],
      },
      {
        title: "Jurisdiction and availability",
        paragraphs: [
          "The availability of legal services depends on jurisdiction, the facts, timing, conflicts, and the firm's acceptance of the matter. Website content is not intended to advertise services where doing so would violate applicable professional rules.",
        ],
      },
      {
        title: "No guarantee of results",
        paragraphs: [
          "Descriptions of services, examples, or past matters do not guarantee a particular outcome. Legal results depend on the facts, law, evidence, decision-makers, and other circumstances of each matter.",
        ],
      },
    ],
  },
  accessibility: {
    title: "Accessibility Statement",
    description:
      "Read Miranda Law's website accessibility statement and find contact information for assistance accessing website content.",
    updated: "August 14, 2026",
    intro:
      "Miranda Law is working to provide a website that is usable by people with a wide range of abilities, devices, browsers, and assistive technologies.",
    sections: [
      {
        title: "Our approach",
        paragraphs: [
          "The website is designed with semantic headings, keyboard-accessible controls, visible focus states, descriptive links, responsive layouts, and text alternatives for meaningful images. Accessibility will be included in ongoing content and quality reviews.",
        ],
      },
      {
        title: "Need assistance?",
        paragraphs: [
          `If you have difficulty accessing content or completing a task, contact the office at ${CONTACT.phoneDisplay} or ${CONTACT.email}. Please describe the page, feature, and assistance you need.`,
        ],
      },
      {
        title: "Feedback",
        paragraphs: [
          "Accessibility is an ongoing process. Feedback about barriers helps the firm prioritize improvements as the website and its intake tools evolve.",
        ],
      },
    ],
  },
} as const;
