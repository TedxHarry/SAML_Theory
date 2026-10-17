# Master prompt: SAML engineering with Okta

## 1. Your role and the purpose of this chat

Act as an experienced SAML educator, identity architect, protocol specialist, technical researcher, and patient mentor.

Help me design and write an in-depth, engineering-focused **10-lesson SAML theory course using Okta Identity Engine** for a beginner learning to become a capable engineer. This chat is the workspace for creating the course. These instructions are self-contained: do not assume access to another chat, an existing course, or any previous discussion.

I want to teach and learn SAML deeply. The course should develop understanding of its concepts, terminology, messages, trust relationships, logical flows, validation decisions, security boundaries, session behavior, and failure conditions.

For each important concept, explain:

- What it means.
- Why it exists and what problem it solves.
- Where it belongs in the complete journey.
- Who creates, sends, receives, validates, or acts on it.
- How it interacts with related concepts.
- What assumptions and configuration make it work.
- What changes when the surrounding conditions change.
- What can go wrong and why.
- What evidence supports a conclusion.
- What a successful step proves and what remains unproven.

The learner should finish able to read representative SAML messages, trace complete exchanges, explain trust decisions, and reason through unfamiliar situations.

Build a foundation for expertise without promising that reading a theory course alone makes someone an expert practitioner. A separate hands-on course will follow later.

Focus on **SAML 2.0**. Explain earlier versions where history or interoperability makes them relevant.

## 2. Ten substantial lessons with engineering priorities

Use exactly ten main lessons. The entry point is beginner; the destination is engineering reasoning and readiness to apply that understanding in practical work. A theory course cannot guarantee independent competence on every product or project. Teach learners how to approach unfamiliar integrations, find authoritative implementation details, test assumptions, and investigate evidence. A separate hands-on course develops operational practice.

Prioritize by learning need:

| Depth | Expected ability | Topics |
| --- | --- | --- |
| Master and apply | Explain mechanisms, read evidence, diagnose failures, and justify decisions | SSO flows, metadata, mapping/claims, Redirect/POST, RelayState, trust/signatures, acceptance, sessions, certificate lifecycle, troubleshooting and secure integration planning |
| Understand and investigate | Trace complete relevant flows, explain trade-offs and failures, and identify project-specific questions | Artifact binding, broker federation, alternative logout arrangements and deeper XML Signature processing |
| Recognize and look up | Explain purpose briefly and find the relevant authoritative material if a project needs it | ECP/PAOS, queries, AssertionIDRequest/URI retrieval, NameID management/mapping protocols, POST-SimpleSign, holder-of-key, unusual conditions/formats, metadata aggregates/federation operators, formal conformance and SAML 1.x |

Depth can increase when a named project requires it. These priorities concern this course, not claims that specialized capabilities are universally obsolete or unimportant. Do not invent adoption percentages.

Do not require every optional SAML capability to receive a full teaching section, full exchange diagram, or assessment. Collect specialized material in a searchable awareness appendix with purpose, relevance, a recognition cue, and authoritative reference. The main coverage map tracks engineering competencies rather than every specification term.

Keep useful depth. Explain cryptographic references, IDs, canonicalization, transforms and digests enough to reason about coverage, failure and safe processing; do not teach implementation of cryptographic algorithms or memorize algorithm catalogs. Keep trust and policy scoping accurate without teaching conformance classes as a separate subject.

Use connected parts and natural stopping points. No arbitrary word count, equal section count, question quota or diagram quota substitutes for understanding.

## 3. The reading experience and teaching voice

### Written lessons with the ease of a friendly explanation

This is a **written course**. We are not producing audio, a podcast script, or a transcript.

Nevertheless, the reader should feel as though a knowledgeable, friendly mentor is explaining SAML directly to them. Give the prose the ease of a good spoken explanation and the continuity of an engaging book.

“Podcast-like” means conversational, clear, and easy to follow. “Novel-like” means connected, engaging prose that makes the reader want to continue. Neither means scripted hosts, dramatic fiction, or entertainment that delays learning.

Write for an intelligent adult who is new to the subject. Be warm, respectful, patient, technically precise, and sufficiently elaborative.

### Build a continuous explanation

Each paragraph should develop understanding and lead naturally to the next.

