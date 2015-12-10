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
    expect(navBar.isSubmenuItemHeading(validSubmenuHeading1)).toBe(true);
    expect(navBar.isSubmenuItemHeading(validSubmenuHeading2)).toBe(true);
  });

  var invalidSubmenuHeading1 = 'Development]()';
  var invalidSubmenuHeading2 = ' ** # Guidelines';
  var invalidSubmenuHeading3 = '  *  # Guidelines';
  var invalidSubmenuHeading4 = '  * $ Guidelines';
  var invalidSubmenuHeading5 = '  * [Code Style & Reviews](wiki/development/codeReviews.md)';
  var invalidSubmenuHeading6 = '  - - - -';

  it('does not match invalid submenu headings', function() {
    expect(navBar.isSubmenuItemHeading(invalidSubmenuHeading1)).toBe(false);
    expect(navBar.isSubmenuItemHeading(invalidSubmenuHeading2)).toBe(false);
    expect(navBar.isSubmenuItemHeading(invalidSubmenuHeading3)).toBe(false);
    expect(navBar.isSubmenuItemHeading(invalidSubmenuHeading4)).toBe(false);
    expect(navBar.isSubmenuItemHeading(invalidSubmenuHeading5)).toBe(false);
    expect(navBar.isSubmenuItemHeading(invalidSubmenuHeading6)).toBe(false);
  });
});

describe('Submenu item matcher', function() {
  var validSubmenuItem1 = '  * [Code Style & Reviews](wiki/development/codeReviews.md)';
  var validSubmenuItem2 = '   * [Code Style & Reviews](wiki/development/codeReviews.md)';
  var validSubmenuItem3 = '   * [Code Style & Reviews]()';
  it('matches valid submenu items', function() {
    expect(navBar.isSubmenuItem(validSubmenuItem1)).toBe(true);
    expect(navBar.isSubmenuItem(validSubmenuItem2)).toBe(true);
    expect(navBar.isSubmenuItem(validSubmenuItem3)).toBe(true);
  });

  var invalidSubmenuItem1 = 'Development]()';
  var invalidSubmenuItem2 = '  * # Guidelines';
  var invalidSubmenuItem3 = '  [Code Style & Reviews](wiki/development/codeReviews.md)';
  var invalidSubmenuItem4 = '  $ $ SubMenu Heading 1';
  var invalidSubmenuItem5 = '  * [Code Style & Reviews(wiki/development/codeReviews.md)';
  var invalidSubmenuItem6 = '  * [Code Style & Reviews](wiki/development/codeReviews.md';
  var invalidSubmenuItem7 = '  * [](wiki/development/codeReviews.md)';
  var invalidSubmenuItem8 = '  - - - -';

  it('does not match invalid submenu items', function() {
    expect(navBar.isSubmenuItem(invalidSubmenuItem1)).toBe(false);
    expect(navBar.isSubmenuItem(invalidSubmenuItem2)).toBe(false);
    expect(navBar.isSubmenuItem(invalidSubmenuItem3)).toBe(false);
    expect(navBar.isSubmenuItem(invalidSubmenuItem4)).toBe(false);
    expect(navBar.isSubmenuItem(invalidSubmenuItem5)).toBe(false);
    expect(navBar.isSubmenuItem(invalidSubmenuItem6)).toBe(false);
    expect(navBar.isSubmenuItem(invalidSubmenuItem7)).toBe(false);
    expect(navBar.isSubmenuItem(invalidSubmenuItem8)).toBe(false);
  });
});

describe('Submenu divider matcher', function() {
  var validSubmenuDivider1 = '  - - - -';
  var validSubmenuDivider2 = '- - - -';
  var validSubmenuDivider3 = '  ----';
  it('matches valid submenu dividers', function() {
    expect(navBar.isSubmenuItemDivider(validSubmenuDivider1)).toBe(true);
    expect(navBar.isSubmenuItemDivider(validSubmenuDivider2)).toBe(true);
    expect(navBar.isSubmenuItemDivider(validSubmenuDivider3)).toBe(true);
  });

  var invalidSubmenuDivider1 = 'Development]()';
  var invalidSubmenuDivider2 = '  * # Guidelines';
  var invalidSubmenuDivider3 = '  * [Code Style & Reviews](wiki/development/codeReviews.md)';
  var invalidSubmenuDivider4 = '  #####';


  it('does not match invalid submenu items', function() {
    expect(navBar.isSubmenuItemDivider(invalidSubmenuDivider1)).toBe(false);
    expect(navBar.isSubmenuItemDivider(invalidSubmenuDivider2)).toBe(false);
    expect(navBar.isSubmenuItemDivider(invalidSubmenuDivider3)).toBe(false);
    expect(navBar.isSubmenuItemDivider(invalidSubmenuDivider4)).toBe(false);
  });
});

describe('Menu item parser', function() {
  var validMenuItem1 = '[Development]()';
  var validMenuItem2 = '[Development2](development.md)';
  it('create a MenuItem object', function() {
    var menuItem1 = navBar.parseMenuItem(validMenuItem1);
    expect(menuItem1.label).toBe('Development');
    expect(menuItem1.link).toBe('');
    var menuItem2 = navBar.parseMenuItem(validMenuItem2);
    expect(menuItem2.label).toBe('Development2');
    expect(menuItem2.link).toBe('development.md');
  });

  var invalidMenuItem1 = 'Development]()';

  it('returns null', function() {
    var menuItem1 = navBar.parseMenuItem(invalidMenuItem1);
    expect(menuItem1).toBe(null);
  });
});

