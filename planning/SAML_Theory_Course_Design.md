# SAML engineering with Okta: course design

Revised October 16, 2026. This revision incorporates the approved scope correction. It supersedes the earlier specification-wide design. The learner begins with no SAML knowledge; the course develops engineering understanding without promising that theory alone makes someone independently ready for every deployment.

## 1. Outcome and teaching priorities

The learner should be able to explain complete exchanges, interpret representative messages and metadata, reason about trust and acceptance, connect identities to application accounts, diagnose failures from evidence, and review an integration or change plan. For an unfamiliar project, the learner should know what to ask, what to inspect, what to verify in implementation documentation, and how to distinguish a justified conclusion from an assumption.

Okta Identity Engine is the primary platform context. The course retains exactly ten substantial lessons, a patient connected teaching voice, recurring fictional examples, progressive diagrams, independent question banks and accurate source scoping. No lesson is defined by an arbitrary length. The specification is a source for engineering understanding, not a checklist of vocabulary to memorize.

### Depth by learning need

| Depth | Meaning | Main examples |
| --- | --- | --- |
| Master and apply | Explain, interpret, diagnose, and justify decisions | Metadata, requested/unsolicited SSO, mapping/claims, Redirect/POST, RelayState, signatures/trust, acceptance, sessions, key lifecycle, secure integration and troubleshooting |
| Understand and investigate | Follow a complete logical flow, explain trade-offs/failures, and identify implementation questions | Artifact delivery, broker federation, alternative logout paths and deeper XML Signature mechanics |
| Recognize and look up | Place an unfamiliar term and locate the relevant specification or product material | Specialized protocols, uncommon conditions/formats, formal conformance and historical versions |

Security is not postponed until the later lessons. Correct trust, targeting, correlation and state assumptions accompany each mechanism; Lesson 9 develops the integrated engineering review. XML Signature internals stop at reasoning and diagnostic depth, without implementing algorithms or memorizing transform catalogs.

## 2. Ten lessons and their outcomes

### Lesson 1: How SAML connects Okta to an application

**Prerequisites:** None; browser and account foundations are taught here.

- **1.1 The problem behind separate sign-ins:** External authentication, authentication versus authorization, and the purpose of federation and SSO. Northstar uses Okta Identity Engine to authenticate users for application access.
- **1.2 People, accounts, and identifiers:** Identity, principal, account, identifier, attributes, permissions, and why SSO is different from provisioning. Distinguish Devi's Okta user/profile, the application username supplied for Atlas, and Atlas's own account ID.
- **1.3 The participants and their responsibilities:** IdP, SP, browser, servers, URLs, endpoints, cookies, and sessions at introductory depth; complete overview sequence L01-S1 appears here. Use Devi's browser, Okta as IdP and Atlas as SP; define an Okta org and an app integration without requiring console familiarity.
- **1.4 A relationship established before the request:** Approved trust, application account readiness, and what SAML information can and cannot establish. Introduce Atlas's SAML app integration in Okta, approved trust, user assignment and account readiness as separate responsibilities.
- **1.5 A complete browser journey, built progressively:** Expand the overview from Section 1.3 into sequence L01-S2, exposing response acceptance, account mapping, session creation and resource access. The independent application-denial comparison belongs in Section 1.8.
- **1.6 How the same arrangement produces single sign-on:** Existing IdP state, separate application sessions, policy-driven prompts, and federation versus the SSO experience. Connect the Okta session to each independent application session and authentication-policy requirements.
- **1.7 SSO does not replace account provisioning:** Account creation/update/disablement, JIT as an application capability, SCIM orientation, and retained-session limits. Distinguish Okta app assignment, enabled lifecycle provisioning, downstream JIT and downstream account status.
- **1.8 A successful authentication can lead to denied access:** Independent disabled-account case; response acceptance, entry, and resource permissions as distinct boundaries.
- **1.9 Where SAML fits beside other identity technologies:** Brief purpose-based comparisons with OIDC, OAuth, SCIM, LDAP, Kerberos, and WS-Federation; verify versions and supported behavior rather than memorizing history.
- **1.10 Begin investigating like an engineer:** An independent failed-attempt ticket, facts versus assumptions, evidence sources and the next observation needed to locate the stopping boundary. Use a synthetic Okta/application investigation, including the limit of an Okta-side success observation.
- **1.11 What you can now explain:** Connected reconstruction, short transfer checks and transition to integration planning/metadata.

**Observable outcome:** Explain a complete conceptual exchange, assign responsibilities, separate sign-in from account lifecycle and permissions, and identify what evidence is missing in a failed attempt.

### Lesson 2: Planning an integration and reading metadata

**Prerequisites:** Lesson 1: participants, trust, accounts, and browser delivery.