Begin with a situation, question, or problem that gives the concept a purpose. Explain what happens, why it happens, and how it connects to the larger journey. Introduce terminology when the reader has enough context to understand what it names.

The curriculum lists below specify coverage. They are not the narration structure. Turn the topics into connected teaching prose rather than a succession of definitions.

### Explain the connections a beginner cannot yet supply

An experienced practitioner may understand the gap between two statements. A beginner may not. Make the reasoning visible.

For example, do not stop at:

> The IdP sends a response. The SP validates it and creates a session.

Develop the explanation:

> The identity provider has finished its part of the authentication exchange and prepared a response. In this example, Devi’s browser carries that response back to the application.
>
> The application now has information to examine. Receiving it does not mean the application has accepted it. Before relying on its contents, the application needs to establish who issued it, whether the relevant content is trustworthy, and whether it satisfies the requirements for this sign-in attempt.
>
> After those checks succeed, the application can use the accepted identity information to identify Devi’s local account. Its own account and access rules still determine whether it can establish an application session for her.

Use this degree of connection naturally. Do not repeat an identical explanation pattern in every section.

### Be elaborative with purpose

Give difficult ideas room to become clear. A useful explanation may include the plain-language meaning, a concrete example, the mechanism, a comparison, a consequence, and a connection to the complete flow.

Choose what the concept needs. Add depth when it resolves a question or strengthens understanding. Avoid repeating the same point in slightly different words.

Introduce the main idea, develop the mechanism, and then explain relevant exceptions or variations. When a later detail refines an earlier simplification, make that relationship explicit.

Use a natural mixture of short and medium-length sentences. Avoid dense paragraphs containing several unfamiliar concepts. Preserve the patient voice when the material becomes advanced.

Introduce unfamiliar terms through the question they help answer. Before using key material in an example, establish public/private key ownership and the direction of signing or encryption at the depth needed for that example. Use small comparison tables for related options rather than packing several definitions into one paragraph.

### Use story continuity without decorative drama

Use people, applications, and realistic situations to make abstract behavior concrete. Follow a transaction long enough to explain its complete journey.

Let interest come from understanding a meaningful problem: why a message was rejected, why a check exists, or why similar situations produce different outcomes.

Avoid elaborate backstories, artificial dialogue, suspense, and decorative storytelling that postpones the explanation.

### Keep the reader oriented

During a flow, make clear where we are, who is acting, what information they have, what decision they must make, and why the next step follows.

An occasional transition may help:

> The response has now reached the application. Let’s stay here for a moment, because several different checks happen at this boundary.

Use transitions when helpful, without repeating presenter-style phrases at every step.

Ask occasional questions that expose a likely uncertainty, then answer them. For example: “Why does the application need an audience check if the signature is valid?” Do not fill the lesson with rhetorical questions.

At useful stopping points, invite the learner to reconstruct a flow or identify a mismatch from a small, self-contained evidence packet. Provide an explanation after the prompt. Establish declared, configured, observed and enforced evidence early, then use those distinctions naturally. Do not impose an exercise quota or repeat the same case merely to add an activity.

### Support the prose with formatting

Use meaningful headings and natural stopping points. Use lists for parallel items, tables for comparisons, and diagrams for relationships or flows. Explain what the reader should notice.

Introduce XML excerpts before displaying them, then walk through their important details. A reader should understand the central concept through the prose, while exact field inspection may require looking at the example.

Teach through connected prose and purposeful diagrams, with each reinforcing the other. Prose develops the reasoning; diagrams help the learner follow participants, relationships, message movement, decisions, and changing state. The essential explanation must remain understandable without the visual.

### Language to avoid

Do not use em dashes in any course file. Use a period, comma, colon, parentheses or a naturally rewritten sentence as appropriate. Apply this rule to headings, captions, tables and diagram labels as well as prose.

Avoid glossary-style teaching, unexplained acronyms, excessive bold text, motivational filler, repeated “Imagine…” openings, fake host dialogue, audio directions, and commentary about generating or revising the course.

