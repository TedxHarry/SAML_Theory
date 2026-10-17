# Lesson 6: Trust, signatures, encryption, and certificate lifecycle

## 1. Which protection does each observation establish?

In a fictional Okta-to-Atlas browser POST sign-in, an engineer observes these facts independently:

| Observation | Fact |
| --- | --- |
| A | The assertion is Base64 encoded. |
| B | A supplied unkeyed hash matches the supplied content. |
| C | Required signature checks pass over the intended assertion using Atlas's approved key for the expected Okta issuer. |
| D | Atlas decrypts content encrypted for its recipient key. |
| E | The browser's separate connections to Okta and Atlas use correctly established HTTPS. |

Which observations alone establish neither secrecy nor trustworthy origin? Does C make the assertion unreadable? Does D prove that Okta supplied it? Does E replace message-level checks?

<details>
<summary>Show explanation</summary>

A is a representation of bytes as text. It does not provide secrecy or trustworthy origin. B also does not authenticate the supplier: someone replacing content can calculate a new unkeyed hash for that replacement.

C establishes the stated signature result over the selected content under approved trust. A signed plaintext assertion can still be readable. Target, time, correlation, account and access requirements remain separate checks.

D establishes the supplied decryption result, not the approved sender's identity. Someone with Atlas's public encryption information can encrypt content for Atlas. E protects the respective connections under their TLS rules, but the browser-mediated journey contains separate connections. It does not replace the required SAML protection and acceptance checks. Message protection likewise does not make TLS unnecessary for sensitive traffic or session cookies.

</details>

## 2. Match the certificate to the operation and direction

Northstar's approved Atlas integration has three operations: Okta signs assertions for Atlas, Atlas signs authentication requests to Okta, and Okta encrypts assertions for Atlas. Separate supported keys are used for these purposes.

Daniel sees Okta app fields named Signature Certificate and Encryption Certificate. He proposes uploading Okta's own signing certificate into both and asking Atlas to supply its private key so encryption will work.

Explain the correct ownership and public-material exchange. Which operation does the app form's Signature Certificate concern?

<details>
<summary>Show explanation</summary>

| Operation | Private capability stays with | Public material used by the other side |
| --- | --- | --- |
| Okta signs assertions | Okta | Atlas receives approved Okta verification material. |
| Atlas signs requests | Atlas | Okta receives approved Atlas verification material. |
| Okta encrypts for Atlas | Atlas retains its private decryption key | Okta receives Atlas's approved public encryption certificate. |

The app form's Signature Certificate is for validating application-supplied sign-in and logout requests. It is not another label for the Okta signing certificate Atlas needs. Encryption Certificate identifies the public recipient material for encrypted assertions. [Okta SAML field reference, advanced settings](https://help.okta.com/oie/en-us/content/topics/apps/aiw-saml-reference.htm)

Okta does not need Atlas's private key to encrypt for it. Read the operation and direction before choosing a certificate; a familiar field name does not make all certificate files interchangeable.

</details>

## 3. Does a matching fingerprint create approved trust?

Atlas expects Northstar's approved Okta issuer. A received message claims that issuer and includes an unfamiliar certificate in KeyInfo. A utility reports that the signature verifies under the included public key. Daniel calculates the certificate's SHA-256 fingerprint and finds it matches a fingerprint printed in the same unverified message. No approved metadata or change record authorizes this key.

Is that enough to accept the key for this issuer? What would make a fingerprint comparison useful?

<details>
<summary>Show explanation</summary>

The message has not established why this key is authorized for the claimed issuer. A sender can supply its own certificate, issuer text and matching fingerprint. Agreement among those supplied values is not an independent trust decision.

A fingerprint helps compare certificate bytes when both parties use the agreed algorithm. It becomes useful for trust establishment when the reference value comes through an authenticated, authorized process for the intended relationship.

Compare the candidate with approved provider information and the effective receiver trust configuration. The supplied verification result concerns the included key and covered content; it does not authorize silently replacing Atlas's trusted key. Readable KeyInfo can help identify a candidate without becoming permission to trust it.

</details>

## 4. Must federation certificates behave like website certificates?

