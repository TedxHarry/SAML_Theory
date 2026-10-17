# Lesson 2: Planning an Okta SAML integration and reading metadata

## 1. Is the integration ready because it is in the OIN?

Northstar Research plans to connect Atlas, a web application, to Okta Identity Engine. Daniel finds an Atlas integration in the Okta Integration Network, or OIN. The application team has not yet confirmed the supported Atlas edition, response binding, expected user identifier or account-creation behavior.

A project manager asks Daniel to mark the integration design complete because a prepared integration exists. What should Daniel establish before doing so?

<details>
<summary>Show explanation</summary>

The OIN entry is a useful starting point, but the team still needs to confirm that its supported behavior matches this Atlas deployment. A product name does not establish compatibility for every edition, environment or requested feature.

Daniel and the Atlas owner should agree the exact SP entity ID, response receiving endpoint and binding, supported ways to start sign-in, required identity and attributes, and protection requirements. They also need approved Okta provider information for Atlas, account lifecycle responsibilities, assignments, applicable authentication policies and a definition of successful access.

The alternative of a custom integration would not remove those questions. Choose a supported integration that meets the documented requirements, then record what each side will configure and who can confirm it. An available integration becomes maintainable through that agreement and evidence, rather than through its catalog listing alone.

</details>

## 2. Which side owns each location?

Atlas is the SAML service provider and Okta is the identity provider. The approved fictional Atlas test requirements specify:

| Item | Value |
| --- | --- |
| Test SP entity ID | `https://atlas-test.northstar.example/saml` |
| Test Assertion Consumer Service, or ACS | `https://atlas-test.northstar.example/saml/acs` |

The selected Okta SAML configuration uses its default ACS setting for this test attempt. The proposed settings are:

| Item | Proposed value |
| --- | --- |
| Okta Single sign-on URL | `https://atlas.northstar.example/saml/acs` |
| Okta Audience URI (SP Entity ID) | `https://atlas-test.northstar.example/saml` |
| IdP SSO URL configured in Atlas test | `https://atlas-test.northstar.example/saml/acs` |

The first proposed URL is the production ACS. Identify the entries that need correction and explain where the replacement values should come from. Is the correct audience sufficient to send the response to test?

<details>
<summary>Show explanation</summary>

