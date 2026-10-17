# Connect the concepts: mixed review

Use these checkpoints after lessons 3, 6 and 10. Each case supplies its own facts. Before opening an explanation, say what is established, what remains unknown and which evidence you would seek next. You can answer aloud or write a short investigation note.

## Checkpoint 1: authentication, configuration and the browser

### 1. A usable session is not a federation test

Devi opens Atlas and sees projects using an existing Atlas session. A new Okta signing certificate was configured earlier that morning. No SAML exchange occurs during this visit. What passed, and what still needs testing?

<details><summary>Reveal the reasoning</summary>

The existing local session authorized this resource request. The visit did not exercise response issuance or the new signing-key trust. Start a controlled fresh exchange with the relevant session states recorded, then confirm the actual signing key, receiver acceptance, intended account and resource result.

</details>

### 2. Three similar-looking values

Atlas's entity ID is `urn:atlas:test`, its ACS is `https://atlas.example/saml/acs`, and Devi's employee ID is `E1042`. A received assertion places `E1042` in Audience and `urn:atlas:test` in NameID. Why does reaching the ACS not make the exchange correct?

<details><summary>Reveal the reasoning</summary>

The ACS establishes where delivery occurred. Audience identifies the intended relying party, while NameID identifies the subject under the agreed mapping. Here their values have been confused. Successful HTTP delivery does not fix targeting or identity semantics. Correct the integration contract and inspect newly issued values; do not simply accept the swapped data.

</details>

### 3. Assigned, authenticated, still no entry

Okta confirms assignment and satisfied authentication policy for a new Atlas attempt. Atlas's receiver accepts the SAML response, but finds no local employee account. JIT is disabled. Which team boundary needs attention, and what is not yet known?

<details><summary>Reveal the reasoning</summary>

The first confirmed failure is local account readiness or mapping. Determine whether the intended account is absent or the received identifier disagrees with the approved lookup. Assignment and authentication do not prove provisioning. The evidence does not justify automatically creating an account or granting a role.

</details>

### 4. A matching string is incomplete correlation

Atlas receives InResponseTo `_req_71`, which exists in its request store but belongs to another browser transaction and a different expected provider. RelayState points to a valid projects page. Can Atlas rely on those two matching-looking values alone?

<details><summary>Reveal the reasoning</summary>

No. The response must fit the actual protected transaction context, including the expected provider and browser association. RelayState restores constrained context or navigation; it does not replace SAML correlation. Inspect the correct pending transaction rather than changing stored expectations to match the incoming reply.

</details>

## Checkpoint 2: identity, message delivery and protection

### 5. Readable is not trusted

A browser capture contains a Base64 SAMLResponse. Atlas decodes it and finds NameID `E1042`. No signature result is available. What has succeeded, and what would be premature?

<details><summary>Reveal the reasoning</summary>

Decoding and reading the reported identifier succeeded. Authentication of the protected identity information has not been established. Base64 is transport encoding. Do not create a session from readable text before the applicable trust, profile and local account checks succeed.

</details>

### 6. A signature can protect the wrong thing

An XML document contains signed Assertion A and unsigned Assertion B. The receiver verifies A but uses B's NameID to select an account. B happens to have the expected audience. What is the decisive defect?

<details><summary>Reveal the reasoning</summary>

The consumed identity comes from an object whose required authenticity was not established. Correct audience text in B does not repair that defect. Bind processing to the exact verified object and required protection scope; adding more superficial field checks to the unsigned object is insufficient.

</details>

### 7. The correct profile value is not a released claim

Devi's Okta profile contains department `Research`. A live, trusted assertion contains no department attribute, and Atlas denies entry because it requires one. Should the first repair change Atlas's reader-role permissions?

<details><summary>Reveal the reasoning</summary>

No. The established gap is claim issuance or the agreed output contract, before the intended role mapping can use that claim. Inspect the actual expression, source and emitted name/value. A populated source does not prove release. The cause of the omission remains to be established.

</details>

### 8. One broker, two relationships

An external IdP authenticates Devi to Okta. Okta issues a new assertion to Atlas, which rejects Audience `urn:ledger:test`. Which relationship needs inspection first? Does upstream success prove Atlas should accept?

<details><summary>Reveal the reasoning</summary>

Inspect downstream Okta-to-Atlas targeting and the intended integration. Upstream authentication does not establish the downstream audience or account result. Replacing the external IdP's signing certificate would not address the supplied downstream audience mismatch.

</details>

## Checkpoint 3: validation, sessions and engineering evidence

### 9. Two clocks, one expired confirmation

At 11:04 UTC, an otherwise acceptable response has Conditions ending at 11:10 and its sole applicable bearer confirmation ending at 11:03. No tolerance applies. Explain why an 11:10 Conditions limit is not enough, and what this says about an unrelated existing application session.

<details><summary>Reveal the reasoning</summary>

The bearer confirmation is expired and cannot support acceptance. All relevant restrictions must hold together. This does not establish the state of an unrelated existing session, which has its own applicable lifetime and policy. Do not extend an assertion deadline to repair a session problem that has not been observed.

</details>

### 10. Expected denial is evidence of a working boundary

Noor signs in as an enabled reader, reaches projects, then receives an administrative denial. The same account and session are recorded for both requests. Which outcome needs repair?

<details><summary>Reveal the reasoning</summary>

None is shown to violate the stated requirements. Sign-in and projects access succeeded, and the reader's administrative denial is expected. Keep the denial as a positive authorization-boundary test. Do not broaden permissions merely to make every page succeed.

</details>

### 11. Returning after logout

Atlas logs termination of its old session. A new browser visit starts SAML, Okta reuses its acceptable session, and Atlas creates a different session. Does the later access prove the old session survived?

<details><summary>Reveal the reasoning</summary>

No. The supplied evidence shows replacement state through a new sign-in. Whether broader logout was required is a separate scope question. If required, check supported provider and participant termination mechanisms instead of treating rapid SSO as proof that local invalidation failed.

</details>

### 12. A change and a separate mapping defect

K2-signed responses fail on Atlas node B, whose effective trust contains only K1. Node A trusts K2 and accepts SAML, but Devi's email NameID finds no employee-ID account. What is established? What remains unknown? Would rolling back K2 alone prove recovery?

<details><summary>Reveal the reasoning</summary>

Two boundaries are evidenced: B's missing approved trust and Devi's output-to-account contract mismatch at A. Their underlying causes are not yet established. A key rollback alone does not fix the email value or prove correct account access. Verify each authorized correction with fresh attempts at every affected runtime, including expected rejection and permission tests.

</details>

Continue with [troubleshooting comparisons](troubleshooting-comparisons.md) or the [final engineering case](final-engineering-case.md). For an XML reminder, open [annotated messages](annotated-saml-messages.md).
