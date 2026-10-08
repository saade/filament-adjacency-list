# Changelog

All notable changes to `filament-adjacency-list` will be documented in this file.

## v4.2.0 - 2026-10-08

### Release Notes

* fix: give a new item the position after its siblings in [`32ca8df`](https://github.com/saade/filament-adjacency-list/commit/32ca8dfa72281d44b6cb13a465c350638f7bf993)
* fix: never change the parent or order of the record whose tree is edited in [`fb52c10`](https://github.com/saade/filament-adjacency-list/commit/fb52c100bbca9f5012c0d727cc802e61402dfc29)
* fix: accept a model that inherits the tree trait from a parent class in [`51a37b2`](https://github.com/saade/filament-adjacency-list/commit/51a37b2b0e5473cbabfbc32a02e64d50adc56757)
* fix: show items that have no label in [`e8faed6`](https://github.com/saade/filament-adjacency-list/commit/e8faed67d886ee0260339cbdd3b69c9e96e267eb)
* fix: make persistCollapsed() remember collapsed items in [`3ad9e28`](https://github.com/saade/filament-adjacency-list/commit/3ad9e2877d12a612e28c583b87cbe529f5a002c7)
* fix: keep the tree empty and stop adding items until the owner record is saved in [`359d502`](https://github.com/saade/filament-adjacency-list/commit/359d502f3188076571fcab844ee5f817d4f47ca7)
* fix: enforce the depth limit on drags and indents, counting the children of the moved item in [`c6618d4`](https://github.com/saade/filament-adjacency-list/commit/c6618d4b03d95152c8dfc0a723efeca2b8f634e9)
* fix: ignore drags on a field that is disabled, not reorderable or not allowed by the policy in [`c155941`](https://github.com/saade/filament-adjacency-list/commit/c1559413524a39b5897059de35fcd882a55996f4)
* fix: move, indent and outdent items correctly in long lists and with a custom children key in [`0576263`](https://github.com/saade/filament-adjacency-list/commit/0576263bbf8b8a4a1b8b2680b1f74281d4bd7089)
* fix: keep item actions working after an item is added or dragged in [`aa611d7`](https://github.com/saade/filament-adjacency-list/commit/aa611d70263161b64d1f9e9240a09f8b4082d5e4)
* fix: save graph relationships without detaching siblings or failing on save in [`0e40ea1`](https://github.com/saade/filament-adjacency-list/commit/0e40ea15ec49bc77955b881ebd4f9333f9c34de2)
* fix: save moves made in the widget and give it the record of its page in [`8359761`](https://github.com/saade/filament-adjacency-list/commit/8359761d741d930c4f8c966c749b93cf968a92cd)
* fix: keep action customizations and relationship saving from replacing each other in [`16dd2e0`](https://github.com/saade/filament-adjacency-list/commit/16dd2e0b6d19877891e7ce6ee87301288c1b39c0)

## v4.1.2 - 2026-09-08

Filament 5.8 compat

## v4.1.1 - 2026-07-13

**Full Changelog**: https://github.com/saade/filament-adjacency-list/compare/v4.1.0...v4.1.1

## v4.1.0 - 2026-06-05

### What's Changed

* performance: Avoid Blade components by @danharrin in https://github.com/saade/filament-adjacency-list/pull/80

**Full Changelog**: https://github.com/saade/filament-adjacency-list/compare/v4.0.3...v4.1.0

## v4.0.3 - 2026-06-04

Performance enhancements for large trees.

## v4.0.2 - 2026-05-05

Add support for Laravel 13

## v4.0.1 - 2026-02-18

### What's Changed

* Laravel v12.x support by @markvaneijk in https://github.com/saade/filament-adjacency-list/pull/42
* feat: Custom item label  by @howdu in https://github.com/saade/filament-adjacency-list/pull/64
* feat(lang): add Polish language by @htulibacki in https://github.com/saade/filament-adjacency-list/pull/47
* feat(lang): add Persian language by @sadegh19b in https://github.com/saade/filament-adjacency-list/pull/50
* Filament V5 support by @howdu in https://github.com/saade/filament-adjacency-list/pull/71

### New Contributors

* @markvaneijk made their first contribution in https://github.com/saade/filament-adjacency-list/pull/42
* @howdu made their first contribution in https://github.com/saade/filament-adjacency-list/pull/64
* @htulibacki made their first contribution in https://github.com/saade/filament-adjacency-list/pull/47
* @sadegh19b made their first contribution in https://github.com/saade/filament-adjacency-list/pull/50

**Full Changelog**: https://github.com/saade/filament-adjacency-list/compare/v4.0.0...v4.0.1

## v3.3.0 - 2025-10-09

### What's Changed

* [3.x] Merge tag 'v4.0.0-beta2' into 3.x by @saade in https://github.com/saade/filament-adjacency-list/pull/66

## v4.0.0 - 2025-10-02

A huge thank you to everyone who contributed to V4 support 💛

### What's Changed

* Filament 4.x support by @saade, @Casmo, @markvaneijk and @howdu in https://github.com/saade/filament-adjacency-list/pull/61 and https://github.com/saade/filament-adjacency-list/pull/57
* Update README.md added relationship by @iotron in https://github.com/saade/filament-adjacency-list/pull/26
* Add disabling options to README by @CodeWithDennis in https://github.com/saade/filament-adjacency-list/pull/30
* Start position at 1 like filament reorderable by @GhostvOne in https://github.com/saade/filament-adjacency-list/pull/33
* Adding AdjacencyListWidget by @cheesegrits in https://github.com/saade/filament-adjacency-list/pull/32
* 4.x auth actions by @cheesegrits in https://github.com/saade/filament-adjacency-list/pull/38

### New Contributors

* @iotron made their first contribution in https://github.com/saade/filament-adjacency-list/pull/26
* @CodeWithDennis made their first contribution in https://github.com/saade/filament-adjacency-list/pull/30
* @GhostvOne made their first contribution in https://github.com/saade/filament-adjacency-list/pull/33

**Full Changelog**: https://github.com/saade/filament-adjacency-list/compare/v3.2.1...v4.0.0

## v3.2.2 - 2025-03-03

### What's Changed

* Update README.md added relationship by @iotron in https://github.com/saade/filament-adjacency-list/pull/26
* Laravel v12.x support by @markvaneijk in https://github.com/saade/filament-adjacency-list/pull/42

### New Contributors

* @iotron made their first contribution in https://github.com/saade/filament-adjacency-list/pull/26
* @markvaneijk made their first contribution in https://github.com/saade/filament-adjacency-list/pull/42

**Full Changelog**: https://github.com/saade/filament-adjacency-list/compare/v3.1.2...v3.2.2

## v4.0.0-beta2 - 2024-10-22

### What's Changed

* action authorization by @cheesegrits in https://github.com/saade/filament-adjacency-list/pull/38

**Full Changelog**: https://github.com/saade/filament-adjacency-list/compare/v4.0.0-beta1...v4.0.0-beta2

## v4.0.0-beta1 - 2024-08-26

This release contains breaking changes and therefore has been tagged as 4.0.0-beta1.

v4.0.0 will be released with Filament V4. Since its backwards compatible, you can upgrade your project today to use the new features.

### The main breaking changes are:

- New asset registration. [You'll need to use a custom theme in order for this plugin to work.](https://github.com/saade/filament-adjacency-list/blob/4.x/README.md#installation)
- The item is not clickable by default (editable), you need to set [`recordAction('edit')`](https://github.com/saade/filament-adjacency-list/blob/4.x/README.md#triggering-an-action-or-opening-a-url-when-clicking-on-an-item) for it to behave like before.

### New features:

- [A new Widget](https://github.com/saade/filament-adjacency-list/blob/4.x/README.md#widget).
- Graphs relationship.

### What's Changed

* Update README.md added relationship by @iotron in https://github.com/saade/filament-adjacency-list/pull/26
* Add disabling options to README by @CodeWithDennis in https://github.com/saade/filament-adjacency-list/pull/30
* Start position at 1 like filament reorderable by @GhostvOne in https://github.com/saade/filament-adjacency-list/pull/33
* Adding AdjacencyListWidget by @cheesegrits in https://github.com/saade/filament-adjacency-list/pull/32

### New Contributors

* @iotron made their first contribution in https://github.com/saade/filament-adjacency-list/pull/26
* @CodeWithDennis made their first contribution in https://github.com/saade/filament-adjacency-list/pull/30
* @GhostvOne made their first contribution in https://github.com/saade/filament-adjacency-list/pull/33

**Full Changelog**: https://github.com/saade/filament-adjacency-list/compare/v3.2.1...v4.0.0-beta1

## v3.2.1 - 2024-03-20

### What's Changed

* fix: relationships always being setup by @saade in https://github.com/saade/filament-adjacency-list/pull/23

**Full Changelog**: https://github.com/saade/filament-adjacency-list/compare/v3.2.0...v3.2.1

## v3.2.0 - 2024-03-12

### What's Changed

* Laravel 11.x Compatibility
* chore(deps): bump aglipanci/laravel-pint-action from 2.3.0 to 2.3.1 by @dependabot in https://github.com/saade/filament-adjacency-list/pull/20
* Feat/graph by @cheesegrits in https://github.com/saade/filament-adjacency-list/pull/19
* add relationships support by @saade in https://github.com/saade/filament-adjacency-list/pull/3

### New Contributors

* @cheesegrits made their first contribution in https://github.com/saade/filament-adjacency-list/pull/19

**Full Changelog**: https://github.com/saade/filament-adjacency-list/compare/v3.1.1...v3.2.0

## v3.1.2 - 2024-03-12

### What's Changed

* Laravel 11.x Compatibility
* chore(deps): bump aglipanci/laravel-pint-action from 2.3.0 to 2.3.1 by @dependabot in https://github.com/saade/filament-adjacency-list/pull/20

**Full Changelog**: https://github.com/saade/filament-adjacency-list/compare/v3.1.1...v3.1.2

## v3.2-beta1 - 2024-02-15

### What's Changed

* add graph relationships by @cheesegrits in https://github.com/saade/filament-adjacency-list/pull/19
* add relationships support by @saade in https://github.com/saade/filament-adjacency-list/pull/3

### New Contributors

* @cheesegrits made their first contribution in https://github.com/saade/filament-adjacency-list/pull/19

**Full Changelog**: https://github.com/saade/filament-adjacency-list/compare/v3.1.1...v3.2-beta1

## v3.1.1 - 2023-11-08

### What's Changed

* Add russian language translations by @tlegenbayangali in https://github.com/saade/filament-adjacency-list/pull/12
* [ADD] FR Translations by @RibesAlexandre in https://github.com/saade/filament-adjacency-list/pull/14
* chore(deps): bump stefanzweifel/git-auto-commit-action from 4 to 5 by @dependabot in https://github.com/saade/filament-adjacency-list/pull/15

### New Contributors

* @tlegenbayangali made their first contribution in https://github.com/saade/filament-adjacency-list/pull/12
* @RibesAlexandre made their first contribution in https://github.com/saade/filament-adjacency-list/pull/14

**Full Changelog**: https://github.com/saade/filament-adjacency-list/compare/v3.1.0...v3.1.1

## v3.1.0 - 2023-09-13

### What's Changed

* Added maxDepth config option by @vanhooff in https://github.com/saade/filament-adjacency-list/pull/10
* chore(deps): bump actions/checkout from 3 to 4 by @dependabot in https://github.com/saade/filament-adjacency-list/pull/7

### New Contributors

* @vanhooff made their first contribution in https://github.com/saade/filament-adjacency-list/pull/10
* @dependabot made their first contribution in https://github.com/saade/filament-adjacency-list/pull/7

**Full Changelog**: https://github.com/saade/filament-adjacency-list/compare/v3.0.4...v3.1.0

## v3.0.4 - 2023-08-31

### What's Changed

* fix typo `Foms` by @saade in https://github.com/saade/filament-adjacency-list/pull/6

**Full Changelog**: https://github.com/saade/filament-adjacency-list/compare/v3.0.3...v3.0.4

## v3.0.3 - 2023-08-18

### What's Changed

* refactor: extract actions by @saade in https://github.com/saade/filament-adjacency-list/pull/2

### New Contributors

* @saade made their first contribution in https://github.com/saade/filament-adjacency-list/pull/2

**Full Changelog**: https://github.com/saade/filament-adjacency-list/compare/v3.0.2...v3.0.3

## v3.0.2 - 2023-08-18

### What's Changed

* add support for RTL by @atmonshi in https://github.com/saade/filament-adjacency-list/pull/1

### New Contributors

* @atmonshi made their first contribution in https://github.com/saade/filament-adjacency-list/pull/1

**Full Changelog**: https://github.com/saade/filament-adjacency-list/compare/v3.0.1...v3.0.2

## v3.0.1 - 2023-08-18

**Full Changelog**: https://github.com/saade/filament-adjacency-list/compare/v3.0.0...v3.0.1

## v3.0.0 - 2023-08-17

**Full Changelog**: https://github.com/saade/filament-adjacency-list/commits/v3.0.0