The Single sign-on URL needs the approved test ACS. In this Okta app configuration, that field names the application-side receiving location. The audience entry already contains the agreed test SP identifier. A correct audience does not repair a separate delivery-address error. [Okta SAML field reference, general settings](https://help.okta.com/oie/en-us/content/topics/apps/aiw-saml-reference.htm)

The IdP SSO URL in Atlas is also wrong. Atlas's own ACS receives the returning response; it is not the Okta service that receives Atlas's authentication request. Obtain the appropriate Okta endpoint from this integration's approved metadata or setup information, together with the expected issuer and verification information.

The corrections address identified configuration mismatches. They do not establish that the next response will pass every check or that the intended account will receive projects access. Those outcomes still need verification.

</details>

## 3. Read the metadata from outside inward

The following fictional document describes Atlas test as a service provider. It contains no metadata signature or key material and is a reading example, not a ready-to-import configuration.

```xml
<md:EntityDescriptor
    xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata"
    entityID="https://atlas-test.northstar.example/saml"
    cacheDuration="PT24H">
  <md:SPSSODescriptor
      protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol"
      AuthnRequestsSigned="false"
      WantAssertionsSigned="true">
    <md:NameIDFormat>urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified</md:NameIDFormat>
    <md:AssertionConsumerService
        Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST"
        Location="https://atlas-test.northstar.example/saml/acs"
        index="0"
        isDefault="true" />
    <md:AssertionConsumerService
        Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST"
        Location="https://atlas-test.northstar.example/saml/acs-secondary"
        index="2"
        isDefault="false" />
  </md:SPSSODescriptor>
</md:EntityDescriptor>
```

Identify the entity, its role, its declared default ACS and the secondary endpoint's index. Does the document show that Devi authenticated? Does the `SAML:1.1` text in the NameID format make this a SAML 1.1 integration?

<details>
<summary>Show explanation</summary>

The entity ID is `https://atlas-test.northstar.example/saml`. The `SPSSODescriptor` describes its service-provider SSO role. Its declared default ACS is the HTTP-POST endpoint ending in `/saml/acs`, with index `0`. The secondary ACS ends in `/saml/acs-secondary` and has index `2`.

The index identifies an endpoint entry. It is not a port number or a count of sign-ins. A declaration of a secondary endpoint also does not prove that the selected Okta configuration permits its use or that a particular attempt selected it.

Metadata describes participant information. It does not record Devi's authentication. The protocol support value identifies SAML 2.0 here; the standardized unspecified NameID format retains `SAML:1.1` in its identifier. That text does not change the surrounding protocol into SAML 1.1.

</details>

## 4. Did changing the prefix change the meaning?

Two XML service declarations both have the local element name `AssertionConsumerService`. One uses the prefix `md`, and the other uses `meta`. Each prefix is explicitly bound to `urn:oasis:names:tc:SAML:2.0:metadata`. Their binding, location, index and default values are identical.

A reviewer rejects the second declaration because it does not use the letters `md`. Is that a sound reason? What if a third document uses `md` but binds it to a different namespace? Also explain whether the XML attribute `Location` is information about a user's department.

<details>
<summary>Show explanation</summary>

The first two declarations identify the same kind of element. A prefix is a local label for a namespace; the namespace and local element name establish the vocabulary identity. The letters `md` are conventional, not a requirement to match those exact letters.

The third document needs a different interpretation because its namespace is different. A familiar prefix cannot make an element part of the SAML metadata vocabulary when the binding says otherwise. Investigate the actual vocabulary and applicable rules.

`Location` is an XML attribute describing an endpoint's address. It is not a SAML attribute about a user. A department value in an assertion belongs to a different concept, despite the shared word *attribute*.

</details>

## 5. Which layer answers the question?

An engineer reviewing a SAML browser integration has four questions:

| Question | Concern |
| --- | --- |
| A | What interaction does an authentication request ask the IdP to perform? |
| B | How is the message carried using HTTP-Redirect or HTTP-POST? |
| C | Which combined rules apply to the selected browser SSO use case? |
| D | Does the XML meet the required structural and data-type constraints? |

Match these concerns to protocol, binding, profile and schema. If the XML passes a schema check, can the engineer conclude that the systems support a compatible browser sign-in?

<details>
<summary>Show explanation</summary>

A concerns the protocol, B the binding, C the profile and D the schema. These terms describe different parts of the arrangement.

A schema result answers a structural question. It does not establish that both systems support the chosen message carriage or that the messages meet all the selected profile's processing requirements. Nor does it establish approved trust, correct endpoint ownership or a usable application account.

For example, a structurally valid endpoint declaration can advertise HTTP-POST while another system has been configured for an incompatible delivery arrangement. The XML can be well shaped while the integration agreement is still wrong. Compatibility needs evidence across the relevant layers.

</details>

## 6. Should an entity ID be repaired like a broken web link?

Atlas's owner gives Daniel the exact SP entity ID `https://atlas.northstar.example/saml`. Opening that address in a browser does not display a page. A colleague proposes changing it to `https://atlas.northstar.example/saml/` because that address returns a web page.

There is no approved change to Atlas's entity ID. Should Daniel replace the identifier? What question should he ask instead?

<details>
<summary>Show explanation</summary>

Daniel should preserve the agreed entity ID and clarify its meaning with the Atlas owner if needed. A SAML entity ID identifies a participant. It does not have to behave like a page that a person can browse.

Adding a trailing slash changes the supplied identifier. A successful page fetch is not a reason to change the value the receiver expects. The appropriate question is, “Which exact identifier does this Atlas deployment publish and enforce for this relationship?”

Keep that question separate from locating the ACS or provider SSO service. Those are service locations with different jobs. Troubleshooting becomes harder if an engineer silently normalizes identifiers while trying to repair endpoint reachability.

</details>

## 7. Which content does “signed” refer to?

Atlas metadata declares `AuthnRequestsSigned="false"` and `WantAssertionsSigned="true"` on its SP SSO role. Its approved integration agreement requires signed assertions. A proposed Okta configuration signs only the enclosing Response and leaves its assertion unsigned. No live test has been run.

Are the two metadata declarations contradictory? Does the response-only signing proposal meet the supplied Atlas agreement? What evidence would you seek after correcting the proposal?

<details>
<summary>Show explanation</summary>

The declarations concern different directions and content. The first describes whether the SP declares that its authentication requests will be signed; the second describes its requirement for assertions it receives. The value `false` does not prohibit the SP from signing a request. Requiring signed returned assertions is a separate choice.

The proposal does not meet the stated Atlas agreement. A signature on the enclosing Response is not the same configuration choice as an assertion signature. Okta exposes those choices separately. This answer follows the supplied Atlas requirement; it does not claim that every SAML integration must use the same protection arrangement. [Okta SAML field reference, advanced settings](https://help.okta.com/oie/en-us/content/topics/apps/aiw-saml-reference.htm)

After correcting the agreed settings, inspect what was emitted and obtain Atlas's processing outcome. Metadata is a declaration, configuration is a selected setting, the message is an observation, and receiver evidence establishes what was enforced. None should silently stand in for all four.

</details>

## 8. Which public certificate goes in which direction?

Northstar is designing an integration in which Okta signs assertions and also encrypts them for Atlas. Separate key pairs serve the two purposes. The Atlas team asks Daniel to send it Okta's private signing key, and Daniel proposes giving Okta its own signing certificate as the encryption recipient material.

Explain both mistakes. Which public material should each side receive, and where should each private key remain?

<details>
<summary>Show explanation</summary>

Atlas needs the approved public verification material for Okta's signing key, commonly supplied in a certificate. Okta keeps its private signing key. Atlas verifies the relevant signatures; it does not need to create Okta signatures.

For encryption to Atlas, Okta needs Atlas's approved public encryption certificate. Atlas retains the corresponding private decryption key. Okta's own signing certificate does not identify Atlas as the encryption recipient.

Read the operation and direction before selecting a certificate. Signing supports verification of protected content under a key. Encryption protects content for a recipient. Signing does not hide the assertion, and encryption alone does not establish the sender's identity. Supplying public material also does not remove the need to approve it for the intended relationship.

</details>

## 9. Does a readable metadata signature establish trust?

Daniel receives an unexpected replacement file labeled “Atlas test IdP metadata.” It changes the issuer and signing key. An XML checker accepts its structure. A utility reports that its metadata signature verifies using a certificate included inside that file. No one has authenticated the publisher or approved that certificate as a metadata trust anchor.

Should Atlas adopt the replacement? If the metadata were later approved, would its signature result establish that a particular runtime assertion also verifies?

<details>
<summary>Show explanation</summary>

The supplied checks do not justify adoption. Daniel still needs an approved basis for trusting the publisher and signer for this integration, and an explanation of the changed issuer and key. The certificate included in the file does not authorize itself.

A trust anchor is previously approved information used to establish trust. The deployment's supported trust process must connect the proposed metadata to an authorized source. Structural validity and verification under an unapproved included key do not make that connection.

Even approved signed metadata answers a configuration-integrity question. A runtime assertion has its own protected content, key relationship and acceptance checks. Verifying the metadata signature does not verify a later assertion, and the metadata signer need not be the runtime assertion signer. [SAML Metadata Interoperability Profile, trust model](https://docs.oasis-open.org/security/saml/Post2.0/sstc-metadata-iop.pdf)

</details>

## 10. Does the NameID format choose Devi's identifier?

Atlas requires an employee identifier to select an existing account. Devi's approved Okta profile contains employee identifier `E1042` and email `devi@northstar.example`. Atlas's enabled account `atlas-4821` has employee identifier `E1042`.

The integration advertises the unspecified NameID format. A preview shows email in NameID, and Daniel argues that the word “unspecified” means Atlas must accept that value. He also points out that the employee identifier exists in the Okta profile.

Which parts of that reasoning are unsupported? What relationship needs to be checked?

<details>
<summary>Show explanation</summary>

The unspecified format does not choose an employee identifier or require Atlas to treat any supplied value as a matching account key. The agreed Atlas rule still requires the employee identifier.

An attribute's presence in the profile does not prove that it was selected as the source for NameID. The preview is evidence that the proposed output differs from the supplied agreement. Review the application username and NameID configuration and the relevant source-to-output relationship, then inspect the resulting value.

The intended chain is approved profile value `E1042`, configured SAML identity output `E1042`, then Atlas's accepted-identity matching rule selecting `atlas-4821`. A corrected preview would help inspect output, but a live receiver outcome is still needed to establish that the intended account was selected. Do not infer SAML field output merely from the existence or direction of a profile mapping.

</details>

## 11. Does a requested attribute prove release or permission?

Atlas's metadata advertises `department` as a required requested attribute. For an independent fictional attempt, the supplied message inspection shows no department attribute in the assertion. No Atlas processing result has been collected. The teams have not documented how department values affect application permissions.

A reviewer says the metadata proves that Okta sent department and that a `Research` value would automatically grant the Research role. Which conclusions are justified, and what needs clarification?

<details>
<summary>Show explanation</summary>

The metadata declares a request for information. It does not prove release in a particular attempt. Here, the supplied observation says that department was absent from the assertion. Atlas's enforcement outcome remains unknown.

The teams should agree the attribute name, name format, expected values and types, whether multiple values are possible, and the behavior when it is missing. They should then review the configured output source and receiver result. A required declaration is not a record that the receiver enforced the requirement.

There is also no supplied rule connecting `Research` to an Atlas role. A department or group value is input that Atlas may interpret through its own rules. It has no universal application permission meaning. Clarify the needed interpretation instead of releasing every available profile value in the hope that one will solve the problem.

</details>

## 12. Read the two metadata clocks

Atlas retrieves authenticated metadata at 09:00 UTC on 16 October 2026. It has `cacheDuration="PT1H"` and `validUntil="2026-10-16T12:00:00Z"`. There are no shorter inherited limits. Retrieval attempts after 10:00 fail. Atlas's documented policy allows continued use of this authenticated copy while it remains valid during a retrieval failure, but does not allow use after its validity expires.

At 10:30, has the cache duration itself made the metadata invalid? At 12:01, may Atlas keep using this copy under the supplied rules? Does either value define Devi's application session lifetime?

<details>
<summary>Show explanation</summary>

At 10:30, the one-hour cache duration has been reached, so refresh should have been attempted. Its passage does not itself invalidate the metadata. The supplied failure policy permits continued use of the still-valid authenticated copy in that situation.

At 12:01, the metadata has expired under `validUntil`, and the supplied policy does not permit continued use of it. Failed retrieval does not extend its validity. The operational response should follow the documented failure and recovery process. [SAML Errata 05, E94](https://docs.oasis-open.org/security/saml/v2.0/errata05/os/saml-v2.0-errata05-os.pdf)

These values concern metadata freshness and validity. Neither establishes the lifetime of a SAML assertion or Devi's application session. Keeping the clocks separate prevents a configuration-refresh value from becoming an invented sign-in or session rule.

</details>

## 13. Does a metadata URL guarantee automatic adoption?

Atlas was configured by manually importing an approved copy of Okta provider information. Its documented setup does not poll a metadata URL. Daniel later publishes an approved update at the documented location and confirms that he can download it. He has not changed Atlas's imported configuration.

Can he conclude that Atlas now uses the update? What should a supported update plan establish?

<details>
<summary>Show explanation</summary>

Atlas has no supplied mechanism that would automatically consume the new publication. Daniel's download shows that the published information is retrievable; it does not show that Atlas adopted it.

The update plan should identify the actual consumer mechanism, authenticate the source, review the differences and apply them through Atlas's supported process. It should record the effective configuration and test the resulting integration behavior. Named owners need to know who publishes a change and who makes it effective at the receiver.

For a different receiver that supports refresh, the plan would also need its schedule, validity handling and failure behavior. A URL alone establishes none of those. Publication, retrieval and effective adoption are distinct observations.

</details>

## 14. Locate the boundary after a signing-key change

In a fictional Atlas test integration, the approved active Okta signing key changes from K1 to K2. These are symbolic labels, not real key material. Atlas's effective trust configuration still contains only K1. For a new attempt, Okta authentication succeeds, the response reaches the expected Atlas test ACS, and Atlas reports that the assertion uses K2 but no approved verification key for it is configured.

Does changing the ACS address address the supplied failure? What should the teams verify before retrying?

<details>
<summary>Show explanation</summary>

The supplied evidence places the failure at Atlas's verification-key configuration. It does not identify a delivery-address problem. The response already reached the expected ACS.

The teams should confirm that K2 is the approved key for this exact integration, then coordinate Atlas's supported trust update with the intended Okta signing state. Obtaining or activating a certificate on the provider side does not prove that the application adopted its verification material. [Okta signing certificate management](https://help.okta.com/oie/en-us/content/topics/apps/manage-signing-certificates.htm)

After the coordinated change, repeat the attempt and inspect both the message and receiver outcome. Successful verification would address this known boundary; account matching, session creation and resource permission still need their own evidence. Do not add a key solely because an incoming message presents it.

</details>

## 15. What is missing from the handover?

Daniel hands over a fictional Atlas test integration with this record:

| Recorded item | Evidence |
| --- | --- |
| Environment | Clearly identified Atlas test and corresponding Okta app integration |
| Participant and service values | Approved SP entity ID, ACS/binding, Okta issuer and provider endpoint |
| Protection | Agreed signing requirements and approved verification material |
| One observed result | Devi opened projects successfully in the test environment |

The record omits the identity source and matching rule, account lifecycle arrangements, attribute interpretation, metadata update behavior and change owners. A teammate says the successful test makes those omissions unimportant.

Explain why the handover is incomplete. What would you add without claiming that any unperformed test has passed?

<details>
<summary>Show explanation</summary>

The recorded success is useful evidence for one attempt. It does not explain how another employee becomes ready, how changed identity data is handled, or how a certificate or metadata change will be maintained.

Add the agreed identity source, selected output and account-matching rule; required attributes and their interpretation; account creation, updates and disablement responsibilities; relevant assignment and policy assumptions; and the supported update and failure process. Record named owners for these responsibilities and for investigating failures. Distinguish production and test information wherever their arrangements differ.

Preserve the observed result with its context, then identify remaining tests and unknowns explicitly. A useful handover lets another engineer connect declared requirements, effective configuration, observed messages and enforced outcomes. It should explain why the integration works and how it will be maintained, rather than depend on repeating a successful click.

</details>

## Sources

- [OASIS SAML Metadata, entity and role descriptors, endpoints and signing declarations](https://docs.oasis-open.org/security/saml/v2.0/saml-metadata-2.0-os.pdf)
- [OASIS SAML Core, URI comparison and NameID formats: §§1.3.2 and 8.3](https://docs.oasis-open.org/security/saml/v2.0/saml-core-2.0-os.pdf)
- [SAML Errata 05, metadata limits and freshness: E76 and E94](https://docs.oasis-open.org/security/saml/v2.0/errata05/os/saml-v2.0-errata05-os.pdf)
- [OASIS Technical Overview, SAML building blocks: §4.3](https://docs.oasis-open.org/security/saml/Post2.0/sstc-saml-tech-overview-2.0.html)
- [SAML Metadata Interoperability Profile, trust and key interpretation](https://docs.oasis-open.org/security/saml/Post2.0/sstc-metadata-iop.pdf)
- [W3C XML Schema Primer, XML structure and namespaces](https://www.w3.org/TR/xmlschema-0/)
- [Okta existing app integrations](https://help.okta.com/oie/en-us/content/topics/apps/apps-add-applications.htm)
- [Okta SAML field reference](https://help.okta.com/oie/en-us/content/topics/apps/aiw-saml-reference.htm)
- [Okta signing certificate management](https://help.okta.com/oie/en-us/content/topics/apps/manage-signing-certificates.htm)
- [Okta profile mapping directions](https://help.okta.com/oie/en-us/content/topics/users-groups-profiles/usgp-map-attributes.htm)