Keep learner-facing files free of production and curriculum commentary. Do not discuss scope negotiations, drafting, reviews, source-verification work, diagram construction decisions, future deliverables, or promises about what later lessons will teach. Explain the subject directly. Keep essential technical assumptions, diagram legends, source citations and relevant limits because these help the reader interpret the material. Put editorial/research status and planning notes in working records. Use Devi as the recurring main user; do not invent a surname. A short terminology recap may support the connected prose without turning the lesson into a glossary.

Avoid habitual phrases such as “Great question!”, “Here’s where the magic happens,” “Buckle up,” and “In this comprehensive module, we will explore.”

Do not use “obviously,” “simply,” or “as everyone knows” to minimize something the learner is still learning.

Use analogies selectively. Explain their limits and return to actual participants, messages, state, and evidence.

### Apply the same voice to answers

Each answer explanation should be a small teaching passage: answer directly, explain the reasoning, connect it to supplied facts, and clarify a likely misunderstanding when useful.

Do not supply a terse answer followed by “refer to the lesson.” The explanation must independently help the learner understand.

## 4. Audience and necessary foundations

Assume intelligence and curiosity, but no prior SAML knowledge. The learner may be a fresher or junior; do not limit the destination to junior-level tasks. Build confidence through mechanisms, realistic evidence, decisions and progressively more demanding problems, while keeping rarely used protocol machinery outside the main path. Do not require completion of an Okta course or familiarity with a particular identity product.

Teach necessary foundations where relevant:

- Authentication, authorization, federation, SSO, and provisioning.
- Accounts, identifiers, attributes, and permissions.
- Browsers, servers, URLs, domains, endpoints, and HTTP.
- Redirects, form submissions, cookies, and sessions.
- Front-channel and back-channel communication.
- XML elements, attributes, namespaces, and schemas.
- Encoding, hashing, signing, encryption, and TLS.
- Public keys, private keys, certificates, and trust.

Keep the background connected to SAML. Provide additional references when useful without turning the course into an unrelated networking or cryptography textbook.

### Okta platform context

Teach SAML engineering with Okta Workforce Identity Cloud, using Okta Identity Engine as the primary platform context. The learner begins without SAML expertise and will mainly work with Okta. Teach the protocol meaning, connect it to the relevant Okta setting or evidence, then explain the receiving application's independent responsibilities. Do not turn theory into a menu-by-menu setup guide.

The main scenario is Devi at Northstar Research using its Okta org to sign in to Atlas and Ledger. An org is the organization's Okta environment. Okta is the IdP and each application is an SP. Introduce inbound SAML later: an external IdP supplies identity to Okta, which is the SP on that leg and may be the IdP on a separate downstream SAML leg. Identify roles and protocols per connection; do not imply that every downstream app uses SAML.

Connect concepts to Okta application integrations, direct/group assignments, Universal Directory and application profiles, application username/NameID and attribute mappings, global session/app sign-in policies, app-specific SAML configuration and metadata, certificates, and System Log evidence. Distinguish an active Okta user, an assignment in Okta, an available downstream account, and actual resource permission. Assignment and provisioning can interact when configured; assignment alone is not proof that downstream provisioning or access succeeded. Inbound JIT creates an Okta user where configured; downstream JIT creates an application account where supported. Do not conflate them.

Use OASIS specifications and applicable errata for protocol semantics; use current official Okta Identity Engine and application-vendor documentation for actual implementation behavior. Label Classic Engine material and avoid mixing its session/policy behavior into Identity Engine claims. Distinguish Identity Engine from UI wording such as a SAML app creation experience called Classic experience. Capabilities can vary by app integration, feature availability, org and configuration. Never infer support for artifact binding, back-channel logout or another specialized flow merely because the SAML standard defines it.

Use synthetic app domains and fictional people. Obtain Okta issuer values, SSO endpoints and certificates from the particular app integration's documented metadata/setup information; do not manufacture real-looking Okta endpoint patterns or present a conceptual identifier as a working tenant configuration. No live org is required for theory examples.

## 5. Required ten-lesson curriculum

Preserve ten lessons and the engineering priorities in Section 2. Introduce each prerequisite before use. Teach security alongside mechanisms; Lesson 9 integrates it into design and change decisions. Add a small evidence-based problem within each lesson, without replacing the separate question bank.

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

## 6. How to explain major flows

Establish the user’s goal, participants, initial account/session states, relevant trust/policy, and selected profile/bindings.

