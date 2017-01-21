$(function () {
  'use strict'

  QUnit.module('dropdowns plugin')

  QUnit.test('should be defined on jquery object', function (assert) {
    assert.expect(1)
    assert.ok($(document.body).dropdown, 'dropdown method is defined')
  })

  QUnit.module('dropdowns', {
    beforeEach: function () {
      // Run all tests in noConflict mode -- it's the only way to ensure that the plugin works in noConflict mode
      $.fn.bootstrapDropdown = $.fn.dropdown.noConflict()
    },
    afterEach: function () {
      $.fn.dropdown = $.fn.bootstrapDropdown
      delete $.fn.bootstrapDropdown
    }
  })

  QUnit.test('should provide no conflict', function (assert) {
    assert.expect(1)
    assert.strictEqual($.fn.dropdown, undefined, 'dropdown was set back to undefined (org value)')
  })

  QUnit.test('should throw explicit error on undefined method', function (assert) {
    assert.expect(1)
    var $el = $('<div/>')
    $el.bootstrapDropdown()
    try {
      $el.bootstrapDropdown('noMethod')
    }
    catch (err) {
      assert.strictEqual(err.message, 'No method named "noMethod"')
    }
  })

  QUnit.test('should return jquery collection containing the element', function (assert) {
    assert.expect(2)
    var $el = $('<div/>')
    var $dropdown = $el.bootstrapDropdown()
    assert.ok($dropdown instanceof $, 'returns jquery collection')
    assert.strictEqual($dropdown[0], $el[0], 'collection contains element')
  })

  QUnit.test('should not open dropdown if target is disabled via attribute', function (assert) {
    assert.expect(1)
    var dropdownHTML = '<div class="tabs">'
        + '<div class="dropdown">'
        + '<button disabled href="#" class="btn dropdown-toggle" data-toggle="dropdown">Dropdown</button>'
        + '<div class="dropdown-menu">'
        + '<a class="dropdown-item" href="#">Secondary link</a>'
        + '<a class="dropdown-item" href="#">Something else here</a>'
        + '<div class="divider"/>'
        + '<a class="dropdown-item" href="#">Another link</a>'
        + '</div>'
        + '</div>'
        + '</div>'
    var $dropdown = $(dropdownHTML).find('[data-toggle="dropdown"]').bootstrapDropdown().trigger('click')

    assert.ok(!$dropdown.parent('.dropdown').hasClass('show'), '"show" class added on click')
  })

  QUnit.test('should set aria-expanded="true" on target when dropdown menu is shown', function (assert) {
    assert.expect(1)
    var dropdownHTML = '<div class="tabs">'
        + '<div class="dropdown">'
        + '<a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">Dropdown</a>'
        + '<div class="dropdown-menu">'
        + '<a class="dropdown-item" href="#">Secondary link</a>'
        + '<a class="dropdown-item" href="#">Something else here</a>'
        + '<div class="divider"/>'
        + '<a class="dropdown-item" href="#">Another link</a>'
        + '</div>'
        + '</div>'
        + '</div>'
    var $dropdown = $(dropdownHTML)
      .find('[data-toggle="dropdown"]')
      .bootstrapDropdown()
      .trigger('click')

    assert.strictEqual($dropdown.attr('aria-expanded'), 'true', 'aria-expanded is set to string "true" on click')
  })

  QUnit.test('should set aria-expanded="false" on target when dropdown menu is hidden', function (assert) {
    assert.expect(1)
    var done = assert.async()
    var dropdownHTML = '<div class="tabs">'
        + '<div class="dropdown">'
        + '<a href="#" class="dropdown-toggle" aria-expanded="false" data-toggle="dropdown">Dropdown</a>'
        + '<div class="dropdown-menu">'
        + '<a class="dropdown-item" href="#">Secondary link</a>'
        + '<a class="dropdown-item" href="#">Something else here</a>'
        + '<div class="divider"/>'
        + '<a class="dropdown-item" href="#">Another link</a>'
        + '</div>'
        + '</div>'
        + '</div>'
    var $dropdown = $(dropdownHTML)
      .appendTo('#qunit-fixture')
      .find('[data-toggle="dropdown"]')
      .bootstrapDropdown()

    $dropdown
      .parent('.dropdown')
      .on('hidden.bs.dropdown', function () {
        assert.strictEqual($dropdown.attr('aria-expanded'), 'false', 'aria-expanded is set to string "false" on hide')
        done()
      })

    $dropdown.trigger('click')
    $(document.body).trigger('click')
  })

  QUnit.test('should not open dropdown if target is disabled via class', function (assert) {
    assert.expect(1)
    var dropdownHTML = '<div class="tabs">'
        + '<div class="dropdown">'
        + '<button href="#" class="btn dropdown-toggle disabled" data-toggle="dropdown">Dropdown</button>'
        + '<div class="dropdown-menu">'
        + '<a class="dropdown-item" href="#">Secondary link</a>'
        + '<a class="dropdown-item" href="#">Something else here</a>'
        + '<div class="divider"/>'
        + '<a class="dropdown-item" href="#">Another link</a>'
        + '</div>'
        + '</div>'
        + '</div>'
    var $dropdown = $(dropdownHTML).find('[data-toggle="dropdown"]').bootstrapDropdown().trigger('click')

    assert.ok(!$dropdown.parent('.dropdown').hasClass('show'), '"show" class added on click')
  })

  QUnit.test('should add class show to menu if clicked', function (assert) {
    assert.expect(1)
    var dropdownHTML = '<div class="tabs">'
        + '<div class="dropdown">'
        + '<a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>'
        + '<div class="dropdown-menu">'
        + '<a class="dropdown-item" href="#">Secondary link</a>'
        + '<a class="dropdown-item" href="#">Something else here</a>'
        + '<div class="divider"/>'
        + '<a class="dropdown-item" href="#">Another link</a>'
        + '</div>'
        + '</div>'
        + '</div>'
    var $dropdown = $(dropdownHTML).find('[data-toggle="dropdown"]').bootstrapDropdown().trigger('click')

    assert.ok($dropdown.parent('.dropdown').hasClass('show'), '"show" class added on click')
  })

  QUnit.test('should test if element has a # before assuming it\'s a selector', function (assert) {
    assert.expect(1)
    var dropdownHTML = '<div class="tabs">'
        + '<div class="dropdown">'
        + '<a href="/foo/" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>'
        + '<div class="dropdown-menu">'
        + '<a class="dropdown-item" href="#">Secondary link</a>'
        + '<a class="dropdown-item" href="#">Something else here</a>'
        + '<div class="divider"/>'
        + '<a class="dropdown-item" href="#">Another link</a>'
        + '</div>'
        + '</div>'
        + '</div>'
    var $dropdown = $(dropdownHTML).find('[data-toggle="dropdown"]').bootstrapDropdown().trigger('click')

    assert.ok($dropdown.parent('.dropdown').hasClass('show'), '"show" class added on click')
  })


  QUnit.test('should remove "show" class if body is clicked', function (assert) {
    assert.expect(2)
    var dropdownHTML = '<div class="tabs">'
        + '<div class="dropdown">'
        + '<a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>'
        + '<div class="dropdown-menu">'
        + '<a class="dropdown-item" href="#">Secondary link</a>'
        + '<a class="dropdown-item" href="#">Something else here</a>'
        + '<div class="divider"/>'
        + '<a class="dropdown-item" href="#">Another link</a>'
        + '</div>'
        + '</div>'
        + '</div>'
    var $dropdown = $(dropdownHTML)
      .appendTo('#qunit-fixture')
      .find('[data-toggle="dropdown"]')
      .bootstrapDropdown()
      .trigger('click')

    assert.ok($dropdown.parent('.dropdown').hasClass('show'), '"show" class added on click')
    $(document.body).trigger('click')
    assert.ok(!$dropdown.parent('.dropdown').hasClass('show'), '"show" class removed')
  })

  QUnit.test('should remove "show" class if body is focused', function (assert) {
    assert.expect(2)
    var dropdownHTML = '<div class="tabs">'
        + '<div class="dropdown">'
        + '<a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>'
        + '<div class="dropdown-menu">'
        + '<a class="dropdown-item" href="#">Secondary link</a>'
        + '<a class="dropdown-item" href="#">Something else here</a>'
        + '<div class="dropdown-divider"/>'
        + '<a class="dropdown-item" href="#">Another link</a>'
        + '</div>'
        + '</div>'
        + '</div>'
    var $dropdown = $(dropdownHTML)
       .appendTo('#qunit-fixture')
       .find('[data-toggle="dropdown"]')
       .bootstrapDropdown()
       .trigger('click')

    assert.ok($dropdown.parent('.dropdown').hasClass('show'), '"show" class added on click')
    $(document.body).trigger('focusin')
    assert.ok(!$dropdown.parent('.dropdown').hasClass('show'), '"show" class removed')
  })

  QUnit.test('should remove "show" class if body is clicked, with multiple dropdowns', function (assert) {
    assert.expect(7)
    var dropdownHTML = '<div class="nav">'
        + '<div class="dropdown" id="testmenu">'
        + '<a class="dropdown-toggle" data-toggle="dropdown" href="#testmenu">Test menu <span class="caret"/></a>'
        + '<div class="dropdown-menu">'
        + '<a class="dropdown-item" href="#sub1">Submenu 1</a>'
        + '</div>'
        + '</div>'
        + '</div>'
        + '<div class="btn-group">'
        + '<button class="btn">Actions</button>'
        + '<button class="btn dropdown-toggle" data-toggle="dropdown"><span class="caret"/></button>'
        + '<div class="dropdown-menu">'
        + '<a class="dropdown-item" href="#">Action 1</a>'
        + '</div>'
        + '</div>'
    var $dropdowns = $(dropdownHTML).appendTo('#qunit-fixture').find('[data-toggle="dropdown"]')
    var $first = $dropdowns.first()
    var $last = $dropdowns.last()

    assert.strictEqual($dropdowns.length, 2, 'two dropdowns')

    $first.trigger('click')
    assert.strictEqual($first.parents('.show').length, 1, '"show" class added on click')
    assert.strictEqual($('#qunit-fixture .show').length, 1, 'only one dropdown is shown')
    $(document.body).trigger('click')
    assert.strictEqual($('#qunit-fixture .show').length, 0, '"show" class removed')

    $last.trigger('click')
    assert.strictEqual($last.parent('.show').length, 1, '"show" class added on click')
    assert.strictEqual($('#qunit-fixture .show').length, 1, 'only one dropdown is shown')
    $(document.body).trigger('click')
    assert.strictEqual($('#qunit-fixture .show').length, 0, '"show" class removed')
  })

  QUnit.test('should remove "show" class if body is focused, with multiple dropdowns', function (assert) {
    assert.expect(7)
    var dropdownHTML = '<div class="nav">'
        + '<div class="dropdown" id="testmenu">'
        + '<a class="dropdown-toggle" data-toggle="dropdown" href="#testmenu">Test menu <span class="caret"/></a>'
        + '<div class="dropdown-menu">'
        + '<a class="dropdown-item" href="#sub1">Submenu 1</a>'
        + '</div>'
        + '</div>'
        + '</div>'
        + '<div class="btn-group">'
        + '<button class="btn">Actions</button>'
        + '<button class="btn dropdown-toggle" data-toggle="dropdown"><span class="caret"/></button>'
        + '<div class="dropdown-menu">'
        + '<a class="dropdown-item" href="#">Action 1</a>'
        + '</div>'
        + '</div>'
    var $dropdowns = $(dropdownHTML).appendTo('#qunit-fixture').find('[data-toggle="dropdown"]')
    var $first = $dropdowns.first()
    var $last = $dropdowns.last()

    assert.strictEqual($dropdowns.length, 2, 'two dropdowns')

    $first.trigger('click')
    assert.strictEqual($first.parents('.show').length, 1, '"show" class added on click')
    assert.strictEqual($('#qunit-fixture .show').length, 1, 'only one dropdown is show')
    $(document.body).trigger('focusin')
    assert.strictEqual($('#qunit-fixture .show').length, 0, '"show" class removed')

    $last.trigger('click')
    assert.strictEqual($last.parent('.show').length, 1, '"show" class added on click')
    assert.strictEqual($('#qunit-fixture .show').length, 1, 'only one dropdown is show')
    $(document.body).trigger('focusin')
    assert.strictEqual($('#qunit-fixture .show').length, 0, '"show" class removed')
  })

  QUnit.test('should fire show and hide event', function (assert) {
    assert.expect(2)
    var dropdownHTML = '<div class="tabs">'
        + '<div class="dropdown">'
        + '<a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>'
        + '<div class="dropdown-menu">'
        + '<a class="dropdown-item" href="#">Secondary link</a>'
        + '<a class="dropdown-item" href="#">Something else here</a>'
        + '<div class="divider"/>'
        + '<a class="dropdown-item" href="#">Another link</a>'
        + '</div>'
        + '</div>'
        + '</div>'
    var $dropdown = $(dropdownHTML)
      .appendTo('#qunit-fixture')
      .find('[data-toggle="dropdown"]')
      .bootstrapDropdown()

    var done = assert.async()

    $dropdown
      .parent('.dropdown')
      .on('show.bs.dropdown', function () {
        assert.ok(true, 'show was fired')
      })
      .on('hide.bs.dropdown', function () {
        assert.ok(true, 'hide was fired')
        done()
      })

    $dropdown.trigger('click')
    $(document.body).trigger('click')
  })


  QUnit.test('should fire shown and hidden event', function (assert) {
    assert.expect(2)
    var dropdownHTML = '<div class="tabs">'
        + '<div class="dropdown">'
        + '<a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>'
        + '<div class="dropdown-menu">'
        + '<a class="dropdown-item" href="#">Secondary link</a>'
        + '<a class="dropdown-item" href="#">Something else here</a>'
        + '<div class="divider"/>'
        + '<a class="dropdown-item" href="#">Another link</a>'
        + '</div>'
        + '</div>'
        + '</div>'
    var $dropdown = $(dropdownHTML)
      .appendTo('#qunit-fixture')
      .find('[data-toggle="dropdown"]')
      .bootstrapDropdown()

    var done = assert.async()

    $dropdown
      .parent('.dropdown')
      .on('shown.bs.dropdown', function () {
        assert.ok(true, 'shown was fired')
      })
      .on('hidden.bs.dropdown', function () {
        assert.ok(true, 'hidden was fired')
        done()
      })

    $dropdown.trigger('click')
    $(document.body).trigger('click')
  })

  QUnit.test('should fire shown and hidden event with a relatedTarget', function (assert) {
    assert.expect(2)
    var dropdownHTML = '<div class="tabs">'
        + '<div class="dropdown">'
        + '<a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>'
        + '<div class="dropdown-menu">'
        + '<a class="dropdown-item" href="#">Secondary link</a>'
        + '<a class="dropdown-item" href="#">Something else here</a>'
        + '<div class="divider"/>'
        + '<a class="dropdown-item" href="#">Another link</a>'
        + '</div>'
        + '</div>'
        + '</div>'
    var $dropdown = $(dropdownHTML)
      .appendTo('#qunit-fixture')
      .find('[data-toggle="dropdown"]')
      .bootstrapDropdown()
    var done = assert.async()

    $dropdown.parent('.dropdown')
      .on('hidden.bs.dropdown', function (e) {
        assert.strictEqual(e.relatedTarget, $dropdown[0])
        done()
      })
      .on('shown.bs.dropdown', function (e) {
        assert.strictEqual(e.relatedTarget, $dropdown[0])
        $(document.body).trigger('click')
      })

    $dropdown.trigger('click')
  })

  QUnit.test('should ignore keyboard events within <input>s and <textarea>s', function (assert) {
    assert.expect(3)
    var done = assert.async()

    var dropdownHTML = '<div class="tabs">'
        + '<div class="dropdown">'
        + '<a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>'
        + '<div class="dropdown-menu">'
        + '<a class="dropdown-item" href="#">Secondary link</a>'
        + '<a class="dropdown-item" href="#">Something else here</a>'
        + '<div class="divider"/>'
        + '<a class="dropdown-item" href="#">Another link</a>'
        + '<input type="text" id="input">'
        + '<textarea id="textarea"/>'
        + '</div>'
        + '</div>'
        + '</div>'
    var $dropdown = $(dropdownHTML)
      .appendTo('#qunit-fixture')
      .find('[data-toggle="dropdown"]')
      .bootstrapDropdown()

    var $input = $('#input')
    var $textarea = $('#textarea')

    $dropdown
      .parent('.dropdown')
      .on('shown.bs.dropdown', function () {
        assert.ok(true, 'shown was fired')

        $input.trigger('focus').trigger($.Event('keydown', { which: 38 }))
        assert.ok($(document.activeElement).is($input), 'input still focused')

        $textarea.trigger('focus').trigger($.Event('keydown', { which: 38 }))
        assert.ok($(document.activeElement).is($textarea), 'textarea still focused')

        done()
      })

    $dropdown.trigger('click')
  })

  QUnit.test('should skip disabled element when using keyboard navigation', function (assert) {
    assert.expect(1)
    var dropdownHTML = '<div class="tabs">'
        + '<div class="dropdown">'
        + '<a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>'
        + '<div class="dropdown-menu">'
        + '<a class="dropdown-item disabled" href="#">Disabled link</a>'
        + '<a class="dropdown-item" href="#">Another link</a>'
        + '</div>'
        + '</div>'
        + '</div>'
    var $dropdown = $(dropdownHTML)
      .appendTo('#qunit-fixture')
      .find('[data-toggle="dropdown"]')
      .bootstrapDropdown()
      .trigger('click')

    $dropdown.trigger($.Event('keydown', { which: 40 }))
    $dropdown.trigger($.Event('keydown', { which: 40 }))

    assert.ok(!$(document.activeElement).is('.disabled'), '.disabled is not focused')
  })

  QUnit.test('should not close the dropdown if the user clicks on a text field', function (assert) {
    assert.expect(1)
    var dropdownHTML = '<div class="btn-group">'
        + '<button type="button" data-toggle="dropdown">Dropdown</button>'
        + '<div class="dropdown-menu">'
        + '<input id="textField" type="text" />'
        + '</div>'
        + '</div>'
    var $dropdown = $(dropdownHTML)
      .appendTo('#qunit-fixture')
      .find('[data-toggle="dropdown"]')
      .bootstrapDropdown()
      .trigger('click')

    $('#textField').trigger('click')

    assert.ok($dropdown.parent('.btn-group').hasClass('show'), 'dropdown menu is shown')
  })

  QUnit.test('should not close the dropdown if the user clicks on a textarea', function (assert) {
    assert.expect(1)
    var dropdownHTML = '<div class="btn-group">'
        + '<button type="button" data-toggle="dropdown">Dropdown</button>'
        + '<div class="dropdown-menu">'
        + '<textarea id="textArea"></textarea>'
        + '</div>'
        + '</div>'
    var $dropdown = $(dropdownHTML)
      .appendTo('#qunit-fixture')
      .find('[data-toggle="dropdown"]')
      .bootstrapDropdown()
      .trigger('click')

    $('#textArea').trigger('click')

    assert.ok($dropdown.parent('.btn-group').hasClass('show'), 'dropdown menu is shown')
  })
})
