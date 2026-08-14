import type { PageSectionContent } from "@/components/site/PageSections";

export type FaqContent = {
  question: string;
  answer: string;
};

export type SitePageContent = {
  path: string;
  title: string;
  metaDescription: string;
  hero: {
    eyebrow: string;
    title: string;
    accent?: string;
    lead: string;
    image?: string;
    imageAlt?: string;
    secondaryHref?: string;
    secondaryLabel?: string;
  };
  sections: readonly PageSectionContent[];
  faqs?: readonly FaqContent[];
  finalCta?: {
    title: string;
    body: string;
  };
};

export const ESTATE_PLANNING_PAGE: SitePageContent = {
  path: "/estate-planning",
  title: "Estate Planning in North Jersey",
  metaDescription:
    "Understand wills, trusts, powers of attorney, and health care directives with clear, multilingual estate-planning guidance from Miranda Law.",
  hero: {
    eyebrow: "Estate planning for North Jersey families",
    title: "Make the important decisions",
    accent: "before someone else has to.",
    lead: "A thoughtful estate plan brings your wishes, decision-makers, and essential documents into one clear framework. Miranda Law helps families build that framework in English, Spanish, and Portuguese.",
    secondaryHref: "/resources/estate-planning-checklist",
    secondaryLabel: "Use the planning checklist",
  },
  sections: [
    {
      eyebrow: "Why planning matters",
      title: "Estate planning is about people as much as property.",
      body: [
        "An estate plan can give the people you trust useful direction if you die or become unable to make decisions. It can also reduce the number of urgent choices your family must make during an already difficult time.",
        "The right documents depend on your family, assets, responsibilities, and goals. The work begins by understanding those facts—not by reaching for a one-size-fits-all package.",
      ],
    },
    {
      eyebrow: "What a plan can do",
      title: "Put your decisions in writing.",
      tone: "sand",
      bullets: [
        "Explain how you want property handled after your death.",
        "Nominate the people you want to manage your estate and carry out your instructions.",
        "Choose someone to address financial and legal matters if you cannot act for yourself.",
        "Name a health care representative and communicate medical preferences.",
        "Create practical guidance for children, dependents, caregivers, and loved ones.",
        "Coordinate existing documents after marriage, divorce, a birth, a death, retirement, or a major financial change.",
      ],
    },
    {
      id: "services",
      eyebrow: "Core documents",
      title: "The pieces of a coordinated estate plan.",
      cards: [
        {
          title: "Wills",
          body: "State how property should be distributed, nominate an executor, and document other important wishes.",
          href: "/estate-planning/wills",
        },
        {
          title: "Trusts",
          body: "Create a structure for holding, managing, and transferring selected assets under written terms.",
          href: "/estate-planning/trusts",
        },
        {
          title: "Powers of Attorney",
          body: "Authorize a trusted person to handle defined financial or legal matters on your behalf.",
          href: "/estate-planning/powers-of-attorney",
        },
        {
          title: "Health Care Directives",
          body: "Choose a health care representative and communicate treatment preferences for a time when you cannot decide for yourself.",
          href: "/estate-planning/health-care-directives",
        },
      ],
    },
    {
      eyebrow: "How it works together",
      title: "Different questions call for different documents.",
      tone: "blue",
      cards: [
        {
          title: "Your wishes and property",
          body: "A will—and, when appropriate, a trust—can address how selected assets should be managed and transferred.",
        },
        {
          title: "Financial incapacity",
          body: "A power of attorney can identify who may act for you and define the authority that person receives.",
        },
        {
          title: "Medical incapacity",
          body: "A health care directive can identify your representative and preserve guidance about treatment decisions.",
        },
      ],
    },
    {
      eyebrow: "Who planning is for",
      title: "You do not need to be wealthy to need a plan.",
      bullets: [
        "Parents and guardians of minor children",
        "Homeowners and people with financial accounts or personal property",
        "Married and unmarried couples",
        "Business owners and independent professionals",
        "People preparing for retirement",
        "Adults helping parents or caring for other relatives",
        "Anyone whose family, health, assets, or responsibilities have recently changed",
      ],
    },
    {
      id: "process",
      eyebrow: "The Miranda Law process",
      title: "A practical route from questions to signed documents.",
      tone: "sand",
      steps: [
        {
          title: "Schedule a free consultation",
          body: "Start with a conversation about your family, existing documents, concerns, and goals.",
        },
        {
          title: "Review the planning options",
          body: "Brian explains the available approaches in plain language and identifies the questions that matter most.",
        },
        {
          title: "Prepare and review",
          body: "The firm drafts the agreed documents and walks through what they mean before anything is finalized.",
        },
        {
          title: "Sign and carry the plan forward",
          body: "Complete the required formalities, understand where documents should be kept, and know when a future review may be useful.",
        },
      ],
    },
    {
      eyebrow: "Why Miranda Law",
      title:
        "Clear guidance, responsive communication, and room for questions.",
      tone: "dark",
      bullets: [
        "Personalized recommendations based on your circumstances and goals.",
        "Service in English, Spanish, and Portuguese.",
        "Phone, text, and WhatsApp communication with the office.",
        "A North Jersey practice serving Monmouth County and communities north of it.",
        "An initial consultation at no charge.",
      ],
    },
  ],
  faqs: [
    {
      question: "What documents are commonly included in an estate plan?",
      answer:
        "Many plans include a will, a financial power of attorney, and one or more health care directives. A trust may be appropriate depending on the assets, family circumstances, and goals involved.",
    },
    {
      question: "Do I need an estate plan if I am not wealthy?",
      answer:
        "Estate planning also addresses decision-making, incapacity, children, personal property, and the people who may be asked to act for you. Those questions can matter at many income and asset levels.",
    },
    {
      question: "How often should I review my plan?",
      answer:
        "A review can be useful after a marriage, divorce, birth, death, move, retirement, significant financial change, or change in the people you named. Periodic reviews can also confirm that the plan still reflects your wishes.",
    },
    {
      question: "What happens during the first consultation?",
      answer:
        "The conversation focuses on your family, assets, existing documents, concerns, and goals. You do not need to arrive with every decision already made.",
    },
    {
      question: "How much does estate planning cost?",
      answer:
        "Fees depend on the documents and complexity involved. Miranda Law discusses the recommended scope and fee before legal work begins.",
    },
    {
      question: "Can Miranda Law assist me in Spanish or Portuguese?",
      answer:
        "Yes. Miranda Law communicates with clients in English, Spanish, and Portuguese.",
    },
  ],
};