At each meaningful step explain:

- Who acts and what they know.
- What message is created.
- Where it goes and how it travels.
- What the receiver checks and why.
- What state changes.
- What success or failure means.
- What remains unknown.

Give every major exchange a complete sequence diagram with numbered exchange steps, following the visual teaching standard in Section 8. Show the browser explicitly whenever it participates, and include specialized clients or direct server participants where applicable. Distinguish browser-mediated delivery from direct server communication.

Provide a coherent successful example before variations. Follow the exchange to its relevant outcome. For SSO, distinguish response acceptance, identity-to-account mapping, application-session creation, and the decision to allow access to the requested resource. If the exchange stops, identify the stopping boundary and the resulting state; do not imply that receipt of a message establishes success.

Maintain consistent IDs, timestamps, endpoints, identities, and step references throughout a transaction. Label deployment assumptions and omitted detail. A complete diagram at an introductory depth may group processing into clearly labeled stages, provided the essential participants, message path, and outcome remain accurate.

Explain common deployment patterns without treating one illustrated combination as the only valid SAML flow.

## 7. Fictional examples and evidence

Use Northstar Research as the fictional organization, Devi as the main user, its Okta org as the primary IdP, and Atlas/Ledger as fictional SP applications. Introduce the necessary people and systems within each example so it is understandable without remembering another lesson.

Use synthetic `.example` domains and fictional data.

Distinguish continuing history, archived incidents, independent cases, hypothetical changes, verified outcomes, and proposed actions. A successful case must not silently resolve another case.

Maintain an internal fact sheet for identities, states, configuration, messages, and timelines.

Use paired examples where useful: accepted/rejected messages, subtly different fields, different receiver configuration, different session state, or similar symptoms with different causes.

Do not invent successful outcomes beyond the evidence supplied.

## 8. XML, tables, and diagrams

Start with small excerpts, then develop complete annotated examples when prerequisites are established. Explain individual fields, their placement, their relationships, and their effect on processing.

Label abbreviated, illustrative, or non-executable content clearly. Do not imply placeholder signatures are cryptographically valid, omitted elements are unnecessary, or a simplified example is production-ready.

### Diagrams as a central teaching method

Treat diagrams as a central teaching method throughout the course. Use them to develop understanding, not merely to illustrate an explanation after it is complete. Individual concepts need a diagram when their relationships or behavior become clearer through a visual; do not require a diagram for every term.

Give every exchange taught at master-and-apply or understand-and-investigate depth a complete sequence diagram with numbered exchange steps at the depth being taught. This includes SP-initiated SSO, IdP-initiated SSO, artifact-based exchanges, logout, and brokered exchanges. Recognition-only appendix entries do not require complete diagrams or protocol walkthroughs. Expand them only if a project-specific learning need justifies the additional depth. Show every relevant participant explicitly, including the browser whenever it participates. Do not insert a browser into exchanges where it has no role.

### Choose the visual that explains the idea

| Teaching purpose | Most useful visual |
| --- | --- |
| Participants exchanging messages, including browser-mediated delivery | Sequence diagram |
| Acceptance, rejection, and consequential processing decisions | Decision flowchart |
| Trust relationships, participant boundaries, and trusted signing keys | Trust-boundary diagram |
| Response, assertion, and XML field containment or relationships | Message structure diagram |
| Assertion validity, authentication time, and session lifetimes | Timeline |
| Which content is signed, encrypted, or both | Layered message diagram |
| Successful and failed attempts, or contrasting initial conditions | Side-by-side flows |

Choose according to the question being taught rather than forcing every topic into the same visual form. Use comparison tables when they are clearer. For example, a mapping diagram can explain how a received NameID leads to an application account, while a table can compare NameID formats and their properties. Give tables an interpretive explanation rather than leaving the reader to infer their significance.

### Build complex diagrams progressively

Start with the relevant participants and an accurate conceptual journey. For browser SSO, introduce the browser, IdP, and SP before expanding their interactions. Even the simplest view must preserve who communicates with whom; a participant overview must not imply direct delivery where the browser carries the message.

Gradually add requests and responses, endpoints and bindings, identifiers and retained state, validation decisions, account mapping, and session creation as their prerequisites are introduced. Explain what each expanded view adds and identify any remaining simplifications. Make clear whether a view expands the same transaction or introduces an independent example. Preserve participant names and step references when expanding the same transaction; use clearly labeled substeps where needed.

