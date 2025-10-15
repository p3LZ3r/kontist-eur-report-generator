# Security Headers Specification

## ADDED Requirements

### Requirement: Content Security Policy Configuration

The application SHALL implement Content Security Policy (CSP) headers that balance security with necessary third-party integrations.

#### Scenario: KoFi widget iframe loading
- **GIVEN** the KoFi overlay widget script is loaded from `https://storage.ko-fi.com`
- **WHEN** a user clicks the "Unterstützen" (Support) button
- **THEN** the widget SHALL successfully load and display an iframe from `https://ko-fi.com`
- **AND** the iframe SHALL render the donation panel without CSP violations

#### Scenario: Arbitrary iframe blocking
- **GIVEN** an attacker attempts to inject an iframe from an unauthorized domain
- **WHEN** the iframe attempts to load
- **THEN** the browser SHALL block the iframe due to CSP `frame-src` restrictions
- **AND** a CSP violation SHALL be logged to the browser console

#### Scenario: KoFi script execution
- **GIVEN** the CSP `script-src` directive includes `https://storage.ko-fi.com`
- **WHEN** the page loads
- **THEN** the KoFi widget initialization script SHALL execute without errors
- **AND** the floating chat button SHALL be visible on the page

### Requirement: CSP Directive Specificity

The CSP configuration SHALL use specific trusted domains rather than wildcard or overly permissive directives.

#### Scenario: Frame source whitelist
- **GIVEN** the CSP configuration for iframe sources
- **WHEN** the `frame-src` directive is evaluated
- **THEN** it SHALL list explicit trusted domains (e.g., `https://ko-fi.com`)
- **AND** it SHALL NOT use wildcard patterns like `https://*` or `*`
- **AND** it SHALL NOT use `'unsafe-inline'` or `'unsafe-eval'` for frame sources

#### Scenario: Multi-domain widget support
- **GIVEN** multiple external widgets require iframe access (e.g., KoFi, future analytics)
- **WHEN** configuring the `frame-src` directive
- **THEN** each domain SHALL be listed explicitly with space separation
- **AND** domains SHALL use HTTPS protocol for secure communication

### Requirement: Legacy Browser Compatibility

The CSP configuration SHALL include legacy directives for older browser support while maintaining modern standards.

#### Scenario: Child-src fallback
- **GIVEN** a legacy browser that doesn't support `frame-src` directive
- **WHEN** the page loads with both `frame-src` and `child-src` directives
- **THEN** the browser SHALL use `child-src` as a fallback for iframe restrictions
- **AND** the same domain restrictions SHALL apply via `child-src`

#### Scenario: Modern browser precedence
- **GIVEN** a modern browser that supports both `frame-src` and `child-src`
- **WHEN** the page loads with both directives
- **THEN** the browser SHALL prioritize the `frame-src` directive
- **AND** the `child-src` directive SHALL be ignored in favor of the more specific directive