export const ABOUT_PAGE: SitePageContent = {
  path: "/about",
  title: "About Brian Miranda",
  metaDescription:
    "Meet Brian M. Miranda, Esq. and learn about Miranda Law's clear, responsive, multilingual approach to serving North Jersey families.",
  hero: {
    eyebrow: "Meet Brian Miranda",
    title: "Legal guidance should feel",
    accent: "clear, personal, and useful.",
    lead: "Brian M. Miranda, Esq. leads a North Jersey practice built around direct communication, practical next steps, and long-term client relationships.",
    image: "/images/brian-law-detail_25336cb9.jpg.webp",
    imageAlt: "A linen-bound planning book with organized legal documents",
    secondaryHref: "/estate-planning",
    secondaryLabel: "Explore estate planning",
  },
  sections: [
    {
      eyebrow: "The practice",
      title: "A steady point of contact for important legal decisions.",
      body: [
        "Miranda Law works with individuals and families who want straightforward explanations and a plan they can understand. The estate-planning process is designed to turn broad concerns—about family, property, health, and the future—into a practical set of decisions.",
        "The firm also assists with select real estate, corporate, civil litigation and defense, municipal, immigration, and landlord-tenant matters.",
      ],
    },
    {
      eyebrow: "What clients can expect",
      title: "Clear answers without unnecessary distance.",
      tone: "sand",
      cards: [
        {
          title: "Plain-language explanations",
          body: "Understand the purpose of each option, the decisions it requires, and how it relates to the rest of the plan.",
        },
        {
          title: "Personal recommendations",
          body: "The conversation begins with your actual family, assets, responsibilities, and priorities.",
        },
        {
          title: "Responsive communication",
          body: "The legal team handles intake and scheduling through phone, text, and WhatsApp.",
        },
        {
          title: "Multilingual service",
          body: "English, Spanish, and Portuguese communication is available throughout the client experience.",
        },
      ],
    },
    {
      eyebrow: "Serving North Jersey",
      title: "Local counsel for multilingual families.",
      body: [
        "Miranda Law primarily serves North Jersey, including Monmouth County and communities north of it. The Warren office gives clients a local place to begin, while the firm's phone, text, and WhatsApp options help make communication easier.",
        "Approximately half of the firm's clients are Spanish- or Portuguese-speaking. Multilingual service is not an add-on; it is part of how the practice works every day.",
      ],
    },
    {
      eyebrow: "Approach to estate planning",
      title: "Listen first. Explain the options. Build the plan carefully.",
      tone: "blue",
      steps: [
        {
          title: "Understand",
          body: "Discuss the people, property, responsibilities, and changes that bring you to the conversation.",
        },
        {
          title: "Explain",
          body: "Review possible documents and tradeoffs in language that makes the choices easier to follow.",
        },
        {
          title: "Prepare",
          body: "Draft and review the agreed plan with enough room to ask questions before signing.",
        },
        {
          title: "Carry forward",
          body: "Leave knowing what was signed, where it belongs, and what kinds of future changes may call for another review.",
        },
      ],
    },
  ],
  finalCta: {
    title: "Bring the questions you have now.",
    body: "You do not need to solve every decision before calling. A free initial consultation is a place to understand what may come next.",
  },
};