- **2.1 Collect the requirements before changing settings:** Application/IdP owners, supported initiation and bindings, environments, account source, identifiers, claims, access requirements, test users, support ownership, and success criteria. Collect both the app owner's requirements and Okta org/app-integration details; compare an OIN integration with custom SAML setup at conceptual depth.
- **2.2 The SAML building blocks and enough XML:** Assertion, protocol, binding, profile, metadata, and schema in context; elements, attributes, nesting, namespaces, and prefixes without schema memorization.
- **2.3 Read the values that must agree:** Entity IDs and issuers versus addresses; SSO URL, ACS/reply URL, logout URL; IdP/SP roles, endpoint binding, relevant index/default selection; URI identifiers need not open as web pages. Map Okta Single sign-on URL to the app ACS and Audience URI (SP Entity ID) to the intended app audience; distinguish these from the Okta IdP SSO URL and issuer.
- **2.4 Read keys and declared expectations:** KeyDescriptor, signing/encryption uses, signing expectations, NameID formats, requested attributes where applicable; configuration labels are product-dependent. Connect the protocol fields to Okta Name ID format, Application username format, attribute/group statements and signing/encryption choices.
- **2.5 Make metadata usable and keep it current:** Manual exchange versus metadata refresh, authenticated acquisition, signed metadata and approved trust anchors, cache/validity, stale configuration, environment separation, and declared versus enforced support. Use metadata for the specific Okta app integration; never assume automatic refresh or identical values across app instances or environments.

**Observable outcome:** Read representative IdP/SP metadata, complete an integration information sheet, explain mismatched values, and distinguish declared configuration from trusted and enforced configuration.

### Lesson 3: Follow an SP-initiated sign-in through Okta

**Prerequisites:** Lessons 1–2.

- **3.1 The initial request and remembered state:** SP session inspection, IdP selection, AuthnRequest creation, pending request context, and intended resource.
- **3.2 Follow the complete Redirect/POST example:** Browser delivery, IdP session/policy/authentication, returned response, acceptance, mapping, application session, and resource result. Show Okta's assignment and authentication-policy decisions before issuance, then the app's independent acceptance and access decisions.
- **3.3 Read the request fields that drive decisions:** ID, Version, IssueInstant, Issuer, Destination, ACS URL/index where relevant, ProtocolBinding, and request signing expectations.
- **3.4 Ask for identity and authentication behavior:** NameIDPolicy fields with correct placement; RequestedAuthnContext/comparison, ForceAuthn, IsPassive; requested behavior versus actual evidence. Explain how documented Okta settings, including Honor Force Authentication where applicable, affect observed behavior without redefining SAML semantics.
- **3.5 Change the starting conditions:** No session, existing IdP session, existing SP session; passive/requirements failure; RelayState, retained state, and navigation distinguished. Specialized scoping and proxy controls move to reference depth. Use Identity Engine global session/app sign-in policy context and avoid assuming an Okta session always removes further prompts.

**Observable outcome:** Trace and annotate an SP-initiated exchange, explain retained correlation state, and predict the effect of changed session or authentication requirements without treating a request as proof.

### Lesson 4: Responses, assertions, NameID, and attributes

**Prerequisites:** Lessons 2–3, especially XML nesting and correlation.

- **4.1 Envelope, assertion, and protocol result:** Response versus assertion; ID, Issuer, IssueInstant, Destination, InResponseTo in their actual locations; status and useful diagnostic limits; do not assume every response contains exactly one assertion.
- **4.2 Who the subject is and how the application finds an account:** Subject, NameID; persistent, transient, email-address, unspecified formats; scope/qualifiers, stability, reassignment, linking and mapping; do not equate every identifier with email. Trace Okta profile/application username and NameID configuration through to the SP's actual account-matching rule.
- **4.3 For whom, where, and when:** Bearer SubjectConfirmation/Data, Recipient, Conditions, AudienceRestriction, NotBefore/NotOnOrAfter boundaries and placement; unusual conditions/methods recognized without exhaustive study.
- **4.4 Authentication information and application attributes:** AuthnStatement, AuthnInstant, AuthnContext, SessionIndex/SessionNotOnOrAfter orientation; AttributeStatement, names/formats/values/multivalued claims, release and interpretation. Use synthetic Okta-produced attribute/group statements and profile mapping examples; previews illustrate output, not proven live acceptance.
- **4.5 From identity information to a usable account:** Missing/incorrect claims, case and normalization rules under stated policy, account readiness, JIT where supported versus ongoing provisioning; encrypted structures introduced before Lesson 6. Keep Okta account/assignment state separate from the receiving app's provisioning, JIT and account interpretation.

**Observable outcome:** Read a representative response, locate related fields correctly, explain identifier-to-account mapping, and separate protocol status from application access.

