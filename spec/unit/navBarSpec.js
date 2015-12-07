var navBar = require('../../lib/navbar.js');

describe('Menu Item matcher', function() {
  var validMenuItem1 = '[Development]()';
  var validMenuItem2 = '[Development](md file title)';
  it('matches valid menu items', function() {
    expect(navBar.isMenuItem(validMenuItem1)).toBe(true);
    expect(navBar.isMenuItem(validMenuItem2)).toBe(true);
  });

  var invalidMenuItem1 = 'Development]()';
  var invalidMenuItem2 = '[Development(adf)';
  var invalidMenuItem3 = '[Development](adf';
  var invalidMenuItem4 = '  * # Guidelines';
  var invalidMenuItem5 = '  * [Code Style & Reviews](wiki/development/codeReviews.md)';
  var invalidMenuItem6 = '  - - - -';
  it('does not match invalid menu items', function() {
    expect(navBar.isMenuItem(invalidMenuItem1)).toBe(false);
    expect(navBar.isMenuItem(invalidMenuItem2)).toBe(false);
    expect(navBar.isMenuItem(invalidMenuItem3)).toBe(false);
    expect(navBar.isMenuItem(invalidMenuItem4)).toBe(false);
    expect(navBar.isMenuItem(invalidMenuItem5)).toBe(false);
    expect(navBar.isMenuItem(invalidMenuItem6)).toBe(false);
  });
});

describe('Submenu heading matcher', function() {
  var validSubmenuHeading1 = '  * # Guidelines';
  var validSubmenuHeading2 = '    * # Guidelines';
  it('matches valid submenu headings', function() {
    expect(navBar.isSubmenuHeading(validSubmenuHeading1)).toBe(true);
    expect(navBar.isSubmenuHeading(validSubmenuHeading2)).toBe(true);
  });

  var invalidSubmenuHeading1 = 'Development]()';
  var invalidSubmenuHeading2 = ' ** # Guidelines';
  var invalidSubmenuHeading3 = '  *  # Guidelines';
  var invalidSubmenuHeading4 = '  * $ Guidelines';
  var invalidSubmenuHeading5 = '  * [Code Style & Reviews](wiki/development/codeReviews.md)';
  var invalidSubmenuHeading6 = '  - - - -';

  it('does not match invalid submenu headings', function() {
    expect(navBar.isSubmenuHeading(invalidSubmenuHeading1)).toBe(false);
    expect(navBar.isSubmenuHeading(invalidSubmenuHeading2)).toBe(false);
    expect(navBar.isSubmenuHeading(invalidSubmenuHeading3)).toBe(false);
    expect(navBar.isSubmenuHeading(invalidSubmenuHeading4)).toBe(false);
    expect(navBar.isSubmenuHeading(invalidSubmenuHeading5)).toBe(false);
    expect(navBar.isSubmenuHeading(invalidSubmenuHeading6)).toBe(false);
  });
});

describe('Submenu item matcher', function() {
  var validSubmenuItem1 = '  * [Code Style & Reviews](wiki/development/codeReviews.md)';
  var validSubmenuItem2 = '   * [Code Style & Reviews](wiki/development/codeReviews.md)';
  it('matches valid submenu items', function() {
    expect(navBar.isSubmenuItem(validSubmenuItem1)).toBe(true);
    expect(navBar.isSubmenuItem(validSubmenuItem2)).toBe(true);
  });

  var invalidSubmenuItem1 = 'Development]()';
  var invalidSubmenuItem2 = '  * # Guidelines';
  var invalidSubmenuItem3 = '  [Code Style & Reviews](wiki/development/codeReviews.md)';
  var invalidSubmenuItem4 = '  $ $ SubMenu Heading 1';
  var invalidSubmenuItem5 = '  * [Code Style & Reviews(wiki/development/codeReviews.md)';
  var invalidSubmenuItem5 = '  * [Code Style & Reviews](wiki/development/codeReviews.md';
  var invalidSubmenuItem6 = '  * [](wiki/development/codeReviews.md)';
  var invalidSubmenuItem7 = '  - - - -';

  it('does not match invalid submenu items', function() {
    expect(navBar.isSubmenuItem(invalidSubmenuItem1)).toBe(false);
    expect(navBar.isSubmenuItem(invalidSubmenuItem2)).toBe(false);
    expect(navBar.isSubmenuItem(invalidSubmenuItem3)).toBe(false);
    expect(navBar.isSubmenuItem(invalidSubmenuItem4)).toBe(false);
    expect(navBar.isSubmenuItem(invalidSubmenuItem5)).toBe(false);
    expect(navBar.isSubmenuItem(invalidSubmenuItem6)).toBe(false);
    expect(navBar.isSubmenuItem(invalidSubmenuItem7)).toBe(false);
  });
});

describe('Submenu divider matcher', function() {
  var validSubmenuDivider1 = '  - - - -';
  var validSubmenuDivider2 = '- - - -';
  var validSubmenuDivider3 = '  ----';
  it('matches valid submenu dividers', function() {
    expect(navBar.isSubmenuDivider(validSubmenuDivider1)).toBe(true);
    expect(navBar.isSubmenuDivider(validSubmenuDivider2)).toBe(true);
    expect(navBar.isSubmenuDivider(validSubmenuDivider3)).toBe(true);
  });

  var invalidSubmenuDivider1 = 'Development]()';
  var invalidSubmenuDivider2 = '  * # Guidelines';
  var invalidSubmenuDivider3 = '  * [Code Style & Reviews](wiki/development/codeReviews.md)';
  var invalidSubmenuDivider4 = '  #####';


  it('does not match invalid submenu items', function() {
    expect(navBar.isSubmenuDivider(invalidSubmenuDivider1)).toBe(false);
    expect(navBar.isSubmenuDivider(invalidSubmenuDivider2)).toBe(false);
    expect(navBar.isSubmenuDivider(invalidSubmenuDivider3)).toBe(false);
    expect(navBar.isSubmenuDivider(invalidSubmenuDivider4)).toBe(false);
  });
});