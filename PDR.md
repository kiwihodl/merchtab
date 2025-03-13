# Product Development Record (PDR)

## Current Requirements (March 21, 2024)

### Component Architecture

1. **Media Gallery Component**

   - MUST be implemented as a web component (`<media-gallery>`)
   - MUST handle all media types (images, videos, 3D models)
   - MUST NOT contain variant selection logic
   - MUST handle media updates from:
     a. Direct thumbnail clicks
     b. External updates (variant changes)
     c. URL deep linking
   - MUST maintain selected media until explicitly changed
   - MUST show loading states during transitions
   - MUST support keyboard navigation
   - MUST be accessible
   - MUST support responsive image loading with proper srcset
   - MUST support modal view for larger images
   - MUST handle touch gestures for mobile

2. **Variant Selector Component**

   - MUST be implemented as a form component
   - MUST appear below price and add-to-cart button
   - MUST update URL parameters when variant changes (`?variant=[variant-id]`)
   - MUST handle unavailable combinations
   - MUST show loading states during transitions
   - MUST be accessible
   - MUST support color swatches with proper contrast
   - MUST handle out-of-stock variants
   - MUST support multiple option types (color, size, etc.)
   - MUST update product metafields when variant changes

3. **State Management**
   - MUST use URL parameters for deep linking
   - MUST sync state via ProductProvider context
   - MUST handle invalid variant combinations
   - MUST maintain state during page navigation
   - MUST support direct links to variants
   - MUST handle browser back/forward navigation
   - MUST update media gallery when variant changes
   - MUST persist selected options in session storage

### Test Requirements

1. **Media Gallery Tests**

   ```typescript
   describe("Media Gallery Component", () => {
     describe("Media Display", () => {
       it("should display main media at full size");
       it("should display thumbnails in a slider");
       it("should show placeholder when no media available");
       it("should show loading state during transitions");
       it("should lazy load thumbnails");
       it("should handle different media types");
     });

     describe("Media Selection", () => {
       it("should update main media when thumbnail clicked");
       it("should maintain selected media until changed");
       it("should show active state on selected thumbnail");
       it("should handle keyboard navigation");
       it("should support touch gestures");
       it("should update URL when media changes");
     });

     describe("Modal View", () => {
       it("should open modal on main media click");
       it("should support zoom in modal view");
       it("should maintain selected media in modal");
       it("should close on escape key");
     });

     describe("Accessibility", () => {
       it("should have proper aria labels");
       it("should support keyboard navigation");
       it("should announce media changes");
       it("should handle focus management");
     });
   });
   ```

2. **Variant Selector Tests**

   ```typescript
   describe("Variant Selector Component", () => {
     describe("Variant Display", () => {
       it("should show unique option values without duplicates");
       it("should show available combinations for selected options");
       it("should disable unavailable combinations");
       it("should show out of stock indicators");
       it("should display color swatches with proper contrast");
     });

     describe("Variant Selection", () => {
       it("should update URL when variant selected");
       it("should update product state when variant selected");
       it("should show loading state during transitions");
       it("should maintain selected options during navigation");
       it("should handle browser back/forward");
     });

     describe("Deep Linking", () => {
       it("should initialize with URL variant");
       it("should handle invalid variant URLs");
       it("should update URL when variant changes");
       it("should sync URL with session storage");
     });

     describe("Accessibility", () => {
       it("should have proper aria labels");
       it("should support keyboard navigation");
       it("should announce option changes");
       it("should handle focus management");
     });
   });
   ```

### Implementation Plan

1. **Phase 1: Component Architecture**

   - [ ] Convert Gallery to web component (`<media-gallery>`)
   - [ ] Implement proper media type handling
   - [ ] Add modal view support
   - [ ] Move variant logic to VariantSelector
   - [ ] Update component tests

2. **Phase 2: State Management**

   - [ ] Implement URL-based state
   - [ ] Add session storage support
   - [ ] Add deep linking
   - [ ] Handle browser navigation
   - [ ] Update ProductProvider
   - [ ] Add state transition tests

3. **Phase 3: UI and Accessibility**
   - [ ] Add loading states
   - [ ] Improve accessibility
   - [ ] Add keyboard navigation
   - [ ] Add touch support
   - [ ] Add color swatches
   - [ ] Polish transitions
   - [ ] Add responsive images

### Current Status

❌ Gallery needs conversion to web component
❌ Missing modal view support
❌ Missing proper media type handling
❌ VariantSelector needs form-based implementation
❌ Missing URL state management
❌ Missing session storage support
❌ Missing touch support
❌ Incomplete test coverage
❌ Accessibility issues

### Next Actions

1. Update test files to match Dawn patterns
2. Convert Gallery to web component
3. Implement proper media handling
4. Add URL and session storage support
5. Improve accessibility and touch support

## Test Status

Current test coverage is insufficient. Need to:

1. Add tests for web component lifecycle
2. Add tests for media type handling
3. Add tests for modal view
4. Add tests for touch support
5. Add tests for session storage
6. Add tests for URL management
7. Add tests for accessibility

## Build Status

✅ Building successfully
❌ Runtime behavior incorrect
❌ Missing web component support
❌ Missing accessibility features
❌ Missing touch support
❌ Missing session storage support