### Lesson 5: Bindings, RelayState, and alternative paths

**Prerequisites:** Lessons 3–4.

- **5.1 How messages become browser traffic:** Redirect versus POST, SAMLRequest/SAMLResponse, form submission, binding-specific compression/Base64/URL encoding, and signature/RelayState coverage; encoding is not encryption.
- **5.2 An IdP-initiated sign-in:** Complete unsolicited-response flow, supported application behavior, absent SP request context, deep links, return targets, and navigation risks. Use an explicitly unsolicited Okta launch example; determine initiation from actual messages rather than assuming every dashboard tile launches the same flow.
- **5.3 When the browser carries an artifact:** Complete artifact-based flow and SOAP ArtifactResolve/ArtifactResponse subexchange, trust and resolution failure; understand and investigate rather than memorize binary layouts. Label artifact delivery as a SAML concept and investigate documented platform support before describing any arrangement as an Okta feature.
- **5.4 When a broker sits between systems:** Complete two-leg browser flow, upstream/downstream roles, separate messages/identifiers/trust, account/claim transformations, and organization/tenant boundaries. Use external IdP to Okta inbound SAML followed by a separate Okta-to-application SAML leg; include inbound account linking/JIT and routing at useful conceptual depth.
- **5.5 Select and compare the supported path:** Profile/binding constraints, IdP discovery and multiple IdPs, browser context/cookies, fresh verification of browser-specific claims; alternative specialized bindings in the appendix.

**Observable outcome:** Compare initiation paths, explain RelayState limits, trace artifact and broker flows, and identify which implementation documentation is needed for an unfamiliar combination.

### Lesson 6: Trust, signatures, encryption, and certificate lifecycle

**Prerequisites:** XML, metadata, message layers, and bindings from Lessons 2–5.

- **6.1 Protection goals and keys:** Authenticity, integrity, confidentiality; encoding/hash/sign/encrypt; public/private keys, certificates, signing versus encryption key roles, TLS versus message protection.
- **6.2 Why the verification key is trusted:** Approved federation configuration, authenticated metadata, incoming KeyInfo, issuer-specific trust, federation trust versus Web PKI assumptions. Show Atlas trusting the appropriate Okta signing key and distinguish it from a key merely included in a message.
- **6.3 What the signature actually covers:** Request/response/assertion signatures, multiple layers, references and IDs, SignedInfo, canonicalization/transforms/digests/SignatureValue at reasoning depth; verified versus consumed content.
- **6.4 Read encrypted structures and processing dependencies:** Encrypted assertions/identifiers/attributes; signed/encrypted scope, appropriate recipient/decryption keys, failure evidence and construction-specific ordering. Connect response/assertion signing and assertion encryption to the relevant Okta integration settings and the SP's supported processing.
- **6.5 Plan and investigate key changes:** Algorithm policy, expiry and implementation-specific enforcement, overlap/rollover, refresh, stale keys, compromise/trust removal, ownership and rollback planning. Use the Okta app integration's signing certificate, active key, partner update, metadata refresh assumptions and a verified rollback plan; do not imply generating a certificate updates the partner.

**Observable outcome:** Explain signature coverage and trust separately, reason about encryption and key failures, and assess a rollover plan. No hand implementation of XML cryptography is required.

### Lesson 7: Response acceptance and application access

**Prerequisites:** Lessons 2–6.

- **7.1 Receive and parse the expected message safely:** Safe XML, structural/schema checks where appropriate, status handling, expected profile/binding and local policy. For outbound SAML, make Atlas the validator. In inbound SAML, explicitly move the receiving/validation role to Okta.
- **7.2 Establish issuer and exact trustworthy content:** Trusted issuer/key, required signatures, consumed element selection, encryption dependencies, and limits of mathematical verification.
- **7.3 Check targeting, time, and presentation:** Destination versus Recipient versus Audience; conditions, bearer confirmation, boundary times and allowed clock skew.
- **7.4 Check attempt, replay, and authentication requirements:** Relevant InResponseTo, retained state, unsolicited policy, replay/cache assumptions, requested/reported context and freshness.
- **7.5 Follow the remaining application decisions:** Mapping, account readiness, entry policy, session creation and resource authorization; integrated accepted/rejected packets and distinct stopping boundaries. An Okta-side success or generated assertion is not proof of downstream acceptance, session creation or permitted access.

**Observable outcome:** Explain each decision through its question, evidence, purpose, failure, and limits; distinguish dependencies from a universal validation order.

### Lesson 8: Sessions, reauthentication, and logout

**Prerequisites:** Lessons 3–4 and 7.