export const RESOURCES_PAGE: SitePageContent = {
  path: "/resources",
  title: "Estate Planning Resources",
  metaDescription:
    "Use Miranda Law's estate-planning FAQs, preparation checklist, and video resources to organize questions before a consultation.",
  hero: {
    eyebrow: "Estate planning resources",
    title: "Start informed.",
    accent: "You do not have to start certain.",
    lead: "These resources are designed to help you organize the people, property, documents, and questions you may want to discuss with an attorney.",
    secondaryHref: "/resources/estate-planning-faqs",
    secondaryLabel: "Read common questions",
  },
  sections: [
    {
      eyebrow: "Prepare at your pace",
      title: "Three ways to make the first conversation easier.",
      cards: [
        {
          title: "Estate Planning FAQs",
          body: "Plain-language answers to common questions about documents, timing, cost, and the first consultation.",
          href: "/resources/estate-planning-faqs",
          linkLabel: "Browse the FAQs",
        },
        {
          title: "Estate Planning Checklist",
          body: "A practical list of information and decisions to gather. Complete what you can and leave the rest for the conversation.",
          href: "/resources/estate-planning-checklist",
          linkLabel: "Open the checklist",
        },
        {
          title: "Video Library",
          body: "Short explanations of estate-planning concepts and the questions families commonly bring to the office.",
          href: "/resources/video-blog",
          linkLabel: "Visit the video library",
        },
      ],
    },
    {
      eyebrow: "A useful reminder",
      title:
        "General information is a starting point, not a personal legal plan.",
      tone: "sand",
      body: [
        "Online resources can help you identify questions, but they cannot account for every family, asset, document, or legal issue. A consultation is where general information becomes a conversation about your circumstances.",
      ],
    },
  ],
};

export const OTHER_SERVICES_PAGE: SitePageContent = {
  path: "/other-services",
  title: "Other Legal Services",
  metaDescription:
    "Miranda Law assists North Jersey clients with select real estate, corporate, litigation, municipal, immigration, and landlord-tenant matters.",
  hero: {
    eyebrow: "Other legal services",
    title: "Practical counsel for",
    accent: "the matters around the plan.",
    lead: "In addition to estate planning, Miranda Law assists clients with select legal matters affecting property, business, immigration, and everyday disputes.",
    secondaryHref: "/contact",
    secondaryLabel: "Ask about your matter",
  },
  sections: [
    {
      eyebrow: "Areas of assistance",
      title: "Tell us what brings you here.",
      cards: [
        {
          title: "Real Estate",
          body: "Guidance for select residential and related property matters, from questions and documents through the next practical step.",
        },
        {
          title: "Corporate Matters",
          body: "Counsel for select business questions and transactions where clear documentation and risk awareness matter.",
        },
        {
          title: "Civil Litigation & Defense",
          body: "Representation in select civil disputes, with an early focus on the facts, available options, and proportionate next steps.",
        },
        {
          title: "Municipal Matters",
          body: "Assistance with select matters handled through New Jersey municipal courts and local processes.",
        },
        {
          title: "Immigration",
          body: "Support with select immigration matters for individuals and families, available in English, Spanish, and Portuguese.",
        },
        {
          title: "Landlord & Tenant",
          body: "Guidance for select landlord-tenant questions and disputes involving rights, documents, and next steps.",
        },
      ],
      note: "The availability of representation depends on the facts, timing, jurisdiction, and any conflicts. Contact the office so the legal team can determine whether the matter is one Miranda Law can consider.",
    },
    {
      eyebrow: "A coordinated perspective",
      title: "Legal matters rarely stay in one neat category.",
      tone: "blue",
      body: [
        "A real estate transaction can affect an estate plan. A business interest may need to be considered alongside family goals. An immigration or litigation matter can change what requires attention first.",
        "Miranda Law begins by understanding the immediate issue and its connection to the rest of the client's legal picture.",
      ],
    },
  ],
};

