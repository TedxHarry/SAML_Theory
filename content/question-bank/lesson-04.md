# Lesson 4: Responses, assertions, NameID, and attributes

## 1. Read the response without confusing its layers

Atlas requested authentication through Okta with request ID `_req_Q04_READ`. The following fictional reading copy shows selected response content. The issuer is a conspicuous example placeholder, not a real Okta issuer pattern. **The signature is omitted**, so this copy does not meet Atlas's signed-assertion requirement and must not be submitted as a working sign-in message. All `.example` addresses and transaction values in these scenarios are fictional.

```xml
<samlp:Response
    xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol"
    xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"
    ID="_resp_Q04_READ"
    Version="2.0"
    IssueInstant="2026-10-16T15:00:20Z"
    Destination="https://atlas.northstar.example/saml/acs"
    InResponseTo="_req_Q04_READ">
  <saml:Issuer>urn:example:northstar:okta-idp</saml:Issuer>
  <samlp:Status>
    <samlp:StatusCode Value="urn:oasis:names:tc:SAML:2.0:status:Success" />
  </samlp:Status>
  <saml:Assertion ID="_assert_Q04_READ"
      Version="2.0" IssueInstant="2026-10-16T15:00:20Z">
    <saml:Issuer>urn:example:northstar:okta-idp</saml:Issuer>
    <saml:Subject>
      <saml:NameID Format="urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified">E1042</saml:NameID>
      <saml:SubjectConfirmation Method="urn:oasis:names:tc:SAML:2.0:cm:bearer">
        <saml:SubjectConfirmationData
            Recipient="https://atlas.northstar.example/saml/acs"
            InResponseTo="_req_Q04_READ"
            NotOnOrAfter="2026-10-16T15:02:00Z" />
      </saml:SubjectConfirmation>
    </saml:Subject>
    <saml:Conditions NotBefore="2026-10-16T14:59:50Z"
        NotOnOrAfter="2026-10-16T15:05:00Z">
      <saml:AudienceRestriction>
        <saml:Audience>https://atlas.northstar.example/saml</saml:Audience>
      </saml:AudienceRestriction>
    </saml:Conditions>
    <saml:AuthnStatement AuthnInstant="2026-10-16T15:00:15Z"
        SessionIndex="_session_Q04_READ">
      <saml:AuthnContext>
        <saml:AuthnContextClassRef>urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport</saml:AuthnContextClassRef>
      </saml:AuthnContext>
    </saml:AuthnStatement>
  </saml:Assertion>
</samlp:Response>
```

Identify the response ID, assertion ID, subject identifier and two values that refer to the initiating request. What does the provider's `Success` establish, and why does recognizing these fields not establish Atlas acceptance?

<details>
<summary>Show explanation</summary>

The response ID is `_resp_Q04_READ`; the assertion ID is `_assert_Q04_READ`. The NameID value `E1042` identifies the subject under the agreed unspecified-format interpretation. Both the outer Response and the bearer `SubjectConfirmationData` have `InResponseTo="_req_Q04_READ"`, referring to Atlas's request.

The provider reports a successful protocol result. That does not establish Atlas's verification, acceptance, account matching, session creation or permission decision. The response is the protocol envelope; its assertion contains statements about the subject and restrictions on their use.

Here, a decisive limitation is already supplied: the required assertion signature is omitted. Reading familiar values cannot repair that omission. Schema-valid structure would also not make this a cryptographically valid or acceptable sign-in message.

</details>

## 2. Interpret a non-success status before searching for an account

A SAML identity provider cannot satisfy the requested authentication context for a fictional Atlas attempt. Its protocol reply contains this status fragment. This is a standalone reading fragment, not a complete response or a claim about the exact status returned by every Okta configuration.

```xml
<samlp:Status xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol">
  <samlp:StatusCode Value="urn:oasis:names:tc:SAML:2.0:status:Responder">
    <samlp:StatusCode Value="urn:oasis:names:tc:SAML:2.0:status:NoAuthnContext" />
  </samlp:StatusCode>
</samlp:Status>
```