- **8.1 Independent sessions and browser cookies:** IdP session, each application session, cookie scope, SessionIndex association, and what each observed state establishes. Use an Okta global session and separate Atlas/Ledger sessions; do not assume session cookie names or behavior from Classic Engine.
- **8.2 Read the independent clocks:** Assertion/confirmation validity, authentication time, SessionNotOnOrAfter, maximum/idle lifetime and implementation policy; limits on inferred session lifetime.
- **8.3 Reauthentication and changed requirements:** ForceAuthn/IsPassive/context/freshness revisited with existing sessions and evidence of actual outcomes. Explain Identity Engine global session policy versus app sign-in policy and reauthentication requirements with current official sources.
- **8.4 Local logout and complete SLO examples:** LogoutRequest/Response, NameID/session association, authority/participants/tracking, front-channel and back-channel flows and trust. Separate supported Okta SLO arrangements from conceptual SAML back-channel alternatives; verify feature/app availability before claiming a specific fan-out behavior.
- **8.5 Determine what actually ended:** Partial logout, unreachable participants, disablement/assignment removal/deactivation, retained sessions, expiration/revocation limits, and actual subsequent resource access. Distinguish Okta assignment removal, Okta user deactivation, configured downstream lifecycle actions and existing app sessions.

**Observable outcome:** Draw independent timelines, explain reauthentication decisions, trace logout outcomes, and avoid inferring global logout from one local observation.

### Lesson 9: Secure integration design and change planning

**Prerequisites:** Lessons 1–8; security assumptions have been taught alongside their mechanisms.

- **9.1 Review a proposed integration:** Requirements, protocol support, identifiers, claims/privacy, account lifecycle, environments, owners, session/access expectations and explicit acceptance criteria. Review both Okta and SP configuration, assignment, profile source/mapping and policy responsibilities.
- **9.2 Reason about failed security assumptions:** Replay, response/assertion injection, login CSRF/unsolicited responses, signature wrapping, unsafe XML, algorithm processing, targeting mistakes, weak account linking, metadata/key compromise, unsafe RelayState/open redirects, sensitive exposure/session theft, and incomplete logout. Give replay, injection and XML Signature Wrapping explicit worked conceptual cases: show the failed assumption, relevant evidence, protection and its limits; connect signature wrapping directly to verified versus consumed content.
- **9.3 Choose controls with their limits:** Relate each protection to the specific assumption and evidence; avoid operational attack instructions or claims that a single check guarantees safety.
- **9.4 Plan a test and controlled change:** Positive/negative cases, mapping and authorization tests, environment/configuration comparison, certificate changes, dependency/owner coordination, monitoring, fallback/rollback and emergency access considerations. Include Okta configuration changes, partner coordination, policy/assignment tests, Okta System Log evidence and application-side acceptance tests.
- **9.5 Document and hand over the decision:** Integration brief, evidence packet, known limitations, ongoing metadata/key responsibilities, and project-specific questions to research rather than guess.

**Observable outcome:** Review a fictional integration design, justify controls and tests, assess change risk, and write a clear handover. These are planning exercises, not live deployments.

### Lesson 10: Troubleshooting and engineering casework

**Prerequisites:** Lessons 1–9; no essential concept first appears in the assessment.

- **10.1 Investigate before changing settings:** Scope affected users/environments, timeline, known changes, browser/IdP/SP evidence, correlation and redaction; distinguish facts, assumptions and missing evidence. Use synthetic browser traces, Okta System Log records and SP logs; correlate the attempt and avoid inventing event names or treating missing events as proof.
- **10.2 Reconstruct successful baseline paths:** Independent SP-initiated, IdP-initiated and artifact cases, with full sequences and evidenced resource outcomes.
- **10.3 Locate protocol and trust failures:** Wrong audience/recipient/destination/ACS, correlation/replay, time/skew, signature/key/algorithm/encryption, rollover and stale configuration. Compare actual assertion values with Okta integration settings and the SP's expected values; locate certificate/metadata drift on the correct side.
- **10.4 Investigate identity, policy, and state:** NameID/attribute mapping and reassignment, assignment/readiness, application denial after accepted federation, reauthentication, loops, session/cookie context, partial logout and broker leg differences. Include unassigned app, unexpected application username/attributes, Okta authentication-policy denial, accepted federation with app denial, and distinct broker-leg failures.
- **10.5 Explain and defend the engineering conclusion:** Competing causes, smallest useful next observation, corrective proposal with tests, stakeholder communication, final independent assessment and review map.

**Observable outcome:** Investigate unfamiliar evidence packets, identify stopping boundaries, propose justified next steps, and explain what would establish a successful correction.

## 3. Engineering competency coverage map

This map replaces the exhaustive specification inventory. M = master and apply; U = understand and investigate; R = recognize and look up. A topic can move to greater depth if a project requires it.

