/**
 * Attaches jQuery MultiSelect.
 */
Drupal.behaviors.mollomMultiSelect = function(context) {
  $(context).find('select[multiple]').asmSelect({
    animate: true,
    highlight: true,
    hideWhenAdded: true,
    removeLabel: Drupal.t('remove'),
    highlightAddedLabel: Drupal.t('Added: '),
    highlightRemovedLabel: Drupal.t('Removed: ')
  });
};