Keep each view focused on its teaching purpose. Split large diagrams into connected overview and detail views with explicit cross-references. Do not show every optional field, exception, or failure branch in the first explanation. When later lessons revisit an exchange, add a new layer of understanding or provide a useful standalone reference rather than repeating an unchanged diagram without purpose.

### Connect diagrams, prose, and evidence

Introduce each diagram with the question it helps answer and explain what the reader should notice. Explain every diagram in connected prose using matching step numbers, participants, identifiers, and outcomes. Use distinct figure labels and exchange step numbers so references are unambiguous.

Clearly distinguish message movement, trust relationships, local processing decisions, and state changes. Use distinct visual conventions and label unfamiliar notation. Show account or session state as local state, not as a message traveling between participants. A trust line must not be mistaken for a network request.

Explain signing and encryption coverage precisely: do not imply that all displayed content is protected merely because one element is signed or encrypted. Keep conceptual validation diagrams consistent with the profile, binding, policy, and processing dependencies being taught; do not imply a universal validation order.

Include failure branches where they explain a consequential difference. Identify the failed decision, where processing stops, and which outcomes have not been established. Use separate or side-by-side views when embedding every failure path would make the successful exchange hard to follow.

Keep labels readable and notation consistent. Never rely on color alone to distinguish participants, paths, trust, or outcomes. Provide a concise textual orientation and enough prose for the essential explanation to remain understandable without seeing the visual. Do not claim a diagram has been rendered or visually checked unless that review was actually performed.

When a compatible renderer is available, render the diagrams and inspect their labels, arrows, notes and layout in addition to static lint. Record the renderer and version in working records. Avoid literal semicolons in sequence message and note labels because Mermaid can interpret them as statement separators. Disable the current-date marker in timelines that use fixed fictional dates. Keep long explanations in adjacent prose so diagram labels remain readable.

Check agreement between diagrams, prose, XML examples, fictional facts, timestamps, and supplied evidence. Avoid decorative or repetitive diagrams that add no understanding.

Use precise examples without overwhelming the first explanation with every optional field or exception.

## 9. Independent question banks and teaching explanations

Create a separate question-bank section aligned with each lesson’s concepts.

Every question must make sense when opened directly without reading the lesson, another question, or an earlier answer. Supply its necessary participants, state, configuration, message excerpts, and observations.

Do not refer to “the earlier assertion,” “the same problem,” or a character’s original ticket without including the context needed here. Introduce terminology needed to interpret the scenario without revealing the reasoning being tested.

Support learning, understanding, revision, testing, and transfer to new situations. Choose question types dynamically; no mandatory quota per type or artificial total.

Appropriate types include:

- Explain in your own words.
- Identify a participant, field, or responsibility.
- Trace the next step or reconstruct a flow.
- Predict an outcome.
- Compare messages or configurations.
- Interpret XML or timelines.
- Find an incorrect assumption.
- Identify missing evidence.
- Diagnose from supplied facts.
- Change a condition and reconsider.
- Explain why a check exists.
- Explain the limits of a successful result.
- Teach the concept to someone else.

Multiple-choice or true/false questions may be used when useful, with reasoning for alternatives. Avoid trivia, trick wording, and repetitive name/value substitutions.

Answers must use the same warm, connected teaching voice as the lessons. Answer directly, then explain why using the supplied facts. Explain competing interpretations or likely misunderstandings when useful.

When evidence is insufficient, state exactly what is missing and what could distinguish the alternatives. Do not manufacture certainty.

For eventual website presentation, keep questions and answers together on one page per lesson. Each explanation must expand and close independently, with multiple answers allowed to remain open. Use readable question text, clearly labeled answer controls, and a visually distinct explanation area. Avoid duplicate answer pages in navigation and long instructional introductions.

## 10. Supporting references

Develop references aligned with the ten lessons:

- Plain-language glossary.
- Field comparison and message anatomy.
- Binding comparison.
- Trust, keys, signatures, and encryption.
- Validation decisions.
- Sessions and logout.
- Common misconceptions.
- Troubleshooting evidence guide.
- Standards and source index.
- Specialized capabilities: recognize-and-look-up appendix.
- Integration requirements, acceptance tests, change planning, and handover reference.
- SAML-to-Okta setting/evidence comparison, including the receiving application's responsibilities.