| Competency | Primary location | Depth | Evidence of learning |
| --- | --- | --- | --- |
| Explain federation, SSO, authentication, authorization and provisioning | 1.1–1.4, 1.6–1.7 | M | Explain a success at one boundary followed by failure at another |
| Distinguish identity, account, identifier, attribute and permission | 1.2; 4.2, 4.5 | M | Explain account mapping without assuming email equals account ID |
| Follow browser/server/endpoint/session behavior | 1.3, 1.5; 3.2 | M | Reconstruct a complete browser-mediated journey |
| Plan a real integration and separate environments | 2.1; 9.1, 9.4 | M | Complete a fictional requirements/configuration sheet |
| Read metadata, XML and role/endpoint/key declarations | 2.2–2.5 | M | Identify mismatched IDs, endpoints, bindings and trusted keys |
| Understand metadata refresh and configured versus declared support | 2.5; 6.5 | M | Explain stale configuration and verify a refresh assumption |
| Trace SP initiation and request intent/state | 3.1–3.5 | M | Interpret request, correlation and session-state variations |
| Interpret response/assertion/status/subject/conditions/authentication/attributes | 4.1–4.5 | M | Annotate a representative message and its acceptance questions |
| Handle identifier scope, mapping/linking, JIT and lifecycle boundaries | 4.2, 4.5; 8.5 | M | Diagnose missing/mis-mapped accounts under stated policy |
| Compare Redirect/POST, encoding, signatures and RelayState | 5.1–5.2 | M | Explain packaging, protected content, navigation and absent request context |
| Trace artifact resolution and broker legs | 5.3–5.4 | U | Complete sequence, distinct trust, failure boundary and project questions |
| Establish key trust and precise signature/encryption scope | 6.1–6.4 | M/U | Separate mathematical verification, trusted issuer, protected and consumed content |
| Plan algorithm/key/certificate lifecycle and changes | 6.5; 9.4 | M | Review overlap, refresh, activation, verification, rollback and ownership |
| Reason through targeting/time/confirmation/correlation/replay/context | 7.1–7.4 | M | Explain question, evidence, risk and limit for each decision |
| Separate acceptance, account readiness, session and resource authorization | 7.5 | M | Locate distinct stopping boundaries |
| Understand independent clocks, cookies, reauthentication and logout | 8.1–8.5 | M/U | Timeline plus supported front/back-channel SLO outcomes |
| Evaluate threats, privacy and mitigations | 9.2–9.3 | M | Explain failed assumptions and protection limits |
| Plan tests, changes, monitoring and handover | 9.1, 9.4–9.5 | M | Written review of a fictional project and maintenance change |
| Investigate and communicate unfamiliar problems | 10.1–10.5 | M | Evidence packet, competing causes, justified next test and success criteria |
| Place specialized or historical terms | Awareness appendix | R | Explain purpose and find authoritative detail; no memorization test |

## 4. Progressive visual teaching plan

Complete numbered sequence diagrams are required for the exchanges taught in depth: SP-initiated SSO, IdP-initiated SSO, artifact delivery/resolution, brokered SSO and the logout arrangements explained in Lesson 8. Artifact and back-channel alternatives remain protocol examples unless the specific Okta support has been verified. The browser is explicit when it participates. Direct server exchanges remain distinct. Recognition-only appendix topics do not require full protocol diagrams.

Use sequence diagrams for exchanges; decisions for acceptance/rejection; trust boundaries for keys/issuer relationships; message structure for XML; timelines for validity/sessions; layered views for signing/encryption; paired flows for meaningful differences. NameID mapping gets a relationship diagram; NameID formats get a comparison table. No diagram quota.

| Lesson | Essential visual development | Meaningful comparison |
| --- | --- | --- |
| 1 | Devi/browser, Okta IdP and Atlas SP overview; expanded complete SSO sequence and approved-trust relationship | Authentication succeeds while the application denies access |
| 2 | Metadata anatomy, identity-versus-location comparison and configuration relationship | Expected versus supplied values; separate test/production settings |
| 3 | Expand Lesson 1's exchange with request ID, endpoint and retained state | No sessions versus existing IdP/SP sessions; unsatisfied passive/context requirement |
| 4 | Response/assertion anatomy, identity mapping and field placement | Same visible value under different scope; missing required attributes |
| 5 | Complete unsolicited, artifact and broker flows; packaging details | Request context versus unsolicited context; failed resolution; distinct broker legs |
| 6 | Trusted-key boundaries, signed/encrypted layers, reference-to-consumed-content relationship, rollover timeline | Supplied versus approved key; correct versus stale configuration |
| 7 | Grouped decision overview and focused acceptance decisions connected to full exchange | Wrong target, expired content, correlation failure and valid federation/application denial |
| 8 | Independent state timelines, complete front/back-channel SLO examples and participant outcomes | Local versus partial/global evidence; access remaining after one session ends |
| 9 | Trust/design review map and selected safe/unsafe comparisons | Same mechanism under a different trust, mapping or navigation assumption |
| 10 | Learner reconstruction followed by answer sequences/timelines | Different causes for similar symptoms and evidence that distinguishes them |

