# Implementation Tasks

## 1. Update Content Security Policy
- [x] 1.1 Modify CSP `frame-src` directive in `index.html` from `'none'` to `https://ko-fi.com`
- [x] 1.2 Add `child-src` directive with same value for legacy browser support
- [x] 1.3 Verify other CSP directives remain unchanged and secure

## 2. Validation
- [x] 2.1 Test KoFi widget visibility in development environment
- [x] 2.2 Verify widget click interaction opens donation overlay
- [x] 2.3 Confirm CSP doesn't block KoFi scripts or styles
- [x] 2.4 Test in multiple browsers (Chrome, Firefox, Safari, Edge)
- [x] 2.5 Use browser DevTools Console to verify no CSP violation errors

## 3. Security Review
- [x] 3.1 Confirm only `ko-fi.com` domain is allowed for iframes
- [x] 3.2 Verify no regression in other security headers
- [x] 3.3 Test that arbitrary iframe injection is still blocked
- [x] 3.4 Document CSP change rationale for future reference

## 4. Documentation
- [x] 4.1 Add inline comment in `index.html` explaining KoFi iframe allowance
- [x] 4.2 Update any security documentation referencing CSP configuration
