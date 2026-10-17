# Connect Okta settings to the SAML message

An integration setting has two jobs to understand: what it changes in the outgoing exchange, and what the application expects to receive. Keep the application's approved requirements beside the actual message. A saved setting or a preview is useful evidence, but neither proves that a particular live sign-in was accepted.

The following fictional Atlas test agreement makes the comparison concrete. Its ACS is `https://atlas-test.northstar.example/saml/acs`, its entity ID is `urn:northstar:atlas:test`, and its account lookup uses an employee identifier. Devi's approved value is `E1042`. Atlas also requires a `department` attribute.

## Follow a setting to its observable result

| Okta setting or integration information | Look for in the exchange | What Atlas needs |
| --- | --- | --- |
| Single sign-on URL | The browser's POST target; normally also the configured Response `Destination` and bearer confirmation `Recipient` | The approved ACS for this environment |
| Audience URI (SP Entity ID) | Assertion `Conditions/AudienceRestriction/Audience` | Exact agreed relying-party identifier, here `urn:northstar:atlas:test` |
| Application username configuration and effective app-user value | Subject `NameID` in the emitted assertion | The value expected by its lookup rule, here `E1042` |
| Name ID format | `NameID/@Format` | The agreed interpretation; a format does not select the account by itself |
| Attribute statements or custom claims | Named `Attribute` elements and their `AttributeValue` children | Required names, values and cardinality, including `department` |
| Response / Assertion Signature | The relevant XML `Signature` and its references | Required protection of the exact content consumed, verified under independently approved issuer/key trust |
| IdP issuer and signing certificate from the integration's setup information | Issuer values and the actual verification result | The expected provider and effective trusted public key at every validating runtime |

The Single sign-on URL is the default ACS. Okta's default checkbox shares it with Recipient and Destination; supported advanced settings can separate them or select other endpoints. Do not infer endpoint behavior from the label alone. These settings are documented in the [Okta SAML field reference](https://help.okta.com/oie/en-us/content/topics/apps/aiw-saml-reference.htm).

## Follow one identity value all the way through

For this example, trace `E1042` from the authoritative employee source to the effective app username, then to the captured `NameID`, then to Atlas's unique enabled account. Inspect each boundary instead of assuming that a profile update propagated everywhere. Update timing, integration behavior and supported overrides can affect the emitted value.

Suppose the source contains `E1042`, but the app-user record and actual NameID contain `devi@northstar.example`. Atlas logs `account_match=none` under its employee-ID rule. The output disagrees with the contract. Compare the username configuration, effective app-user value and update behavior before changing Atlas's matching rule. The evidence does not yet explain why the configured value became email.

<details><summary>Check your reasoning</summary>

Changing Name ID format to emailAddress would not make an employee-ID lookup find the intended account. Changing the audience would not repair the emitted subject value either. Resolve the identity contract at its source and verify a fresh sign-in selects exactly Devi's intended account.

</details>

## Find claims without depending on an old screenshot

Current Okta documentation places custom claims on the app's **Sign On** tab and distinguishes the newer claims interface from legacy configuration. The expression languages differ; do not copy a legacy expression into the newer interface without checking its syntax. An empty expression result can omit a claim. See [Okta custom claims](https://help.okta.com/oie/en-us/content/topics/apps/federated-claims-overview.htm).

For `department`, compare the intended source, configured expression, actual output name and emitted value. If the assertion contains `Department` but Atlas requires `department` with exact matching, a populated source profile does not resolve that name mismatch. If the assertion contains no department attribute, investigate issuance before debugging Atlas's role mapping.

## Keep the two SSO addresses distinct

The **app's ACS** receives the response from the browser. The **Okta IdP SSO endpoint** receives the authentication request from the browser. They belong to opposite sides of the exchange. Audience identifies the relying party; it is neither of those destinations merely because it resembles a URL.

Continue with [annotated messages](annotated-saml-messages.md) to find these values inside XML, or use [troubleshooting comparisons](troubleshooting-comparisons.md) to distinguish similar failures.