Progressive views must remain accurate at every stage. Start with an overview of the actual browser-mediated journey, then add message names, endpoints, state, validation and protection as prerequisites are taught. If the same transaction is expanded, preserve action references or label substeps; an independent scenario gets its own local numbering. Figure labels and exchange-step numbers are distinct.

Introduce and explain every figure in prose. Local processing is not a network message; trust is not traffic. Labels and line styles must communicate without color. Keep the main explanation understandable without seeing the image. Use the legend to make meaning explicit. Static diagram lint does not establish actual renderer acceptance or visual layout quality.

## 5. Changes adopted from the external review

- Adopt beginner entry and engineering destination, tiered depth, and greater attention to evidence, integration decisions and maintenance.
- Retain ten lessons. Move specialized protocols to an appendix and use Lesson 9 for secure design/change planning, rather than combining all security with sessions/logout.
- Keep artifact and broker exchanges at complete logical-flow depth without implying their prevalence or making project-specific binary/implementation details mandatory.
- Keep signature internals for safe-processing and diagnostic reasoning; do not implement XML cryptography or memorize its algorithm catalogs.
- Keep a concise competency map. Remove the obligation to cover and diagram every optional capability.
- Teach troubleshooting incrementally: a short evidence-based situation in each lesson, then integrated independent cases in Lesson 10.
- Explain logout's specific dependencies and failure modes rather than calling all SLO unreliable.
- Use synthetic captures, logs and configuration examples for theory. Tool installation, live tenant configuration and operational integration testing belong to the later hands-on course.
- Avoid unsupported claims about adoption percentages or features being dead/obsolete. Federation aggregates may be central in some sectors; the appendix placement reflects this course's intended path.

### Awareness appendix boundary

Collect holder-of-key, ECP/PAOS, AuthnQuery, AttributeQuery, AuthzDecisionQuery, AssertionIDRequest and URI binding, NameID management/mapping protocols, POST-SimpleSign, metadata aggregates/federation operators, formal conformance, unusual conditions/formats, and SAML 1.x history. Each entry explains purpose, relevance, recognition cue and source. No full required exchange or memorization assessment. Clarify that the NameID management/mapping *protocols* are distinct from everyday application account mapping, which remains essential.

## 6. Example continuity and evidence

Northstar Research is the fictional organization. Devi is an employee with an Okta user account. Atlas and Ledger are applications; Northstar's Okta org is the main IdP. Introduce each participant when needed. Synthetic `.example` addresses and fictional records protect the distinction from real deployments.

| Item | Example rule |
| --- | --- |
| Okta issuer / SSO service | Use the particular app integration's documented Okta metadata/setup values; do not fabricate fixed endpoints or issuer patterns |
| Atlas entity ID / receiving endpoint | `https://atlas.northstar.example/saml` / `https://atlas.northstar.example/saml/acs` |
| Initial resource | `https://atlas.northstar.example/projects` |
| Distinct identifiers | Employee `E1042`; Atlas account `atlas-4821`; NameID and linking policy explicitly defined when needed |
| Initial successful case | Active Okta user assigned to Atlas, permitted Okta policy, enabled pre-created Atlas account, permitted resource, approved trust, no initial Okta or Atlas session |
| Independent cases | Restate relevant account/session/configuration state; never silently rewrite another case's outcome |
| Evidence | Unique XML-compatible IDs per transaction, explicit UTC clocks and skew assumptions, synthetic keys/signatures labeled illustrative |

Track terminology, facts, state, source checks, diagrams and unresolved questions in working material. No production commentary belongs in lesson prose. Do not upload sensitive assertions into unapproved decoding services.

## 7. Assessment and production order

Each lesson has an observable outcome and a brief in-lesson reasoning situation. Its separate question bank uses independent scenarios and friendly teaching explanations. Choose explanation, reconstruction, comparison, prediction and diagnosis according to the concept. No question quotas, trivia, repeated name/value substitutions or essential prerequisites first introduced in an answer.

For eventual website delivery, keep each lesson's questions and answers on one page, with independently expandable answers, multiple open answers allowed, clear labels and distinct explanation areas. No website is being built at this stage.

Website publication checks must verify that relative document links and intra-document anchors resolve in the built site. Use the actual site generator’s heading-ID and route rules, including punctuation, numbering and duplicate headings; test links after any Markdown-to-route rewriting. Check expandable answers and Mermaid rendering in that same published format. Source-file anchor checks alone do not establish website behavior.