A colleague proposes fixing Atlas's employee-number lookup first. What does the supplied result suggest investigating? Must every protocol reply contain a usable assertion?

<details>
<summary>Show explanation</summary>

The supplied result points to an unsatisfied authentication-context requirement. Investigate the actual request, supported provider behavior, applicable policy and processing evidence. The packet does not identify an account-lookup failure.

A protocol reply does not have to contain a usable identity assertion for Atlas to consume. A non-success status is a different starting point from an accepted assertion followed by a missing account. Do not begin by assuming every response is a successful identity delivery.

The status narrows the reported problem; it does not establish which setting caused the requirement to be unsatisfied. Changing the requested context without understanding the original requirement could change the security agreement rather than resolve the intended sign-in.

</details>

## 3. Trace the value that actually reached Atlas

Northstar's approved design requires Devi's employee identifier for Atlas account matching. The following evidence belongs to one fictional test:

| Boundary | Supplied fact |
| --- | --- |
| Okta user profile | Employee identifier is `E1042`; email is `devi@northstar.example`. |
| Intended application identity | Atlas application username and NameID should use `E1042`. |
| Actual accepted assertion | NameID is `devi@northstar.example` under the unspecified format. |
| Atlas lookup | The approved rule matches employee identifier exactly. |
| Atlas account | Existing enabled account `atlas-4821` has employee identifier `E1042`. |
| Result | No account matched; no Atlas session was created. |

Does the employee identifier's presence in the Okta profile prove the output was correct? What relationship should be inspected before proposing an account change?

<details>
<summary>Show explanation</summary>

The actual accepted NameID differs from the required employee identifier. Source data existing in a profile does not prove that the configured application identity selected it or that the intended value was emitted.

Inspect the source-to-application-username mapping and the configured NameID output for this integration. Confirm the resulting assertion value, then verify Atlas's account-selection result. The supplied existing account already has the intended employee identifier, so changing its key to email is not justified solely to fit the unexpected output.

The unspecified format does not choose email or employee number automatically. This integration's agreement supplies that interpretation. The evidence identifies a source-to-output mismatch but does not yet establish which mapping or setting produced it.

</details>

## 4. Choose NameID semantics rather than a convenient label

An application team is choosing an identifier relationship for a supported SAML integration. Consider these proposals:

| Proposal | Claim |
| --- | --- |
| A | Label readable employee number `E1042` as persistent solely because it rarely changes. |
| B | Use transient NameID as the only permanent account key, although it is temporary and no separate linking design exists. |
| C | Treat emailAddress format as proof that the mailbox was verified and will always belong to the same person. |
| D | Use unspecified format with an explicitly agreed value, source, scope and account-matching rule. |

Which proposal supplies an interpretation consistent with its stated design? Explain the assumptions that need correction in the other proposals.

<details>
<summary>Show explanation</summary>

D supplies an explicit interpretation for the unspecified format. It still needs supported configuration and evidence of safe matching, but it does not invent semantics from the label.

A confuses stability with persistent-format semantics. A persistent identifier is a lasting opaque identifier scoped to the relevant provider relationship, with privacy requirements. It must not have a guessable relationship to the subject's underlying identity, and its value must not later be reassigned to another principal. Simply changing the Format URI does not transform an employee number into that identifier relationship. [SAML Errata 05, E78 and E86](https://docs.oasis-open.org/security/saml/v2.0/errata05/os/saml-v2.0-errata05-os.pdf)

B relies on a temporary identifier as a durable key without the separate design it would need. C infers mailbox verification and lasting ownership from email-address form. Email can change or be reassigned. Choose supported semantics that match the intended account relationship, rather than changing a format label to make an integration appear compatible.

</details>

## 5. Can two approved issuers share one bare-string lookup?

Atlas trusts two independently approved identity providers. Under their respective unspecified-format agreements, Northstar's IdP sends `E1042` for Devi, while a partner's IdP sends `E1042` for another person. Both assertions pass the applicable SAML acceptance checks for their own relationships.