Atlas's documented federation trust model uses keys from authenticated, accepted metadata under the SAML Metadata Interoperability Profile. Its SAML signature decision does not apply the browser's website-certificate chain and hostname checks. The accepted metadata contains a self-signed signing certificate whose key remains approved.

A reviewer proposes rejecting it solely because it is self-signed, while accepting a different certificate solely because it chains to a public certificate authority. Are those decisions justified under the supplied model? What should an unfamiliar receiver's expiry behavior be based on?

<details>
<summary>Show explanation</summary>

Neither conclusion follows from the stated federation model. The approved relationship comes through metadata acceptance. Self-signing is not automatically disqualifying, and a public certificate chain does not automatically authorize a key to sign for this Okta issuer.

Website TLS validation and federation-key acceptance can use different rules. This question supplies a particular documented profile model, rather than claiming every SAML receiver behaves that way. [SAML Metadata Interoperability Profile, key processing](https://docs.oasis-open.org/security/saml/Post2.0/sstc-metadata-iop.pdf)

For an unfamiliar receiver, establish its documented and enforced trust, certificate-expiry and revocation behavior. Plan changes before the applicable operational deadlines. Do not assume every receiver rejects an expired certificate, or that an unexpired certificate remains authorized after its key has been removed from trust.

</details>

## 5. Which layer protects the outer response?

Atlas's integration requires a signed assertion. A supplied scope inspection establishes that the signature references only assertion `_assert_Q06_SCOPE` and covers its issuer, subject, conditions and statements. The enclosing Response has no separate signature. Its status and Destination are outside the assertion reference.

Does this assertion signature protect the outer status and Destination? Conversely, would a response-only signature satisfy the supplied signed-assertion requirement merely because the amended browser POST profile permits response signing?

<details>
<summary>Show explanation</summary>

The assertion signature does not extend to the enclosing Response's fields. Atlas must still apply their required processing, but it cannot claim that this particular signature covers them.

A correctly constructed response signature can protect the response and enclosed content under its actual reference and transforms. That is a different protection arrangement. Permission in the amended profile to use response signing does not override Atlas's specifically agreed assertion-signing requirement. [SAML Errata 05, E93](https://docs.oasis-open.org/security/saml/v2.0/errata05/os/saml-v2.0-errata05-os.pdf)

Locate the reference and covered content, then compare the result with the integration's requirements. The visual presence of a signature somewhere in the document is not a complete description of what was protected or what the receiver must enforce.

</details>

## 6. Read the two connected signature checks

This standalone XML Signature fragment is a fictional reading aid. The reference target is outside the fragment. Both AA== values are deliberately unusable cryptographic placeholders, not a real SHA-256 digest or valid signature. The fragment is not verifiable signed SAML.

```xml
<ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
  <ds:SignedInfo>
    <ds:CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#" />
    <ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256" />
    <ds:Reference URI="#_assert_Q06_READ">
      <ds:Transforms>
        <ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature" />
        <ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#" />
      </ds:Transforms>
      <ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" />
      <ds:DigestValue>AA==</ds:DigestValue>
    </ds:Reference>
  </ds:SignedInfo>
  <ds:SignatureValue>AA==</ds:SignatureValue>
</ds:Signature>
```

Which object does Reference select? What do reference validation and signature-value validation each check? Would either check alone establish the required protection of the content? Why can a receiver operate without KeyInfo appearing here?

<details>
<summary>Show explanation</summary>

The reference selects the same-document assertion whose ID is `_assert_Q06_READ`. The fragment marker `#` is not part of that assertion ID.

Reference validation recomputes the digest over the selected content after its declared transforms and compares it with DigestValue. Signature-value validation checks SignatureValue against canonicalized SignedInfo using the permitted method and verification key. Both are needed for the required connected result; a digest match alone does not authenticate the supplier, and checking only the signature value leaves required content-reference validation unresolved.

KeyInfo is optional because the receiver can obtain its approved verification key from configuration. These relationships explain what software must check; the placeholder values demonstrate none of those checks succeeding. [W3C XML Signature, core validation](https://www.w3.org/TR/xmldsig-core1/)

</details>

## 7. Does canonicalization ignore every XML change?

Consider three small XML values in isolation, without namespaces or surrounding context:

| Version | XML |
| --- | --- |
| A | `<item a="1" b="2"/>` |
| B | `<item b="2" a="1"></item>` |
| C | `<item a="9" b="2"/>` |

The selected process uses exclusive canonicalization. Which two have the same canonical representation? Does that result justify arbitrary pretty-printing of a signed SAML document or ignoring text whitespace?

<details>
<summary>Show explanation</summary>

A and B both become `<item a="1" b="2"></item>` in this deliberately limited example. Attribute ordering and empty-element notation are normalized by the defined process.

C changes the attribute value, so it has different canonical content. Canonicalization does not mean “treat XML that looks similar as identical.” Text whitespace and namespace context can affect the result, and the selected algorithms and transforms matter.

Do not generalize this small equivalence into permission to tidy a signed document. Preserve the relevant evidence and use the supported signature-processing implementation. A formatting change that seems cosmetic to a reader is not automatically irrelevant to cryptographic processing.

</details>

## 8. Did the application use what it verified?

Atlas receives a fictional document containing assertions A and B. Its diagnostic proves required signature validation over A using the approved key. A identifies Devi as `E1042`. The application then uses an unrestricted XML search that selects B's NameID, `E9009`, for account lookup. No evidence establishes the required protection for B.

Can Atlas rely on the successful check over A to authenticate the identity it consumed from B? What relationship must a safe implementation preserve?

<details>
<summary>Show explanation</summary>

The result over A does not protect an identity read from B. The supplied facts identify a mismatch between the verified object and the object consumed for the application decision.

The implementation must select the intended content unambiguously under its supported SAML rules and use the content whose required protection passed. A generic search for the first convenient NameID does not establish that connection. This distinction is central to recognizing signature-wrapping problems.

Approved keys and successful cryptographic checks do not excuse unsafe object selection. Use a maintained implementation with safe XML and signature processing, investigate the specific selection mismatch, and verify the intended identity and rejection behavior after correction. The packet does not establish whether the mismatch arose from malicious input or an ordinary implementation defect.

</details>

## 9. Can every encrypted assertion be processed in the same order?

Compare two explicitly supported fictional arrangements:

| Arrangement | Protected layers |
| --- | --- |
| A | A readable signed assertion inside a response. |
| B | A signed assertion is encrypted for Atlas, and the ciphertext-containing response also has an outer signature. |

An engineer proposes always decrypting first, verifying afterward, and considering decryption proof that Okta sent the assertion. Explain the limits of that rule. Also distinguish content encryption from key transport in a public-key XML Encryption arrangement.

<details>
<summary>Show explanation</summary>

A has no encrypted assertion to decrypt. In B, the inner assertion signature cannot be checked until the relevant plaintext is recovered, but required outer protection may need verification before decryption. The supported construction and secure receiver processing determine the actual order. Historical CBC constructions are one reason a universal decrypt-first rule is unsafe.

Decryption also does not authenticate the approved sender. A party with Atlas's public encryption information can encrypt content for Atlas. Required trust, signatures and SAML restrictions still apply.

Content encryption protects assertion data, commonly with a symmetric content key. Key transport protects that content key for the recipient. Those are different algorithms and settings, even though both participate in the encrypted arrangement. They must match the supported integration rather than be inferred from the word “encrypted.”

</details>

## 10. Is an approved certificate enough to approve every algorithm?

Atlas recognizes the approved provider key in a received certificate. The certificate itself was signed using SHA-256, but the SAML signature uses a SHA-1-based SignatureMethod and its reference uses SHA-1 as DigestMethod. Atlas's current approved policy rejects both of those SAML choices. No other failure has been established.

A colleague proposes accepting the message because the certificate says SHA-256. Which algorithm roles were confused? Would changing the assertion-encryption algorithm address this signature-policy failure?

<details>
<summary>Show explanation</summary>

The certificate's signature algorithm is separate from the SAML SignatureMethod and reference DigestMethod. Its SHA-256 label does not change the algorithms used for the received XML signature and content digest.

The message fails the supplied SAML algorithm policy even though the key is recognized. Select a currently approved combination supported by sender and receiver, then verify the actual emitted methods and processing result. Contemporary defensive guidance rejects SHA-1-based SAML signatures and digests. [OWASP SAML security guidance](https://cheatsheetseries.owasp.org/cheatsheets/SAML_Security_Cheat_Sheet.html)

An assertion-encryption algorithm serves a different operation. Changing it does not repair the stated signature and digest choices. Keep key approval, algorithm policy and successful cryptographic processing distinct.

</details>

## 11. What changed when the new certificate was generated?

Northstar uses symbolic signing-key labels K1 and K2 for a planned Atlas rollover. Daniel generates the intended new certificate material in Okta. At the observation time, K1 is still the active signing key, a captured response uses K1, and Atlas's effective trust configuration contains only K1. No receiver update has been performed.

Has generation switched signing or prepared Atlas for K2? Which facts should a change record distinguish before claiming the rollover succeeded?

<details>
<summary>Show explanation</summary>

The supplied observations show availability of new material, continued signing with K1 and receiver trust still limited to K1. Generation has established neither sender activation of K2 nor Atlas adoption of K2.

Record the approved new material, selected active sender state, observed signing key and effective receiver trust. Also identify the integration and relevant receiving instances, update mechanism and owners. Okta documents generation and activation as distinct management actions; the receiver's supported adoption process is another responsibility. [Okta signing certificate management](https://help.okta.com/oie/en-us/content/topics/apps/manage-signing-certificates.htm)

Success requires an actual K2-based result under the intended trust configuration, followed by the relevant application outcome. A new certificate appearing in a list is not that evidence, and a metadata publication does not prove the receiver consumed it.

</details>

## 12. Read a cutover across two receiving nodes

On 20 October 2026, Northstar plans an uncompromised-key rollover with approved overlap support. All times are UTC. K1 remains acceptable during the stated overlap.

| System | Effective signing or trust state |
| --- | --- |
| Okta | Signs with K1 before 10:00; signs with K2 from 10:00 onward. |
| Atlas node A | Trusts K1 throughout; additionally trusts K2 from 09:30. |
| Atlas node B | Trusts only K1 until 10:20; then additionally trusts K2. |

At 10:05, K2-signed attempts reach each node. Both nodes use the same documented rule requiring an approved verification key. What configuration outcome should the teams expect at each node? Is importing K2 on A sufficient evidence to remove K1 everywhere?

<details>
<summary>Show explanation</summary>

At 10:05, node A is prepared to verify using approved K2. Node B has no configured approved K2 and cannot satisfy that key requirement for these attempts. This identifies a configuration difference; A's readiness does not by itself prove the message's signature bytes or every later acceptance check pass.

One successful import is not evidence of all-node adoption. Confirm the sender's observed key, effective trust on every relevant receiver, actual K2-based processing results and the agreed handling of in-flight messages, caches and recovery.

Only then retire K1 under the approved plan. Overlap preserves K1's authority while it lasts, so its duration needs a reason. This schedule is an example coordination plan, not a standard SAML waiting period or an Okta guarantee.

</details>

## 13. What if Atlas can trust only one key?

The Atlas team's documentation says this deployment accepts exactly one verification key for its Okta relationship. K1 is currently approved and uncompromised. A proposed change plan assumes K1 and K2 can overlap because another application supports multi-key trust. No supported fallback process has been confirmed.

Can the team reuse that plan? What must a supported replacement and recovery plan establish instead?

<details>
<summary>Show explanation</summary>

The plan assumes a capability this Atlas deployment does not have. Another application's overlap support is not evidence of support here.

Coordinate the sender switch and receiver replacement through documented mechanisms. Establish sequencing, the expected service impact or maintenance arrangement, owners, effective configuration checks and the evidence for a successful retest. Agree on recovery conditions before the change.

A rollback to K1 is possible only if K1 remains permitted, can be selected through the supported sender process and is trusted by the relevant receiver after any required restoration. Do not promise an automatic reversal. Accepting any certificate in the next incoming message would bypass approved trust rather than provide safe overlap.

</details>

## 14. What does a generic signature error establish?

Devi authenticates at Okta and the browser submits a response to Atlas. Atlas's only supplied diagnostic is “signature invalid.” There is no captured protection evidence, algorithm result, effective key inventory or object-selection detail. A certificate change occurred recently, but its relationship to this attempt is unknown.

Can the engineer conclude that Atlas lacks the new certificate? What evidence would distinguish that possibility from other failures?

<details>
<summary>Show explanation</summary>

The recent change makes a key mismatch worth investigating, but the generic error does not establish it. Altered signed content, an unsupported or rejected algorithm, incorrect reference handling and an unapproved verification key can produce different failures behind a broad label.

Inspect the exact integration and attempt, actual signing material, receiver's effective approved keys, required signature layer, allowed algorithms, reference validation and signature-value result through supported diagnostics. Where multiple nodes exist, compare their effective state and import or refresh history.

If later evidence specifically says no approved key matches the observed K2, that supports a key-configuration diagnosis. Without it, do not report a guessed cause or disable verification merely to remove the visible error. Changing the ACS is also unsupported by the facts supplied here.

</details>

## 15. Did a new certificate necessarily introduce a new key?

Under an agreed SHA-256 certificate-fingerprint procedure, certificate C1 and its approved replacement C2 have different fingerprints. An independent public-key comparison establishes that both certificates contain exactly the same public key. Atlas's certificate and key-acceptance rules have not yet been checked for the replacement.

Does this prove a signing-key rollover? What might still need coordination even though the public key is unchanged?

<details>
<summary>Show explanation</summary>

This is a certificate replacement using the same public key, not evidence of a change to the key material. Certificate fingerprints compare certificate bytes; a certificate can change while carrying the same key.

Atlas may nevertheless need a supported update depending on whether it pins a particular certificate, trusts the key through metadata or enforces other relevant certificate rules. The scenario deliberately leaves those receiver behaviors unknown. Neither universal acceptance nor universal rejection is established.

Confirm the authorized replacement, effective sender and receiver behavior, applicable deadlines and the required test outcomes. Describing the change accurately helps the team avoid both an unnecessary key-rollover diagnosis and an assumption that unchanged key bytes make every configuration update irrelevant.

</details>

## 16. Is a compromised key a safe rollback option?

During an Atlas certificate change, evidence indicates that K1's private signing key may be controlled by an attacker. Some receivers trust K1 directly and do not consult certificate-revocation services. K2 is the intended replacement, but adoption has not yet been verified on every receiver. Users also have application sessions created before the incident.

A recovery proposal retains K1 for convenient overlap, rolls signing back to it if K2 fails, and assumes certificate revocation will automatically end all existing Atlas sessions. Which assumptions are unsafe, and what should the incident response separate?

<details>
<summary>Show explanation</summary>

Continuing to trust K1 preserves the authority of anyone holding that private key. Convenience overlap and rollback conditions for an uncompromised planned change do not carry over to this incident.

Coordinate approved trust removal and replacement under the organization's incident process, accounting for the actual receivers and verified K2 adoption. Revocation alone cannot remove trust at receivers that do not consult the revocation mechanism. Confirm the effective trust decision rather than treating publication of revocation as proof of enforcement.

Previously created application sessions require their own incident assessment and supported termination or containment decisions. Removing a verification key does not automatically erase every session established earlier. Keep replacement readiness, compromised-key authority and existing-session exposure as separate responsibilities with explicit evidence and owners.

</details>

## Sources

- [W3C XML Signature, validation and signature structure](https://www.w3.org/TR/xmldsig-core1/)
- [W3C Exclusive XML Canonicalization](https://www.w3.org/TR/xml-exc-c14n/)
- [W3C XML Encryption, data and key protection](https://www.w3.org/TR/xmlenc-core1/)
- [SAML Metadata Interoperability Profile, key trust and processing](https://docs.oasis-open.org/security/saml/Post2.0/sstc-metadata-iop.pdf)
- [SAML Errata 05, POST protection and encrypted-content integrity: E93](https://docs.oasis-open.org/security/saml/v2.0/errata05/os/saml-v2.0-errata05-os.pdf)
- [Okta SAML field reference](https://help.okta.com/oie/en-us/content/topics/apps/aiw-saml-reference.htm)
- [Okta signing certificate management](https://help.okta.com/oie/en-us/content/topics/apps/manage-signing-certificates.htm)
- [OWASP SAML security guidance](https://cheatsheetseries.owasp.org/cheatsheets/SAML_Security_Cheat_Sheet.html)