All ten main lesson files are written and saved under `lessons/`. A full-course editorial, technical-consistency and rendered-diagram review is complete, including Lesson 10. The findings, corrections and verification limits are recorded separately in `SAML_Course_Review.md`. The ten-lesson structure is complete. Question banks and supporting references are recorded below. No compilation or publication has been created.

All ten aligned question banks are written under `question-bank/`, with 155 self-contained questions and independently expandable explanations. The banks for Lessons 1, 2, 7, 9 and 10 each contain 15 questions; the banks for Lessons 3 through 6 and Lesson 8 each contain 16.

Supporting references now include `reference/glossary.md`, `reference/field-comparison-and-message-anatomy.md`, `reference/binding-comparison.md`, `reference/trust-and-protection.md`, `reference/response-validation-and-acceptance.md`, `reference/sessions-reauthentication-and-logout.md`, `reference/common-misconceptions.md`, `reference/troubleshooting-evidence.md`, `reference/integration-planning-changes-and-handover.md` and `reference/sources-and-further-reading.md`. The specialized-awareness appendix is now written in `reference/specialized-awareness.md`. It covers the planned recognition topics through purpose, cues, practical relevance, investigation boundaries and primary sources, without new full protocol exchanges or a memorization assessment. Lesson 8's basic SLO caption and response-delivery steps explicitly follow Okta's documented POST return. The planned main lessons, question banks and eleven reference/appendix files are now written. The final complete-set document review is complete and recorded at the top of `SAML_Course_Review.md`: 31 learner files, 155 questions, 66 freshly rendered diagrams, 107 local links/anchors and 52 reachable external sources. All 18 XML examples are well formed; 17 pass their applicable schemas, with the intentionally incomplete IdP metadata fragment excluded from schema validation. No planned content file remains unwritten. Learner testing, live integration testing and publication/export checks remain separate activities. No compilation or publication has been created.

Future files follow the lesson titles above. Supporting references cover glossary, message/field anatomy, bindings, trust/protection, validation, sessions/logout, misconceptions, troubleshooting evidence, integration planning/change/handover, sources, and the specialized-awareness appendix. Do not create empty future files.

If a lesson is large, build its single source in natural reviewed parts without omitting required explanation. Maintain theory boundaries; no repository creation, publication, tenant setup or production changes are authorized by the course-writing request.

## 8. Research and review standard

Use applicable OASIS Core, Bindings, Profiles, Metadata and errata; verify precise rules and conditions during each lesson's research. The explanatory OASIS Technical Overview supports orientation but does not replace normative text. Use current primary sources for browser behavior and protocol comparisons, and official Okta Identity Engine/application documentation for implementation behavior. OWASP supplies defensive review context; NIST federation guidance supplies useful state/trust concepts without silently imposing a particular compliance framework on all SAML integrations.