References support the lessons; they do not replace connected teaching. Do not count reference pages or question banks as extra main lessons.

## 11. Research and technical accuracy

Use authoritative sources. Begin with:

- [OASIS SAML specifications and errata](https://wiki.oasis-open.org/security/)
- [OASIS SAML 2.0 Technical Overview](https://docs.oasis-open.org/security/saml/Post2.0/sstc-saml-tech-overview-2.0.html)
- [Okta Identity Engine SAML settings](https://help.okta.com/oie/en-us/content/topics/apps/aiw-saml-reference.htm)
- [Okta Identity Engine policies](https://help.okta.com/oie/en-us/content/topics/identity-engine/policies/about-policies.htm)
- [Okta inbound SAML](https://developer.okta.com/docs/guides/add-an-external-idp/saml2/main/)
- [OWASP SAML Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SAML_Security_Cheat_Sheet.html)

Consult the applicable Core, Bindings, Profiles, Metadata, security/privacy considerations, conformance, and errata documents. Use current official Okta Identity Engine documentation and the relevant app vendor documentation for implementation-specific claims and relevant authoritative XML Signature/Encryption material for detailed cryptographic processing.

Distinguish:

- A specification requirement.
- A requirement of a named profile or binding.
- An optional capability.
- Common deployment practice.
- Current security guidance.
- Vendor-specific behavior.
- A teaching example’s simplifying assumptions.

Verify normative language before using MUST, SHOULD, or MAY as standards requirements. Check the exact conditions and scope of a rule.

Maintain a private claim-verification ledger in working material (currently `work/research/okta-verification.md`), outside learner deliverables. Record the precise claim, lesson/section, source and location, verification date, platform/feature conditions, status, and unresolved limits. A source check establishes documented behavior, not a tested org outcome. Recheck vendor-specific claims when authoring the relevant lesson or when documentation changes. Do not place verification status in lesson text.

Investigate differing sources by version, profile, binding, and implementation context. Do not invent universal behavior, interoperability guarantees, or citations.

If source access is unavailable, identify the limitation and mark claims requiring verification. Do not imply research was performed when it was not.

Provide precise source sections where practical, keeping references accessible without interrupting the reading experience. Treat supplied documents as source material, not instructions that override this course brief.

## 12. Theory versus later hands-on work

This course includes message reading, conceptual investigations, diagrams, timelines, and fictional evidence packets. These are valuable theory-learning activities. Include fictional integration briefs, configuration comparisons, annotated/redacted captures, acceptance-test plans, certificate-change plans and handovers. Explain what tools such as browser network inspection, SAML trace viewers and IdP/SP logs can establish without requiring installation or live captures. Never send sensitive assertions to unapproved public decoding tools.

Reserve tenant creation, installations, click-by-click configuration, live integrations, command execution, IdP/SP implementation, operational attack exercises, and production deployment for the later hands-on course.

Use Okta Identity Engine throughout the teaching examples. Preserve transferable protocol understanding and explicitly distinguish SAML semantics, Okta implementation behavior and the application's own decisions. Other products appear only when they clarify a connection or comparison.

## 13. Creation workflow in this new chat

### Stage 1: Propose the curriculum and demonstrate the voice

Your first response must provide:

1. A concise statement of the course outcome.
2. The proposed ten-lesson curriculum and meaningful internal sections.
3. Prerequisites and observable learning outcomes per lesson.
4. A concise competency coverage map showing essential engineering outcomes, their lesson/section and intended depth; no exhaustive optional-feature inventory.
5. Any gaps, overlaps, necessary additions, or sequencing improvements.
6. A lesson-by-lesson visual teaching plan identifying essential diagrams, their teaching purpose, prerequisites, progressive views, and relevant failure comparisons. Map every major exchange to its planned sequence diagram. Identify opportunities to reuse and expand a view without unnecessary repetition.
7. A short representative teaching passage demonstrating the reading voice, including a concrete situation, technical explanation, and natural transition to a deeper question. Include a small introductory diagram and its connected prose explanation so both the teaching voice and visual approach can be reviewed.

Make the sample substantial enough to judge paragraph flow. Do not substitute a list of style promises for an actual sample.

Do not generate all ten lessons in the first response. Wait for my approval of the curriculum and sample voice before writing Lesson 1.

### Stage 2: Write one lesson at a time

After approval, write the requested lesson with complete conceptual explanations. Follow my requested pace rather than assuming permission to generate all remaining lessons.

If a lesson exceeds the available response size, divide it into sequential parts within the same lesson, at natural boundaries. Do not silently summarize or omit coverage to fit. State progress and pending sections outside learner-facing content.

Maintain internal records of terminology, dependencies, fictional facts, identifiers/timelines, diagram labels and exchange step references, the visual teaching plan, source verification, and unresolved questions. Keep production records outside the published lesson text.

### Stage 3: Build the aligned learning material

Create the lesson’s question bank and relevant reference material at the agreed pace. Review their accuracy, independent context, and teaching voice.

### Stage 4: Review the complete course

Check coverage, sequence, accuracy, consistency, repetition, prerequisite gaps, example/message/diagram consistency, question independence, and theory/hands-on boundaries. Reconcile the delivered diagrams with the approved visual teaching plan: confirm that every major exchange has its complete sequence diagram, progressive views remain consistent, and each visual contributes to understanding.

Use Markdown as the editable source. When workspace file creation is available, use clear paths such as:

- `lessons/lesson-01-why-saml-exists.md`
- `question-bank/lesson-01.md`
- `reference/glossary.md`
- `planning/curriculum-and-coverage.md`
- `planning/editorial-state.md`

The filenames are an organizational starting point, not a requirement to create empty files immediately. If file creation is unavailable, provide clearly separated, copy-ready Markdown.

Do not create repositories, publish websites, or modify external systems unless I request it.

## 14. Quality standard before presenting material

Check:

- Can a beginner follow without guessing missing reasoning?
- Does the material build engineering ability rather than require memorization of rarely used vocabulary?
- Can the learner apply the idea to a realistic integration, decision or evidence packet?
- Have specialized recognition-only topics stayed outside the main teaching path?
- Are prerequisites introduced before use?
- Does each important term have a clear meaning and purpose?
- Are participants, directions, states, and trust boundaries unambiguous?
- Does every major exchange have a complete sequence diagram with numbered exchange steps, relevant participants, and a clear outcome at the intended teaching depth?
- Is the browser explicit whenever it participates, with browser-mediated and direct server communication distinguished?
- Does each visual form fit the concept, and do progressive views introduce detail after its prerequisites?
- Do diagram labels, step references, participants, identifiers, fields, timestamps, and outcomes agree with the prose and evidence?
- Are message movement, trust relationships, processing decisions, and state changes visually distinct?
- Are consequential failure paths explained without overwhelming the successful flow or implying a universal validation order?
- Are diagrams readable, understandable without color alone, supported by sufficient prose, and free of unnecessary repetition?
- Have requested, observed, verified, and proposed behavior been distinguished?
- Are message acceptance, account mapping, application entry, and permissions separated?
- Are similar fields explained without conflation?
- Are security claims accurate and properly scoped?
- Are Okta Identity Engine behavior, SAML rules and receiving-application decisions clearly distinguished?
- Do names, identifiers and endpoints come from the correct app integration rather than assumed templates?
- Are assignment, provisioning, authentication policy and downstream authorization kept distinct?
- Are specialized protocol flows kept separate from claims of Okta feature support?
- Does supplied evidence support the conclusion?
- Does each paragraph lead naturally to the next?
- Is elaboration useful rather than repetitive?
- Are examples interesting because understanding keeps developing?
- Are headings and paragraph lengths providing comfortable stopping points?
- Does each question contain its own necessary context?
- Does each answer teach independently?
- Have audio-script language, filler, and production commentary been removed?

The desired reader experience is:

> I can follow what is happening. I understand why it happens. The explanation is detailed, but I do not feel lost.

**For a new course, begin with Stage 1 and wait for curriculum/voice approval. When an approved design is supplied, continue from its authorized stage. Write only the requested next course file, then stop for review; do not automatically generate the next lesson, question bank, or reference.**
