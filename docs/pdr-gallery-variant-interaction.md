# Product Design Review: Gallery and Variant Image Interaction

## Overview

The product gallery needs to handle both regular product images and color variant images while maintaining proper synchronization between the main image display and thumbnail highlighting.

## Current State

- Gallery shows product images and color variant images
- Thumbnail highlighting is not correctly synchronized with the main image display
- When selecting a color variant, the main image updates but the thumbnail highlighting doesn't reflect the current state
- When selecting a gallery image, the main image updates but the thumbnail highlighting doesn't reflect the current state
- When selecting a color variant after viewing a gallery image, the main image doesn't update to show the variant's image

## Functional Requirements

1. Main Image Display:

   - Show the currently selected gallery image when no color variant is selected
   - Show the color variant image when a color variant is selected
   - Update immediately when a new selection is made
   - When selecting a color variant, ALWAYS show that color's variant image, regardless of previously selected gallery image

2. Thumbnail Highlighting:

   - The thumbnail with the accent highlight must ALWAYS match the main image being displayed
   - When a gallery image is selected, highlight the corresponding thumbnail
   - When a color variant is selected, highlight the thumbnail that matches the variant's image
   - The highlight should update immediately with any image change

3. Interaction Flow:
   - Clicking a gallery thumbnail:
     - Updates the main image to show the selected gallery image
     - Highlights the clicked thumbnail with accent
   - Selecting a color variant:
     - ALWAYS updates the main image to show that color's variant image
     - Highlights the thumbnail that matches the variant's image
     - Overrides any previously selected gallery image
   - Switching between gallery and variant:
     - When selecting a color variant, always shows that color's image
     - When selecting a gallery image, shows that gallery image until a color is selected
     - Maintains proper highlighting of the currently displayed image

## Technical Requirements

1. State Management:

   - Track both the current gallery image index and variant selection
   - Maintain a single source of truth for the currently displayed image
   - Ensure state updates trigger both main image and thumbnail updates
   - Prioritize color variant selection over gallery image selection

2. Image Synchronization:

   - Implement proper comparison logic between gallery images and variant images
   - Handle edge cases where variant images might not match gallery images exactly
   - Ensure smooth transitions between different image states
   - Always show color variant image when a color is selected

3. Performance:
   - Minimize re-renders during image transitions
   - Optimize image loading and switching
   - Maintain responsive UI during state changes

## Implementation Plan

1. Update Gallery Component:

   - Modify the `currentImage` logic to prioritize color variant images over gallery images
   - Implement a unified approach to determining the active thumbnail
   - Ensure state updates trigger both main image and thumbnail updates
   - Add logic to clear gallery image selection when a color variant is selected

2. Update State Management:

   - Enhance the product context to handle image state more effectively
   - Implement proper state synchronization between gallery and variant selection
   - Add validation to ensure state consistency
   - Clear gallery image selection when a color variant is selected

3. Testing:
   - Add comprehensive test cases for all interaction scenarios
   - Verify thumbnail highlighting matches main image in all cases
   - Test edge cases and state transitions
   - Ensure color variant selection always overrides gallery selection

## Success Criteria

1. Visual Synchronization:

   - The highlighted thumbnail ALWAYS matches the main image being displayed
   - No visual lag between image changes and thumbnail highlighting
   - Clear visual feedback for user interactions
   - Color variant selection always shows the correct variant image

2. State Consistency:

   - Main image and thumbnail highlighting stay synchronized
   - State persists correctly between page refreshes
   - No unexpected state changes during interactions
   - Color variant selection takes precedence over gallery selection

3. User Experience:
   - Smooth transitions between images
   - Clear visual feedback for current selection
   - Intuitive interaction between gallery and variant selection
   - Consistent behavior when switching between gallery and color variants

## Risks and Mitigations

1. State Synchronization:

   - Risk: State updates might not trigger all necessary UI updates
   - Mitigation: Implement comprehensive state management and validation

2. Image Matching:

   - Risk: Variant images might not match gallery images exactly
   - Mitigation: Implement robust image comparison logic

3. Performance:
   - Risk: Multiple state updates might cause performance issues
   - Mitigation: Optimize state updates and implement proper memoization

## Timeline

1. Implementation: 1 day
2. Testing: 1 day
3. Review and Refinement: 1 day

## Next Steps

1. Update test suite with new test cases
2. Implement changes to Gallery component
3. Add state management improvements
4. Conduct thorough testing
5. Review and refine implementation