export const CONTACT_PAGE: SitePageContent = {
  path: "/contact",
  title: "Contact Miranda Law",
  metaDescription:
    "Schedule a free initial consultation with Miranda Law in Warren, New Jersey by phone, text, WhatsApp, or email.",
  hero: {
    eyebrow: "Contact Miranda Law",
    title: "Take the first step",
    accent: "toward a clearer plan.",
    lead: "Tell the legal team what brings you here. Initial consultations are available at no charge, and the office can communicate by phone, text, WhatsApp, or email.",
    image: "/images/brian-law-detail_25336cb9.jpg.webp",
    imageAlt: "Organized planning documents and a linen-bound book",
  },
  sections: [],
};

const SHARED_SERVICE_PROCESS: PageSectionContent = {
  eyebrow: "The Miranda Law process",
  title: "From a first conversation to a finished document.",
  tone: "sand",
  steps: [
    {
      title: "Schedule a consultation",
      body: "Discuss your current documents, family, property, concerns, and goals.",
    },
    {
      title: "Review the options",
      body: "Understand the purpose, limits, and decisions involved before choosing a direction.",
    },
    {
      title: "Prepare and review",
      body: "The firm drafts the document and reviews its terms with you in plain language.",
    },
    {
      title: "Sign and finalize",
      body: "Complete the required formalities and understand how the document fits with the rest of the plan.",
    },
  ],
};

const SHARED_WHY_MIRANDA: PageSectionContent = {
  eyebrow: "Why work with Miranda Law",
  title: "Personal guidance with accessible communication.",
  tone: "dark",
  bullets: [
    "Clear explanations centered on the decisions you need to make.",
    "Recommendations based on your family, assets, and goals.",
    "Service in English, Spanish, and Portuguese.",
    "Phone, text, and WhatsApp communication with the office.",
    "A free initial consultation to understand the possible scope.",
  ],
};

