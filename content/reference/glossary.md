# SAML with Okta: plain-language glossary

In the recurring example, Devi works at Northstar Research. Okta is the identity provider for Atlas and Ledger, which are separate applications. Each application decides whether to accept the supplied SAML information, which account it represents and what that account may do. Example addresses and records are fictional.

## Find a term by topic

- [People, systems and access](#people-systems-and-access)
- [Messages, delivery and configuration](#messages-delivery-and-configuration)
- [Identity and account relationships](#identity-and-account-relationships)
- [Acceptance, targets and time](#acceptance-targets-and-time)
- [Trust, signatures and encryption](#trust-signatures-and-encryption)
- [Okta configuration and evidence](#okta-configuration-and-evidence)
- [Sessions, reauthentication and logout](#sessions-reauthentication-and-logout)
- [Account lifecycle and change work](#account-lifecycle-and-change-work)
- [Related protocol names](#related-protocol-names)

## People, systems and access

**SAML:** Security Assertion Markup Language. A standard for exchanging security information. In SAML 2.0 browser SSO, a provider supplies authentication and identity information that an application evaluates. SAML is a standard, while Okta is a product implementing supported SAML behavior.

**Authentication:** Establishing the identity involved according to the authentication method and policy. Authenticating Devi does not establish that she may approve payments or administer Atlas.

**Authorization:** Deciding whether an action on a resource is allowed. Atlas can accept Devi's sign-in while denying an administrative action.

**Identity provider (IdP):** The participant supplying authentication and identity information. Okta is the IdP toward Atlas. On an inbound relationship with an external provider, Okta instead acts as the receiving SP.

**Service provider (SP):** The participant receiving and using SAML information for its service. Atlas is the SP toward Okta. *Relying party* emphasizes its reliance on another party's information.

**Principal:** An entity whose identity can be authenticated. Devi is the principal in the example, rather than another server in the exchange.

**Federation:** An arrangement in which one system relies on identity or authentication information from another under an established trust relationship. The systems can belong to the same organization.

**Single sign-on (SSO):** An experience in which suitable existing authentication state reduces repeated authentication across services. It does not mean all applications share one session or that another challenge is never required.

**Account:** A system's record representing a user, with its own status and associated settings or access. Devi's Okta account and Atlas account are separate records.

**Identifier:** A value referring to something within a context. A request ID identifies a message; an entity ID identifies a participant; an employee identifier can help select an account. Those roles are different.

**Permission:** An application's allowance to perform an action. A supplied group or department value may inform its rules, but does not have one universal permission meaning.

For the connected explanation, see [Lesson 1](../lessons/lesson-01-why-saml-exists.md).

## Messages, delivery and configuration

**Browser:** The software on Devi's device making web requests and carrying messages. In the selected Redirect/POST flow, it delivers the authentication request to Okta and the response to Atlas. Carrying the response does not make it the identity authority.

**HTTP and HTTPS:** HTTP defines web requests and responses. HTTPS protects the connection using TLS. A browser-mediated exchange involves separate connections; connection protection does not replace the required SAML message checks.

**Endpoint:** A service location that receives a particular kind of request or message. Atlas's projects page, its SAML ACS and Okta's SSO service perform different jobs.

**Redirect:** An HTTP response directing the browser to make another request. The browser follows the direction; it is not a direct server-to-server delivery of the next message.

**POST form submission:** A browser submission carrying form data to a server. Ordinary SAML HTTP-POST carries an encoded message in a SAMLRequest or SAMLResponse form control. POST can carry a request as well as a response.

**Protocol:** The rules and messages for an interaction. AuthnRequest and Response belong to SAML's authentication exchange; a binding explains their carriage.

**Binding:** Rules mapping SAML messages or references onto a transport arrangement. HTTP-Redirect, HTTP-POST and HTTP-Artifact are examples. The request and response can use different bindings.

**Profile:** Rules combining and constraining SAML building blocks for a use case, such as browser SSO. A product's support for SAML does not establish support for every profile or binding.

**AuthnRequest:** An SP's request for an authentication exchange. Creating it does not prove that authentication happened. In SP-initiated Atlas sign-in, Atlas creates it and retains context for evaluating the return.

**Response:** The protocol reply containing a reported result and, where applicable, assertions. Its ID identifies the reply. Status Success is a responder-reported result, not proof that the SP granted access.

**Assertion:** A container of statements about a subject, with information and restrictions governing use. It has its own ID and issuer. A familiar identifier inside it is useful only after the required acceptance checks.

**Metadata:** Structured information about participants, roles, services, keys and supported or expected behavior. It is configuration information, not a record that Devi authenticated. Publication does not prove a receiver adopted it.

**XML element and XML attribute:** An element is a named XML structure; an XML attribute is a property in its opening tag. Location on an endpoint declaration is an XML attribute, distinct from a SAML attribute about a user.

**Namespace and prefix:** The namespace identifies the XML vocabulary; a prefix is a local label bound to it. Different prefixes can mean the same vocabulary. Familiar prefix letters cannot substitute for checking the namespace.

**Schema:** Rules for allowed XML structure and data types. Schema validity is not signature validity, approved trust or complete profile compliance. Safe processing also needs applicable protocol rules beyond the schema.

**SP-initiated sign-in:** The SP creates the authentication request. A dashboard tile can still lead to this path if it first sends the browser to the application to start SAML.

**Unsolicited response:** A response without a preceding SP AuthnRequest that it answers. Often called IdP-initiated SSO. It needs deliberate receiver support and controls; failed requested correlation must not silently become unsolicited acceptance.

**Artifact:** A sensitive reference used to obtain a SAML message through a separate resolution exchange. The browser carries the reference; the receiving server retrieves the message. After successful resolution, the artifact cannot be reused to retrieve the message. Standardization does not establish Okta support.

**ArtifactResolve and ArtifactResponse:** The request and reply used to retrieve the referenced message. Their correlation is separate from the original authentication request and response carried inside that result.

**SOAP:** An XML messaging envelope used in supported direct server exchanges, including generic SAML artifact resolution and back-channel logout examples. Its presence does not establish a particular Okta capability.

See [Lesson 2](../lessons/lesson-02-planning-and-metadata.md), [Lesson 3](../lessons/lesson-03-sp-initiated-sso.md) and [Lesson 5](../lessons/lesson-05-bindings-relaystate-and-alternative-paths.md).

## Identity and account relationships

**Entity ID:** The identifier of a SAML participant. It is not necessarily a browsable page or a message-receiving address. Preserve its exact agreed value under the applicable comparison rules.

**Issuer:** The entity making a protocol message or assertion. Its text identifies the claimed sender; approved trust and required protection establish whether the receiver can rely on that claim.

**Assertion Consumer Service (ACS):** The SP service receiving the relevant browser SSO response or artifact under its supported binding. In Okta's outbound SAML app configuration, Single sign-on URL supplies the default application-side ACS.

**NameID:** An identifier for the assertion's subject, interpreted with its format and applicable scope. It is not automatically an email address, an Okta username or the application's internal account ID.

**Subject:** The entity the assertion's statements concern. In the recurring example, this is Devi. SubjectConfirmation describes how that subject may be confirmed when the assertion is presented.

**NameID format:** The identifier's declared semantics. Unspecified requires an agreed interpretation; emailAddress describes email-address form; persistent is a lasting opaque scoped identifier whose value must not be reassigned to another principal; transient is temporary. A format label does not create an account-matching design.

**NameIDPolicy and AllowCreate:** Requested identifier-related requirements. AllowCreate concerns the IdP's creation or association of identifier-related information; it does not enable downstream JIT, create an application account or prove any creation occurred.

**NameQualifier and SPNameQualifier:** Identifier attributes expressing scope where their format permits them. They are not ordinary user profile fields to invent or discard casually. Even without them, an identifier still needs an agreed identity relationship.

**Application username:** The app-specific user value configured in Okta. In the Atlas example it supplies the agreed NameID value. The actual source, output and receiver lookup must agree; the field is distinct from Name ID format.

**Account matching:** Selecting the intended local account from accepted scoped identity information. Atlas maps the approved employee identifier E1042 to account atlas-4821. Matching is separate from checking that the account is enabled or permitted to enter.

**Account linking:** Establishing an association between identities or accounts in different systems. Inbound linking can connect an external identity to an Okta user. Matching email text alone is not universal proof that the association is authorized.

**User or application profile:** A collection of attributes stored for the relevant user or application-user record. The Okta user profile and an app-specific profile can hold different values. Stored source data is separate from emitted SAML information.

**Profile mapping:** A configured relationship moving or deriving data between user/application profiles. Direction matters. An attribute present in a source profile, or a saved mapping, does not prove that a particular SAML field was emitted. This data profile is distinct from a SAML protocol profile.

**Attribute or claim:** Information about the subject, such as department. Okta calls SAML custom claims attribute statements. Agree technical names, types, multiplicity and missing-value behavior; a readable FriendlyName does not replace the technical Name.

**Group statement:** SAML attribute output representing selected group information. Atlas interprets accepted values under its own rules. Releasing more groups does not establish the right permission and can expose unnecessary information.

**Brokering, inbound and outbound:** In the external-provider example, Okta receives an upstream assertion as SP, resolves an Okta identity, then issues a separate downstream response as IdP for Atlas. Trust, requests and account mappings belong to each relationship.

See [Lesson 4](../lessons/lesson-04-responses-assertions-and-identity.md) and [Lesson 5](../lessons/lesson-05-bindings-relaystate-and-alternative-paths.md).

## Acceptance, targets and time

**SAML acceptance:** The receiver's decision that the relevant information satisfies its applicable reliance requirements. This includes more than a signature check and remains separate from local account entry and resource permission.

**Conditions:** Restrictions on use of an assertion, such as its time interval and audience. Their location and combination rules matter. An unknown restriction cannot be ignored simply to obtain a positive result.

**Subject confirmation:** Information defining how the presenter can be associated with the assertion's subject. Evaluate each supported alternative as a whole; do not combine a recipient from one with a deadline from another.

**Bearer confirmation:** Confirmation by possession and presentation of the assertion without a separate subject-specific private-key proof. Required recipient, time, correlation, protection and replay controls remain essential.

| Term or field | Plain-language meaning |
| --- | --- |
| Audience | Intended relying party under the assertion's audience restrictions. For Atlas it is the agreed SP entity ID, not automatically the ACS. |
| Destination | Intended receiving location of the protocol message. On a response it addresses the reply; on an AuthnRequest it addresses the provider endpoint. |
| Recipient | Location at which the selected bearer confirmation permits presentation, evaluated under the applicable profile. It has a different job from Audience. |
| InResponseTo | The initiating request ID that a reply or applicable confirmation answers. It is not the response's own ID. |
| ProtocolBinding | On AuthnRequest, the requested response delivery binding. It does not identify the binding that carried that request. |
| IssueInstant | When a message or assertion was issued. Recent issuance does not prove recent authentication. |
| AuthnInstant | Reported authentication time in AuthnStatement. Use it with the actual freshness requirement, not interchangeably with IssueInstant. |
| NotBefore | Inclusive start of the applicable time interval. Read its XML location; browser bearer confirmation must not acquire this attribute merely to imitate Conditions. |
| NotOnOrAfter | Exclusive end of the applicable interval. Conditions and bearer confirmation can have separate deadlines; the later one does not rescue a failed earlier restriction. |
| validUntil | Metadata expiry. It concerns the affected configuration information, not an application session. |
| cacheDuration | Metadata cache duration before refresh should be attempted. Cache staleness alone is different from invalidity under validUntil. |

**Clock tolerance or skew allowance:** The receiver's supported allowance for clock differences. It is not permission to ignore expiry, conceal delivery delay or extend application-session lifetime.

**Pending request context:** Protected local information about an unfinished sign-in, such as request ID, provider, browser association, requirements, expiry and approved target. It is not already an authenticated application session.

**Correlation:** Establishing that returned information answers the expected request and fits its usable context. A matching ID string alone does not establish approved trust, the intended browser association or permitted reuse.

**RelayState:** Separate binding-level state with an agreed application purpose, such as an opaque lookup for retained navigation context. It is not an assertion field or a replacement for InResponseTo. Its integrity and navigation handling need appropriate controls.

**Replay:** Impermissible reuse of previously accepted bearer information. An assertion can still be within its deadline and have a valid signature when replay controls reject it. Protection must remain effective across relevant receiving nodes.

**Login CSRF:** An unwanted sign-in that can place a browser into a session for an identity its user did not intend to use. Correct signatures do not recreate an absent initiating browser/request relationship.

**Deep link:** The desired destination inside an application, such as projects. An approved navigation target still requires application authorization; successful sign-in does not authorize every supplied URL.

See [Lesson 3](../lessons/lesson-03-sp-initiated-sso.md), [Lesson 4](../lessons/lesson-04-responses-assertions-and-identity.md) and [Lesson 7](../lessons/lesson-07-response-acceptance-and-access.md).

## Trust, signatures and encryption

**Authenticity, integrity and confidentiality:** Origin of information, whether it has changed, and who can read it. A mechanism addressing one goal does not automatically establish the others.

**Trust relationship:** Approved reliance on a particular issuer and its verification material for a defined integration. A certificate or familiar issuer name arriving in a message cannot authorize itself.

**Trust anchor:** Previously approved information used to establish trust. A fingerprint copied from the same unverified message is not an independent anchor.

**Key pair:** Related public and private keys. The private key enables signing or the relevant decryption operation; public information supports the corresponding verification or encryption operation. Keep the operation and owner explicit.

**Certificate:** A container for a public key and associated information. It is not a private key. A receiver's federation trust model can differ from browser website-certificate validation; expiry and revocation handling need documented behavior.

**Fingerprint:** A digest used to compare certificate bytes under an agreed algorithm. A changed certificate fingerprint does not necessarily mean its public key changed. The reference fingerprint also needs an approved source.

**Digital signature:** Protection allowing verification of selected content under a key. It does not hide plaintext or establish that the key is authorized, targets are correct or access is permitted without the other required decisions.

**Hash or digest:** A value calculated from input data. An unkeyed digest match alone does not authenticate who supplied the content. In XML Signature, required reference validation connects the digest to the selected transformed content.

**SignedInfo, Reference and SignatureValue:** Connected XML Signature structures. Reference identifies content and its digest processing. SignatureValue is checked over canonicalized SignedInfo. Required reference validation and signature-value validation are both needed.

**Canonicalization and transforms:** Defined XML processing used to obtain the representation for cryptographic checks. They do not mean every formatting or namespace change is harmless. Preserve the supported processing rules and the exact content used.

**Verified versus consumed content:** The content whose required protection passed versus the content used for the identity or access decision. They must remain connected. Verification of assertion A does not authenticate a NameID read from unrelated assertion B.

**XML signature wrapping:** A class of problems in which verification and application selection become disconnected. The key question is which exact object was verified and which object the application actually used.

**Encryption:** Confidentiality protection for content. Successful decryption recovers data for further checking; it does not prove the approved sender supplied it. A signed plaintext assertion, conversely, can remain readable.

**Content encryption and key transport:** In the illustrated public-key arrangement, a content key protects assertion data, and recipient public-key processing protects that content key. These are separate operations and algorithm settings.

**EncryptedAssertion:** A SAML structure containing protected assertion content. Authorized decryption recovers the assertion. Required outer protection may need checking before decryption; inner signatures require recovered content. There is no universal decrypt-first rule.

**Base64:** A way to represent bytes as text. It provides neither encryption nor trustworthy origin. A readable trace may already have reversed this encoding.

See [Lesson 6](../lessons/lesson-06-trust-signatures-and-encryption.md) and [Lesson 7](../lessons/lesson-07-response-acceptance-and-access.md).

## Okta configuration and evidence

**Okta org:** An organization's Okta environment, with its users, integrations and policies. Obtain real issuer, endpoint and key information from the identified integration's approved setup information, rather than constructing a tenant pattern from an example.

**App integration:** The Okta configuration connecting to an application. It is not the application server, a downstream account or the application session.

**Okta Integration Network (OIN):** A catalog of prepared integrations. The selected integration still needs to match the actual app edition, deployment, requirements and supported behavior.

**App assignment:** Access granted to an Okta integration through the relevant user/group arrangement. It is separate from a usable downstream account or resource permission. Configured provisioning can interact with assignment, but its result needs evidence.

**Global session policy:** Identity Engine policy governing Okta session/authentication context and related requirements. It is distinct from the requested app's sign-in policy and each application's local session rules.

**App sign-in policy:** Identity Engine authentication requirements for accessing the requested integration. An existing Okta session does not necessarily satisfy them, and a resource served entirely by Atlas may not start a new policy evaluation at Okta.

**IdP routing rule:** An Okta rule selecting a provider using available context. Selection is not successful authentication, permission or safe account linking. Do not assume email domain is always the deciding input.

**Assertion preview:** Generated-output inspection in Okta. Useful for checking proposed identity and claims, but not evidence that Atlas received or accepted a particular live attempt.

**System Log:** Okta org-side event evidence. It can help associate user, target, time and processing context. It does not prove Atlas's internal acceptance or authorization, and its diagnostic IDs need not equal SAML message IDs.

The relevant product settings are documented in the [Okta SAML field reference](https://help.okta.com/oie/en-us/content/topics/apps/aiw-saml-reference.htm), [Identity Engine policy overview](https://help.okta.com/oie/en-us/content/topics/identity-engine/policies/about-policies.htm) and [custom-claims guidance](https://help.okta.com/oie/en-us/content/topics/apps/federated-claims-overview.htm).

## Sessions, reauthentication and logout

**Session:** Continuing signed-in state maintained by a system under its own rules. Okta, Atlas and Ledger own separate sessions. Establishing one does not transfer the same session object to the others.

**Cookie:** Browser-held information returned with applicable requests according to scope and browser policy. It can help a service recognize a session. Cookie removal and server-side session invalidation are different actions.

**SessionIndex:** An issuer-provided reference associated with SAML authentication-session information. It can help supported logout associate a subject with sessions. It is not a browser cookie or a LogoutRequest ID.

**SessionNotOnOrAfter:** An optional upper bound for sessions derived from an authentication statement, processed under the applicable profile. It is separate from Conditions expiry and does not promise the application session remains usable until that time.

**Maximum lifetime and idle timeout:** A total-duration limit versus a limit without qualifying activity. Each service defines its starting point and qualifying activity. Ledger use does not automatically reset Atlas's idle timer.

**Reauthentication or freshness:** Establishing authentication again, or meeting a requirement about its recency. A new assertion can report an older authentication time. Reauthentication also does not grant a missing application permission.

**AuthnContext and RequestedAuthnContext:** Reported authentication context versus the SP's requested requirement. A class URI is not a universal count of factors. Requested behavior and observed authentication must be evaluated separately.

**ForceAuthn:** A request for fresh authentication rather than reliance on prior authentication context. It does not universally mean password, MFA or global logout. Okta's Honor Force Authentication setting and actual processing matter.

**IsPassive:** A request constraint against visibly taking control for authentication interaction. It does not permit bypassing an unmet requirement. Combining it with ForceAuthn does not remove either constraint.

**Local logout:** Ending state at one service under its supported implementation. A surviving provider session may support a later new SSO session. Rapid return alone does not prove the old app session survived.

**Single Logout (SLO):** Coordinated logout among an authority and participating services. Actual scope depends on supported configuration, session associations and participant processing. It does not inherently mean every app and device.

**LogoutRequest and LogoutResponse:** Messages requesting termination for the identified relationship and reporting its result. Subject/session targeting, required protection and reply correlation matter. HTTP success alone is not confirmation of termination.

**Front-channel and back-channel:** Browser-carried federation messages versus direct server communication. Okta's documented front-channel feature has feature and participation requirements; generic SAML SOAP logout is a separate protocol example.

**PartialLogout:** A logout result indicating incomplete propagation confirmation. An authority can report top-level Success for its own targeted termination with nested PartialLogout. Unconfirmed participants are not thereby proven active or terminated.

See [Lesson 8](../lessons/lesson-08-sessions-reauthentication-and-logout.md). For product-specific participation, consult the [Okta SLO guide](https://developer.okta.com/docs/guides/single-logout/saml2/main/).

## Account lifecycle and change work

**Provisioning and deprovisioning:** Creating and maintaining accounts/access versus removing or disabling them as required. These processes are distinct from browser sign-in and need supported configuration, ownership and actual results.

**Just-in-time provisioning (JIT):** Supported account creation during sign-in under configured rules. Inbound JIT can create an Okta user; downstream JIT can create an application account. Neither automatically establishes the other or a complete later lifecycle.

**Deactivation:** An account-status action. Okta documents effects on its sessions and assignments, background processing and conditional downstream deprovisioning. Completion and independent application-session results still need evidence. [Okta user deactivation](https://help.okta.com/oie/en-us/content/topics/users-groups-profiles/usgp-deactivate-user-account.htm)

**Certificate replacement and key rollover:** A new certificate can contain the same public key; a true key rollover changes key material. Generation, sender activation and receiver adoption are separate states needing coordination.

**Effective configuration:** The values actually used by the relevant running instance. A proposed setting, published metadata or import screenshot is not necessarily its runtime state.

**Acceptance test and rejection test:** Evidence that intended permitted behavior succeeds versus evidence that intended unacceptable behavior is refused. A generic error does not establish rejection at the boundary the test was meant to exercise.

**Evidence boundary:** The decision or action a source can establish. Browser delivery, Okta processing, SP acceptance, account entry, session creation and resource authorization need appropriately scoped evidence.

**Rollback:** Supported restoration of selected state under the approved policy. It does not automatically undo created accounts, disclosures or established sessions, and it does not make a compromised old key safe.

**Handover:** A maintained record of the integration agreement, sources, effective state, evidence, owners, recovery and unresolved items. Planned tests and proposed corrections remain distinct from verified outcomes.

See [Lesson 9](../lessons/lesson-09-integration-design-and-change-planning.md) and [Lesson 10](../lessons/lesson-10-troubleshooting-and-engineering-casework.md).

## Related protocol names

| Name | Useful orientation |
| --- | --- |
| OpenID Connect (OIDC) | An identity layer using OAuth 2.0. It can support authentication with its own messages and rules; it is not another name for SAML. |
| OAuth 2.0 | An authorization framework for limited access to HTTP services. An access token alone is not a universally suitable application sign-in assertion. |
| SCIM | System for Cross-domain Identity Management. A protocol for identity-resource lifecycle operations, such as users and groups, rather than the SAML browser exchange. |
| LDAP | A directory-access protocol with authentication-related operations. Its presence does not establish that an application uses SAML browser SSO. |
| Kerberos | Ticket-based network authentication. Its tickets are not SAML assertions. |
| WS-Federation | Another federation framework with its own mechanisms. Similar goals do not make its messages interchangeable with SAML. |

See the comparison and primary sources in [Lesson 1, where SAML fits](../lessons/lesson-01-why-saml-exists.md#19-where-saml-fits-beside-other-identity-technologies).

## Sources

- [SAML Core: assertions, identifiers, conditions, authentication and logout](https://docs.oasis-open.org/security/saml/v2.0/saml-core-2.0-os.pdf)
- [SAML Bindings: Redirect, POST, Artifact and SOAP](https://docs.oasis-open.org/security/saml/v2.0/saml-bindings-2.0-os.pdf)
- [SAML Profiles: browser SSO and logout](https://docs.oasis-open.org/security/saml/v2.0/saml-profiles-2.0-os.pdf)
- [SAML Metadata](https://docs.oasis-open.org/security/saml/v2.0/saml-metadata-2.0-os.pdf)
- [SAML Errata 05: identifier, session, protection and metadata clarifications](https://docs.oasis-open.org/security/saml/v2.0/errata05/os/saml-v2.0-errata05-os.pdf)
- [SAML Metadata Interoperability Profile: trust and keys](https://docs.oasis-open.org/security/saml/Post2.0/sstc-metadata-iop.pdf)
- [W3C XML Signature](https://www.w3.org/TR/xmldsig-core1/)
- [W3C XML Encryption](https://www.w3.org/TR/xmlenc-core1/)
- [Okta SAML settings](https://help.okta.com/oie/en-us/content/topics/apps/aiw-saml-reference.htm)
- [Okta System Log](https://help.okta.com/oie/en-us/content/topics/reports/reports_syslog.htm)