Atlas currently uses only the NameID string as a global account key. Could successful signature verification make this lookup safe? What identity relationship is missing?

<details>
<summary>Show explanation</summary>

The same visible string has different meanings in the two approved relationships. A global bare-string lookup can join the partner's person to Devi's account. Successful signature verification does not repair that ambiguity.

Atlas needs an explicit identity scope, such as its approved issuer relationship plus the identifier interpreted under that agreement. Both identities can be valid while remaining different identities.

Where applicable, NameQualifier and SPNameQualifier carry further identifier scope under their format rules. They should not be casually invented, discarded or concatenated as though they were ordinary profile fields. The practical requirement is to know which accepted identity, in which trusted relationship, selects a particular account.

</details>

## 6. Is normalization a harmless repair?

Atlas's current integration contract treats accepted employee identifiers as exact values. Two enabled local accounts belong to different people and have identifiers `AB17` and `ab17`. An engineer proposes lowercasing all incoming identifiers and all account keys to simplify matching. The corresponding Okta source field is also editable by end users, although it is used to select an application account.

Identify the two design concerns. Would a valid assertion signature remove either concern?

<details>
<summary>Show explanation</summary>

Lowercasing would collapse two distinct account identifiers into one value. That changes the agreed matching rule and introduces an account-selection collision. Normalization needs documented behavior and collision analysis rather than an assumption that rewriting text is harmless.

