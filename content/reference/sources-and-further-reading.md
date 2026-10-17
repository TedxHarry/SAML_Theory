# SAML with Okta: sources and further reading

Begin with the question you need to answer, then read the relevant section. You do not need to read every specification from beginning to end to investigate an integration. You do need to distinguish what SAML defines, what Okta supports, what the application requires and what the recorded attempt actually did.

## Choose the source for the question

| Question | Source to use | Limit of that source |
| --- | --- | --- |
| What does this SAML field or processing rule mean? | Relevant OASIS specification with applicable approved errata. | A defined capability is not proof of product support. |
| What does this Okta setting do? | Official documentation for the applicable engine, integration and feature. | A configured setting does not establish the receiver's result. |
| What does the SP support or require? | Application-vendor documentation, supported library guidance and the approved integration agreement. | Another application's example does not establish this application's contract. |
| How should this protection be implemented or reviewed? | Applicable standards, maintained implementation documentation and current security guidance. | An old sample is not a complete current algorithm or deployment policy. |
| What happened in this attempt? | Associated browser, provider and receiving/application records. | Documentation describes behavior; it does not prove a particular runtime outcome. |

For the last question, use the [troubleshooting evidence reference](troubleshooting-evidence.md). For an unfamiliar protocol feature, use the [specialized-awareness reference](specialized-awareness.md). For recording an agreed design and its limits, use the [planning and handover reference](integration-planning-changes-and-handover.md).

## Find the relevant SAML document

The four base specifications below are OASIS SAML 2.0 Standards. Read them with the applicable approved corrections in Errata 05, rather than treating an isolated paragraph or historical example as the complete rule.

