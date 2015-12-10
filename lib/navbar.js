var _ = require("lodash"),
  lblReader = require('line-by-line');

var NavBar = {
  menuItemRegExp: /^\[(.+)\]\((.*)\)/,
  submenuItemHeadingRegExp: /^\s*\*\s#\s+(.+)/,
  submenuItemRegExp: /^\s*\*\s\[(.+)]\((.*)\)/,
  submenuItemDividerRegExp: /^\s*(\s?-)+/,

  menuItemWithNoSubmenuTemplate: '<li><a href="/wiki/<%= link %>"><%= label %></a></li>',
  menuItemWithSubmenuTemplate: '<li class="dropdown"><a href="" data-toggle="dropdown" class="dropdown-toggle">' +
  '<%= label %><b class="caret"></b></a><ul class="dropdown-menu"><%=submenu %></ul>' +
  '</li>',
  submenuItemTemplate: '<li class="dropdown"><a href="/wiki/<%= link %>"><%= label %></a></li>',
  submenuItemHeadingTemplate: '<li class="dropdown"><li class="dropdown-header"><%= label %></li></li>',
  submenuItemDividerTemplate: '<li class="divider"></li>',

  menuItems: []
};

NavBar.isMenuItem = function (line) {
  return NavBar.menuItemRegExp.test(line);
};

NavBar.isSubmenuItemHeading = function (line) {
  return NavBar.submenuItemHeadingRegExp.test(line);
};

NavBar.isSubmenuItem = function (line) {
  return NavBar.submenuItemRegExp.test(line);
};

NavBar.isSubmenuItemDivider = function (line) {
  return NavBar.submenuItemDividerRegExp.test(line);
};

NavBar.MenuItem = function (options) {
  this.label = options.label;
  this.link = options.link;
  this.submenuItems = options.submenuItems;
};

NavBar.SubmenuItem = function (options) {
  this.isDivider = options.isDivider;
  this.isHeading = options.isHeading;
  this.label = options.label;
  this.link = options.link;
};

NavBar.parseMenuItem = function (line) {
  var match = line.match(NavBar.menuItemRegExp);
  return match ? new NavBar.MenuItem({
    label: match[1],
    link: match[2] || '',
    submenuItems: []
  }) : null;
};

NavBar.parseSubmenuItem = function (line) {
  var match = line.match(NavBar.submenuItemRegExp);
  return match ? new NavBar.SubmenuItem({
    label: match[1],
    link: match[2] || ''
  }) : null;
};

NavBar.parseSubmenuItemHeading = function (line) {
  var match = line.match(NavBar.submenuItemHeadingRegExp);
  return match ? new NavBar.SubmenuItem({
    label: match[1],
    isHeading: true
  }) : null;
};

NavBar.parseSubmenuItemHeading = function (line) {
  var match = line.match(NavBar.submenuItemHeadingRegExp);
  return match ? new NavBar.SubmenuItem({
    label: match[1],
    isHeading: true
  }) : null;
};

NavBar.parseSubmenuItemDivider = function (line) {
  var match = line.match(NavBar.submenuItemDividerRegExp);
  return match ? new NavBar.SubmenuItem({
    isDivider: true
  }) : null;
};

NavBar.renderSubmenuItem = function (submenuItem) {
  var output = '';
  if (submenuItem instanceof NavBar.SubmenuItem) {
    if (submenuItem.isHeading) {
      output = _.template(NavBar.submenuItemHeadingTemplate)(submenuItem);
    } else if (submenuItem.isDivider) {
      output = _.template(NavBar.submenuItemDividerTemplate)(submenuItem);
    } else {
      output = _.template(NavBar.submenuItemTemplate)(submenuItem);
    }
  }
  return output;
};

NavBar.renderMenuItem = function (menuItem) {
  var output = '';
  if (menuItem instanceof NavBar.MenuItem) {
    if (menuItem.submenuItems && menuItem.submenuItems.length > 0) {
      _.forEach(menuItem.submenuItems, function (submenuItem) {
        output += NavBar.renderSubmenuItem(submenuItem);
      });
      output = _.template(NavBar.menuItemWithSubmenuTemplate)({
        label: menuItem.label,
        submenu: output
      });
    } else {
      output = _.template(NavBar.menuItemWithNoSubmenuTemplate)(menuItem);
    }
  }
  return output;
};

NavBar.topMenuItem = function () {
  if (NavBar.menuItems.length > 0) {
    return NavBar.menuItems[NavBar.menuItems.length - 1];
  } else {
    return null;
  }
};

NavBar.lexAnalizer = function (line) {
  if (NavBar.isMenuItem(line)) {
    NavBar.menuItems.push(NavBar.parseMenuItem(line));
  } else if (NavBar.isSubmenuItem(line)) {
    NavBar.topMenuItem() ? NavBar.topMenuItem().submenuItems.push(NavBar.parseSubmenuItem(line)) : console.log('Skipped submenu item with no parent menu item.');
  } else if (NavBar.isSubmenuItemHeading(line)) {
    NavBar.topMenuItem() ? NavBar.topMenuItem().submenuItems.push(NavBar.parseSubmenuItemHeading(line)) : console.log('Skipped submenu item with no parent menu item.');
  } else if (NavBar.isSubmenuItemDivider(line)) {
    NavBar.topMenuItem() ? NavBar.topMenuItem().submenuItems.push(NavBar.parseSubmenuItemDivider(line)) : console.log('Skipped submenu item with no parent menu item.');
  }
};

NavBar.render = function () {
  var output = '';
  _.forEach(NavBar.menuItems, function (menuItem) {
    output = NavBar.renderMenuItem(menuItem);
  });
  return output;
};

NavBar.parse = function (filePath, callback) {
  try {
    var lr = new lblReader(filePath, {skipEmptyLines: true});

    lr.on('line', function (line) {
      NavBar.lexAnalizer(line);
    });

    lr.on('end', function () {
      callback(NavBar.render());
    });
  } catch (e) {
    console.log('No navigation.md supplied');
  }
};

module.exports = NavBar;