The editable source introduces a separate concern: a person may be able to influence the identity value used to select an account. Account-selecting values need an authoritative source and controlled changes. Okta explicitly cautions against deriving application usernames from fields end users can edit. [Okta SAML field reference, application username](https://help.okta.com/oie/en-us/content/topics/apps/aiw-saml-reference.htm)

A valid signature can protect information supplied by the provider. It does not make an unsafe source or an ambiguous local lookup safe. Correct the identity design and its change controls, rather than treating signed output as approval of every account relationship.

</details>

## 7. Can the correct recipient repair the wrong audience?

Atlas test expects its entity ID to be `https://atlas-test.northstar.example/saml` and receives responses at `https://atlas-test.northstar.example/saml/acs`. The following fictional attempt has usable pending context for `_req_Q04_TARGET`:

| Field | Observed value |
| --- | --- |
| Response Destination | Expected test ACS |
| Selected bearer Recipient | Expected test ACS |
| Assertion Audience | `https://ledger.northstar.example/saml` |
| Both applicable InResponseTo values | `_req_Q04_TARGET` |

Atlas reports successful required signature verification but rejects the audience. Should the team change Recipient or ignore the audience because the response arrived correctly?

<details>
<summary>Show explanation</summary>

Neither proposal addresses the supplied failure. Recipient and Destination concern receiving locations, while Audience identifies the intended relying party. The observed audience names Ledger rather than the expected Atlas test entity.

Delivery and request correlation can be correct while an audience restriction is wrong. Successful signature verification does not make the content suitable for a different relying party.

Compare the actual audience output with the approved Atlas test requirements and the relevant Okta Audience URI configuration. Correct the confirmed mismatch through the supported process, then verify the resulting message and receiver outcome. Do not change the correct receiving address simply to make unrelated fields contain identical strings.

</details>

## 8. Which of these arrivals passes both time checks?

A fictional assertion for Atlas has these limits on 16 October 2026:

| Location | Limit |
| --- | --- |
| Conditions NotBefore | 14:59:50 UTC |
| Conditions NotOnOrAfter | 15:05:00 UTC |
| Selected bearer SubjectConfirmationData NotOnOrAfter | 15:02:00 UTC |

The reading example uses zero clock tolerance, and only these time checks are being assessed. Its bearer confirmation has no NotBefore attribute. Consider five alternative arrival times: 14:59:49, 15:00:21, 15:02:00 exactly, 15:03:00 and 15:05:00 exactly.

Which pass both checks? Can the later Conditions deadline rescue an arrival that misses the bearer deadline?

<details>
<summary>Show explanation</summary>

| Arrival, UTC | Conditions permit it? | Before bearer deadline? | Both pass? |
| --- | --- | --- | --- |
| 14:59:49 | No, too early | Yes | No |
| 15:00:21 | Yes | Yes | Yes |
| 15:02:00 exactly | Yes | No | No |
| 15:03:00 | Yes | No | No |
| 15:05:00 exactly | No | No | No |

NotBefore includes its starting instant. NotOnOrAfter excludes its ending instant, so the bearer limit has already been reached at 15:02:00. The later Conditions limit cannot rescue it.

These are separate restrictions in separate locations. Passing both only permits processing to continue; it does not establish trust, correlation, account readiness or overall acceptance. Real receivers apply their supported tolerance policy, which this exercise deliberately sets to zero. The selected browser bearer confirmation must not acquire a NotBefore attribute merely to imitate the Conditions interval.

</details>

## 9. Did authentication happen when the assertion was issued?

Atlas's application requirement for this fictional action is authentication within the previous five minutes. At 15:00:20 UTC, Atlas receives a properly accepted assertion whose AuthnInstant is 14:00:00 UTC and IssueInstant is 15:00:19 UTC. The supplied receiver clock has no uncertainty. Okta reused an earlier authentication context, and no later authentication is established by the evidence.

An engineer calls the authentication one second old because the assertion was issued one second ago. Is the stated freshness requirement met? What does each time mean?

<details>
<summary>Show explanation</summary>

The supplied authentication is one hour and twenty seconds old. It does not meet the stated five-minute freshness requirement. The assertion's recent issuance does not change when authentication occurred.

IssueInstant records issuance of the relevant message or assertion. AuthnInstant reports the authentication time. Reusing an earlier authentication context can produce a new assertion with a much older authentication time.

This case explicitly supplies successful SAML acceptance and a separate application action requirement. Identify that unmet freshness requirement without claiming a signature or transport failure. Any supported reauthentication path must establish the required new result; changing an issuance timestamp would not establish that authentication happened again.

</details>

## 10. Is SessionIndex the browser's session cookie?

An accepted fictional Atlas assertion includes SessionIndex `_session_Q04_BOUND`. It has Conditions NotOnOrAfter at 15:05 UTC and an AuthnStatement SessionNotOnOrAfter at 16:00 UTC. Atlas creates its own session at 15:01 UTC. The applicable processing arrangement enforces the supplied 16:00 upper bound, and Atlas's own absolute lifetime would otherwise end at 17:01. No earlier idle timeout, logout or other termination occurs in this scenario.

Must Atlas use `_session_Q04_BOUND` as its cookie value? Does the Conditions deadline force this derived session to end at 15:05? May the supplied session run until 17:01?

<details>
<summary>Show explanation</summary>

SessionIndex is an issuer-provided SAML session reference. It is not a requirement for Atlas to use the same string as its local browser cookie. Atlas manages its own application session representation.

The Conditions deadline restricts assertion use; it does not automatically set the lifetime of every session established from the assertion. The separately supplied SessionNotOnOrAfter is relevant to the derived session's upper bound under the stated arrangement. [SAML Errata 05, E79](https://docs.oasis-open.org/security/saml/v2.0/errata05/os/saml-v2.0-errata05-os.pdf)

Atlas cannot extend this session to 17:01 under the supplied rules. Its otherwise longer lifetime is constrained by the 16:00 bound. In a real integration, earlier local expiry or termination can also apply; an upper bound is not a promise that a session survives until that instant.

</details>

## 11. Read attribute names and multiple values

Atlas receives this standalone fictional attribute-statement fragment inside an otherwise accepted assertion. It is a reading fragment, not a complete assertion. Atlas's documented contract reads the technical name `groups` and expects separate group values.

```xml
<saml:AttributeStatement xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion">
  <saml:Attribute Name="groups"
      NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:basic"
      FriendlyName="Team memberships">
    <saml:AttributeValue>Atlas-Readers</saml:AttributeValue>
    <saml:AttributeValue>Research-Staff</saml:AttributeValue>
  </saml:Attribute>
</saml:AttributeStatement>
```

What is the technical attribute name, how many values are supplied, and is FriendlyName the lookup key under this contract? Would replacing the two values with one string containing `Atlas-Readers,Research-Staff` necessarily preserve the meaning? Does NameFormat establish a value data type?

<details>
<summary>Show explanation</summary>

The technical name is `groups`. Two separate values are supplied: `Atlas-Readers` and `Research-Staff`. The FriendlyName is a readable label, while the supplied Atlas contract uses `groups` as the agreed technical name.

A single comma-joined string is one value unless a separate supported contract defines how it should be parsed. Atlas's stated contract expects distinct values, so the proposed serialization is not automatically equivalent.

NameFormat describes the convention for the attribute name. It does not establish the value's data type or tell Atlas how to interpret a list. Names, value types, multiplicity and serialization must agree with the receiving application's requirements.

</details>

## 12. Explain a missing claim when the expression result is known

Atlas requires a department attribute for application entry. For a fictional Okta Identity Engine attempt, the evidence says:

- Devi's Okta profile has department `Research`.
- The configured department claim uses a different source whose expression evaluates to empty for this attempt.
- The emitted assertion has no department attribute.
- Atlas accepts the SAML information and matches Devi's enabled account, but denies entry because department is missing. No application session is created.

Which boundary failed? Does the existing profile value contradict the omitted output, and should the team start by replacing the signing certificate?

<details>
<summary>Show explanation</summary>

The established failure is Atlas's application-required data check after the supplied SAML acceptance and account match. The configured expression result explains why the intended claim was not released in this case. Okta documents omission when a SAML attribute-statement expression evaluates to empty. [Okta custom claims](https://help.okta.com/oie/en-us/content/topics/apps/federated-claims-overview.htm)

The profile's `Research` value does not contradict that result because the claim uses a different source. Source availability and selected expression output are different evidence.

Review the agreed department source and applicable claim configuration, resolve the confirmed empty-output cause under that agreement, and inspect the emitted attribute and Atlas's result on retest. Replacing a signing certificate does not address the supplied missing-data cause. Nor should Atlas's requirement be weakened solely to make the error disappear.

</details>

## 13. Does a group value grant the same role everywhere?

Okta supplies an accepted group value `Atlas-Readers` to two applications. Atlas maps that value to its reader entitlement for the correctly matched enabled account. Ledger has no rule mapping that value to any Ledger permission. No other permissions are supplied in this scenario.

An engineer expects the user to receive an equivalent reader role in Ledger automatically. Is that expectation justified? Would sending every group from Okta establish the missing permission rule?

<details>
<summary>Show explanation</summary>

The supplied Atlas rule establishes meaning in Atlas. It does not create a corresponding rule in Ledger. A SAML group value is data that each application interprets under its own documented agreement; it is not a universal role assignment.

Sending more group names does not establish the missing Ledger interpretation. It can also release unnecessary organizational information. First determine the intended Ledger permission and the supported way to supply and enforce its inputs.

For Atlas, verify that the correct accepted value reached the intended account and that the reader entitlement was actually applied. For Ledger, the absence of a supplied mapping prevents the conclusion that this group granted a role. Treat release, interpretation and permission enforcement as connected but separate steps.

</details>

## 14. Can a successful preview overrule a different live message?

Daniel previews an Okta assertion for Atlas and sees attribute `department=Research`. In a separately identified live test attempt, approved capture evidence shows `dept=Research` instead. Atlas's contract requires the exact name `department`, and its diagnostic reports that department is missing after successful SAML acceptance.

Daniel has not established why the preview and test output differ. Does the preview prove that Atlas ignored a correctly named attribute? What should he compare next?

<details>
<summary>Show explanation</summary>

The preview does not overrule the actual test evidence. In that attempt, the supplied name is `dept`, while Atlas requires `department`. The diagnostic is consistent with that mismatch.

The cause of the differing output remains unknown. Compare the exact integration and environment, previewed user, claim configuration and effective settings associated with the live attempt. Use the claims model applicable to that org; do not assume expressions copied between legacy and current interfaces behave identically.

The justified conclusion is a live attribute-name mismatch plus an unresolved preview-to-attempt difference. After correcting the confirmed configuration cause, inspect the actual message and application outcome. A preview helps inspect generated content; it does not prove which content a separate attempt delivered or what Atlas accepted and consumed.

</details>

## 15. Locate the application boundary after SAML acceptance

The following independent fictional Atlas cases all begin after successful SAML acceptance. Atlas requires usable department data, exactly one intended account match, and an enabled account with entry allowed before creating a session. It then checks projects permission.

| Case | Supplied application facts |
| --- | --- |
| A | Required department missing; no session created. |
| B | Required data usable; the configured lookup finds two possible accounts; no session created. |
| C | Required data usable; one intended account matches, but it is disabled; no session created. |
| D | Required data usable; one enabled account matches and entry is allowed; session created; projects permission absent. |

Explain the stopping boundary in each case. Would creating an extra account through JIT necessarily fix case B?

<details>
<summary>Show explanation</summary>

A stops at application-required data. B stops at ambiguous account selection. C stops at account readiness or entry. D completes sign-in but fails resource authorization, leaving an established session without projects access.

These outcomes need different corrections. The supplied SAML acceptance is not evidence that every later application requirement passed, and the later denial is not evidence that the earlier signature or audience checks failed.

Creating another account does not resolve an already ambiguous lookup in B. It can add another possible match. Establish the intended identity relationship and resolve the confirmed collision through the supported account process. JIT is a configured application capability, not an automatic remedy for every matching failure or a consequence of simply receiving a NameID.

</details>

## 16. What can a trace viewer conclude about encrypted content?

An Okta-to-Atlas response contains EncryptedAssertion, so an ordinary browser trace viewer cannot display the inner NameID. Atlas's application record says it successfully decrypted the assertion, but the supplied evidence includes no required signature-verification result, target/time checks, account match or resource outcome.

One reviewer concludes that the NameID was omitted because the trace viewer cannot show it. Another concludes that decryption proves trusted identity and application access. Are either of those conclusions established?

<details>
<summary>Show explanation</summary>

Neither conclusion is established. Encryption can conceal the inner assertion from a viewer that lacks decryption access. The viewer's inability to display NameID does not prove that the inner assertion lacks it.

Successful decryption recovers content for controlled processing. It does not establish the sender's authority, required signatures, target restrictions, timing, account selection or permission. Atlas still needs the acceptance and application decisions required by its integration.

Use approved receiver diagnostics or appropriately protected evidence to inspect what Atlas recovered and how it processed that content. Do not distribute private keys to make an ordinary viewer convenient. The actual signed layers and supported processing arrangement determine which protection checks apply; there is no universal rule here that every signature check always follows decryption.

</details>

## Sources

- [SAML Core, identifiers, assertions, conditions, authentication statements, attributes and status](https://docs.oasis-open.org/security/saml/v2.0/saml-core-2.0-os.pdf)
- [SAML Profiles, browser SSO and bearer-confirmation processing: §4.1.4, as amended](https://docs.oasis-open.org/security/saml/v2.0/saml-profiles-2.0-os.pdf)
- [SAML Errata 05, persistent identifiers, derived session bounds and protection: E78, E79, E86 and E93](https://docs.oasis-open.org/security/saml/v2.0/errata05/os/saml-v2.0-errata05-os.pdf)
- [Okta SAML field reference](https://help.okta.com/oie/en-us/content/topics/apps/aiw-saml-reference.htm)
- [Okta profile attribute mapping directions](https://help.okta.com/oie/en-us/content/topics/users-groups-profiles/usgp-map-attributes.htm)
- [Okta custom claims and empty-expression behavior](https://help.okta.com/oie/en-us/content/topics/apps/federated-claims-overview.htm)
- [Okta group attribute statements](https://help.okta.com/oie/en-us/content/topics/apps/define-group-attribute-statements.htm)
- [Okta assertion preview guidance](https://help.okta.com/oie/en-us/content/topics/apps/apps_app_integration_wizard_saml.htm)