Primary source starting points: [SAML Core](https://docs.oasis-open.org/security/saml/v2.0/saml-core-2.0-os.pdf), [Bindings](https://docs.oasis-open.org/security/saml/v2.0/saml-bindings-2.0-os.pdf), [Profiles](https://docs.oasis-open.org/security/saml/v2.0/saml-profiles-2.0-os.pdf), [Metadata](https://docs.oasis-open.org/security/saml/v2.0/saml-metadata-2.0-os.pdf), [Errata 05](https://docs.oasis-open.org/security/saml/v2.0/errata05/os/saml-v2.0-errata05-os.pdf), [OASIS Technical Overview](https://docs.oasis-open.org/security/saml/Post2.0/sstc-saml-tech-overview-2.0.html), [OWASP security guidance](https://cheatsheetseries.owasp.org/cheatsheets/SAML_Security_Cheat_Sheet.html), [NIST federation guidance](https://pages.nist.gov/800-63-4/sp800-63c.html).

Distinguish specification rules, named profile/binding rules, optional capabilities, common patterns, security guidance, product behavior and teaching assumptions. Do not infer universal requirements from one deployment. Avoid normative MUST/SHOULD/MAY unless its actual scope has been checked. Verify modern security recommendations rather than copying historical algorithm/transport references.

Before each file is delivered, check prerequisite order, useful depth, connected voice, complete message paths, local state and trust, consistency of figures/prose/XML/evidence, decision limits, and independent question context. Lesson 1 establishes the connected teaching voice and progressive-diagram approach; preserve those qualities as concepts become more detailed. Review diagram source separately from actual rendered layout; report which checks were performed.

Maintain a private claim-verification ledger in working material (currently `work/research/okta-verification.md`), outside learner deliverables. Record the precise claim, lesson/section, source and location, verification date, platform/feature conditions, status, and unresolved limits. A source check establishes documented behavior, not a tested org outcome. Recheck vendor-specific claims when authoring the relevant lesson or when documentation changes. Do not place verification status in lesson text.

## 9. Learner-facing editorial rule

Do not use em dashes in any course file. Use a period, comma, colon, parentheses or a naturally rewritten sentence as appropriate. Apply this rule to headings, captions, tables and diagram labels as well as prose.

Use Devi as the recurring main user, with no invented surname. Keep production, curriculum and review commentary in planning or working records. Lessons teach the subject directly: no drafting notes, scope discussions, verification status, future-file promises or repeated explanations of what the course will do. Preserve technical assumptions, readable diagram legends and source citations. Use brief terminology recaps where they reduce beginner overload.

## 10. Okta teaching context and implementation boundary

### Okta platform context

Teach SAML engineering with Okta Workforce Identity Cloud, using Okta Identity Engine as the primary platform context. The learner begins without SAML expertise and will mainly work with Okta. Teach the protocol meaning, connect it to the relevant Okta setting or evidence, then explain the receiving application's independent responsibilities. Do not turn theory into a menu-by-menu setup guide.

The main scenario is Devi at Northstar Research using its Okta org to sign in to Atlas and Ledger. An org is the organization's Okta environment. Okta is the IdP and each application is an SP. Introduce inbound SAML later: an external IdP supplies identity to Okta, which is the SP on that leg and may be the IdP on a separate downstream SAML leg. Identify roles and protocols per connection; do not imply that every downstream app uses SAML.

Connect concepts to Okta application integrations, direct/group assignments, Universal Directory and application profiles, application username/NameID and attribute mappings, global session/app sign-in policies, app-specific SAML configuration and metadata, certificates, and System Log evidence. Distinguish an active Okta user, an assignment in Okta, an available downstream account, and actual resource permission. Assignment and provisioning can interact when configured; assignment alone is not proof that downstream provisioning or access succeeded. Inbound JIT creates an Okta user where configured; downstream JIT creates an application account where supported. Do not conflate them.

Use OASIS specifications and applicable errata for protocol semantics; use current official Okta Identity Engine and application-vendor documentation for actual implementation behavior. Label Classic Engine material and avoid mixing its session/policy behavior into Identity Engine claims. Distinguish Identity Engine from UI wording such as a SAML app creation experience called Classic experience. Capabilities can vary by app integration, feature availability, org and configuration. Never infer support for artifact binding, back-channel logout or another specialized flow merely because the SAML standard defines it.

Use synthetic app domains and fictional people. Obtain Okta issuer values, SSO endpoints and certificates from the particular app integration's documented metadata/setup information; do not manufacture real-looking Okta endpoint patterns or present a conceptual identifier as a working tenant configuration. No live org is required for theory examples.


### Lesson-to-Okta thread

| Lesson | Okta context that must be visible |
| --- | --- |
| 1 | Devi, Northstar's Okta org, Atlas SP, app assignment, independent application decisions |
| 2 | OIN/custom integration requirements, metadata, ACS/audience, usernames, attributes, certificates and environments |
| 3 | App-initiated request to Okta; assignment, session and policy; response returned for SP processing |
| 4 | Okta user/application profiles, username/NameID, attribute/group statements; SP mapping and account readiness |
| 5 | Explicit unsolicited launch, inbound SAML/external IdP, separate downstream leg; artifact concept with support caveat |
| 6 | Okta signing configuration and active certificate; SP encryption material; partner trust and rollover coordination |
| 7 | Atlas validates outbound responses; Okta validates on an inbound leg; generated output is not acceptance proof |
| 8 | Identity Engine global/app policy, separate app sessions, verified supported logout arrangements and lifecycle actions |
| 9 | Okta/app configuration review, test plan, profile/assignment/policy checks, ownership, monitoring and rollback |
| 10 | Synthetic Okta System Log plus browser/SP evidence; failures attributed to the correct processing boundary |

Keep awareness topics and conceptual protocol diagrams distinct from verified Okta capabilities. Update the visual plan's labels and example assumptions accordingly. Do not create the remaining lesson files until requested.

Official implementation starting points: [SAML settings](https://help.okta.com/oie/en-us/content/topics/apps/aiw-saml-reference.htm), [Identity Engine policies](https://help.okta.com/oie/en-us/content/topics/identity-engine/policies/about-policies.htm), [existing app integrations](https://help.okta.com/oie/en-us/content/topics/apps/apps-add-applications.htm), [provisioning workflow](https://help.okta.com/oie/en-us/content/topics/provisioning/lcm/lcm-deploy-cloud.htm), [inbound SAML](https://developer.okta.com/docs/guides/add-an-external-idp/saml2/main/). These are the sources to check for each lesson's particular claims, not a declaration that all future behavior has already been verified.