export const SERVICE_PAGES: Record<string, SitePageContent> = {
  wills: {
    path: "/estate-planning/wills",
    title: "Wills Attorney in North Jersey",
    metaDescription:
      "Learn what a New Jersey will can address and speak with Miranda Law about documenting your wishes, executor, and estate plan.",
    hero: {
      eyebrow: "Wills",
      title: "Put your wishes",
      accent: "into a plan others can follow.",
      lead: "A will can state how property should be distributed, nominate the person who will administer your estate, and record other important decisions for the people you leave behind.",
      secondaryHref: "/estate-planning",
      secondaryLabel: "See the complete estate plan",
    },
    sections: [
      {
        eyebrow: "What is a will?",
        title: "A legal document for decisions that take effect after death.",
        body: [
          "A will records instructions for property governed by the will and nominates an executor to administer the estate. Parents may also use a will to nominate a guardian for minor children, subject to court review.",
          "A will does not control every asset. Beneficiary designations, jointly owned property, trust assets, and other arrangements may operate separately, which is why coordination matters.",
        ],
      },
      {
        eyebrow: "Why you may need one",
        title: "Give your family written direction.",
        tone: "sand",
        bullets: [
          "You want to identify who should receive property governed by the will.",
          "You want to nominate an executor and a backup.",
          "You have minor children and want to record a guardian nomination.",
          "You want to make selected gifts to people or organizations.",
          "Your family structure or wishes differ from the default rules that may otherwise apply.",
          "You already have a will, but the people, property, or instructions are out of date.",
        ],
      },
      {
        eyebrow: "What you can decide",
        title:
          "The people, gifts, and instructions at the center of the estate.",
        cards: [
          {
            title: "Executor",
            body: "Nominate the person who should handle the estate and name an alternate if the first choice cannot serve.",
          },
          {
            title: "Beneficiaries",
            body: "Identify who should receive property governed by the will and how the remaining estate should be divided.",
          },
          {
            title: "Specific gifts",
            body: "Record selected gifts of property or amounts, while coordinating those instructions with the overall plan.",
          },
          {
            title: "Guardian nomination",
            body: "Parents can state whom they want considered to care for minor children if a guardian becomes necessary.",
          },
        ],
      },
      {
        eyebrow: "Who should consider a will",
        title: "A foundational document for many adults.",
        bullets: [
          "Parents and guardians",
          "Homeowners and people with personal property",
          "Married and unmarried partners",
          "People with stepchildren or blended families",
          "Business owners",
          "Anyone who wants to choose an executor rather than leave administration entirely to default procedures",
        ],
      },
      {
        eyebrow: "What happens without one",
        title:
          "New Jersey's default rules may decide what your document did not.",
        tone: "blue",
        body: [
          "When a person dies without a valid will, New Jersey's intestacy rules govern the distribution of probate property. A court process may also be needed to appoint an administrator rather than confirm an executor named in a will.",
          "Those default rules cannot account for every personal relationship or informal promise. A properly prepared will gives the legal process written instructions to work from.",
        ],
      },
      {
        eyebrow: "Common misconceptions",
        title: "A will is important, but it is not the whole plan.",
        cards: [
          {
            title: "“A will avoids probate.”",
            body: "A will generally provides instructions for probate rather than eliminating the process by itself.",
          },
          {
            title: "“My family already knows what I want.”",
            body: "Conversations are valuable, but they do not replace a properly executed legal document.",
          },
          {
            title: "“A will covers incapacity.”",
            body: "Financial powers of attorney and health care directives address decisions during life if you cannot act for yourself.",
          },
        ],
      },
      {
        eyebrow: "How it fits",
        title: "Coordinate the will with the rest of the estate plan.",
        body: [
          "A will works alongside beneficiary designations, ownership arrangements, trusts, powers of attorney, and health care directives. Reviewing those pieces together can reveal gaps or conflicting instructions before they become someone else's problem.",
        ],
      },
      SHARED_SERVICE_PROCESS,
      SHARED_WHY_MIRANDA,
    ],
    faqs: [
      {
        question: "Can I write my own will?",
        answer:
          "A will must satisfy legal requirements to be valid. Legal guidance can also help coordinate the document with beneficiary designations, jointly owned property, and the rest of the estate plan.",
      },
      {
        question: "Does a will control every asset I own?",
        answer:
          "Not necessarily. Assets with beneficiary designations, jointly owned property, and trust assets may pass under separate arrangements.",
      },
      {
        question: "Can I name a guardian for my children?",
        answer:
          "A parent can use a will to nominate a guardian for minor children. A court makes the final appointment based on the applicable law and circumstances.",
      },
      {
        question: "When should I update my will?",
        answer:
          "A review can be useful after marriage, divorce, a birth, a death, a move, a major change in property, or a change in the people you named.",
      },
      {
        question: "Where should I keep the signed will?",
        answer:
          "Keep it somewhere secure but accessible to the people who may need it. The firm can discuss practical storage and whether any registry or other arrangement is appropriate.",
      },
    ],
  },
  trusts: {
    path: "/estate-planning/trusts",
    title: "Trusts Attorney in North Jersey",
    metaDescription:
      "Understand how trusts can hold and manage assets under written terms and speak with Miranda Law about whether a trust fits your estate plan.",
    hero: {
      eyebrow: "Trusts",
      title: "Create structure for",
      accent: "how selected assets are managed.",
      lead: "A trust can place selected property under written terms for the benefit of the people or purposes you choose. Whether one belongs in your plan depends on what you own, what you want to accomplish, and how the trust will be maintained.",
      secondaryHref: "/estate-planning",
      secondaryLabel: "See the complete estate plan",
    },
    sections: [
      {
        eyebrow: "What is a trust?",
        title:
          "A legal relationship built around property, instructions, and responsibility.",
        body: [
          "A trust generally involves a trustee who holds or manages property under written terms for one or more beneficiaries. The person creating the trust decides its purpose and the rules that apply, within the limits of the law.",
          "There are many kinds of trusts. The right structure—and whether a trust is useful at all—depends on the goals and assets involved.",
        ],
      },
      {
        eyebrow: "Why you may need one",
        title: "Add control where a simple transfer may not be enough.",
        tone: "sand",
        bullets: [
          "You want property managed for a child or another beneficiary over time.",
          "You want a successor trustee to manage trust property if you cannot.",
          "You want to set conditions or timing for distributions.",
          "You have a blended family or responsibilities that require careful coordination.",
          "You want a plan for selected property that continues beyond your lifetime.",
          "You have an existing trust that has not been reviewed or properly coordinated with current assets.",
        ],
      },
      {
        eyebrow: "What you can decide",
        title: "Define who manages, who benefits, and how the terms work.",
        cards: [
          {
            title: "Trustee",
            body: "Choose the person or institution responsible for following the trust terms and name appropriate successors.",
          },
          {
            title: "Beneficiaries",
            body: "Identify who may benefit and under what circumstances distributions may be made.",
          },
          {
            title: "Property",
            body: "Determine which assets should be transferred to or coordinated with the trust.",
          },
          {
            title: "Timing and purpose",
            body: "Set a framework for when property may be used, distributed, or retained for future needs.",
          },
        ],
      },
      {
        eyebrow: "Who should consider a trust",
        title:
          "Useful in the right plan—not automatically necessary in every plan.",
        bullets: [
          "Parents planning for minor children",
          "Families supporting a beneficiary who may need ongoing management",
          "Homeowners and people with property in more than one jurisdiction",
          "Blended families",
          "Business owners",
          "People who want a successor structure for managing selected assets during incapacity",
        ],
      },
      {
        eyebrow: "What happens without one",
        title: "The result depends on the rest of the plan.",
        tone: "blue",
        body: [
          "A trust is not required for every estate. Without one, property may still pass through a will, beneficiary designation, joint ownership, or other legal arrangement.",
          "The practical question is whether those alternatives provide enough control, continuity, and coordination for your circumstances.",
        ],
      },
      {
        eyebrow: "Common misconceptions",
        title: "A signed trust is only the beginning.",
        cards: [
          {
            title: "“Every family needs a trust.”",
            body: "Some goals can be handled effectively through other documents and ownership arrangements.",
          },
          {
            title: "“A trust works automatically once signed.”",
            body: "A trust generally must be funded or coordinated with the relevant assets to do the work it was designed to do.",
          },
          {
            title: "“A trust replaces every other document.”",
            body: "Wills, powers of attorney, health care directives, and beneficiary designations may still be essential.",
          },
        ],
      },
      {
        eyebrow: "How it fits",
        title:
          "Connect the trust to the will, titles, and beneficiary designations.",
        body: [
          "Trust planning is as much about coordination as drafting. The document, selected assets, ownership records, beneficiary designations, and the rest of the estate plan should point in the same direction.",
        ],
      },
      SHARED_SERVICE_PROCESS,
      SHARED_WHY_MIRANDA,
    ],
    faqs: [
      {
        question: "What is the difference between a will and a trust?",
        answer:
          "A will gives instructions for property governed by the will after death. A trust can hold and manage selected property under written terms during life, after death, or both.",
      },
      {
        question: "Does a trust avoid probate?",
        answer:
          "Property properly held in a trust may be administered under the trust terms rather than through probate, but assets left outside the trust may follow a different path.",
      },
      {
        question: "Can I change a trust?",
        answer:
          "That depends on the type of trust and its terms. Revocable and irrevocable trusts operate differently, so the document must be reviewed.",
      },
      {
        question: "Who should serve as trustee?",
        answer:
          "The choice depends on the responsibility involved, the people affected, the complexity of the property, and the candidate's judgment and availability.",
      },
      {
        question: "What does it mean to fund a trust?",
        answer:
          "Funding generally means transferring or coordinating selected assets so the trust can govern them. The necessary steps depend on the asset.",
      },
    ],
  },
  "powers-of-attorney": {
    path: "/estate-planning/powers-of-attorney",
    title: "Powers of Attorney in North Jersey",
    metaDescription:
      "Learn how a financial power of attorney can authorize a trusted person to handle defined matters and speak with Miranda Law about your plan.",
    hero: {
      eyebrow: "Powers of Attorney",
      title: "Choose who may act",
      accent: "when you cannot act for yourself.",
      lead: "A power of attorney can authorize a trusted person to handle defined financial, legal, or practical matters on your behalf. Careful drafting helps make the authority clear before it is urgently needed.",
      secondaryHref: "/estate-planning",
      secondaryLabel: "See the complete estate plan",
    },
    sections: [
      {
        eyebrow: "What is a power of attorney?",
        title: "Written authority for a person you choose.",
        body: [
          "A power of attorney names an agent to act for you within the authority described in the document. Depending on its terms, that authority may cover financial accounts, property, taxes, contracts, benefits, business interests, or other legal and practical matters.",
          "The document should be tailored to the authority you actually want to give and coordinated with institutions or arrangements that may have their own requirements.",
        ],
      },
      {
        eyebrow: "Why you may need one",
        title: "Prepare for a time when signatures and decisions cannot wait.",
        tone: "sand",
        bullets: [
          "You want someone to manage bills or financial accounts during incapacity.",
          "You own real estate or a business interest that may require ongoing action.",
          "You want an agent to address taxes, benefits, insurance, or legal documents.",
          "You travel or may need help handling a limited transaction.",
          "You want a backup agent if the first person cannot serve.",
          "Your current document is old, too narrow, or names someone who is no longer appropriate.",
        ],
      },
      {
        eyebrow: "What you can decide",
        title: "Who acts, what they may do, and how the authority is limited.",
        cards: [
          {
            title: "Primary agent",
            body: "Choose a person you trust to follow the document and act with care.",
          },
          {
            title: "Successor agent",
            body: "Name a backup in case the first agent cannot or will not act.",
          },
          {
            title: "Scope of authority",
            body: "Describe the financial, legal, property, business, or other matters the agent may handle.",
          },
          {
            title: "Timing and limits",
            body: "Address when authority begins, whether it continues during incapacity, and any instructions or limits that should apply.",
          },
        ],
      },
      {
        eyebrow: "Who should consider one",
        title: "Incapacity planning belongs in many adult estate plans.",
        bullets: [
          "Adults with financial accounts or recurring obligations",
          "Homeowners and business owners",
          "People approaching retirement",
          "Caregivers and adults supporting family members",
          "People with planned travel, medical procedures, or periods of limited availability",
          "Anyone who wants to choose an agent before a court process may become necessary",
        ],
      },
      {
        eyebrow: "What happens without one",
        title:
          "Family members do not always receive automatic financial authority.",
        tone: "blue",
        body: [
          "If you become unable to manage financial or legal matters and no effective authority is in place, relatives may face delays, institutional barriers, or a court proceeding to obtain authority.",
          "A power of attorney cannot prevent every difficulty, but it can provide a documented starting point and identify the person you chose.",
        ],
      },
      {
        eyebrow: "Common misconceptions",
        title: "Authority should be deliberate, not vague.",
        cards: [
          {
            title: "“My spouse or child can automatically handle everything.”",
            body: "Relationships alone may not give another person authority over individually held accounts or legal matters.",
          },
          {
            title: "“A power of attorney replaces a will.”",
            body: "A power of attorney generally concerns authority during life; a will addresses instructions after death.",
          },
          {
            title: "“The broadest document is always best.”",
            body: "The appropriate authority depends on your goals, risks, and trust in the people being named.",
          },
        ],
      },
      {
        eyebrow: "How it fits",
        title: "Pair financial authority with health care planning.",
        body: [
          "A financial power of attorney handles a different set of decisions from a health care directive. Keeping both documents current can create a more complete incapacity plan.",
        ],
      },
      SHARED_SERVICE_PROCESS,
      SHARED_WHY_MIRANDA,
    ],
    faqs: [
      {
        question: "When does a power of attorney take effect?",
        answer:
          "That depends on the document's terms and applicable law. The timing should be discussed and written clearly.",
      },
      {
        question: "Does the authority continue if I become incapacitated?",
        answer:
          "A durable power of attorney is designed to continue during incapacity, but the actual document must be reviewed for its terms and validity.",
      },
      {
        question: "Can I name more than one agent?",
        answer:
          "A document may name co-agents or successors, but multiple agents can create practical questions about signatures, coordination, and disagreements.",
      },
      {
        question: "Can I revoke a power of attorney?",
        answer:
          "A person with capacity can generally revoke authority, but effective revocation also requires practical notice to the agent and relevant institutions.",
      },
      {
        question: "Is a power of attorney the same as a health care proxy?",
        answer:
          "No. Financial powers of attorney and health care directives address different decisions and are usually documented separately.",
      },
    ],
  },
  "health-care-directives": {
    path: "/estate-planning/health-care-directives",
    title: "Health Care Directives in North Jersey",
    metaDescription:
      "Learn how New Jersey health care directives can name a representative and communicate treatment preferences if you cannot decide for yourself.",
    hero: {
      eyebrow: "Health Care Directives",
      title: "Give the people you trust",
      accent: "clearer medical guidance.",
      lead: "A health care directive can name a representative to make health care decisions if you become unable to decide and can record preferences that help guide difficult conversations.",
      secondaryHref: "/estate-planning",
      secondaryLabel: "See the complete estate plan",
    },
    sections: [
      {
        eyebrow: "What is a health care directive?",
        title: "A written plan for medical decision-making during incapacity.",
        body: [
          "New Jersey recognizes a proxy directive, which names a health care representative, and an instruction directive, often called a living will, which communicates treatment preferences.",
          "The representative's authority is intended for a time when you cannot make your own health care decisions. While you remain able to decide, your own decisions control.",
        ],
      },
      {
        eyebrow: "Why you may need one",
        title: "Make the conversation easier before a crisis.",
        tone: "sand",
        bullets: [
          "You want to choose who should speak with physicians and make decisions if you cannot.",
          "You want to name an alternate representative.",
          "You have treatment preferences or values you want your representative to understand.",
          "You want family members and medical providers to have written guidance.",
          "You have an older directive that names the wrong person or no longer reflects your wishes.",
          "You are preparing for surgery, managing a health condition, or completing a broader estate plan.",
        ],
      },
      {
        eyebrow: "What you can decide",
        title: "Choose a representative and communicate what matters to you.",
        cards: [
          {
            title: "Health care representative",
            body: "Name the person authorized to make health care decisions if you are unable to do so.",
          },
          {
            title: "Alternate representative",
            body: "Choose a backup if the first person is unable, unwilling, or unavailable to serve.",
          },
          {
            title: "Treatment preferences",
            body: "Provide guidance about treatments, life-sustaining measures, and the values that should shape decisions.",
          },
          {
            title: "People who receive copies",
            body: "Plan how representatives, family members, physicians, and health care facilities can access the directive when needed.",
          },
        ],
      },
      {
        eyebrow: "Who should consider one",
        title: "Advance directives are not only for older adults.",
        bullets: [
          "Any adult who wants to choose a health care representative",
          "People preparing for surgery or managing an illness",
          "Parents, caregivers, and adults with family responsibilities",
          "People whose relatives disagree about medical decisions",
          "Adults whose closest trusted person may not otherwise be the obvious decision-maker",
          "Anyone completing or updating an estate plan",
        ],
      },
      {
        eyebrow: "What happens without one",
        title:
          "Loved ones may be left without your written choice or instructions.",
        tone: "blue",
        body: [
          "Without a directive, medical providers and family members may have to determine who should participate in decisions and what you would have wanted without the benefit of your written guidance.",
          "A directive cannot anticipate every medical circumstance, but it can identify the person you trust and give that person a clearer understanding of your values.",
        ],
      },
      {
        eyebrow: "Common misconceptions",
        title: "The document protects your voice; it does not replace it.",
        cards: [
          {
            title: "“My representative decides while I still can.”",
            body: "Your representative acts only when you are unable to make your own health care decisions under the applicable standard.",
          },
          {
            title: "“A directive is only about end-of-life care.”",
            body: "A proxy directive can address health care decision-making more broadly during incapacity.",
          },
          {
            title: "“Completing the form ends the conversation.”",
            body: "Discussing your values with the representative and sharing accessible copies are important parts of the plan.",
          },
        ],
      },
      {
        eyebrow: "How it fits",
        title: "Coordinate medical and financial decision-makers.",
        body: [
          "A health care representative addresses medical decisions, while an agent under a financial power of attorney may handle bills, insurance, accounts, and other practical matters. Both roles may be needed during the same period.",
        ],
      },
      SHARED_SERVICE_PROCESS,
      SHARED_WHY_MIRANDA,
    ],
    faqs: [
      {
        question:
          "What is the difference between a proxy directive and a living will?",
        answer:
          "A proxy directive names a health care representative. An instruction directive, often called a living will, records treatment preferences. A person may use one or both.",
      },
      {
        question: "When can my representative make decisions?",
        answer:
          "The representative acts when you have been determined unable to make your own health care decisions under the applicable process. If you regain capacity, your own decisions control again.",
      },
      {
        question: "Who should receive a copy?",
        answer:
          "Consider providing copies to the primary and alternate representatives, appropriate family members, physicians, and health care facilities involved in your care.",
      },
      {
        question: "Can I change my directive?",
        answer:
          "A person with capacity can generally update or revoke a directive. New copies should be shared so older instructions are not used by mistake.",
      },
      {
        question: "Is a POLST the same as an advance directive?",
        answer:
          "No. A POLST is a medical order used in particular serious-illness circumstances. It can complement, but does not automatically replace, an advance directive.",
      },
    ],
  },
};
