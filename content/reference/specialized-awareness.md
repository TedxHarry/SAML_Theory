# SAML with Okta: specialized capabilities and recognition cues

A partner document may mention SAML features that do not appear in an ordinary Atlas sign-in. Start with the exact requirement: what needs to happen, which participants support it, and what evidence would establish the result? An unfamiliar term is a reason to investigate that relationship, rather than immediately redesign the working integration.

For Okta, establish the engine, integration, direction of federation and documented feature support. A capability defined by SAML is not automatically available in an Okta app integration. The [Okta SAML field reference](https://help.okta.com/oie/en-us/content/topics/apps/aiw-saml-reference.htm) describes specific controls; its presence alone does not establish support for the alternatives below.

## Find the unfamiliar feature

| Recognition cue | Look here |
| --- | --- |
| `holder-of-key`, subject key information | [Holder-of-key confirmation](#holder-of-key-confirmation) |
| ECP, PAOS, `application/vnd.paos+xml` | [Enhanced client or proxy](#enhanced-client-or-proxy) |
| `AuthnQuery`, `AttributeQuery`, `AuthzDecisionQuery` | [Queries and assertion requests](#queries-and-assertion-requests) |
| `AssertionIDRequest`, URI binding | [Retrieving an identified assertion](#retrieving-an-identified-assertion) |
| `ManageNameIDRequest`, `NameIDMappingRequest` | [Name identifier protocols](#name-identifier-protocols) |
| HTTP-POST-SimpleSign, form `Signature` and `SigAlg` | [POST-SimpleSign](#post-simplesign) |
| `EntitiesDescriptor`, federation operator, metadata aggregate | [Federation metadata and operators](#federation-metadata-and-operators) |
| Conformance claim, operational mode, feature matrix | [Formal conformance](#formal-conformance) |
| `OneTimeUse`, `ProxyRestriction`, an unfamiliar format URI | [Additional conditions and formats](#additional-conditions-and-formats) |
| SAML 1.0 or 1.1 in a vendor requirement | [Earlier SAML versions](#earlier-saml-versions) |

## Holder-of-key confirmation

Holder-of-key associates subject confirmation with a specified key. Recognize `urn:oasis:names:tc:SAML:2.0:cm:holder-of-key` and key information in SubjectConfirmationData. The applicable profile determines how the presenter demonstrates the required key relationship. [SAML Profiles, §3.1](https://docs.oasis-open.org/security/saml/v2.0/saml-profiles-2.0-os.pdf)

Keep the subject-confirmation key separate from the issuer's signing key and the SP's decryption key. Seeing a signed assertion does not establish holder-of-key confirmation. The [trust reference](trust-and-protection.md#locate-the-protected-layer) helps separate these questions.

Investigate this when a partner explicitly requires key-based subject confirmation. Ask which profile and client mechanism implement it, how the receiver verifies the demonstration, and whether both products support that exact arrangement. Merely changing the confirmation-method URI in an otherwise bearer example would not establish it.

## Enhanced client or proxy

The Enhanced Client or Proxy profile, ECP, involves a capable client or proxy in authentication. PAOS is the reverse-SOAP binding used in this profile. Recognition cues include SOAP envelopes, the PAOS HTTP header and `application/vnd.paos+xml`. [SAML Profiles, §4.2](https://docs.oasis-open.org/security/saml/v2.0/saml-profiles-2.0-os.pdf), [SAML Bindings, §3.3](https://docs.oasis-open.org/security/saml/v2.0/saml-bindings-2.0-os.pdf)

This matters when an application's documentation explicitly describes an ECP-capable client. Identify that client and its authentication capabilities before proposing a solution. A command-line HTTP client following redirects is not, by itself, evidence of ECP support. Likewise, the word “proxy” in a network diagram does not establish that the proxy implements this SAML profile.

## Queries and assertion requests

These message names identify different requests to a SAML authority:

| Message | Purpose | Useful distinction |
| --- | --- | --- |
| `AuthnQuery` | Ask for authentication statements about a subject. | Different from an AuthnRequest asking for an authentication response. |
| `AttributeQuery` | Ask for subject attributes. | Different from SCIM account provisioning. |
| `AuthzDecisionQuery` | Ask for an authorization decision about a resource/action. | Different from Atlas's ordinary local permission check. |

The definitions are in [SAML Core, §§3.3.2.2–3.3.2.4](https://docs.oasis-open.org/security/saml/v2.0/saml-core-2.0-os.pdf). The [query/request profile, Profiles §6](https://docs.oasis-open.org/security/saml/v2.0/saml-profiles-2.0-os.pdf), describes their profiled use.

Investigate a query when an architecture identifies a separate authority and query service. Establish who may request which information and for what purpose. For example, a missing department claim in Atlas's existing sign-in does not establish a need for AttributeQuery. First compare the agreed claim contract and actual emitted output.

## Retrieving an identified assertion

`AssertionIDRequest` asks for an assertion by its identifier. [SAML Core, §3.3.1](https://docs.oasis-open.org/security/saml/v2.0/saml-core-2.0-os.pdf)

The SAML URI binding retrieves an assertion through a URI; it is not a general transport for arbitrary SAML requests and responses. Its identifier ends in `bindings:URI`. [SAML Bindings, §3.7](https://docs.oasis-open.org/security/saml/v2.0/saml-bindings-2.0-os.pdf)

Investigate these when a partner explicitly describes assertion retrieval. Establish the retrieval service, authorization, trust and acceptance requirements. Do not equate an assertion ID, a URI reference and a SAML artifact merely because all can refer to something. The [Artifact explanation](binding-comparison.md#understand-what-artifact-adds) describes that separate arrangement.

## Name identifier protocols

`ManageNameIDRequest` concerns changing or terminating a federation identifier relationship. `NameIDMappingRequest` seeks another identifier for the same principal in a particular format or federation namespace. [SAML Core, §§3.6 and 3.8, with applicable errata](https://docs.oasis-open.org/security/saml/v2.0/saml-core-2.0-os.pdf)

These protocols differ from Atlas matching accepted `E1042` to its existing account. They also differ from configuring the application username or NameID output in Okta. Everyday [identifier-to-account mapping](field-comparison-and-message-anatomy.md#identifier-formats-and-attribute-values) does not imply either protocol is being used.

Investigate them when a partner explicitly requires protocol-managed federation identifiers. Establish ownership of identifier changes and account continuity. A requirement to rename a local account should first be examined against the application's supported lifecycle and linking behavior.

## POST-SimpleSign

POST-SimpleSign defines a separate POST binding whose message-signing mechanism treats the message as an octet string rather than using XML Signature for that message protection. Recognition cues include its binding identifier and `Signature`/`SigAlg` form controls. The linked specification identifies itself as **Committee Draft 03**. [OASIS POST-SimpleSign, introduction and signature construction](https://docs.oasis-open.org/security/saml/Post2.0/sstc-saml-binding-simplesign-cd-03.html)

Investigate this only when the partner's actual binding requirement names it. POST delivery alone does not identify SimpleSign, and a form field called Signature needs interpretation under the selected mechanism. Do not change ordinary POST XML-signature verification to this mechanism as a speculative fix. Compare the exact supported binding with the [binding reference](binding-comparison.md).

## Federation metadata and operators

An `EntitiesDescriptor` can group multiple entities, including nested groups. A federation operator may distribute a metadata aggregate describing many participating organizations. The container and its entity records are configuration information, not a user's authentication response. [SAML Metadata, §§2.3.1–2.3.2](https://docs.oasis-open.org/security/saml/v2.0/saml-metadata-2.0-os.pdf)

For an operational example, [eduGAIN’s metadata guidance](https://technical.edugain.org/metadata) describes an aggregate intended for participating federations, rather than direct consumption by individual IdPs or SPs. Distribution arrangements need to be understood in their own context.

This may be central to a project involving a federation operator or many institutional partners. Determine the authoritative distribution source, trust model, participating entities, refresh/expiry handling and local acceptance policy. Receiving an aggregate does not automatically mean every listed entity is authorized for every local purpose.

Keep operator trust, individual issuer trust and effective receiver configuration explicit. A signed aggregate requires an approved basis for trusting its signer. Metadata refresh does not automatically revoke every application session established earlier. The [planning reference](integration-planning-changes-and-handover.md) helps record these dependencies and owners.

## Formal conformance

SAML conformance distinguishes operational modes and combinations of profiles, messages and bindings. A broad “SAML 2.0 compliant” statement needs that scope before it can answer an integration question. [SAML Conformance Requirements, §§3.1–3.2](https://docs.oasis-open.org/security/saml/v2.0/saml-conformance-2.0-os.pdf)

Use this when evaluating a product claim or comparing requirements with supported behavior. Ask for the precise supported role and exchange, required options and relevant implementation evidence. Neither a vendor label nor a schema-valid example establishes that Atlas's complete contract works. Conversely, a successful Atlas sign-in does not establish support for every SAML protocol.

## Additional conditions and formats

`OneTimeUse` constrains assertion reuse; `ProxyRestriction` constrains downstream assertion issuance. The latter does not mean an HTTP reverse-proxy setting. An unfamiliar NameID format or attribute profile also needs its defined semantics. [SAML Core, §§2.5.1.5–2.5.1.6 and §8.3](https://docs.oasis-open.org/security/saml/v2.0/saml-core-2.0-os.pdf)

Investigate these when they appear in an actual supported contract or message. Record the exact location and identifier, then check the receiving implementation's handling. An unfamiliar condition is not something to delete or ignore to make validation succeed. Absence of OneTimeUse also does not authorize replay of browser bearer assertions; use the [response-acceptance requirements](response-validation-and-acceptance.md#associate-the-requested-reply-and-prevent-replay).

Recognition examples include `X509SubjectName` and `WindowsDomainQualifiedName` in NameID format identifiers. For an unusual format, obtain representative approved values and verify the intended matching rule. Changing a format label alone cannot establish that the emitted value has the required meaning.

## Earlier SAML versions

SAML 1.0 and 1.1 belong to earlier protocol versions. Version-specific documents, message structures and profiles need to be read in their own context. The [OASIS Technical Overview](https://docs.oasis-open.org/security/saml/Post2.0/sstc-saml-tech-overview-2.0.html), an explanatory Committee Draft, provides architectural and historical context alongside the normative specifications.

This matters when maintaining an older integration or planning a supported migration. Obtain the actual version and vendor migration guidance. Do not assume that renaming an XML element or replacing a namespace converts an integration to SAML 2.0.

A NameID format URI containing `1.1` is not enough to classify a message as SAML 1.1. Read the [format explanation](field-comparison-and-message-anatomy.md#identifier-formats-and-attribute-values) and the message's actual version and namespaces together.

## Turn recognition into a useful investigation

Suppose an Atlas partner document says it requires ECP, while the available integration evidence describes a browser Redirect/POST exchange. Record the requirement and the mismatch. Ask the partner to identify the supported client, profile and endpoints; obtain corresponding Okta support information for the intended relationship. Until that is established, a working ordinary browser sign-in does not settle the ECP requirement.

The same approach applies to any unfamiliar feature: identify its purpose, locate the authoritative definition, establish actual product support, and agree on the evidence needed for the intended result. The [sources guide](sources-and-further-reading.md) helps separate protocol rules, product documentation and runtime evidence.
