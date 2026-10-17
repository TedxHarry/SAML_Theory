# Read a SAML message with purpose

Start with a question: which request is this answering, who issued the statements, who may consume them, and which identity will the application resolve? Reading every XML word in order is less useful than following those relationships.

The XML below is fictional, shortened teaching data. The signature has been removed, so this displayed copy cannot establish signature validity and must not be submitted to a real ACS. In a real investigation, preserve the original securely when cryptographic verification is required. Prefixes such as `saml` are labels for namespaces; a different prefix with the same namespace does not change an element's meaning.

## First read the request

Atlas test retains `_req_A1` in protected pending context for Devi's browser, expecting its configured Okta provider and a return to projects. There is no usable Atlas session yet. Its approved ACS is `https://atlas-test.northstar.example/saml/acs`.

```xml
<samlp:AuthnRequest
  xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol"
  xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"
  ID="_req_A1" Version="2.0" IssueInstant="2026-10-17T10:00:00Z"
  Destination="https://idp.northstar.example/sso/saml"
  AssertionConsumerServiceURL="https://atlas-test.northstar.example/saml/acs"
  ProtocolBinding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST">
  <saml:Issuer>urn:northstar:atlas:test</saml:Issuer>
  <samlp:NameIDPolicy
    Format="urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified"
    AllowCreate="false"/>
</samlp:AuthnRequest>
```

| Read this | Interpret it | Do not conclude |
| --- | --- | --- |
| ID `_req_A1` | This authentication request's identifier | That it identifies a person |
| Issuer `urn:northstar:atlas:test` | The SP identifies itself | That an issuer string authenticates the requester by itself |
| Destination | The provider endpoint receiving this request | That it is the SP's response endpoint |
| AssertionConsumerServiceURL | The requested response-delivery address | That the IdP must approve an arbitrary requested address |
| ProtocolBinding HTTP-POST | Requested response delivery | That the request itself must travel by POST |
| NameIDPolicy | Requested identifier policy | That AllowCreate provisions an application account |

The provider's trust and endpoint rules still apply. This fictional endpoint illustrates a role, not the exact URL syntax of a real Okta tenant. Obtain that tenant's actual endpoint from its approved integration information.

## Then locate the envelope and the statements

The browser carries the response to Atlas. This example reports the issuer `urn:northstar:okta:test`; a real integration must use its actual agreed issuer. All timestamps are UTC.

```xml
<samlp:Response
  xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol"
  xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"
  ID="_resp_A1" Version="2.0" IssueInstant="2026-10-17T10:00:10Z"
  InResponseTo="_req_A1"
  Destination="https://atlas-test.northstar.example/saml/acs">
  <saml:Issuer>urn:northstar:okta:test</saml:Issuer>
  <!-- Signature omitted from this teaching copy. -->
  <samlp:Status>
    <samlp:StatusCode Value="urn:oasis:names:tc:SAML:2.0:status:Success"/>
  </samlp:Status>
  <saml:Assertion ID="_assert_A1" Version="2.0"
    IssueInstant="2026-10-17T10:00:10Z">
    <saml:Issuer>urn:northstar:okta:test</saml:Issuer>
    <saml:Subject>
      <saml:NameID Format="urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified">E1042</saml:NameID>
      <saml:SubjectConfirmation Method="urn:oasis:names:tc:SAML:2.0:cm:bearer">
        <saml:SubjectConfirmationData InResponseTo="_req_A1"
          Recipient="https://atlas-test.northstar.example/saml/acs"
          NotOnOrAfter="2026-10-17T10:03:00Z"/>
      </saml:SubjectConfirmation>
    </saml:Subject>
    <saml:Conditions NotBefore="2026-10-17T10:00:00Z"
      NotOnOrAfter="2026-10-17T10:05:00Z">
      <saml:AudienceRestriction>
        <saml:Audience>urn:northstar:atlas:test</saml:Audience>
      </saml:AudienceRestriction>
    </saml:Conditions>
    <saml:AuthnStatement AuthnInstant="2026-10-17T09:50:00Z" SessionIndex="_si_A1">
      <saml:AuthnContext>
        <saml:AuthnContextClassRef>urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport</saml:AuthnContextClassRef>
      </saml:AuthnContext>
    </saml:AuthnStatement>
    <saml:AttributeStatement>
      <saml:Attribute Name="department">
        <saml:AttributeValue>Research</saml:AttributeValue>
      </saml:Attribute>
    </saml:AttributeStatement>
  </saml:Assertion>
</samlp:Response>
```

| Location | What to compare | Why it matters |
| --- | --- | --- |
| Response and Assertion IDs | Distinct object IDs and relevant replay records | A copied signed object does not become fresh evidence |
| InResponseTo at the envelope and bearer confirmation | `_req_A1` and the applicable retained transaction | Correlation is more than finding any familiar ID |
| Issuer and required signature scope | Approved provider/key trust and the exact object consumed | Reported origin and authenticated origin differ |
| Destination and Recipient | Approved receiving endpoint | Correct delivery alone does not establish an intended audience |
| Audience | `urn:northstar:atlas:test` | The assertion is meant for this relying party |
| NameID | `E1042` and Atlas's unique eligible account match | Trusted identity information still needs local interpretation |
| Attribute Name and AttributeValue | `department` and `Research` | Output naming and values must fit the app's contract |

The Response is the envelope around the Assertion. Inside the Assertion, Subject identifies the subject and its confirmation, Conditions restrict use, AuthnStatement describes authentication, and AttributeStatement carries additional claims. These structural roles are defined in [SAML Core, §§2 and 3](https://docs.oasis-open.org/security/saml/v2.0/saml-core-2.0-os.pdf); the browser sign-in requirements are in [SAML Profiles, §4.1](https://docs.oasis-open.org/security/saml/v2.0/saml-profiles-2.0-os.pdf).

## Explain the clocks before revealing the analysis

Atlas processes this response at 10:04:00. Assume no clock tolerance. Conditions has not expired, but the displayed bearer confirmation ended at 10:03:00. Can that confirmation support acceptance? Does AuthnInstant prove a fresh authentication at 10:00:10?

<details><summary>Reveal the time analysis</summary>

That bearer confirmation cannot support acceptance at 10:04. A later Conditions deadline does not extend its delivery deadline. AuthnInstant reports 09:50, while IssueInstant reports message issuance at 10:00:10; those are different events. Whether that authentication meets Atlas's assurance and freshness requirements needs the relevant policy and verified result.

Neither displayed deadline alone proves when every established application session will end. Session lifetime is a separate question with applicable profile constraints and local policies.

</details>

## Check the limits of the evidence

This XML lets you identify reported values and relationships. It does not prove a valid signature, the required authentication assurance, unused pending context, replay rejection, a unique local account or resource permission. Receiver evidence is needed for those outcomes. Continue with the [Okta settings bridge](okta-settings-to-saml.md) or the [final engineering case](final-engineering-case.md).
