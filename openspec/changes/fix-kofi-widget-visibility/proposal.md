# Proposal: Fix KoFi Widget Visibility

## Why

The KoFi support widget is currently invisible to users due to overly restrictive Content Security Policy (CSP) settings. The CSP directive `frame-src 'none'` blocks all iframe content, preventing the KoFi overlay widget from rendering its donation panel when users click the support button.

This impacts the ability to receive voluntary donations from users who find the tool valuable, removing a legitimate funding mechanism for the open-source project.

## What Changes

- Update CSP `frame-src` directive in `index.html` to allow iframes from `https://ko-fi.com` domain
- Change from `frame-src 'none'` to `frame-src https://ko-fi.com` to enable the KoFi widget overlay while maintaining security for other iframe sources
- Add corresponding `child-src` directive for legacy browser compatibility

**Security Impact:** Minimal - only allows iframes specifically from the trusted Ko-fi.com domain, maintaining protection against arbitrary iframe injection.

## Impact

### Affected Files
- `index.html` - Content Security Policy meta tag (lines 10-21)

### Affected Specs
- `security-headers` (new capability) - CSP configuration for external widget integrations

### User Impact
- **Positive:** Users can now see and interact with the KoFi donation widget
- **Neutral:** No changes to core EÜR functionality
- **Security:** Maintains strong CSP while allowing necessary third-party widget

### Browser Compatibility
- Modern browsers: Use `frame-src` directive
- Legacy browsers: Use `child-src` as fallback (deprecated but still supported)