| Source | Use it for | Helpful starting sections |
| --- | --- | --- |
| [SAML Core: Assertions and Protocols](https://docs.oasis-open.org/security/saml/v2.0/saml-core-2.0-os.pdf) | Message/statement meaning, identifiers, restrictions and protocols. | §2.2 identifiers; §2.4 subjects; §2.5 conditions; §2.7 statements; §3.4 authentication requests; §3.7 logout. |
| [SAML Bindings](https://docs.oasis-open.org/security/saml/v2.0/saml-bindings-2.0-os.pdf) | How messages or references travel. | §3.4 Redirect; §3.5 POST; §3.6 Artifact; §3.2 SOAP when relevant. |
| [SAML Profiles](https://docs.oasis-open.org/security/saml/v2.0/saml-profiles-2.0-os.pdf) | Rules combining SAML building blocks for a particular use case. | §4.1 browser SSO, especially §4.1.4 processing; §4.4 logout; §5 artifact resolution when relevant. |
| [SAML Metadata](https://docs.oasis-open.org/security/saml/v2.0/saml-metadata-2.0-os.pdf) | Participant roles, endpoints, keys and advertised requirements. | §2.2.2 endpoints; §2.4.3 IdP role; §2.4.4 SP role. |
| [SAML Errata 05](https://docs.oasis-open.org/security/saml/v2.0/errata05/os/saml-v2.0-errata05-os.pdf) | Approved corrections to the original specifications. | Locate the affected base document/section, then read the amended requirement. |

Core defines the vocabulary; a profile constrains how it is used. For example, a field being optional in a generic XML schema does not settle whether browser SSO requires or prohibits it in a particular location. Likewise, a general binding's capabilities do not override the selected profile's permitted combinations.

The [OASIS Technical Overview](https://docs.oasis-open.org/security/saml/Post2.0/sstc-saml-tech-overview-2.0.html) provides explanatory architecture and example flows. The linked document identifies itself as Committee Draft 02. Use it for orientation, alongside the normative specifications and approved corrections; it is not a replacement for those rules.

The [Metadata Interoperability Profile](https://docs.oasis-open.org/security/saml/Post2.0/sstc-metadata-iop.pdf) is a separate OASIS Standard describing a metadata-based interoperability and trust model. It helps explain key acceptance in that named model. Confirm whether the receiver implements it before assuming its certificate-processing behavior applies.

### Errata items used in this course

Use these item numbers to locate the applicable amendments in [Errata 05](https://docs.oasis-open.org/security/saml/v2.0/errata05/os/saml-v2.0-errata05-os.html). The section numbers refer to the amended base specifications.

| Item | Subject | Amended specification location |
| --- | --- | --- |
| E14 | Identifier creation/association permission | Core §3.4.1.1 |
| E76 | Shorter inherited metadata limits | Metadata §§2.3.1, 2.3.2, 2.4.1 and 2.5 |
| E78 | Persistent identifiers cannot move to another principal | Core §8.3.7 |
| E79 | Derived-session upper bound, with profile-specific processing | Core §2.7.2 |
| E86 | Persistent identifier privacy without one mandated generation method | Core §8.3.7 |
| E90 | RelayState handling and unsolicited-response CSRF | Bindings §3.1.1; Profiles §§4.1.5–4.1.6 |
| E92 | Clock-difference tolerance | Core §1.3.3 and related time processing |
| E93 | Encryption integrity protection and permitted POST signature layers | Core §6.2; Profiles §§4.1.3.5 and 4.1.4.3 |
| E94 | Cache refresh and metadata validity are separate | Metadata §§4.3.1–4.3.2 |

E79 concerns derived sessions; E94 concerns metadata cache refresh and validity. E76 addresses inherited metadata limits. Keep these separate when reading a sentence that compares assertion, session and metadata clocks.

### Read a rule in context

Identify the document, section, participant role, message, binding and profile. Then determine whether the text is a requirement, a recommendation, an optional capability or an example. Check applicable errata and cross-references. Words such as MUST or MAY acquire their scope from that context; copying the sentence without it can change the meaning.

Historical specifications contain examples and algorithm references that are not current deployment recommendations. Use current approved security policy and supported implementation guidance when selecting actual protection.

## Find the relevant Okta guidance

Use Identity Engine material for the Northstar context. A page or UI label called **Classic experience** is not, by itself, proof that the org uses Classic Engine. Conversely, Classic Engine session or policy examples should not be assumed to describe Identity Engine behavior.

### Integration, identity and protection

| Engineering question | Official source | What to look for |
| --- | --- | --- |
| Is an existing integration suitable? | [Add existing app integrations](https://help.okta.com/oie/en-us/content/topics/apps/apps-add-applications.htm) | Supported capabilities and the identified integration, rather than the app name alone. |
| What does creating a custom integration or preview establish? | [Create SAML app integrations](https://help.okta.com/oie/en-us/content/topics/apps/apps_app_integration_wizard_saml.htm) | Required partner information and generated assertion inspection. |
| What do the SAML setting labels mean? | [SAML field reference](https://help.okta.com/oie/en-us/content/topics/apps/aiw-saml-reference.htm) | ACS/audience, identity output, distinct protection settings and request behavior. |
| How are application attributes configured? | [Custom claims](https://help.okta.com/oie/en-us/content/topics/apps/federated-claims-overview.htm) | Applicable current/legacy configuration, sources and actual output. |
| How are provider signing certificates managed? | [Manage signing certificates](https://help.okta.com/oie/en-us/content/topics/apps/manage-signing-certificates.htm) | Available material, activation and integration setup information. |
| How is account lifecycle configured separately from sign-in? | [Provisioning workflow](https://help.okta.com/oie/en-us/content/topics/provisioning/lcm/lcm-deploy-cloud.htm) | Supported lifecycle capabilities and assignment as distinct work. |
| What changes when Okta receives upstream SAML? | [Add a SAML Identity Provider](https://help.okta.com/oie/en-us/content/topics/security/idp-add-saml.htm) | Inbound issuer/trust, verification, matching and linking choices. |

Pair these pages with the application's supported configuration guide and the actual integration's setup information. Atlas is fictional, so its example values do not substitute for a real vendor's contract. A signature setting or certificate file is not proof of successful runtime acceptance.

For the connected explanations, see [message anatomy](field-comparison-and-message-anatomy.md), [bindings](binding-comparison.md) and [trust/protection](trust-and-protection.md).

### Policy, sessions, lifecycle and logout

| Engineering question | Official source | Scope to preserve |
| --- | --- | --- |
| What governs Okta session context? | [Global session policies](https://help.okta.com/oie/en-us/content/topics/identity-engine/policies/about-okta-sign-on-policies.htm) | Provider session/authentication decisions. |
| What authentication does an app require? | [App sign-in policies](https://help.okta.com/oie/en-us/content/topics/identity-engine/policies/about-app-sign-on-policies.htm) | Applicable app authentication requirements, distinct from local app authorization. |
| How are Okta sessions and cookie persistence governed? | [Identity Engine global session rules](https://help.okta.com/oie/en-us/content/topics/identity-engine/policies/add-okta-sign-on-policy-rule.htm) | Session establishment, maximum/idle lifetimes and cookie persistence; separate from app-local sessions. |
| What session assumptions differ by engine? | [Identity Engine session guidance](https://developer.okta.com/docs/guides/oie-upgrade-sessions-api/main/) | Engine-specific context and cautions; this is an upgrade guide, not a reason to copy historical API recipes. |
| What does basic SAML SLO support? | [Configure Single Logout](https://help.okta.com/oie/en-us/content/topics/apps/apps_single_logout.htm) | App support, signed initiating requests and documented response delivery. |
| How are other participants notified? | [Front-channel SAML SLO guide](https://developer.okta.com/docs/guides/single-logout/saml2/main/) | Feature status, initiation/participation configuration, browser delivery and participant responsibility. |
| What does deactivation affect? | [Deactivate user accounts](https://help.okta.com/oie/en-us/content/topics/users-groups-profiles/usgp-deactivate-user-account.htm) | Background completion and applicable downstream deprovisioning. |

Check current feature availability and the exact integration's support before transferring an example to another org. A separately documented mechanism, such as [Universal Logout](https://developer.okta.com/docs/guides/oin-universal-logout-overview/), needs its own supported relationship; using SAML does not automatically enable it.

The [session and logout reference](sessions-reauthentication-and-logout.md) keeps provider state, application state, propagation and confirmed results separate.

### Investigation evidence

| Source | Useful purpose |
| --- | --- |
| [System Log](https://help.okta.com/oie/en-us/content/topics/reports/reports_syslog.htm) | Org-side observations and event context. |
| [System Log filters and search](https://help.okta.com/oie/en-us/content/topics/reports/syslog-filters.htm) | Narrowing the relevant activity without treating an unsuccessful search as proof of absence. |
| [System Log query guide](https://developer.okta.com/docs/reference/system-log-query/) | Event/operation/session correlation and the limits of those identifiers. |

Use the documented meaning of each event and field. Do not turn an illustrative normalized packet into an invented vendor event schema, or assume the log's operation identifier equals a SAML request ID. Receiver and application records remain necessary for their own decisions.

## Read deeper when a protection question requires it

| Source | Why to open it | How to use it |
| --- | --- | --- |
| [W3C XML Signature 1.1](https://www.w3.org/TR/xmldsig-core1/) | References, SignedInfo, digest and signature-value processing. | Start with §§3.2 and 4.4; connect the mechanism to the applicable SAML rules and implementation. |
| [W3C XML Encryption 1.1](https://www.w3.org/TR/xmlenc-core1/) | Encrypted data, protected key material and algorithm roles. | Start with §2.2 for the structure; do not infer a universal SAML processing order from one example. |
| [W3C XML Signature Best Practices](https://www.w3.org/TR/xmldsig-bestpractices/) | Trust, safe processing and verified-versus-consumed content. | This is a Working Group Note providing guidance, not a replacement for normative SAML requirements. |
| [OWASP SAML Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SAML_Security_Cheat_Sheet.html) | Defensive review of implementation and configuration. | Apply relevant controls to the selected supported design rather than treating the page as proof that they are already enforced. |
| [NIST federation guidance](https://pages.nist.gov/800-63-4/sp800-63c.html) | Trust, federation assurance and session relationships. | Read its applicability and requirements in context; it does not automatically impose one assurance/compliance framework on every Okta integration. |
| [MDN HTTP cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies) | Browser storage, sending, removal and cookie attributes. | Distinguish browser-held information from the application's session enforcement. |

These are targeted references for understanding and investigation. Cryptographic mechanisms still need maintained implementations and currently approved supported choices. Reading their internal structure is not an instruction to implement signature or encryption algorithms yourself.

## Resolve an apparent disagreement by separating its scope

Suppose Daniel reads that the amended browser SSO profile permits response or assertion signature protection for POST, while Atlas requires a signed assertion. Those statements answer different questions.

| Source | What it answers in this case |
| --- | --- |
| Profiles §4.1.3.5 with Errata 05 E93 | What the amended profile permits/requires for that protection context. |
| Atlas's approved receiving contract | Which supported arrangement this particular application requires. |
| Okta's field reference and effective configuration | Which signed layers the provider is configured to produce. |
| Actual receiver evidence | Whether the required verification and remaining acceptance checks passed for the attempt. |

The broader protocol permission does not waive Atlas's narrower supported contract. A selectable Okta setting does not prove Atlas accepted its output. Use the relevant [Profiles](https://docs.oasis-open.org/security/saml/v2.0/saml-profiles-2.0-os.pdf) and [E93 correction](https://docs.oasis-open.org/security/saml/v2.0/errata05/os/saml-v2.0-errata05-os.pdf), then establish application requirements and actual outcomes separately.

For a new question, record the claim, authoritative source and section, applicable role/profile/binding, product/feature conditions, and the evidence still needed. If documentation and observed behavior remain inconsistent, preserve both observations and involve the responsible application, implementation or vendor owner. Do not silently weaken a requirement to make the disagreement disappear.