describe('Submenu item parser', function() {
  var validSubmenuItem1 = '  * [Code Style & Reviews](wiki/development/codeReviews.md)';
  var validSubmenuItem2 = '  * [Code Style & Reviews]()';
  it('create a SubmenuItem object', function() {
    var submenuItem1 = navBar.parseSubmenuItem(validSubmenuItem1);
    expect(submenuItem1.label).toBe('Code Style & Reviews');
    expect(submenuItem1.link).toBe('wiki/development/codeReviews.md');
    var submenuItem2 = navBar.parseSubmenuItem(validSubmenuItem2);
    expect(submenuItem2.label).toBe('Code Style & Reviews');
    expect(submenuItem2.link).toBe('');
  });

  var invalidSubmenuItem1 = '  [Code Style & Reviews](wiki/development/codeReviews.md)';

  it('returns null', function() {
    var submenuItem1 = navBar.parseSubmenuItem(invalidSubmenuItem1);
    expect(submenuItem1).toBe(null);
  });
});

describe('Submenu item heading parser', function() {
  var validSubmenuItemHeading1 = '  * # Guidelines';
  it('create a Submenu item object', function() {
    var submenuItem1 = navBar.parseSubmenuItemHeading(validSubmenuItemHeading1);
    expect(submenuItem1.label).toBe('Guidelines');
    expect(submenuItem1.isHeading).toBe(true);
  });

  var invalidSubmenuItemHeading1 = '  * Guidelines';

  it('returns null', function() {
    var submenuItem1 = navBar.parseSubmenuItemHeading(invalidSubmenuItemHeading1);
    expect(submenuItem1).toBe(null);
  });
});

describe('Submenu item divider parser', function() {
  var validSubmenuItemDivider1 = '  - - - -';
  it('create a Submenu item object', function() {
    var submenuItem1 = navBar.parseSubmenuItemDivider(validSubmenuItemDivider1);
    expect(submenuItem1.isDivider).toBe(true);
  });

  var invalidSubmenuItemDivider1 = '  * Guidelines';

  it('returns null', function() {
    var submenuItem1 = navBar.parseSubmenuItemDivider(invalidSubmenuItemDivider1);
    expect(submenuItem1).toBe(null);
  });
});

describe('Submenu item renderer', function() {
  var validSubmenuItem1 = '  * [Code Style & Reviews](codeReviews.md)';
  var validSubmenuItem2 = '  * [Code Style & Reviews]()';
  var validSubmenuItem3 = '  * # Guidelines';
  var validSubmenuItem4 = '  - - - -';
  it('renders a Submenu item object', function() {
    var submenuItem1 = navBar.parseSubmenuItem(validSubmenuItem1);
    expect(navBar.renderSubmenuItem(submenuItem1)).toBe('<li class="dropdown"><a href="codeReviews.md">Code Style & Reviews</a></li>');
    var submenuItem2 = navBar.parseSubmenuItem(validSubmenuItem2);
    expect(navBar.renderSubmenuItem(submenuItem2)).toBe('<li class="dropdown"><a href="">Code Style & Reviews</a></li>');
    var submenuItem3 = navBar.parseSubmenuItemHeading(validSubmenuItem3);
    expect(navBar.renderSubmenuItem(submenuItem3)).toBe('<li class="dropdown"><li class="dropdown-header">Guidelines</li></li>');
    var submenuItem4 = navBar.parseSubmenuItemDivider(validSubmenuItem4);
    expect(navBar.renderSubmenuItem(submenuItem4)).toBe('<li class="divider"></li>');
  });

  var invalidSubmenuItem1 = '  * Guidelines';

  it('returns null', function() {
    var submenuItem1 = navBar.parseSubmenuItemDivider(invalidSubmenuItem1);
    expect(navBar.renderSubmenuItem(submenuItem1)).toBe('');
  });
});

describe('Menu item renderer', function() {
  var menuItemWithNoSubmenu = navBar.parseMenuItem('[Development](md file title)');
  it('renders a Menu item object with no submenu', function() {
    expect(navBar.renderMenuItem(menuItemWithNoSubmenu)).toBe('<li><a href="md file title">Development</a></li>');
  });

  var menuItemWithSubmenu = navBar.parseMenuItem('[Development]()');
  menuItemWithSubmenu.submenuItems = [
    navBar.parseSubmenuItem('  * [Code Style & Reviews](wiki/development/codeReviews.md)'),
    navBar.parseSubmenuItemHeading('  * # Guidelines'),
    navBar.parseSubmenuItemDivider('  - - - -')
  ];
  it('renders a Menu item object with submenu', function() {
    expect(navBar.renderMenuItem(menuItemWithSubmenu)).toBe('<li class="dropdown active"><a href="" data-toggle="dropdown" class="dropdown-toggle">Development<b class="caret"></b></a><ul class="dropdown-menu"><li class="dropdown"><a href="wiki/development/codeReviews.md">Code Style & Reviews</a></li><li class="dropdown"><li class="dropdown-header">Guidelines</li></li><li class="divider"></li></ul></li>');
  });
});

describe('NavBar file parser', function() {
  it('renders a full Menu from file', function() {
    navBar.parse('./spec/unit/navBarTestData.md', function(parsedContent) {
      console.log(parsedContent);
      expect(parsedContent.length).toBeGreaterThan(0);
    });
  });
});